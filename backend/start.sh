#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
  echo "Waiting for postgres..."
  sleep 2
done
echo "Database is ready!"

echo "Setting up database schema..."
npx prisma db push --accept-data-loss

echo "Starting API server..."
node dist/index.js