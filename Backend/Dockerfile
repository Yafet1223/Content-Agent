# ========================================================
# ContentFlow AI - FastAPI Backend & AI Agent Dockerfile
# ========================================================
FROM python:3.11-slim

# Prevent Python from writing .pyc bytecode and enable unbuffered standard out/err
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

# Install system dependencies needed for compiling packages and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies first (cached layer)
COPY Backend/requirements.txt /app/Backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/Backend/requirements.txt

# Copy all repository source files (Backend, Database, workflow, config, etc.)
COPY . /app

WORKDIR /app/Backend

EXPOSE 8000

# Periodic health check against FastAPI /health endpoint
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start Uvicorn ASGI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
