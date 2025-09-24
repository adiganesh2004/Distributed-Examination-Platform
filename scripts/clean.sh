#!/bin/bash

ACTION=$1

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

# Stop CockroachDB safely
pkill cockroach

if [ -z "$ACTION" ] || [ "$ACTION" = "all" ]; then
  clean_java
  clean_logs
  clean_react
elif [ "$ACTION" = "java" ]; then
  clean_java
elif [ "$ACTION" = "logs" ]; then
  clean_logs
elif [ "$ACTION" = "react" ]; then
  clean_react
else
  echo "Invalid option. Use: java | logs | react | both"
  exit 1
fi

exit 0