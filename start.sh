#!/bin/bash

# OJET Troubleshooter - Start Script
# Starts servers in background and returns terminal control

echo "🚀 Starting OJET Troubleshooter..."
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Create .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

# Create logs directory
mkdir -p logs

echo ""
echo "   Starting backend..."

# Start backend in background
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

echo "   ✅ Backend started (PID: $BACKEND_PID)"
echo "   Starting frontend..."

# Start frontend in background
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 2

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

