#!/bin/bash

CURRENT_DIR="$(pwd)"
DATASOURCE_PORT=$1
REGION=$2
USED_PORTS_FILE="$(pwd)/UsedPorts.txt"
LOGS_DIR="$(pwd)/logs"

mkdir -p "$LOGS_DIR"

declare -A SERVICES_DIRS=(
  [AUTH-SERVICE]="../services/authentication-service"
  [PROCT-SERVICE]="../services/proctoring-service"
  [RESULTS-SERVICE]="../services/results-service"
  [TEST-CREATE-SERVICE]="../services/test-creation-service"
  [TEST-EVAL-SERVICE]="../services/test-evaluation-service"
  [GATEWAY-SERVICE]="../services/gateway-service"
  [QUESTION-SERVICE]="../services/question-service"
)

declare -A SERVICE_COUNTS=(
  [GATEWAY-SERVICE]=1
  [AUTH-SERVICE]=1
  [PROCT-SERVICE]=0
  [RESULTS-SERVICE]=0
  [TEST-CREATE-SERVICE]=0
  [TEST-EVAL-SERVICE]=0
  [QUESTION-SERVICE]=1
)

declare -A SERVICE_JARS=(
  [AUTH-SERVICE]="target/authentication-service-1.0.0.jar"
  [PROCT-SERVICE]="target/proctoring-service-1.0.0.jar"
  [RESULTS-SERVICE]="target/results-service-1.0.0.jar"
  [TEST-CREATE-SERVICE]="target/test-creation-service-1.0.0.jar"
  [TEST-EVAL-SERVICE]="target/test-evaluation-service-1.0.0.jar"
  [GATEWAY-SERVICE]="target/gateway-service-1.0.0.jar"
  [QUESTION-SERVICE]="target/question-service-1.0.0.jar"
)

get_free_port() {
  while true; do
    PORT_CHECK=$(shuf -i 30000-40000 -n 1)
    (echo >/dev/tcp/127.0.0.1/$PORT_CHECK) &>/dev/null || { echo $PORT_CHECK; return; }
  done
}

EUREKA_DIR="../services/eureka_server"
EUREKA_JAR="target/eureka-server-1.0.0.jar"
EUREKA_PORT=$(get_free_port)
GATEWAY_PORT=0
EUREKA_LOG="$LOGS_DIR/eureka-server-$EUREKA_PORT.log"
cd "$EUREKA_DIR" || { echo "Gateway directory $EUREKA_DIR not found!"; exit 1; }

env DATASOURCE_PORT=$DATASOURCE_PORT EUREKA_PORT=$EUREKA_PORT java -jar "$EUREKA_JAR" --server.port=$EUREKA_PORT 1>"$EUREKA_LOG" 2>&1 &
echo "Started EUREKA on port $EUREKA_PORT in $REGION" >> "$USED_PORTS_FILE"
cd "$CURRENT_DIR"


for SERVICE in "${!SERVICES_DIRS[@]}"; do
    DIR=${SERVICES_DIRS[$SERVICE]}
    COUNT=${SERVICE_COUNTS[$SERVICE]}
    JAR_FILE=${SERVICE_JARS[$SERVICE]}

    for ((i=1; i<=COUNT; i++)); do
        PORT=$(get_free_port)
        URI="http://localhost:$PORT"
        SERVICE_LOG="$LOGS_DIR/$SERVICE-$PORT.log"

        cd "$DIR" || { echo "Directory $DIR not found!"; exit 1; }
        if [[ "$SERVICE" == "GATEWAY-SERVICE" ]]; then
          GATEWAY_PORT=$PORT
        fi

        env DATASOURCE_PORT=$DATASOURCE_PORT EUREKA_PORT=$EUREKA_PORT java -jar "$JAR_FILE" --server.port=$PORT 1>"$SERVICE_LOG" 2>&1 &
        echo "Started $SERVICE instance $i on port $PORT in $REGION" >> "$USED_PORTS_FILE"
        cd "$CURRENT_DIR"

    done
done

echo "Started GATEWAY on port $GATEWAY_PORT in $REGION" >> "$USED_PORTS_FILE"
cd "$CURRENT_DIR"

echo "$GATEWAY_PORT"