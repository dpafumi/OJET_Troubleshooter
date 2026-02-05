# 🚀 OJET Troubleshooter - Deployment Guide

This guide explains how to deploy the OJET Troubleshooter application to customer environments.

---

## 📦 Package Contents

The deployment package includes:

```
OJET_Troubleshooter/
├── backend/                 # Node.js backend server
├── frontend/               # React frontend application
├── logs/                   # Application logs directory
├── start.sh               # Start script
├── stop.sh                # Stop script
├── restart.sh             # Restart script
├── README.md              # Main documentation
├── INSTALLATION.md        # Installation instructions
├── DEPLOYMENT_GUIDE.md    # This file
├── OJET_QUERIES_GUIDE.md  # Ojet Queries documentation
├── MONITOR_GUIDE.md       # Monitor feature documentation
└── RELEASE_NOTES.md       # Version history
```

---

## 🎯 Prerequisites

### System Requirements
- **Operating System**: Linux, macOS, or Windows with WSL
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Memory**: Minimum 2GB RAM
- **Disk Space**: Minimum 500MB free space

### Network Requirements
- Access to Oracle databases (ports typically 1521, 1522)
- Access to Striim servers (port 9080 or custom)
- Outbound internet access for npm package installation (during setup only)

### Database Requirements
- Oracle Database 11g or higher
- User with SELECT privileges on:
  - `V$XSTREAM_CAPTURE`
  - `GV$PROPAGATION_RECEIVER`
  - `V$STREAMS_POOL_STATISTICS`
  - `V$PARAMETER`
  - `V$XSTREAM_TRANSACTION`
  - `GV$XSTREAM_APPLY_READER`
  - `DBA_CAPTURE`

---

## 📥 Installation Steps

### 1. Download and Extract Package

```bash
# Download the package (replace with actual download location)
wget https://github.com/dpafumi/OJET_Troubleshooter/archive/refs/tags/v1.3.0.tar.gz

# Extract
tar -xzf v1.3.0.tar.gz
cd OJET_Troubleshooter-1.3.0
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment (Optional)

Create a `.env` file in the `backend` directory if you need custom configuration:

```bash
# backend/.env
PORT=3001
NODE_ENV=production
```

### 4. Make Scripts Executable

```bash
chmod +x start.sh stop.sh restart.sh
```

---

## 🚀 Starting the Application

### Standard Start
```bash
./start.sh
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Background Start (Production)
```bash
nohup ./start.sh > /dev/null 2>&1 &
```

---

## 🛑 Stopping the Application

```bash
./stop.sh
```

---

## 🔄 Restarting the Application

```bash
./restart.sh
```

---

## 🔧 Configuration

### Changing Ports

**Frontend Port** (default: 3000):
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3000,  // Change this
  ...
}
```

**Backend Port** (default: 3001):
Edit `backend/.env` or set environment variable:
```bash
export PORT=3001
```

### Firewall Configuration

If deploying on a server, ensure these ports are open:
```bash
# Frontend
sudo firewall-cmd --permanent --add-port=3000/tcp

# Backend
sudo firewall-cmd --permanent --add-port=3001/tcp

# Reload firewall
sudo firewall-cmd --reload
```

---

## 🔒 Security Considerations

### 1. Database Credentials
- Credentials are stored in browser localStorage (client-side only)
- Never stored on the server
- Cleared when browser cache is cleared

### 2. Network Security
- Use HTTPS in production (requires reverse proxy like nginx)
- Restrict access to trusted networks
- Use VPN for remote access

### 3. Oracle Database Access
- Use read-only database users
- Grant only necessary SELECT privileges
- Use strong passwords

---

## 📊 Monitoring and Logs

### View Logs
```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log
```

### Check Process Status
```bash
# Check if processes are running
ps aux | grep node

# Check ports
netstat -tulpn | grep -E '3000|3001'
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Dependencies Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Application Won't Start
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check logs for errors
cat logs/backend.log
cat logs/frontend.log
```

---

## 🔄 Updating to New Version

```bash
# Stop current version
./stop.sh

# Backup current installation
cd ..
cp -r OJET_Troubleshooter OJET_Troubleshooter.backup

# Download and extract new version
wget https://github.com/dpafumi/OJET_Troubleshooter/archive/refs/tags/vX.X.X.tar.gz
tar -xzf vX.X.X.tar.gz
cd OJET_Troubleshooter-X.X.X

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start new version
./start.sh
```

---

## 📞 Support

For issues or questions:
- **GitHub Issues**: https://github.com/dpafumi/OJET_Troubleshooter/issues
- **Documentation**: See README.md and INSTALLATION.md

---

## 📝 Version Information

- **Current Version**: 1.3.0
- **Release Date**: 2026-02-05
- **Node.js Required**: 18.x or higher
- **Supported Platforms**: Linux, macOS, Windows (WSL)

