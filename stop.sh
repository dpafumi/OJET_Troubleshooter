#!/bin/bash

# OJET Troubleshooter - Stop Script
# This script stops both backend and frontend

echo "🛑 Stopping OJET Troubleshooter..."

# Kill processes on backend port (3001)
echo "   Stopping backend (port 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Backend stopped"
else
    echo "   ℹ️  No backend process found on port 3001"
fi

# Kill processes on frontend port (3000)
echo "   Stopping frontend (port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend stopped"
else
    echo "   ℹ️  No frontend process found on port 3000"
fi

echo ""
echo "✅ OJET Troubleshooter stopped successfully!"
echo ""

