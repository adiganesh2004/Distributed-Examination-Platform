#!/bin/bash

> UsedPorts.txt

CURRENT_DIR="$(pwd)"
LOGS_DIR="$CURRENT_DIR/logs"
DATABASE_PORTS="$LOGS_DIR/DBPORTS.txt"
mkdir -p "$LOGS_DIR"

> "$DATABASE_PORTS"

declare -A NODES

# Function to find a free TCP port
get_free_port() {
    while true; do
        PORT_CHECK=$(shuf -i 30000-40000 -n 1)
        (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
    done
}

MAIN_DB_PORT=$(get_free_port)
NUMBER="$1"

declare -A NODES

if [[ "$NUMBER" == "1" ]]; then
    NODES=([${MAIN_DB_PORT}]="india")
elif [[ "$NUMBER" == "2" ]]; then
    NODES=([${MAIN_DB_PORT}]="india" [$(get_free_port)]="usa")
elif [[ "$NUMBER" == "3" ]]; then
    NODES=([${MAIN_DB_PORT}]="india" [$(get_free_port)]="usa" [$(get_free_port)]="europe")
else
    echo "Invalid NUMBER"
fi

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    ./start_cockroachdb.sh "$PORT" "$REGION" "$MAIN_DB_PORT"
    echo "Started the Database at $REGION $PORT"
    echo "$REGION $PORT" >> "$DATABASE_PORTS"
done

sleep 2

./cockroachdb_schema.sh "$MAIN_DB_PORT"

echo "DB SCHEMA DONE"

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    GATEWAY_PORT=$(./start_region_instances.sh "$PORT" "$REGION")
    ./start_react_apps.sh "$GATEWAY_PORT" "$REGION"
    echo "Started region $REGION"
done

