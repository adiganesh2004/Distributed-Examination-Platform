#!/bin/bash

# Usage: ./start_cockroachdb.sh <PORT> <REGION> [<JOIN_PORT>]
# Example: ./start_cockroachdb.sh 26257 india
# Example: ./start_cockroachdb.sh 26258 usa 26257

PORT=$1
REGION=$2
JOIN_PORT=${3:-26257}  # Default join port is 26257

if [[ -z "$PORT" || -z "$REGION" ]]; then
    echo "Usage: $0 <PORT> <REGION> [<JOIN_PORT>]"
    exit 1
fi

DATA_DIR="../cockroach-data/$REGION-$PORT"
mkdir -p "$DATA_DIR"

# Determine join parameter
JOIN_FLAG="--join=localhost:$JOIN_PORT"

# Function to find a free TCP port
get_free_port() {
    while true; do
        PORT_CHECK=$(shuf -i 30000-40000 -n 1)
        (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
    done
}

HTTP_PORT=$(get_free_port)

if [[ "$PORT" -eq "$JOIN_PORT" ]]; then
    JOIN_FLAG=""
    cockroach start-single-node \
    --insecure \
    --listen-addr="localhost:$PORT" \
    --http-addr="localhost:$HTTP_PORT" \
    --cache=.05 --max-sql-memory=.05 \
    --store="$DATA_DIR" \
    --locality="region=$REGION" \
    --background
else
    cockroach start \
        --insecure \
        --listen-addr="localhost:$PORT" \
        --http-addr="localhost:$HTTP_PORT" \
        --store="$DATA_DIR" \
        --locality="region=$REGION" \
        --cache=.05 --max-sql-memory=.05 \
        $JOIN_FLAG \
        --background
fi
echo "Started CockroachDB on port $PORT in region $REGION (HTTP port: $HTTP_PORT, join: $JOIN_FLAG)" >> UsedPorts.txt
