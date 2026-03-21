# Build stage - JAVA 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom.xml
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar código e compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage - JAVA 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar JAR compilados
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]