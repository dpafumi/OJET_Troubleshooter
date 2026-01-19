#!/bin/bash

# OJET Troubleshooter - Start in Background
# This script starts servers in background and returns terminal control

echo "🚀 Starting OJET Troubleshooter (Background Mode)..."
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
echo "✅ Starting servers in background..."

# Start backend in background
cd backend
nohup npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
cd frontend
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
cd ..

# Wait for frontend to start
sleep 2

echo ""
echo "=========================================="
echo "✅ Servers Started Successfully!"
echo "=========================================="
echo ""
echo "🌐 URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""
echo "📊 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop.sh"
echo ""
echo "💡 Tip: Open http://localhost:3000 in your browser"
echo ""

