#!/bin/bash

# OJET Troubleshooter - Automated Setup Script
# This script sets up the project on a new machine

set -e  # Exit on error

echo "🚀 OJET Troubleshooter - Automated Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js installation
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version is too old (v$NODE_VERSION)${NC}"
    echo "Please upgrade to Node.js v18 or higher"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"

# Check Oracle Instant Client (optional warning)
echo ""
echo "📋 Checking Oracle Instant Client..."
if command -v sqlplus &> /dev/null; then
    echo -e "${GREEN}✅ Oracle Instant Client detected${NC}"
else
    echo -e "${YELLOW}⚠️  Oracle Instant Client not detected${NC}"
    echo "   You'll need it to connect to Oracle databases"
    echo "   macOS: brew install instantclient-basic"
    echo "   Linux: Download from https://www.oracle.com/database/technologies/instant-client/downloads.html"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
chmod +x start.sh stop.sh restart.sh 2>/dev/null || true
echo -e "${GREEN}✅ Scripts are now executable${NC}"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ backend/package.json not found${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    else
        echo "PORT=3000" > .env
        echo -e "${GREEN}✅ Created default .env file${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ frontend/package.json not found${NC}"
    exit 1
fi

cd ..

# Create logs directory
echo ""
echo "📁 Creating logs directory..."
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "========================================"
echo ""
echo "📍 Next steps:"
echo "   1. Start the project:  ./start.sh"
echo "   2. Open browser:       http://localhost:5173"
echo "   3. Stop the project:   ./stop.sh"
echo ""
echo "📚 Documentation:"
echo "   - README.md                      - Project overview"
echo "   - RESTART_GUIDE.md               - How to restart"
echo "   - HOW_TO_EDIT_SHOW_COMMANDS.md   - Edit show commands"
echo "   - HOW_TO_EDIT_TROUBLESHOOTING.md - Edit troubleshooting"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If ports are in use: ./stop.sh"
echo "   - View logs:           tail -f logs/backend.log"
echo ""

