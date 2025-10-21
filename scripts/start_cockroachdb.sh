#!/bin/bash

# Usage: ./start_cockroachdb.sh <PORT> <REGION> [<JOIN_PORT>]

PORT=$1
REGION=$2
JOIN_PORT=${3:-$PORT}  # Default join port is same as main node

if [[ -z "$PORT" || -z "$REGION" ]]; then
    echo "Usage: $0 <PORT> <REGION> [<JOIN_PORT>]"
    exit 1
fi

DATA_DIR="../cockroach-data/$REGION"
mkdir -p "$DATA_DIR"

# Find a free HTTP port for the Admin UI
get_free_port() {
    while true; do
        PORT_CHECK=$(shuf -i 30000-40000 -n 1)
        (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
    done
}

HTTP_PORT=$(get_free_port)

if [[ "$PORT" -eq "$JOIN_PORT" ]]; then
    # Start the first (main) CockroachDB node
    cockroach start-single-node \
        --insecure \
        --sql-addr=localhost:$PORT \
        --http-addr=localhost:$HTTP_PORT \
        --advertise-addr=localhost:$PORT \
        --store="$DATA_DIR" \
        --locality="region=$REGION" \
        > cockroach-$REGION.log 2>&1 &

else
    # Start additional node and join existing cluster
    cockroach start \
        --insecure \
        --sql-addr=localhost:$PORT \
        --http-addr=localhost:$HTTP_PORT \
        --advertise-addr=localhost:$PORT \
        --store="$DATA_DIR" \
        --locality="region=$REGION" \
        --join=localhost:$JOIN_PORT \
        --cache=.05 --max-sql-memory=.05 \
        > cockroach-$REGION.log 2>&1 &
fi

echo "Started CockroachDB on port $PORT in region $REGION (HTTP port: $HTTP_PORT, join: localhost:$JOIN_PORT)" | tee -a UsedPorts.txt
