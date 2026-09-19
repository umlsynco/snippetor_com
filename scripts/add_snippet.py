#!/usr/bin/env python3
"""Register a snippet file: pull its source, validate its diagrams, list it.

Takes the path to an already-authored snippet file at
public/theme/{theme}/{snippet_folder}/{snippet_name}.snippet.json and:

  1. Pulls every note's source file from Chromium into public/{commit}/{path}
     (via pull_chromium_file.py), skipping notes whose extension isn't
     recognized as code and files that were already pulled.
  2. Validates the snippet references at least one diagram, and that every
     diagram file actually sits next to the snippet file.
  3. Appends (or updates, if already present) a summary entry for it in
     public/theme/{theme}/list.json, which is what the site's card grid
     fetches at runtime.

Expected snippet file shape (see src/types/snippet.ts):

    {
      "title": "...",
      "description": "...",
      "modified": "2024-09-10",
      "projects": ["Android", "WebLayer"],
      "diagrams": ["architecture.svg"],
      "repo": {
        "url": "https://chromium.googlesource.com/chromium/src",
        "commitId": "...",
        "branch": "main"
      },
      "notes": [
        {"path": "weblayer/browser/browser_impl.cc", "line": 25, "text": "..."}
      ]
    }

`diagrams` entries are filenames only, resolved relative to the snippet
file's own folder. `repo` is optional; DEFAULT_REPO is used if absent.

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

    for field in ("title", "description", "modified"):
        if not data.get(field):
            raise UsageError(f"snippet file is missing required field: {field!r}")
    return data


def repo_gitiles_path(repo: dict) -> str:
    parsed = urlparse(repo["url"])
    if parsed.netloc != GITILES_HOST:
        raise UsageError(f"repo.url must be on {GITILES_HOST}, got: {repo['url']}")
    return parsed.path.strip("/")


def notes_to_pull(notes: list[dict]) -> list[str]:
    paths: list[str] = []
    seen: set[str] = set()
    for note in notes:
        path = note.get("path")
        if not path or path in seen:
            continue
        seen.add(path)
        if Path(path).suffix.lower() not in ACCEPTABLE_CODE_EXTENSIONS:
            print(f"skip note (not a recognized code extension): {path}")
            continue
        paths.append(path)
    return paths


def pull_source_files(data: dict, public_dir: Path, timeout: float) -> None:
    notes = data.get("notes") or []
    paths = notes_to_pull(notes)
    if not paths:
        print("no source files to pull")
        return

    repo = data.get("repo") or DEFAULT_REPO
    gitiles_repo = repo_gitiles_path(repo)

    command = [
        sys.executable,
        str(PULL_SCRIPT),
        repo["commitId"],
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
        raise UsageError("failed to pull one or more source files, stopping (see errors above)")


def validate_diagrams(data: dict, snippet_path: Path) -> None:
    diagrams = data.get("diagrams") or []
    if not diagrams:
        raise UsageError("snippet must reference at least one diagram in 'diagrams'")

    missing = [name for name in diagrams if not (snippet_path.parent / name).is_file()]
    if missing:
        raise UsageError(
            "diagram file(s) not found next to the snippet file "
            f"({snippet_path.parent}): {', '.join(missing)}"
        )


def update_list_json(public_dir: Path, theme: str, snippet_folder: str, snippet_name: str, data: dict) -> None:
    list_path = public_dir / "theme" / theme / "list.json"
    entries = []
    if list_path.is_file():
        entries = json.loads(list_path.read_text())

    diagrams = data.get("diagrams") or []
    entry = {
        "title": data["title"],
        "description": data["description"],
        "modified": data["modified"],
        "projects": data.get("projects", []),
        "uml_path": f"{snippet_folder}/{diagrams[0]}",
        "snippet_path": f"{snippet_folder}/{snippet_name}",
    }

    entries = [e for e in entries if e.get("snippet_path") != entry["snippet_path"]]
    entries.append(entry)

    list_path.parent.mkdir(parents=True, exist_ok=True)
    list_path.write_text(json.dumps(entries, indent=2) + "\n")
    print(f"updated {list_path} ({len(entries)} snippet(s))")


def add_snippet(snippet_path: Path, timeout: float) -> None:
    public_dir, theme, snippet_folder = locate_theme_dirs(snippet_path)
    data = load_snippet(snippet_path)

    pull_source_files(data, public_dir, timeout)
    validate_diagrams(data, snippet_path)
    update_list_json(public_dir, theme, snippet_folder, snippet_path.name, data)


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
