#!/bin/sh
npm ci --no-audit --no-fund || npm install
if [ ! -f /app/.initialized ]; then
  npx sequelize-cli db:migrate
  touch /app/.initialized
fi
exec "$@"