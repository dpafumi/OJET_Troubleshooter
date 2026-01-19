# 📦 OJET Troubleshooter - Portability Guide

This guide explains how to transfer the OJET Troubleshooter project to another machine or location.

---

## ✅ Quick Start (New Machine)

### Option 1: Automated Setup (Recommended)

```bash
# 1. Copy the entire OJET_Troubleshooter folder to the new machine
# 2. Navigate to the project directory
cd OJET_Troubleshooter

# 3. Run the setup script
chmod +x setup.sh
./setup.sh

# 4. Start the project
./start.sh
```

### Option 2: Manual Setup

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Make scripts executable
cd ..
chmod +x start.sh stop.sh restart.sh

# 4. Start the project
./start.sh
```

---

## 📋 Prerequisites on New Machine

Before transferring, ensure the new machine has:

1. **Node.js v18+**
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```
   Download from: https://nodejs.org/

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Oracle Instant Client** (for database connectivity)
   - **macOS**: `brew install instantclient-basic`
   - **Linux**: Download from [Oracle website](https://www.oracle.com/database/technologies/instant-client/downloads.html)
   - **Windows**: Download and install from Oracle website

---

## 🚀 Transfer Methods

### Method 1: Direct Copy (Simple)

**On source machine:**
```bash
# Compress the project (excluding node_modules)
zip -r -q -X OJET_Troubleshooter.zip OJET_Troubleshooter/ \
  -x "*/node_modules/*" \
  -x "*/dist/*" \
  -x "*/.vite/*" \
  -x "*/logs/*" \
  -x "*/.env" \
  -x "*.log" \
  -x ".DS_Store"
```

**Transfer the file** (USB, email, cloud storage, etc.)

**On destination machine:**
```bash
# Extract
unzip OJET_Troubleshooter.zip

# Setup
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh
```

---

### Method 2: Git (Best Practice)

**On source machine:**
```bash
cd OJET_Troubleshooter

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to remote repository (GitHub, GitLab, etc.)
git remote add origin <your-repo-url>
git push -u origin main
```

**On destination machine:**
```bash
# Clone the repository
git clone <your-repo-url>

# Setup
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh
```

---

### Method 3: Cloud Storage (Dropbox, Google Drive, etc.)

1. Copy entire `OJET_Troubleshooter` folder to cloud storage
2. Download on new machine
3. Run setup script

---

## 📁 What Gets Transferred

### ✅ Files to Transfer (Included)

```
OJET_Troubleshooter/
├── backend/
│   ├── server.js              ✅
│   ├── package.json           ✅
│   └── .env.example           ✅
├── frontend/
│   ├── src/                   ✅
│   ├── public/                ✅
│   ├── index.html             ✅
│   ├── package.json           ✅
│   └── vite.config.js         ✅
├── *.md files                 ✅
├── *.sh scripts               ✅
├── .gitignore                 ✅
└── setup.sh                   ✅
```

### ❌ Files NOT Transferred (Auto-generated)

```
❌ node_modules/        (will be installed by npm)
❌ dist/                (build output)
❌ .vite/               (cache)
❌ logs/*.log           (old logs)
❌ .env                 (contains credentials - create new)
```

---

## 🔧 Post-Transfer Setup

### Step 1: Run Setup Script

```bash
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Check Node.js version
- ✅ Check Oracle Instant Client
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create `.env` file
- ✅ Make scripts executable
- ✅ Create logs directory

### Step 2: Verify Installation

```bash
# Check if everything is installed
ls -la backend/node_modules/  # Should show packages
ls -la frontend/node_modules/ # Should show packages
```

### Step 3: Start the Project

```bash
./start.sh
```

### Step 4: Test in Browser

Open: http://localhost:3000

---

## 🎯 Platform-Specific Notes

### macOS
```bash
# Install Oracle Instant Client
brew install instantclient-basic

# Run setup
./setup.sh
```

### Linux (Ubuntu/Debian)
```bash
# Install Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Download Oracle Instant Client from Oracle website
# Then run setup
chmod +x setup.sh
./setup.sh
```

### Windows
```powershell
# Use Git Bash or WSL for running shell scripts
# Or manually run:
cd backend
npm install

cd ../frontend
npm install

# Then start manually:
cd backend
npm start

# In another terminal:
cd frontend
npm run dev
```

---

## 📊 Transfer Size

| Method | Size | Notes |
|--------|------|-------|
| **With node_modules** | ~500 MB | Not recommended |
| **Without node_modules** | ~5 MB | ✅ Recommended |
| **Git repository** | ~5 MB | ✅ Best practice |

---

## 🚨 Troubleshooting After Transfer

### Issue: "node: command not found"
**Solution:** Install Node.js v18+ from https://nodejs.org/

### Issue: "Permission denied" on scripts
**Solution:**
```bash
chmod +x setup.sh start.sh stop.sh restart.sh
```

### Issue: "Cannot find module"
**Solution:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Issue: Oracle connection fails
**Solution:**
1. Install Oracle Instant Client
2. Verify database is accessible from new machine
3. Check firewall rules

---

## ✅ Verification Checklist

After transfer, verify:

- [ ] Node.js v18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Oracle Instant Client installed (optional)
- [ ] Setup script ran successfully: `./setup.sh`
- [ ] Backend dependencies installed: `ls backend/node_modules`
- [ ] Frontend dependencies installed: `ls frontend/node_modules`
- [ ] Scripts are executable: `ls -la *.sh`
- [ ] Project starts: `./start.sh`
- [ ] Frontend loads: http://localhost:3000
- [ ] Backend responds: http://localhost:3001/api/health

---

## 📝 Quick Reference

```bash
# Transfer (source machine)
./package-for-transfer.sh
# Or manually: zip -r -q -X OJET_Troubleshooter.zip OJET_Troubleshooter/ -x "*/node_modules/*"

# Setup (destination machine)
unzip OJET_Troubleshooter_*.zip
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh

# Start
./start.sh

# Stop
./stop.sh
```

---

**That's it!** Your OJET Troubleshooter is now fully portable. 🎉

