#!/bin/bash

> UsedPorts.txt

CURRENT_DIR="$(pwd)"
FRONTEND_DIR="../frontend/client"
declare -A NODES

# Function to find a free TCP port
get_free_port() {
    while true; do
        PORT_CHECK=$(shuf -i 30000-40000 -n 1)
        (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
    done
}

MAIN_DB_PORT=$(get_free_port)

# NODES=( [${MAIN_DB_PORT}]="india")
NODES=([${MAIN_DB_PORT}]="india" [$(get_free_port)]="usa")
# NODES=([${MAIN_DB_PORT}]="india" [$(get_free_port)]="usa" [$(get_free_port)]="europe")

# ./compile_services.sh

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    ./start_cockroachdb.sh "$PORT" "$REGION" "$MAIN_DB_PORT"
    echo "Started the Database at $REGION $PORT"
done

./cockroachdb_schema.sh "$MAIN_DB_PORT"
echo "DB ScHEMA DONE"

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    ./start_region_instances.sh "$PORT" "$REGION"
    # GATEWAY_PORT=$(./start_region_instances.sh "$PORT" "$REGION")
    cd "$FRONTEND_DIR"
    # npm run dev with GATEWAY_PORT
    echo "Started region $REGION"
done

