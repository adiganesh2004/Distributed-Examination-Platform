#!/bin/bash

ACTION=$1

CURRENT_DIR="$(pwd)"
COCKROACH_DIR="../cockroach-data" 
LOGS_DIR="$CURRENT_DIR/logs"
DATABASE_PORTS="$LOGS_DIR/DBPORTS.txt"

clean_java() {
  echo "Stopping Spring Boot services..."
  pkill -f "java -jar" && echo "Java processes stopped." || echo "No Java processes found."
}

clean_logs() {
  if [ -d "logs" ]; then
    rm -rf logs/
    echo "Logs directory deleted."
  else
    echo "No logs directory found."
  fi
}

clean_react() {
  echo "Stopping active React/Vite apps..."
  pkill -f "node.*vite" && echo "Vite dev servers stopped." || echo "No Vite dev servers found."
}

clean_db() {
  if [ ! -f "$DATABASE_PORTS" ]; then
    echo "No DBPORTS.txt found — skipping graceful DB shutdown."
  else
    echo "Shutting down CockroachDB nodes gracefully..."
    while read -r REGION PORT; do
      if [[ -n "$PORT" ]]; then
        echo "Stopping CockroachDB in region '$REGION' (port $PORT)..."
        cockroach node drain --insecure --host=localhost:$PORT
        if [ $? -eq 0 ]; then
          echo "Successfully stopped node $REGION ($PORT)"
        else
          echo "Failed to stop node $REGION ($PORT) — may already be stopped."
        fi
      fi
    done < "$DATABASE_PORTS"
  fi
  pkill cockroach
}

if [ "$ACTION" = "dbdir" ]; then
    rm -rf "$COCKROACH_DIR"
    echo "CockroachDB data directory deleted."
  fi

if [ -z "$ACTION" ] || [ "$ACTION" = "all" ]; then
  clean_db
  clean_java
  clean_logs
  clean_react
elif [ "$ACTION" = "db" ]; then
  clean_db
elif [ "$ACTION" = "java" ]; then
  clean_java
elif [ "$ACTION" = "logs" ]; then
  clean_logs
elif [ "$ACTION" = "react" ]; then
  clean_react
else
  echo "Invalid option. Use: all | db | java | logs | react"
  exit 1
fi

exit 0
