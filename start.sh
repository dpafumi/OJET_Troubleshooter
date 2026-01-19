#!/bin/bash

echo "🚀 Starting OJET Troubleshooter..."
echo ""

# Check if --background flag is passed
BACKGROUND_MODE=false
if [ "$1" == "--background" ] || [ "$1" == "-b" ]; then
    BACKGROUND_MODE=true
fi

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

if [ "$BACKGROUND_MODE" = true ]; then
    # Background mode - returns terminal control
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
    echo "📝 View Logs:"
    echo "   tail -f logs/backend.log"
    echo "   tail -f logs/frontend.log"
    echo ""
    echo "🛑 To stop servers:"
    echo "   ./stop.sh"
    echo ""
else
    # Foreground mode - shows logs in terminal
    echo ""
    echo "✅ Starting servers (foreground mode)..."
    echo "   Frontend:    http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo ""
    echo "💡 Tip: Use './start.sh --background' to run in background"
    echo "📝 Logs will be shown below"
    echo "🛑 Press Ctrl+C to stop both servers"
    echo ""

    # Start backend in background (but keep script running)
    (cd backend && npm start) > logs/backend.log 2>&1 &
    BACKEND_PID=$!

    # Wait a bit for backend to start
    sleep 2

    # Start frontend in foreground (shows logs)
    (cd frontend && npm run dev)

    # When frontend stops, kill backend
    kill $BACKEND_PID 2>/dev/null
fi

