#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
DATA_DIR="${FRESHFLOW_DB_DIR:-$ROOT_DIR/.postgres-data}"
SOCKET_DIR="${FRESHFLOW_DB_SOCKET_DIR:-$ROOT_DIR/.postgres-socket}"
PORT="${FRESHFLOW_DB_PORT:-55432}"

if [ ! -x "$PG_BIN/initdb" ] || [ ! -x "$PG_BIN/pg_ctl" ]; then
  echo "PostgreSQL 16 tools were not found. Set PG_BIN to the folder containing initdb and pg_ctl." >&2
  exit 1
fi

mkdir -p "$SOCKET_DIR"

if [ ! -s "$DATA_DIR/PG_VERSION" ]; then
  "$PG_BIN/initdb" \
    -D "$DATA_DIR" \
    --username=freshflow \
    --auth-local=trust \
    --auth-host=trust \
    --encoding=UTF8 \
    --locale=C
fi

if ! "$PG_BIN/pg_ctl" -D "$DATA_DIR" status >/dev/null 2>&1; then
  "$PG_BIN/pg_ctl" \
    -D "$DATA_DIR" \
    -l "$DATA_DIR/server.log" \
    -o "-p $PORT -k $SOCKET_DIR" \
    start >/dev/null
fi

if ! "$PG_BIN/psql" -h localhost -p "$PORT" -U freshflow -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'freshflow'" | grep -q 1; then
  "$PG_BIN/createdb" -h localhost -p "$PORT" -U freshflow freshflow
fi

"$PG_BIN/psql" -h localhost -p "$PORT" -U freshflow -d freshflow -f "$ROOT_DIR/database/schema.sql" >/dev/null

echo "Fresh Flow database is ready at postgres://freshflow:freshflow@localhost:$PORT/freshflow"
