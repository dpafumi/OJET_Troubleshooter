# 📊 OJET Monitor Guide

This guide explains how to use the Monitor feature to monitor OJET sources in real-time via Striim REST API.

---

## 🎯 Overview

The Monitor feature allows you to:
- Connect to a Striim server via REST API
- Execute OJET monitoring commands remotely
- View formatted results in ASCII tables
- Save configuration for quick access

---

## 🚀 Quick Start

### 1. Navigate to Monitor Page
- Open the OJET Troubleshooter application
- Click on **"Monitor"** in the navigation bar

### 2. Configure Striim Connection
Fill in the Striim connection details:
- **Striim URL**: The URL of your Striim server (e.g., `http://10.142.0.20:9080`)
- **Username**: Your Striim username (e.g., `admin`)
- **Password**: Your Striim password

### 3. Configure Source
Fill in the OJET source details:
- **Namespace**: The namespace where your OJET source is located (e.g., `admin`)
- **OJET Source Name**: The name of your OJET source (e.g., `Get_qatest_CLIENT_FORMAL`)

### 4. Monitor
- Click **"Monitor Source"** button
- Wait for the results to load
- View the 4 monitoring results in formatted tables

---

## 📋 Monitoring Commands

The Monitor feature executes 4 commands automatically:

### 1. Show Status
**Command**: `show <namespace>.<sourceName> status;`

**Purpose**: Display general status information about the OJET source

**Output Fields**:
- ServerStatus
- Enqueue
- Dequeue
- CaptureStatus
- CaptureState
- SpillCount
- Progress
- Error

### 2. Show Status Details
**Command**: `show <namespace>.<sourceName> status details;`

**Purpose**: Display detailed status including SCN values and metrics

**Output Fields**:
- FIRST_SCN
- START_SCN
- APPLIED_SCN
- CAPTURED_SCN
- OLDEST_SCN
- FILTERED_SCN
- MESSAGES_CAPTURED
- MESSAGES_ENQUEUED
- CAPTURE_TIME
- RULE_TIME
- ENQUEUE_TIME
- LCR_TIME
- REDO_WAIT_TIME
- REDO_MINED
- RESTART_SCN

### 3. Show Memory
**Command**: `show <namespace>.<sourceName> memory;`

**Purpose**: Display memory usage summary

**Output Fields**:
- LogMinerSession
- CaptureSession
- ApplySession
- StreamsPool

### 4. Show Memory Details
**Command**: `show <namespace>.<sourceName> memory details;`

**Purpose**: Display detailed memory breakdown

**Output Fields**:
- LOG_MINER_USED
- LOG_MINER_MAX
- CAPTURE_USED
- CAPTURE_ALLOCATED
- APPLY_USED
- APPLY_ALLOCATED
- STREAMS_USED
- STREAMS_ALLOCATED
- MSGS_IN_MEM
- MSGS_SPILLED
- TXNS_ROLLBACK
- PROPAGATION_STATE

---

## 🔧 Features

### Persistent Configuration
All form values are automatically saved in your browser's localStorage:
- Striim URL
- Username
- Password
- Namespace
- Source Name

**Benefits**:
- No need to re-enter values when navigating between pages
- Values persist even after closing the browser
- Quick access for repeated monitoring

### ASCII Table Formatting
Results are displayed in clean ASCII tables with:
- Box-drawing characters for borders
- Text wrapping at 30 characters max width
- Proper alignment of all rows
- Easy-to-read format

### Example Output
```
╒════════════════════════════════╤════════════════════════════════╕
│ ServerStatus                   │ CaptureState                   │
├────────────────────────────────┼────────────────────────────────┤
│ STRIIM$OJET$ADMIN$GET_QATEST_  │ STRIIM$C$ADMIN$GET_QATEST_     │
│ CLIENT_FORMAL is atached       │ CLIENT_FORMAL is waiting for   │
│                                │ more transactions              │
└────────────────────────────────┴────────────────────────────────┘
```

---

## 🔐 Security Notes

1. **Password Storage**: Passwords are stored in localStorage (browser-side only)
2. **HTTPS Recommended**: Use HTTPS for Striim URL in production
3. **Authentication**: Uses Striim's standard authentication mechanism
4. **Token-Based**: API calls use STRIIM-TOKEN authorization header

---

## 🐛 Troubleshooting

### Cannot Connect to Striim
**Error**: "Failed to authenticate with Striim"

**Solutions**:
- Verify Striim URL is correct and accessible
- **Remove trailing slash** from URL (e.g., use `http://10.142.0.46:9080` not `http://10.142.0.46:9080/`)
  - The application now automatically removes trailing slashes
- Check username and password
- Ensure Striim server is running
- Check network connectivity

### Network Errors

**Error**: "ECONNREFUSED - Connection refused"
- **Cause**: Striim server is not running or not accessible on the specified port
- **Solution**: Verify Striim is running and the port is correct (default: 9080)

**Error**: "ETIMEDOUT - Connection timed out"
- **Cause**: Network timeout, firewall blocking, or server not responding
- **Solution**: Check firewall rules, network connectivity, and server status

**Error**: "ENOTFOUND - Host not found"
- **Cause**: Invalid hostname or DNS resolution failure
- **Solution**: Verify the hostname/IP address is correct and accessible

**Error**: "Authentication endpoint not found"
- **Cause**: Striim server is running but REST API is not available
- **Solution**:
  - Verify Striim version supports REST API (v5.2.0.4E confirmed working)
  - Check if Striim is fully started (not just the process, but the web interface)
  - Try accessing the Striim URL in a browser to confirm it's accessible

### Source Not Found
**Error**: "Source not found" or empty results

**Solutions**:
- Verify namespace is correct
- Verify OJET source name is correct (case-sensitive)
- Check that the source exists in Striim

### CORS Errors
**Error**: "CORS policy blocked"

**Solutions**:
- Backend proxy handles CORS automatically
- Ensure backend server is running on port 3001
- Check Vite proxy configuration in `frontend/vite.config.js`

---

## 📖 Related Documentation

- **Show Commands Guide**: See detailed field explanations in the "Show Commands" page
- **README.md**: Complete project documentation
- **Installation.md**: Installation guide

---

## 💡 Tips

1. **Save Time**: Configuration is saved automatically - no need to re-enter
2. **Multiple Sources**: Change source name to monitor different sources
3. **Refresh Data**: Click "Monitor Source" again to refresh the data
4. **Field Explanations**: See "Show Commands" page for detailed field descriptions

---

**Ready to monitor?** Fill in the form and click "Monitor Source"! 🚀

