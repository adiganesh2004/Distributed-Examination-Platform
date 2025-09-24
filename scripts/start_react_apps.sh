#!/bin/bash

GATEWAY_PORT=$1
REGION=$2
FRONTEND_DIR="../frontend/client"
LOGS_DIR="$(pwd)/logs"

# Function to find a free TCP port
get_free_port() {
    while true; do
        PORT_CHECK=$(shuf -i 30000-40000 -n 1)
        (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
    done
}

PORT=$(get_free_port)
REACT_LOG="$LOGS_DIR/frontend-$PORT.log"
cd "$FRONTEND_DIR"
VITE_API_URL="http://localhost:${GATEWAY_PORT}" npm run dev -- --port $PORT 1>"$REACT_LOG" 2>&1 &

echo "STARTED REACT ON $PORT for region $REGION" 