#!/bin/bash

# OJET Troubleshooter - Verify Setup Script
# This script verifies that the project is properly set up

echo "🔍 OJET Troubleshooter - Setup Verification"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to check and report
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Check Node.js
echo "📋 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        check_pass "Node.js $NODE_VERSION installed"
    else
        check_fail "Node.js version too old ($NODE_VERSION). Need v18+"
    fi
else
    check_fail "Node.js not installed"
fi

# Check npm
echo ""
echo "📋 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm $NPM_VERSION installed"
else
    check_fail "npm not installed"
fi

# Check Oracle Instant Client
echo ""
echo "📋 Checking Oracle Instant Client..."
if command -v sqlplus &> /dev/null; then
    check_pass "Oracle Instant Client detected"
else
    check_warn "Oracle Instant Client not detected (needed for DB connections)"
fi

# Check project structure
echo ""
echo "📋 Checking project structure..."

if [ -d "backend" ]; then
    check_pass "backend/ directory exists"
else
    check_fail "backend/ directory missing"
fi

if [ -d "frontend" ]; then
    check_pass "frontend/ directory exists"
else
    check_fail "frontend/ directory missing"
fi

if [ -f "backend/package.json" ]; then
    check_pass "backend/package.json exists"
else
    check_fail "backend/package.json missing"
fi

if [ -f "frontend/package.json" ]; then
    check_pass "frontend/package.json exists"
else
    check_fail "frontend/package.json missing"
fi

# Check dependencies
echo ""
echo "📋 Checking dependencies..."

if [ -d "backend/node_modules" ]; then
    BACKEND_PACKAGES=$(ls backend/node_modules | wc -l)
    check_pass "Backend dependencies installed ($BACKEND_PACKAGES packages)"
else
    check_fail "Backend dependencies not installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    FRONTEND_PACKAGES=$(ls frontend/node_modules | wc -l)
    check_pass "Frontend dependencies installed ($FRONTEND_PACKAGES packages)"
else
    check_fail "Frontend dependencies not installed (run: cd frontend && npm install)"
fi

# Check scripts
echo ""
echo "📋 Checking scripts..."

for script in start.sh stop.sh restart.sh setup.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            check_pass "$script is executable"
        else
            check_warn "$script exists but not executable (run: chmod +x $script)"
        fi
    else
        check_warn "$script not found"
    fi
done

# Check .env file
echo ""
echo "📋 Checking configuration..."

if [ -f "backend/.env" ]; then
    check_pass "backend/.env exists"
else
    if [ -f "backend/.env.example" ]; then
        check_warn "backend/.env missing (will be created from .env.example)"
    else
        check_warn "backend/.env and .env.example missing"
    fi
fi

# Check logs directory
echo ""
echo "📋 Checking logs directory..."

if [ -d "logs" ]; then
    check_pass "logs/ directory exists"
else
    check_warn "logs/ directory missing (will be created automatically)"
fi

# Summary
echo ""
echo "==========================================="
echo "📊 Verification Summary"
echo "==========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Project is ready to run.${NC}"
    echo ""
    echo "🚀 To start the project:"
    echo "   ./start.sh"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found, but project should work.${NC}"
    echo ""
    echo "🚀 To start the project:"
    echo "   ./start.sh"
else
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo ""
    echo "🔧 To fix issues:"
    echo "   1. Run setup script: ./setup.sh"
    echo "   2. Or manually install dependencies:"
    echo "      cd backend && npm install"
    echo "      cd ../frontend && npm install"
fi

echo ""

