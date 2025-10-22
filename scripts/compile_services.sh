#!/bin/bash

CURRENT_DIR="$(pwd)"

declare -A SERVICES_DIRS=(
  [COMMON]="../common"
  [AUTH-SERVICE]="../services/authentication-service"
  [PROCT-SERVICE]="../services/proctoring-service"
  [RESULTS-SERVICE]="../services/results-service"
  [TEST-CREATE-SERVICE]="../services/test-creation-service"
  [TEST-EVAL-SERVICE]="../services/test-evaluation-service"
  [GATEWAY_DIR]="../services/gateway-service"
  [EUREKA_DIR]="../services/eureka_server"
  [QUESTION-SERVICE]="../services/question-service"
)

declare -A SERVICE_JARS=(
  [COMMON]="common-0.0.1-SNAPSHOT.jar"
  [AUTH-SERVICE]="authentication-service-1.0.0.jar"
  [PROCT-SERVICE]="proctoring-service-1.0.0.jar"
  [RESULTS-SERVICE]="results-service-1.0.0.jar"
  [TEST-CREATE-SERVICE]="test-creation-service-1.0.0.jar"
  [TEST-EVAL-SERVICE]="test-evaluation-service-1.0.0.jar"
  [GATEWAY_DIR]="gateway-service-1.0.0.jar"
  [EUREKA_DIR]="eureka-server-1.0.0.jar"
  [QUESTION-SERVICE]="question-service-1.0.0.jar"
)

SERVICES_ORDER=("COMMON" "AUTH-SERVICE" "GATEWAY_DIR" "EUREKA_DIR" "QUESTION-SERVICE")
# "PROCT-SERVICE" "RESULTS-SERVICE" "TEST-CREATE-SERVICE" "TEST-EVAL-SERVICE"

for SERVICE in "${SERVICES_ORDER[@]}"; do
    DIR=${SERVICES_DIRS[$SERVICE]}
    JAR_FILE=${SERVICE_JARS[$SERVICE]}
    (
        cd "$DIR" || exit 1
        if [[ "$SERVICE" == "COMMON" ]]; then
            mvn clean install -Dmaven.test.skip=true || { echo "Build failed for $SERVICE"; exit 1; }
        else
            mvn clean package -Dmaven.test.skip=true || { echo "Build failed for $SERVICE"; exit 1; }
        fi
        mv target/*.jar "target/$JAR_FILE"
    )

done