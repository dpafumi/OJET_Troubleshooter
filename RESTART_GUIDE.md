# 🔄 OJET Troubleshooter Project Restart Guide

## 📋 Table of Contents
1. [Quick Restart](#quick-restart)
2. [Using Automated Scripts](#using-automated-scripts)
3. [Manual Restart](#manual-restart)
4. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Restart

### Option A: Using the Script (Recommended)

```bash
# From project root
./restart.sh
```

### Option B: Manual in 2 Steps

**Step 1 - Stop:**
```bash
./stop.sh
```

**Step 2 - Start:**
```bash
./start.sh
```

---

## 🤖 Using Automated Scripts

### 1. Start the Project

```bash
cd OJET_Troubleshooter
./start.sh
```

**What it does:**
- ✅ Checks and installs dependencies if missing
- ✅ Creates `.env` file if it doesn't exist
- ✅ Starts backend on port 3001
- ✅ Starts frontend on port 3000
- ✅ Shows URLs and process PIDs

**Expected output:**
```
🚀 Starting OJET Troubleshooter...

✅ Starting servers...
   Backend API: http://localhost:3001
   Frontend:    http://localhost:3000

Press Ctrl+C to stop both servers
```

---

### 2. Stop the Project

```bash
./stop.sh
```

**What it does:**
- 🛑 Kills processes on port 3001 (backend)
- 🛑 Kills processes on port 3000 (frontend)
- 🛑 Shows confirmation for each stopped process

**Expected output:**
```
🛑 Stopping OJET Troubleshooter...
   Stopping backend (port 3001)...
   ✅ Backend stopped
   Stopping frontend (port 3000)...
   ✅ Frontend stopped

✅ OJET Troubleshooter stopped successfully!
```

---

### 3. Restart the Project

```bash
./restart.sh
```

**What it does:**
- 🛑 Stops all processes
- 🚀 Starts backend and frontend
- 📝 Saves logs to `logs/backend.log` and `logs/frontend.log`
- 📋 Shows process PIDs

**Expected output:**
```
🛑 Stopping OJET Troubleshooter...
   ✅ Backend stopped
   ✅ Frontend stopped

🚀 Starting OJET Troubleshooter...
   ✅ Backend started (PID: 12345)
   ✅ Frontend started (PID: 12346)

✅ OJET Troubleshooter is running!

📍 URLs:
   Frontend: http://localhost:3000
   Backend:  http://localhost:3001

📝 Logs:
   Backend:  tail -f logs/backend.log
   Frontend: tail -f logs/frontend.log

🛑 To stop:
   ./stop.sh
```

---

## 🔧 Manual Restart

### Method 1: Ctrl+C in Terminals

If you started the project manually in separate terminals:

**Terminal 1 (Backend):**
```bash
Ctrl + C
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
Ctrl + C
cd frontend
npm run dev
```

---

### Method 2: Kill Processes by Port

```bash
# Stop backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Stop frontend (port 3000)
lsof -ti:3000 | xargs kill -9

# Start again
cd OJET_Troubleshooter
./start.sh
```

---

### Method 3: Kill Processes by PID

```bash
# View Node.js processes
ps aux | grep node

# Kill by specific PID
kill -9 <PID>

# Or kill all Node.js processes (CAREFUL!)
pkill -9 node
```

---

## 🚨 Troubleshooting

### Problem 1: "Port already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Option A: Use the stop script
./stop.sh

# Option B: Kill process manually
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

### Problem 2: Scripts not executable

**Error:**
```
-bash: ./start.sh: Permission denied
```

**Solution:**
```bash
chmod +x start.sh stop.sh restart.sh
```

---

### Problem 3: Missing dependencies

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Problem 4: Zombie processes

**Symptom:** Project doesn't respond, ports occupied but no visible processes.

**Solution:**
```bash
# Kill all Node.js processes
pkill -9 node

# Clean ports
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Restart
./start.sh
```

---

### Problem 5: Frontend doesn't load

**Symptom:** Backend works but frontend shows blank page.

**Solution:**
```bash
cd frontend
rm -rf node_modules .vite
npm install
npm run dev
```

---

### Problem 6: Backend doesn't connect to Oracle

**Symptom:** Database connection error.

**Solution:**
1. Verify Oracle Instant Client is installed
2. Verify credentials in the sidebar
3. Verify network connectivity to Oracle
4. Check logs: `tail -f logs/backend.log`

---

## 📝 View Logs in Real Time

```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Both logs simultaneously
tail -f logs/*.log
```

---

## 🔍 Check Status

### Check if processes are running:

```bash
# View Node.js processes
ps aux | grep node

# View what's using the ports
lsof -i :3001
lsof -i :3000
```

### Check connectivity:

```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000
```

---

## 📊 Command Summary

| Action | Command |
|--------|---------|
| **Start** | `./start.sh` |
| **Stop** | `./stop.sh` |
| **Restart** | `./restart.sh` |
| **View backend logs** | `tail -f logs/backend.log` |
| **View frontend logs** | `tail -f logs/frontend.log` |
| **Kill port 3001 (backend)** | `lsof -ti:3001 \| xargs kill -9` |
| **Kill port 3000 (frontend)** | `lsof -ti:3000 \| xargs kill -9` |
| **Reinstall deps** | `cd backend && npm install && cd ../frontend && npm install` |

---

## 🎯 Recommended Workflow

### Normal Development:
```bash
./start.sh
# Work on the code
# Ctrl+C when done
```

### After Backend Changes:
```bash
./restart.sh
```

### After Frontend Changes:
```bash
# No need to restart, Vite has hot reload
# Just save the file and the browser updates automatically
```

### After package.json Changes:
```bash
./stop.sh
cd backend && npm install
cd ../frontend && npm install
cd ..
./start.sh
```

---

**Done!** Now you can easily restart the project. 🚀

