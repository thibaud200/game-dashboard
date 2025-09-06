#!/bin/bash

echo "🔍 Checking if backend is running..."

# Check if port 3001 is in use
if netstat -ln 2>/dev/null | grep -q ":3001 "; then
    echo "✅ Backend appears to be running on port 3001"
    
    # Try to make a simple health check
    if command -v curl >/dev/null 2>&1; then
        echo "🏥 Testing health endpoint..."
        curl -s http://localhost:3001/api/health || echo "❌ Health check failed"
    else
        echo "ℹ️  curl not available, cannot test endpoints"
    fi
else
    echo "❌ No service running on port 3001"
    echo ""
    echo "To start the backend:"
    echo "1. Go to the backend directory: cd backend"
    echo "2. Install dependencies: npm install"
    echo "3. Start the server: npm run dev"
fi

echo ""
echo "🔍 Checking backend directory structure..."
if [ -d "backend" ]; then
    echo "✅ Backend directory exists"
    ls -la backend/
    echo ""
    
    if [ -f "backend/package.json" ]; then
        echo "✅ package.json found"
        cat backend/package.json | grep -A 5 -B 5 '"scripts"'
    else
        echo "❌ package.json not found"
    fi
    
    if [ -f "backend/server.ts" ]; then
        echo "✅ server.ts found"
    else
        echo "❌ server.ts not found"
    fi
    
    if [ -d "backend/node_modules" ]; then
        echo "✅ node_modules exists"
    else
        echo "❌ node_modules not found - run 'npm install' in backend directory"
    fi
else
    echo "❌ Backend directory not found"
fi