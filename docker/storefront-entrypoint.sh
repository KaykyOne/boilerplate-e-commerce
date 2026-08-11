#!/bin/sh
set -eu

if [ ! -f .next/BUILD_ID ]; then
  echo "Building the storefront with the configured public URLs..."
  npm run build
fi

echo "Starting the storefront on port ${PORT:-8000}..."
exec npm run start

