#!/bin/bash

CURRENT_DIR="$(pwd)"
DATASOURCE_PORT=$1
REGION=$2
USED_PORTS_FILE="$CURRENT_DIR/UsedPorts.txt"
LOGS_DIR="$CURRENT_DIR/logs"

mkdir -p "$LOGS_DIR"

declare -A SERVICES_DIRS=(
  [AUTH-SERVICE]="../services/authentication-service"
  [PROCT-SERVICE]="../services/proctoring-service"
  [RESULTS-SERVICE]="../services/results-service"
  [TEST-CREATE-SERVICE]="../services/test-creation-service"
  [TEST-EVAL-SERVICE]="../services/test-evaluation-service"
  [GATEWAY-SERVICE]="../services/gateway-service"
  [QUESTION-SERVICE]="../services/question-service"
  [TEST-TAKING-SERVICE]="../services/test-taking-service"
)

declare -A SERVICE_COUNTS=(
  [GATEWAY-SERVICE]=1
  [AUTH-SERVICE]=1
  [RESULTS-SERVICE]=1
  [PROCT-SERVICE]=1
  [TEST-CREATE-SERVICE]=1
  [TEST-EVAL-SERVICE]=0
  [QUESTION-SERVICE]=1
  [TEST-TAKING-SERVICE]=1
)

get_free_port() {
  while true; do
    PORT_CHECK=$(shuf -i 30000-40000 -n 1)
    (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
  done
}

# Start Eureka
EUREKA_DIR="../services/eureka_server"
EUREKA_PORT=$(get_free_port)
EUREKA_IMAGE="eureka-server:latest"
EUREKA_LOG="$LOGS_DIR/eureka-$EUREKA_PORT.log"

cd "$EUREKA_DIR" || exit 1
docker build -t "$EUREKA_IMAGE" .
docker run -d --name "eureka-$REGION" -p "$EUREKA_PORT:8080" \
  -e "EUREKA_PORT=$EUREKA_PORT" \
  -e "DATASOURCE_PORT=$DATASOURCE_PORT" \
  "$EUREKA_IMAGE" > "$EUREKA_LOG" 2>&1

echo "Started EUREKA on port $EUREKA_PORT for region $REGION" >> "$USED_PORTS_FILE"
cd "$CURRENT_DIR"

# Start all services as containers
for SERVICE in "${!SERVICES_DIRS[@]}"; do
    DIR=${SERVICES_DIRS[$SERVICE]}
    COUNT=${SERVICE_COUNTS[$SERVICE]}
    IMAGE_NAME="${SERVICE,,}:latest" # lowercase image name

    cd "$DIR" || exit 1
    docker build -t "$IMAGE_NAME" .
    cd "$CURRENT_DIR"

    for ((i=1; i<=COUNT; i++)); do
        PORT=$(get_free_port)
        SERVICE_LOG="$LOGS_DIR/${SERVICE,,}-$PORT.log"

        docker run -d \
          --name "${SERVICE,,}-$REGION-$i" \
          -p "$PORT:8080" \
          -e "EUREKA_PORT=$EUREKA_PORT" \
          -e "DATASOURCE_PORT=$DATASOURCE_PORT" \
          -e "SPRING_PROFILES_ACTIVE=$REGION" \
          "$IMAGE_NAME" > "$SERVICE_LOG" 2>&1

        echo "Started $SERVICE on port $PORT for $REGION" >> "$USED_PORTS_FILE"

        if [[ "$SERVICE" == "GATEWAY-SERVICE" ]]; then
          GATEWAY_PORT=$PORT
        fi
    done
done

echo "Started GATEWAY on port $GATEWAY_PORT in $REGION" >> "$USED_PORTS_FILE"
echo "$GATEWAY_PORT"