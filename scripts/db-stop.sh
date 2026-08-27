#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_BIN="${PG_BIN:-/usr/lib/postgresql/16/bin}"
DATA_DIR="${FRESHFLOW_DB_DIR:-$ROOT_DIR/.postgres-data}"

if [ ! -s "$DATA_DIR/PG_VERSION" ]; then
  echo "Fresh Flow database has not been initialized."
  exit 0
fi

if "$PG_BIN/pg_ctl" -D "$DATA_DIR" status >/dev/null 2>&1; then
  "$PG_BIN/pg_ctl" -D "$DATA_DIR" stop -m fast >/dev/null
  echo "Fresh Flow database stopped."
else
  echo "Fresh Flow database is not running."
fi
