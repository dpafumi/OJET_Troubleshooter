#!/bin/bash

# OJET Troubleshooter - Restart Script
# This script stops and restarts both backend and frontend

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
echo "🚀 Starting OJET Troubleshooter..."
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend in background
echo "   Starting backend..."
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend started (PID: $BACKEND_PID)"

# Wait a bit for backend to initialize
sleep 2

# Start frontend in background
echo "   Starting frontend..."
cd ../frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "✅ OJET Troubleshooter is running!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📋 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop:"
echo "   ./stop.sh"
echo "   or manually: kill $BACKEND_PID $FRONTEND_PID"
echo ""

