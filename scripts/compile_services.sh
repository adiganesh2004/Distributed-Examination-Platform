#!/bin/bash

CURRENT_DIR="$(pwd)"

declare -A SERVICES_DIRS=(
  [AUTH-SERVICE]="../services/authentication-service"
  [PROCT-SERVICE]="../services/proctoring-service"
  [RESULTS-SERVICE]="../services/results-service"
  [TEST-CREATE-SERVICE]="../services/test-creation-service"
  [TEST-EVAL-SERVICE]="../services/test-evaluation-service"
  [GATEWAY_DIR]="../services/gateway-service"
  [EUREKA_DIR]="../services/eureka_server"
  [QUESTION-CREATION-SERVICE]="../services/question-creation-service"
)

declare -A SERVICE_JARS=(
  [AUTH-SERVICE]="authentication-service-1.0.0.jar"
  [PROCT-SERVICE]="proctoring-service-1.0.0.jar"
  [RESULTS-SERVICE]="results-service-1.0.0.jar"
  [TEST-CREATE-SERVICE]="test-creation-service-1.0.0.jar"
  [TEST-EVAL-SERVICE]="test-evaluation-service-1.0.0.jar"
  [GATEWAY_DIR]="gateway-service-1.0.0.jar"
  [EUREKA_DIR]="eureka-server-1.0.0.jar"
  [QUESTION-CREATION-SERVICE]="question-creation-service-1.0.0.jar"
)

for SERVICE in "${!SERVICES_DIRS[@]}"; do
    DIR=${SERVICES_DIRS[$SERVICE]}
    JAR_FILE=${SERVICE_JARS[$SERVICE]}
    (
        cd "$DIR" || exit 1
        mvn clean package -Dmaven.test.skip=true || { echo "Build failed for $SERVICE"; exit 1; }
        mv target/*.jar "target/$JAR_FILE"
    )
done