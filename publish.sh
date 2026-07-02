#!/usr/bin/env bash
# Sync HTML artifacts from the Obsidian vault, rebuild gallery, push to GitHub Pages.
set -euo pipefail

REPO="$HOME/alfred-html"
VAULT="/Users/alfredho/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain/wiki/outputs/html"

echo "==> Syncing from vault"
rsync -a --delete --exclude='.DS_Store' "$VAULT/" "$REPO/sites/"

echo "==> Rebuilding gallery"
python3 "$REPO/gen-gallery.py"

echo "==> Committing"
cd "$REPO"
git add -A
if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi
git commit -m "Publish: $(date +%Y-%m-%d\ %H:%M)"
git push
echo "==> Done. Live at https://whhoaf.github.io/alfred-html/"
