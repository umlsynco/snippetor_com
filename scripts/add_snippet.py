#!/usr/bin/env python3
"""Register a snippet file: pull its source, validate its diagrams, list it.

Takes the path to an already-authored snippet file at
public/theme/{theme}/{snippet_folder}/{snippet_name}.snippet.json and:

  1. Pulls every note's source file from Chromium into public/chromium/{commit}/{path}
     (via pull_chromium_file.py), skipping notes whose extension isn't
     recognized as code and files that were already pulled.
  2. Validates that every declared diagram file sits next to the snippet
     file (diagrams are optional; a snippet with none is fine).
  3. Appends (or updates, if already present) a summary entry for it in
     public/theme/{theme}/list.json (title, description, modified, uml_path,
     snippet_path), which is what the site's card grid fetches at runtime.
     `modified` is copied through as-is (epoch milliseconds).

Snippet file shape (as authored/exported, schema 2):

    {
      "content": {
        "schema": 2,
        "title": "...",
        "description": "...",
        "modified": 1789777314293,
        "repos": [
          {"id": 0, "url": "https://chromium.googlesource.com/chromium/src.git",
           "commitId": "...", "branch": ""}
        ],
        "notes": [
          {"path": "chrome/browser/profiles/profile.cc", "line": 264, "text": "...", "rid": 0}
        ],
        "diagrams": ["architecture.svg"]
      }
    }

`diagrams` (optional) entries are filenames only, resolved relative to the
snippet file's own folder. Each note's `rid` selects which entry of
`content.repos` it was pulled from; notes with no matching repo (or no
`repos` at all) fall back to DEFAULT_REPO.

Usage:
    scripts/add_snippet.py public/theme/weblayers/my-snippet/my-snippet.snippet.json
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

ACCEPTABLE_CODE_EXTENSIONS = {
    ".c", ".cc", ".cpp", ".cxx", ".h", ".hh", ".hpp", ".hxx",
    ".m", ".mm", ".java", ".kt", ".js", ".jsx", ".ts", ".tsx",
    ".py", ".go", ".rs", ".mojom", ".proto", ".gn", ".gni", ".sh",
}  # fmt: skip

# Mirrors DEFAULT_REPO in src/utils/sourceFiles.ts.
DEFAULT_REPO = {
    "url": "https://chromium.googlesource.com/chromium/src",
    "commitId": "test_sha",
    "branch": "main",
}

GITILES_HOST = "chromium.googlesource.com"
PULL_SCRIPT = Path(__file__).resolve().parent / "pull_chromium_file.py"


class UsageError(Exception):
    pass


def locate_theme_dirs(snippet_path: Path) -> tuple[Path, str, str]:
    """Given .../public/theme/{theme}/{snippet_folder}/{name}.snippet.json,
    return (public_dir, theme, snippet_folder)."""
    parts = snippet_path.parts
    for i in range(len(parts) - 4):
        if parts[i] == "public" and parts[i + 1] == "theme":
            if len(parts) != i + 5:
                break
            return Path(*parts[: i + 1]), parts[i + 2], parts[i + 3]
    raise UsageError(
        "snippet path must look like "
        ".../public/theme/{theme}/{snippet_folder}/{name}.snippet.json, got: "
        f"{snippet_path}"
    )


def load_snippet(snippet_path: Path) -> dict:
    if not snippet_path.is_file():
        raise UsageError(f"snippet file not found: {snippet_path}")
    try:
        data = json.loads(snippet_path.read_text())
    except json.JSONDecodeError as error:
        raise UsageError(f"snippet file is not valid JSON: {error}") from error

    content = data.get("content")
    if not isinstance(content, dict):
        raise UsageError("snippet file is missing a top-level 'content' object")

    for field in ("title", "description", "modified"):
        if content.get(field) in (None, ""):
            raise UsageError(f"snippet file is missing required field: 'content.{field}'")
    return content


def repo_gitiles_path(repo: dict) -> str:
    parsed = urlparse(repo["url"])
    if parsed.netloc != GITILES_HOST:
        raise UsageError(f"repo.url must be on {GITILES_HOST}, got: {repo['url']}")
    path = parsed.path.strip("/")
    if path.endswith(".git"):
        path = path[: -len(".git")]
    return path


def repo_for_note(note: dict, repos_by_id: dict[int, dict]) -> dict:
    if repos_by_id:
        repo = repos_by_id.get(note.get("rid"))
        if repo is not None:
            return repo
    return DEFAULT_REPO


def pull_source_files(content: dict, public_dir: Path, timeout: float) -> None:
    notes = content.get("notes") or []
    repos_by_id = {repo["id"]: repo for repo in content.get("repos") or [] if "id" in repo}

    groups: dict[tuple[str, str], list[str]] = {}
    seen: dict[tuple[str, str], set[str]] = {}
    for note in notes:
        path = note.get("path")
        if not path:
            continue
        if Path(path).suffix.lower() not in ACCEPTABLE_CODE_EXTENSIONS:
            print(f"skip note (not a recognized code extension): {path}")
            continue

        repo = repo_for_note(note, repos_by_id)
        key = (repo_gitiles_path(repo), repo.get("commitId", DEFAULT_REPO["commitId"]))
        group_seen = seen.setdefault(key, set())
        if path in group_seen:
            continue
        group_seen.add(path)
        groups.setdefault(key, []).append(path)

    if not groups:
        print("no source files to pull")
        return

    failed = False
    for (gitiles_repo, commit_id), paths in groups.items():
        command = [
            sys.executable,
            str(PULL_SCRIPT),
            commit_id,
            *paths,
            "--repo",
            gitiles_repo,
            "--out-dir",
            str(public_dir),
            "--timeout",
            str(timeout),
        ]
        result = subprocess.run(command)
        if result.returncode != 0:
            failed = True

    if failed:
        raise UsageError("failed to pull one or more source files, stopping (see errors above)")


def validate_diagrams(content: dict, snippet_path: Path) -> list[str]:
    diagrams = content.get("diagrams") or []
    if not diagrams:
        print("no diagrams declared for this snippet")
        return []

    missing = [name for name in diagrams if not (snippet_path.parent / name).is_file()]
    if missing:
        raise UsageError(
            "diagram file(s) not found next to the snippet file "
            f"({snippet_path.parent}): {', '.join(missing)}"
        )
    return diagrams


def update_list_json(
    public_dir: Path,
    theme: str,
    snippet_folder: str,
    snippet_name: str,
    content: dict,
    diagrams: list[str],
) -> None:
    list_path = public_dir / "theme" / theme / "list.json"
    entries = []
    if list_path.is_file():
        entries = json.loads(list_path.read_text())

    entry = {
        "title": content["title"],
        "description": content["description"],
        "modified": content["modified"],
        "uml_path": f"{snippet_folder}/{diagrams[0]}" if diagrams else "",
        "snippet_path": f"{snippet_folder}/{snippet_name}",
    }

    entries = [e for e in entries if e.get("snippet_path") != entry["snippet_path"]]
    entries.append(entry)

    list_path.parent.mkdir(parents=True, exist_ok=True)
    list_path.write_text(json.dumps(entries, indent=2) + "\n")
    print(f"updated {list_path} ({len(entries)} snippet(s))")


def add_snippet(snippet_path: Path, timeout: float) -> None:
    public_dir, theme, snippet_folder = locate_theme_dirs(snippet_path)
    content = load_snippet(snippet_path)

    pull_source_files(content, public_dir, timeout)
    diagrams = validate_diagrams(content, snippet_path)
    update_list_json(public_dir, theme, snippet_folder, snippet_path.name, content, diagrams)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "snippet_path",
        type=Path,
        help="Path to public/theme/{theme}/{snippet_folder}/{name}.snippet.json",
    )
    parser.add_argument("--timeout", type=float, default=30.0, help="Per-file pull timeout in seconds (default: 30)")
    args = parser.parse_args()

    try:
        add_snippet(args.snippet_path.resolve(), args.timeout)
    except UsageError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
