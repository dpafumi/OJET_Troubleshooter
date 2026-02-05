# 📊 OJET Queries Guide

This guide explains how to use the new **Ojet Queries** feature to execute useful Oracle queries for monitoring OJET capture and apply processes.

---

## 🎯 Overview

The Ojet Queries feature allows you to:
- Connect to an Oracle database directly
- Execute pre-configured monitoring queries for OJET processes
- View formatted results in tables
- Monitor memory usage, capture status, and propagation health
- Troubleshoot OJET performance issues

---

## 🚀 Quick Start

### 1. Navigate to Ojet Queries Page
- Open the OJET Troubleshooter application
- Click on **"Ojet Queries"** in the navigation bar

### 2. Configure Database Connection
Fill in the Oracle database connection details in the sidebar:
- **Host**: The hostname or IP address of your Oracle database
- **Port**: The Oracle listener port (default: 1521)
- **SID / Service Name**: Your Oracle database SID or service name
- **Username**: Database username with appropriate privileges
- **Password**: Database password

### 3. Connect to Database
- Click **"Connect to Database"**
- Wait for the connection confirmation message
- The credentials are saved in your browser for convenience

### 4. Execute Queries
- Browse the available query cards
- Click **"View SQL Query"** to see the actual SQL being executed
- Click **"Execute Query"** to run the query
- View results in the formatted table below each query

---

## 📋 Available Queries

### 1. Check Capture Process Status
**Purpose**: View detailed status of OJET capture processes including SCN positions and configuration

**Key Metrics**:
- CAPTURE_NAME - Name of the capture process
- QUEUE_OWNER - Owner of the queue
- CAPTURE_USER - User running the capture
- START_SCN - SCN from which capture starts
- CAPTURED_SCN - SCN of last redo log record scanned
- APPLIED_SCN - All changes below this SCN have been captured
- FIRST_SCN - Lowest SCN to which capture can be repositioned
- REQUIRED_CHECKPOINT_SCN - Oldest SCN for which redo/archive logs are needed
- STATUS - Current administrative state (ENABLED, DISABLED, ABORTED)
- ERROR_MESSAGE - Any error messages

**Use Case**: Monitor overall health, progress, and configuration of capture processes

---

### 2. Check Propagation Receiver
**Purpose**: Monitor data transport and propagation status

**Key Metrics**:
- TOTAL_MSGS - Total messages received
- HIGHEST_MESS_SCN_RECEIVED - Highest SCN received
- HIGHEST_MESS_ACKNOWLEDGE_TO_SENDER - Highest SCN acknowledged
- STATE - Current propagation state

**Use Case**: Identify bottlenecks in data propagation and check for lag

---

### 3. Check Capture Process Memory Usage
**Purpose**: Monitor memory allocation and utilization for capture processes

**Key Metrics**:
- USED_MB - Memory currently in use (MB)
- ALLOCATED_MB - Total memory allocated (MB)
- MEM_UTIL_PCT - Memory utilization percentage
- LAG_SEC - Latency in seconds

**Use Case**: Identify memory pressure and potential spilling to disk

---

### 4. Check Apply Process Memory Usage
**Purpose**: Monitor memory usage for apply/reader processes

**Key Metrics**:
- APPLY_NAME - Name of the apply process
- MSGS_TO_STRIIM - Messages sent to Striim
- USED_MB / ALLOC_MB - Memory usage
- MEM_UTIL_PCT - Memory utilization percentage

**Use Case**: Monitor apply process health and memory consumption

---

### 5. Check Streams Pool Memory Usage
**Purpose**: Monitor overall streams pool allocation and usage

**Key Metrics**:
- STREAM_POOL_TOTAL_MB - Total streams pool size
- STREAM_POOL_FREE_MB - Free memory in streams pool
- STREAM_POOL_USAGE_PCT - Usage percentage

**Use Case**: Determine if streams_pool_size needs to be increased

**Action**: If usage is > 90%, consider increasing streams_pool_size

---

### 6. Check Database Memory Parameters
**Purpose**: View key Oracle memory configuration parameters

**Parameters Shown**:
- sga_target, sga_max_size
- shared_pool_size, large_pool_size
- streams_pool_size
- memory_max_target, memory_target
- db_cache_size

**Use Case**: Review current memory configuration and plan adjustments

---

### 7. Check Transactions Being Processed
**Purpose**: View transactions currently being processed by Capture/Apply processes

**Key Metrics**:
- COMPONENT_NAME - Name of the component
- TRAN_ID - Transaction ID
- CUMULATIVE_MESSAGE_COUNT - Messages in transaction
- FIRST_MESSAGE_POSITION - Starting position

**Use Case**: Identify long-running transactions that may cause lag

---

## 🔍 Interpreting Results

### Memory Utilization
- **< 70%**: Healthy
- **70-90%**: Monitor closely
- **> 90%**: Consider increasing memory allocation

### Capture States
- **CAPTURING CHANGES**: Normal operation
- **WAITING FOR REDO**: Idle, waiting for new changes
- **PAUSED FOR FLOW CONTROL**: Memory pressure or slow consumer
- **WAITING FOR TRANSACTION**: Waiting for LogMiner

### Propagation States
- **WAITING FOR MESSAGE FROM PROPAGATION SENDER**: Normal, catching up
- **RECEIVING LCRS**: Actively receiving data
- **WAITING FOR MEMORY**: Memory pressure - increase streams_pool_size

---

## 💡 Best Practices

1. **Regular Monitoring**: Execute these queries regularly to establish baselines
2. **Compare Metrics**: Compare CAPTURED_SCN vs APPLIED_SCN to measure lag
3. **Memory Tuning**: Use memory queries to proactively adjust Oracle parameters
4. **Transaction Analysis**: Monitor long-running transactions that may impact performance

---

## 🔒 Security Notes

1. **Credentials**: Stored in browser localStorage (client-side only)
2. **Permissions**: User must have SELECT privileges on V$ and DBA_ views
3. **Network**: Ensure network connectivity to Oracle database

---

## 🐛 Troubleshooting

### Cannot Connect to Database
**Error**: "Connection failed"

**Solutions**:
- Verify host, port, and SID are correct
- Check network connectivity to database
- Ensure user has appropriate privileges
- Verify Oracle listener is running

### Query Returns No Results
**Possible Causes**:
- No OJET processes are running
- User lacks privileges on system views
- Database is not configured for OJET/Streams

### ORA-00942: table or view does not exist
**Solution**: User needs SELECT privileges on V$ and DBA_ views

---

## 📚 Related Documentation

- [Confluence: Ojet Show Commands and Queries](https://webaction.atlassian.net/wiki/spaces/CSE/pages/2937978994/Ojet+Show+Commands+and+Queries)
- [Monitor Guide](MONITOR_GUIDE.md) - For Striim-based monitoring
- [Installation Guide](INSTALLATION.md) - Setup instructions

