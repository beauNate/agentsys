#!/usr/bin/env bash
# Sync shared lib/ to all plugins
# 
# DEVELOPER TOOL: Run this after modifying files in lib/ to propagate
# changes to all plugins. Then commit the updated plugin lib/ files.
#
# Users don't need to run this - plugin lib/ files are tracked in git.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Syncing lib/ to all plugins..."

PLUGINS=(
  "deslop-around"
  "next-task"
  "pr-merge"
  "project-review"
  "ship"
)

for plugin in "${PLUGINS[@]}"; do
  PLUGIN_LIB="$REPO_ROOT/plugins/$plugin/lib"
  
  # Create lib directory structure
  mkdir -p "$PLUGIN_LIB"/{platform,patterns,utils}
  
  # Copy all lib files using explicit iteration for safety
  for item in "${REPO_ROOT}/lib"/*; do
    cp -r "$item" "${PLUGIN_LIB}/"
  done
  
  echo "  ✓ $plugin"
done

echo ""
echo "Done! All plugins now have updated lib/ copies."
echo ""
echo "Next steps:"
echo "  git add plugins/*/lib/"
echo "  git commit -m 'chore: sync lib updates to plugins'"
