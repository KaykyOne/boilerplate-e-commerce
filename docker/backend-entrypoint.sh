#!/bin/sh
set -eu

echo "Running Medusa database migrations..."
npx medusa db:migrate

echo "Starting Medusa on port ${PORT:-9000}..."
exec npm run start

