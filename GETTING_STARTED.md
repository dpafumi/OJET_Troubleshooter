# 🚀 Getting Started with OJET Troubleshooter

Welcome! This guide will help you get the OJET Troubleshooter up and running in minutes.

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Run Setup
```bash
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh
```

### 2️⃣ Start the Application
```bash
./start.sh
```

### 3️⃣ Open in Browser
```
http://localhost:3000
```

**That's it!** 🎉

---

## 📚 Documentation Guide

### 🎯 Essential Documents (Start Here)

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **README.md** | Complete project overview | First time setup |
| **QUICK_START.md** | 3-step quick start guide | Getting started |
| **GETTING_STARTED.md** | This file - navigation guide | Right now! |

### 🔧 Operation Guides

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **START_OPTIONS.md** | All start script options | When starting the app |
| **RESTART_GUIDE.md** | How to restart servers | When restarting |
| **PORTABILITY_GUIDE.md** | Transfer to another machine | When deploying |

### 📖 Feature Guides

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **CORRECTIVE_ACTIONS_GUIDE.md** | Automated fix actions | Using validation features |

---

## 🎯 What is OJET Troubleshooter?

A professional web application for diagnosing and validating Oracle OJET (Oracle Job for Extracting Transactions).

### Key Features:
- ✅ **6 Automated Validations** - Dictionary dumps, table instantiation, SCN validation, open transactions, DB parameters
- ✅ **Corrective Actions** - Automated fixes for common issues
- ✅ **Troubleshooting Guide** - 7+ common problems with solutions
- ✅ **Command Reference** - OJET commands with examples
- ✅ **Table Management** - Step-by-step guides for adding/removing tables

---

## 🌐 Application URLs

Once started, access the application at:

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## 📋 Prerequisites

Before running, ensure you have:

- ✅ **Node.js v18+** - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ⚠️ **Oracle Instant Client** (for database connections)
  - macOS: `brew install instantclient-basic`
  - Linux: Download from [Oracle website](https://www.oracle.com/database/technologies/instant-client/downloads.html)

### Verify Prerequisites
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 8.0.0 or higher
```

---

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `./setup.sh` | First-time setup (install dependencies) |
| `./start.sh` | Start the application |
| `./stop.sh` | Stop all servers |
| `./restart.sh` | Restart servers |
| `./verify-setup.sh` | Verify installation |
| `./package-for-transfer.sh` | Create portable archive |

---

## 🎓 How to Use

### 1. Connect to Database
- Open http://localhost:3000
- Use the left sidebar to enter Oracle credentials
- Click "Connect to Database"

### 2. Run Validations
- Navigate to the "Validation" tab
- Click "Run Check" on any validation card
- View results in table format

### 3. Execute Corrective Actions
- After running a validation, if issues are found
- Click the action button (e.g., "Build Dictionary")
- Confirm and view results

### 4. Explore Other Features
- **Troubleshooting** tab - Common problems and solutions
- **Show Commands** tab - OJET command reference
- **Add/Remove Tables** tab - Table management guides

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
./stop.sh
./start.sh
```

### Permission Denied
```bash
chmod +x setup.sh start.sh stop.sh restart.sh
```

### Cannot Find Module
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 📦 Transferring to Another Machine

See **PORTABILITY_GUIDE.md** for detailed instructions.

**Quick method:**
```bash
./package-for-transfer.sh
# Copy the generated .zip file to new machine
# Extract: unzip OJET_Troubleshooter_*.zip
# Setup: cd OJET_Troubleshooter && ./setup.sh
```

---

## 💡 Tips

- **Hot Reload**: Frontend auto-refreshes when you edit files
- **View Logs**: `tail -f logs/backend.log` or `tail -f logs/frontend.log`
- **Stop Servers**: Always use `./stop.sh` before closing terminal

---

## 📞 Need Help?

1. Check **README.md** for complete documentation
2. See **QUICK_START.md** for setup issues
3. Review **TROUBLESHOOTING** section in README.md

---

**Ready to start?** Run `./start.sh` and open http://localhost:3000 🚀

