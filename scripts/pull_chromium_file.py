#!/usr/bin/env python3
"""Pull one or more files from a Chromium commit and save them under public/.

Fetches raw file content from a googlesource.com Gitiles mirror at a specific
commit (or ref) and writes each one to public/chromium/{commit}/{path},
matching the layout the site's CodeViewer fetches from at runtime (see
src/utils/sourceFiles.ts).

Usage:
    scripts/pull_chromium_file.py <commit> <path> [<path> ...]
    scripts/pull_chromium_file.py test_sha weblayer/browser/browser_impl.cc

Example with a real commit:
    scripts/pull_chromium_file.py main weblayer/browser/browser_impl.cc
"""

from __future__ import annotations

import argparse
import base64
import sys
import urllib.error
import urllib.request
from pathlib import Path

DEFAULT_REPO = "chromium/src"
GITILES_HOST = "https://chromium.googlesource.com"
USER_AGENT = "snippetor-com-pull-chromium-file/1.0"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CHROMIUM_DIR_NAME = "chromium"


def gitiles_url(repo: str, commit: str, path: str) -> str:
    return f"{GITILES_HOST}/{repo}/+/{commit}/{path}?format=TEXT"


def fetch_file(repo: str, commit: str, path: str, timeout: float) -> bytes:
    url = gitiles_url(repo, commit, path)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        encoded = response.read()
    return base64.b64decode(encoded)


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(PROJECT_ROOT))
    except ValueError:
        return str(path)


def pull_one(repo: str, commit: str, path: str, out_dir: Path, force: bool, timeout: float) -> bool:
    dest = out_dir / CHROMIUM_DIR_NAME / commit / path
    if dest.exists() and not force:
        print(f"skip  {path} (already exists at {display_path(dest)}, use --force to overwrite)")
        return True

    try:
        content = fetch_file(repo, commit, path, timeout)
    except urllib.error.HTTPError as error:
        print(f"FAIL  {path}: HTTP {error.code} ({gitiles_url(repo, commit, path)})", file=sys.stderr)
        return False
    except urllib.error.URLError as error:
        print(f"FAIL  {path}: {error.reason}", file=sys.stderr)
        return False

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(content)
    print(f"saved {path} -> {display_path(dest)} ({len(content)} bytes)")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Pull file(s) from a Chromium commit into public/chromium/{commit}/{path}.",
    )
    parser.add_argument("commit", help="Commit SHA (or ref, e.g. 'main') to pull the file(s) at")
    parser.add_argument(
        "path",
        nargs="+",
        help="File path(s) within the repo, relative to its root (e.g. weblayer/browser/browser_impl.cc)",
    )
    parser.add_argument(
        "--repo",
        default=DEFAULT_REPO,
        help=f"Repository on {GITILES_HOST} to pull from (default: {DEFAULT_REPO})",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=PROJECT_ROOT / "public",
        help="Base output directory (default: public/ at the project root)",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite files that already exist")
    parser.add_argument("--timeout", type=float, default=30.0, help="Per-request timeout in seconds (default: 30)")
    args = parser.parse_args()

    results = [
        pull_one(args.repo, args.commit, path, args.out_dir, args.force, args.timeout) for path in args.path
    ]

    if not all(results):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
