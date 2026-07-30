#!/bin/sh
# Quick-start script for the varsha website starter.
# Usage: curl -fsSL https://myndlabs.tech/install.sh | sh
set -eu

TEMPLATE_REPO="yethikrishna/web-ui-template"
DEFAULT_DIR="my-varsha-site"

main() {
  dir="${1:-$DEFAULT_DIR}"
  echo "⚡ varsha — premium website starter by myndlabs.tech"
  echo ""
  echo "Creating your site in ./${dir} ..."

  if command -v npx >/dev/null 2>&1; then
    npx degit "${TEMPLATE_REPO}" "${dir}" 2>/dev/null || {
      echo "npx degit not available, falling back to git clone..."
      git clone --depth=1 "https://github.com/${TEMPLATE_REPO}.git" "${dir}"
      rm -rf "${dir}/.git"
    }
  else
    git clone --depth=1 "https://github.com/${TEMPLATE_REPO}.git" "${dir}"
    rm -rf "${dir}/.git"
  fi

  echo ""
  echo "✓ Site created in ./${dir}"
  echo ""
  echo "Next steps:"
  echo "  cd ${dir}"
  echo "  npm install"
  echo "  npm run dev"
  echo ""
  echo "Docs: https://myndlabs.tech/docs/"
}

main "$@"