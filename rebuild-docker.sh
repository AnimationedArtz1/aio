#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       DOCKERIZED FRONTEND DEPLOYMENT - REBUILD CONTAINER              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd /var/www/aio-platform/frontend

echo "📋 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found!"
    exit 1
fi

echo "✅ Docker found: $(docker --version)"
echo ""

echo "Step 1/5: Stopping current container..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Container stopped"
else
    echo "⚠️  Container already stopped or not running"
fi

echo ""
echo "Step 2/5: Rebuilding Docker image (this will take a moment)..."
docker compose build --no-cache 2>/dev/null || docker-compose build --no-cache 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Docker image rebuilt with new frontend code"
else
    echo "❌ Failed to build Docker image!"
    exit 1
fi

echo ""
echo "Step 3/5: Starting container..."
docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Container started"
else
    echo "❌ Failed to start container!"
    exit 1
fi

echo ""
echo "Step 4/5: Waiting for container to be ready..."
sleep 5

echo "Step 5/5: Verifying container status..."
docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                     ✅ DEPLOYMENT SUCCESSFUL                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Current Status:"
echo "─────────────────────────────────────────────────────────────────────────────"
docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null
echo ""
echo "🔍 Check container logs:"
echo "   docker compose logs -f 2>/dev/null || docker-compose logs -f 2>/dev/null"
echo ""
echo "🌐 Test the site:"
echo "   curl -I http://localhost:8091"
echo "   https://aioasistan.com"
echo ""
echo "╚══════════════════════════════════════════════════════════════╝"
