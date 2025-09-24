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

if [ -z "$ACTION" ] || [ "$ACTION" = "both" ]; then
  clean_java
  clean_logs
elif [ "$ACTION" = "java" ]; then
  clean_java
elif [ "$ACTION" = "logs" ]; then
  clean_logs
else
  echo "Invalid option. Use: java | logs | both"
  exit 1
fi
