#!/bin/bash

> UsedPorts.txt

CURRENT_DIR="$(pwd)"
FRONTEND_DIR="../frontend/client"
declare -A NODES
NODES=( [26257]="india" [26258]="usa" [26259]="europe" )

./compile_services.sh

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    ./start_cockroachdb.sh "$PORT" "$REGION" "26257"
done

for PORT in "${!NODES[@]}"; do
    REGION=${NODES[$PORT]}
    cd "$CURRENT_DIR"
    GATEWAY_PORT=$(./start_region_instances.sh "$PORT" "$REGION")
    cd "$FRONTEND_DIR"
    # npm run dev with GATEWAY_PORT
    
done

