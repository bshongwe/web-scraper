#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
  echo "Waiting for postgres..."
  sleep 2
done
echo "Database is ready!"

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting API server..."
node dist/index.js