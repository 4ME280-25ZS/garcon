#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 \"prompt text\""
  exit 1
fi
PROMPT="$*"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%SZ")
echo "" >> prompt-history.md
echo "### $TIMESTAMP" >> prompt-history.md
echo "$PROMPT" >> prompt-history.md
git add prompt-history.md
git commit -m "Log prompt: ${PROMPT:0:72}" || echo "No changes to commit"
git push origin main
