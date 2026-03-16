# Dev image: Maven 3.9 + JDK 17 for Spring Boot
FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

# Copy POM first and prefetch dependencies (cached unless pom.xml changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

COPY . .

EXPOSE 8080

# Default: run Spring Boot (use volume mount in compose for live code)
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-Dserver.port=8080"]
