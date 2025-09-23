#!/bin/bash

CURRENT_DIR="$(pwd)"
DATASOURCE_PORT=$1
REGION=$2
USED_PORTS_FILE="$(pwd)/UsedPorts.txt"

declare -A SERVICES_DIRS=(
  [AUTH-SERVICE]="../services/authentication-service"
  # [PROCT-SERVICE]="../services/proctoring-service"
  # [RESULTS-SERVICE]="../services/results-service"
  # [TEST-CREATE-SERVICE]="../services/test-creation-service"
  # [TEST-EVAL-SERVICE]="../services/test-evaluation-service"
)

declare -A SERVICE_COUNTS=(
  [AUTH-SERVICE]=1
  # [PROCT-SERVICE]=2
  # [RESULTS-SERVICE]=2
  # [TEST-CREATE-SERVICE]=1
  # [TEST-EVAL-SERVICE]=1
)

declare -A SERVICE_ENV_NAMES=(
  [AUTH-SERVICE]="AUTH_SERVICE_URIS"
  # [PROCT-SERVICE]="PROCT_SERVICE_URIS"
  # [RESULTS-SERVICE]="RESULTS_SERVICE_URIS"
  # [TEST-CREATE-SERVICE]="TEST_CREATE_SERVICE_URIS"
  # [TEST-EVAL-SERVICE]="TEST_EVAL_SERVICE_URIS"
)

declare -A SERVICE_JARS=(
  [AUTH-SERVICE]="target/authentication-service-1.0.0.jar"
  # [PROCT-SERVICE]="target/proctoring-service-1.0.0.jar"
  # [RESULTS-SERVICE]="target/results-service-1.0.0.jar"
  # [TEST-CREATE-SERVICE]="target/test-creation-service-1.0.0.jar"
  # [TEST-EVAL-SERVICE]="target/test-evaluation-service-1.0.0.jar"
)

GATEWAY_DIR="../services/gateway-service"
GATEWAY_JAR="target/gateway-service-1.0.0.jar"


get_free_port() {
  while true; do
    PORT_CHECK=$(shuf -i 30000-40000 -n 1)
    (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
  done
}

declare -A SERVICE_URIS  

for SERVICE in "${!SERVICES_DIRS[@]}"; do
    DIR=${SERVICES_DIRS[$SERVICE]}
    COUNT=${SERVICE_COUNTS[$SERVICE]}
    ENV_VAR=${SERVICE_ENV_NAMES[$SERVICE]}
    JAR_FILE=${SERVICE_JARS[$SERVICE]}
    URIS=""

    for ((i=1; i<=COUNT; i++)); do
        PORT=$(get_free_port)
        URI="http://localhost:$PORT"
        URIS+="$URI,"

        cd "$DIR" || { echo "Directory $DIR not found!"; exit 1; }

        env DATASOURCE_PORT=$DATASOURCE_PORT java -jar "$JAR_FILE" --server.port=$PORT &
        echo "Started $SERVICE instance $i on port $PORT in $REGION" >> "$USED_PORTS_FILE"
        cd "$CURRENT_DIR"
    done

    URIS=${URIS%,}
    export ${ENV_VAR}="$URIS"

    SERVICE_URIS[$SERVICE]=$URIS
done

for SERVICE in "${!SERVICE_URIS[@]}"; do
    ENV_VAR=${SERVICE_ENV_NAMES[$SERVICE]}
    echo "$SERVICE ($ENV_VAR): ${SERVICE_URIS[$SERVICE]}"
done

GATEWAY_PORT=$(get_free_port)

cd "$GATEWAY_DIR" || { echo "Gateway directory $GATEWAY_DIR not found!"; exit 1; }

ENV_ARGS=()
for SERVICE in "${!SERVICE_URIS[@]}"; do
    VAR_NAME=${SERVICE_ENV_NAMES[$SERVICE]}
    ENV_ARGS+=("$VAR_NAME=${SERVICE_URIS[$SERVICE]}")
done

env DATASOURCE_PORT=$DATASOURCE_PORT "${ENV_ARGS[@]}" java -jar "$GATEWAY_JAR" --server.port=$GATEWAY_PORT &
echo "Started GATEWAY on port $GATEWAY_PORT in $REGION" >> "$USED_PORTS_FILE"
cd "$CURRENT_DIR"

echo "$GATEWAY_PORT"