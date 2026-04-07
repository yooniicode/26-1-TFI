.PHONY: dev db backend frontend clean

# Start everything
dev: db backend frontend

# Database only
db:
	docker compose up db -d
	@echo "PostgreSQL running on localhost:5432"

# Spring Boot backend
backend:
	cd backend && ./gradlew bootRun --args='--spring.profiles.active=local'

# Next.js frontend
frontend:
	cd frontend && npm run dev

# Stop all
down:
	docker compose down

# Reset database
db-reset:
	docker compose down -v
	docker compose up db -d
	@echo "Database reset. Run 'make backend' to apply Flyway migrations."

# Build backend jar
build:
	cd backend && ./gradlew build -x test

# Run tests
test:
	cd backend && ./gradlew test

# Generate encryption key
gen-key:
	@openssl rand -hex 32
	@echo "^ Copy this to FILE_ENCRYPTION_KEY in .env.local"
