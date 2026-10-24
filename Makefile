.PHONY: dev test lint gen-api check-boundary

dev:
	@echo "Starting SthreeCare client..."
	npm --prefix client run dev

dev-server:
	@echo "Starting SthreeCare FastAPI server on port 8000..."
	python -m uvicorn app.main:app --app-dir server --reload --port 8000

test: test-client test-server

test-client:
	@echo "Running TypeScript client tests..."
	npm --prefix client/packages/compass run test

test-server:
	@echo "Running Python server tests..."
	python -m pytest server/tests

check-boundary:
	@echo "Verifying zero-health data imports in server..."
	python server/scripts/check_no_health_imports.py

gen-api:
	@echo "Exporting OpenAPI JSON from FastAPI..."
	python server/scripts/export_openapi.py
	node scripts/gen-api-types.ts

lint:
	@echo "Checking codebase..."
	python server/scripts/check_no_health_imports.py
