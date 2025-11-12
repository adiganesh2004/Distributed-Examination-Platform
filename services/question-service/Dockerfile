# ---- Base image ----
    FROM eclipse-temurin:17-jdk-alpine

    # ---- Working dir ----
    WORKDIR /app
    
    # ---- Copy the jar built by Maven ----
    COPY target/*.jar app.jar
    
    # ---- Default port (override later) ----
    EXPOSE 8084
    
    # ---- Run command ----
    ENTRYPOINT ["java","-jar","app.jar"]    