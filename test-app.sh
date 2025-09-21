#!/bin/bash

# Test script to verify the application starts without errors
echo "Testing application startup..."

# Kill any existing processes on port 5173
pkill -f "vite.*5173" 2>/dev/null || true

# Start vite in background
cd /workspaces/spark-template
timeout 15s npm run dev 2>&1 | tee /tmp/vite-output.log &
VITE_PID=$!

# Wait a bit for server to start
sleep 8

# Check if server is running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Application started successfully"
    echo "✅ Server is responding on port 5173"
else
    echo "❌ Application failed to start or is not responding"
    echo "Vite output:"
    cat /tmp/vite-output.log
fi

# Cleanup
kill $VITE_PID 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true

echo "Test completed."