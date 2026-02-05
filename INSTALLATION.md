# OJET Troubleshooter v1.2.0 - Installation Guide

**Release Date**: January 20, 2026  
**Version**: 1.2.0  
**Package**: OJET_Troubleshooter_v1.2.0.zip

---

## 🎉 What's New in v1.2.0

### Major Features
- ✨ **Validation Downstream Dashboard** - Dual database support for downstream scenarios
- ✨ **Multi-Database Connection Pools** - Independent connections for multiple databases
- ✨ **Graceful Shutdown** - Automatic cleanup of all connections on exit
- ✨ **Enhanced Striim Integration** - Better error handling and diagnostics
- ✨ **Persistent Credentials** - Database credentials saved across page navigation
- ✨ **Password Autocomplete Prevention** - No more Chrome password popups

See **RELEASE_NOTES.md** for complete details.

---

## 📋 Prerequisites

Before installing, ensure you have:

1. **Node.js** (v14 or higher)
   ```bash
   node --version  # Should show v14.x.x or higher
   ```

2. **npm** (v6 or higher)
   ```bash
   npm --version   # Should show v6.x.x or higher
   ```

3. **Oracle Instant Client** (for database connectivity)
   - macOS: `brew install instantclient-basic`
   - Linux: Download from [Oracle website](https://www.oracle.com/database/technologies/instant-client/downloads.html)

4. **Oracle Database Access**
   - User with permissions to query system views
   - Network access to Oracle database

---

## 🚀 Quick Installation (Recommended)

### Step 1: Extract the Package
```bash
unzip OJET_Troubleshooter_v1.2.0.zip
cd OJET_Troubleshooter
```

### Step 2: Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will automatically:
- ✅ Check prerequisites (Node.js, npm)
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create configuration files
- ✅ Make scripts executable

### Step 3: Start the Application
```bash
./start.sh
```

**Note:** The application starts in background mode and returns terminal control immediately.

**To view logs:**
```bash
tail -f logs/backend.log   # Backend logs
tail -f logs/frontend.log  # Frontend logs
```

### Step 4: Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## 📖 Using the Application

### Navigation
The application has 7 main pages:

1. **Validation PROD** - Single database validation (6 checks)
2. **Validation Downstream** - Dual database validation (8 checks)
3. **Troubleshooting** - Common problems and solutions
4. **Show Commands** - OJET command reference
5. **Add/Remove Tables** - Table management guides
6. **Monitor** - Real-time Striim monitoring
7. **Ojet Queries** - Execute useful Oracle queries for OJET monitoring ⭐ NEW

### Validation PROD (Single Database)
1. Enter database credentials in the sidebar
2. Click "Connect to Database"
3. Run validation checks
4. Execute corrective actions if needed

### Validation Downstream (Dual Database) ⭐ NEW
1. **Connect to Primary DB**:
   - Enter credentials in first form
   - Click "Connect to Primary DB"
2. **Connect to Downstream DB**:
   - Enter credentials in second form
   - Click "Connect to Downstream DB"
3. **Run Checks**:
   - Blue cards use Primary DB
   - Purple cards use Downstream DB
   - Credentials persist when navigating away

### Monitor (Striim Integration)
1. Enter Striim URL (e.g., `http://10.142.0.46:9080`)
2. Enter username and password
3. Enter namespace and source name
4. Click "Monitor Source"
5. View results in ASCII tables

### Ojet Queries ⭐ NEW
1. Enter Oracle database credentials in the sidebar
2. Click "Connect to Database"
3. Browse available queries:
   - **Capture Process Status** - View detailed status of OJET capture processes
   - **Propagation Receiver** - Monitor data transport and propagation status
   - **Capture Process Memory** - Monitor memory allocation for capture processes
   - **Apply Process Memory** - Monitor memory usage for apply/reader processes
   - **Streams Pool Memory** - Monitor overall streams pool allocation
   - **Database Memory Parameters** - View key Oracle memory configuration
   - **Transactions Processing** - View transactions being processed
4. Click "Execute Query" on any query card
5. View results in formatted tables
6. Expand "View SQL Query" to see the actual SQL being executed

---

## 🛑 Stopping the Application

```bash
./stop.sh
```

This will gracefully shutdown both frontend and backend servers and close all database connections.

---

## 🔄 Restarting the Application

```bash
./restart.sh
```

---

## 🐛 Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:

**Backend (port 3001)**:
```bash
cd backend
nano .env
# Change PORT=3001 to another port
```

**Frontend (port 3000)**:
```bash
cd frontend
nano vite.config.js
# Change port in server.port configuration
```

### Oracle Connection Issues
**Error**: "ORA-12154: TNS:could not resolve the connect identifier"
- Verify Oracle Instant Client is installed
- Check SID/Service Name format

**Error**: "Connection pool not initialized"
- Make sure to connect first using the sidebar
- Verify backend is running

### Striim Connection Issues
**Error**: "Authentication endpoint not found"
- Remove trailing slash from URL
- Verify Striim is running and accessible
- Check Striim version (v5.2.0.4E confirmed working)

See **RESTART_GUIDE.md** for more troubleshooting tips.

---

## 📚 Documentation

Complete documentation is included:

- **README.md** - Project overview and features
- **RELEASE_NOTES.md** - Version history and changes
- **CHANGELOG.md** - Detailed change log
- **GETTING_STARTED.md** - Quick start guide
- **MONITOR_GUIDE.md** - Striim monitoring guide
- **PORTABILITY_GUIDE.md** - Transfer between machines
- **REMOTE_ACCESS.md** - GCP/AWS/VPS deployment
- **RESTART_GUIDE.md** - Restart and troubleshooting
- **DOCUMENTATION_INDEX.md** - Documentation navigation

---

## 🔐 Security Notes

- Database credentials are NOT stored in the frontend (except Monitor page uses localStorage)
- All connections use secure connection pools
- Automatic cleanup of connections on exit
- Password fields prevent browser autocomplete

---

## 📞 Support

For issues, questions, or feature requests:
- Check the documentation files
- Review TROUBLESHOOTING section in README.md
- Contact: Diego Pafumi - Striim Senior Field Engineer

---

## ✅ Installation Complete!

You're ready to start troubleshooting OJET! 🚀

**Next Steps**:
1. Open http://localhost:3000 in your browser
2. Navigate to "Validation PROD" or "Validation Downstream"
3. Connect to your Oracle database
4. Start running validation checks

Enjoy using OJET Troubleshooter v1.2.0! 🎉

