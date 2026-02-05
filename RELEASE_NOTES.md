# Release Notes

## Version 1.3.0 (February 5, 2026)

🎯 **Major Update: OJET Queries Feature with Comprehensive Documentation**

### 🆕 New Features

#### 📊 OJET Queries Page
- **New Dedicated Page**: Execute useful Oracle queries for monitoring OJET processes
- **7 Pre-configured Queries**:
  1. **Check Capture Process Status** - View detailed status from DBA_CAPTURE
  2. **Check Propagation Receiver** - Monitor data transport and propagation
  3. **Check Capture Process Memory Usage** - Monitor memory allocation for capture
  4. **Check Apply Process Memory Usage** - Monitor apply/reader process memory
  5. **Check Streams Pool Memory Usage** - Monitor overall streams pool allocation
  6. **Check Database Memory Parameters** - View Oracle memory configuration
  7. **Check Transactions Being Processed** - View active transactions

#### 📖 Interactive Documentation
- **Expandable Column Descriptions**: Each query includes detailed column explanations
- **Health Metrics Guide**: Built-in troubleshooting tips and health indicators
- **Visual Alerts**: Color-coded warnings and notes for important states
- **SQL Query Display**: View the actual SQL being executed

#### 🎨 Optimized Table Display
- **Space-efficient Columns**: Dynamic column widths based on content
- **Compact Design**: Reduced padding and font sizes for better space utilization
- **Consistent Styling**: Uniform appearance across all query results
- **Tooltips**: Hover over truncated content to see full values

### 🎨 UI/UX Improvements
- **Database Icon**: New icon for OJET Queries in navigation
- **Credential Persistence**: Database credentials saved in browser localStorage
- **Collapsible Sections**: Documentation and SQL queries in expandable accordions
- **Professional Tables**: Clean, modern table design with alternating row colors

### 📚 Documentation Enhancements
- **OJET_QUERIES_GUIDE.md**: Comprehensive guide for all 7 queries
- **DEPLOYMENT_GUIDE.md**: Complete deployment instructions for customers
- **Column Descriptions**: Detailed explanations for every column in each query
- **Troubleshooting Tips**: Built-in guidance for common issues

### 🔧 Technical Improvements
- **7 New API Endpoints**: Backend endpoints for each OJET query
- **Connection Pooling**: Efficient database connection management
- **Error Handling**: Comprehensive error messages and recovery
- **Query Optimization**: Efficient SQL queries for minimal database impact

### 📦 Deployment
- **Deployment Package Script**: Automated package creation for customer delivery
- **Verification Script**: Installation verification tool included
- **Multiple Formats**: Both .tar.gz and .zip packages with checksums

---

## Version 1.2.1 (January 21, 2026)

🎨 **UI/UX Enhancements, Monitor Page Improvements & Simplified Scripts**

### 🆕 New Features

#### 🔍 Monitor Page Enhancements
- **Integrated `mon` Command**: Executes automatically with `show` commands when clicking "Start Monitoring"
- **Filtered Metrics Display**: Shows only 9 critical metrics from `mon` command:
  - Last Event Position
  - Last Event Read Age
  - Latest Activity
  - Memory Usage Apply Session
  - Memory Usage Capture Session
  - Memory Usage LogMiner Session
  - Memory Usage Streams Pool
  - Read Timestamp
  - Timestamp
- **Smart Default Values**: All form fields have intelligent defaults (localhost, admin, OJET_SOURCE)
- **Visual Feedback**: Fields display in gray for default values, black when modified

### 🎨 UI/UX Improvements
- **Better Information Hierarchy**: Documentation links moved to top of Dashboard pages
- **Cleaner Interface**: Removed redundant sections from Monitor page
- **Consistent Form Styling**: Port field uses placeholder instead of pre-filled value
- **Visual Distinction**: Clear difference between default and user-modified values

### 🛠️ Scripts Consolidation
- **Simplified Startup**: `start.sh` now runs in background mode by default
- **Immediate Control**: Returns terminal control after starting services
- **Removed Redundancy**: Eliminated `start-background.sh` (merged into `start.sh`)

### 🐛 Bug Fixes
- Fixed `mon` command showing all fields instead of filtered subset
- Fixed inconsistent form field styling across pages
- Fixed port field appearing in bold instead of as placeholder

---

## Version 1.2.0 (January 20, 2026)

🎉 **Major Update: Validation Downstream, Multi-Database Support & Enhanced Stability**

### 🆕 New Features

#### 🔄 Validation Downstream Dashboard
- **Dual Database Support**: New "Validation Downstream" page with two independent database connections
  - Primary DB connection (for production/source database)
  - Downstream DB connection (for downstream/replica database)
- **8 Validation Checks**: All checks from Validation PROD plus new downstream-specific checks
  - Existing Dictionary Dumps in Primary DB
  - Take Dictionary Dump in Primary DB
  - Table Instantiation in Primary DB
  - SCN Validation in Downstream DB
  - Open Transactions in Primary DB
  - Check Other DB Values in Primary DB
  - Check Other DB Values in Downstream DB
- **Smart Connection Routing**: Each check automatically uses the correct database connection
- **Persistent Credentials**: Database credentials persist when navigating between pages

#### 🗄️ Multi-Database Connection Pool System
- **Independent Connection Pools**: Backend maintains separate connection pools for each database
- **Connection Pool Map**: Efficient management of multiple simultaneous database connections
- **Automatic Pool Reuse**: Reuses existing pools for the same database configuration
- **Memory Efficient**: Pools are properly closed when no longer needed

#### 🔒 Enhanced Security & Stability
- **Graceful Shutdown**: Automatic cleanup of all database connections on application exit
  - Handles SIGTERM, SIGINT (Ctrl+C), SIGHUP signals
  - Closes all Oracle connection pools properly
  - Prevents orphaned database connections
- **Browser Close Detection**: Automatically closes connections when browser/tab is closed
  - Uses `navigator.sendBeacon` for reliable cleanup
  - Fallback to axios for older browsers
- **Password Autocomplete Prevention**: Added `autoComplete="new-password"` to all password fields
  - Prevents Chrome "Check your saved password" popup
  - Improves user experience when navigating between pages

#### 🌐 Improved Striim Integration
- **URL Cleanup**: Automatically removes trailing slashes from Striim URLs
- **Enhanced Error Messages**: Detailed error diagnostics for connection issues
  - Network connectivity errors (ECONNREFUSED, ETIMEDOUT, ENOTFOUND)
  - Authentication errors with specific guidance
  - Server reachability checks before authentication
- **Detailed Logging**: Comprehensive request/response logging for troubleshooting

### 🔧 Improvements

#### User Interface
- **3-Row Grid Layout**: Validation Downstream checks organized in 3 rows for better visibility
- **Color-Coded Cards**: Different colors for Primary DB (blue) and Downstream DB (purple) checks
- **Enhanced Warning Messages**: SCN validation warnings now more prominent with ⚠️ emoji
- **Responsive Design**: Maintains 3-column grid layout with proper breakpoints

#### Backend Enhancements
- **Connection String Keying**: Connection pools keyed by unique connection string
- **Error Handling**: Improved error messages with actionable suggestions
- **Health Check Endpoint**: `/api/health` for monitoring backend status
- **Cleanup Endpoint**: `/api/cleanup` for graceful connection cleanup

#### Code Quality
- **Modular Architecture**: Separate components for each dashboard
- **State Management**: Lifted state to App.jsx for persistence
- **Props Drilling**: Clean prop passing through component hierarchy
- **Error Boundaries**: Robust error handling throughout the application

### 🐛 Bug Fixes
- **Fixed**: Striim URL with trailing slash causing 404 errors
- **Fixed**: Database credentials lost when navigating between pages
- **Fixed**: Chrome password manager popup appearing on navigation
- **Fixed**: Connection pools not being closed on application exit
- **Fixed**: Single global pool causing all checks to use last connected database

### 📚 Documentation Updates
- Updated README.md with new Validation Downstream features
- Updated MONITOR_GUIDE.md with enhanced error handling information
- Added detailed inline code comments for complex logic
- Improved troubleshooting sections

### 🔄 Migration Notes
- **No Breaking Changes**: Existing Validation PROD functionality unchanged
- **New Page**: Access "Validation Downstream" from navigation menu
- **Backward Compatible**: All existing features work as before
- **Database Permissions**: Same permissions required as v1.1.0

---

## Version 1.1.0 (January 19, 2026)

🎉 **Major Update: Real-Time Monitoring & Enhanced Documentation**

### 🆕 New Features

#### 📊 Real-Time OJET Monitoring
- **Striim REST API Integration**: Monitor OJET sources remotely via Striim REST API
- **4 Automated Commands**: Status, Status Details, Memory, and Memory Details
- **ASCII Table Output**: Clean, formatted tables with intelligent text wrapping (30 char max width)
- **Persistent Configuration**: Form values saved in localStorage for convenience
- **Authentication**: Secure token-based authentication with Striim server

#### 📖 Enhanced Command Reference
- **Detailed Field Explanations**: Comprehensive explanations for all Status and Memory fields
- **State Examples**: Detailed examples for PROPAGATION_STATE and CaptureState
- **Formatted Documentation**: Indented, easy-to-read format with proper line breaks
- **12+ Field Descriptions**: Including LOG_MINER, CAPTURE, APPLY, STREAMS, and more

### 🔧 Improvements
- **Text Wrapping Algorithm**: Smart wrapping at word boundaries, `$`, and `_` characters
- **Table Formatting**: Optimized column width for better readability
- **Documentation Updates**: All MD files updated with new features
- **New Documentation**: Added MONITOR_GUIDE.md and DOCUMENTATION_INDEX.md

---

## Version 1.0.0 (January 19, 2026)

🎉 **First stable release of OJET Troubleshooter**

### 🎯 Overview

OJET Troubleshooter is a professional web application for diagnosing and validating Oracle OJET (Oracle Job for Extracting Transactions). This tool provides automated checks, corrective actions, and comprehensive troubleshooting guides for Oracle database administrators and engineers.

---

### ✨ Features

#### 🔍 Automated Validations (6 Categories)
- **Dictionary Dumps**: LogMiner dictionary file verification
- **Table Instantiation**: Validation of tables prepared for CDC
- **SCN Validation**: SCN consistency for dumps and tables
- **Open Transactions**: Identification of long-running open transactions
- **Database Parameters**: Critical database configuration checks
- **Connection Testing**: Oracle database connectivity validation

#### 🔧 Automated Corrective Actions
- **Build Dictionary**: One-click execution of `DBMS_LOGMNR_D.BUILD`
- **Prepare Tables**: One-click execution of `DBMS_CAPTURE_ADM.PREPARE_TABLE_INSTANTIATION`
- Confirmation dialogs before execution
- Detailed result feedback and error handling

#### 📚 Comprehensive Documentation
- **Troubleshooting Guide**: Common problems with step-by-step solutions
- **Command Reference**: OJET commands with examples, field explanations, and copy-to-clipboard
- **Table Management**: Guides for adding/removing tables
- **Monitor Guide**: Real-time monitoring via Striim REST API
- **Remote Access**: GCP, AWS, and VPS deployment instructions

#### 🌐 Remote Access Support
- Configured for external connections (binds to 0.0.0.0)
- GCP firewall configuration examples
- AWS security group setup instructions
- SSH tunneling and reverse proxy guidance

---

### 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite (build tool)
- Axios (HTTP client)
- Lucide React (icons)

**Backend:**
- Node.js
- Express
- Oracle Database driver (oracledb)

---

### 📦 Installation

#### Quick Start
```bash
# Extract the package
unzip OJET_Troubleshooter_v1.0.0.zip

# Navigate to directory
cd OJET_Troubleshooter

# Run setup
chmod +x setup.sh
./setup.sh

# Start the application
./start.sh
```

#### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

For remote access: http://<SERVER_IP>:3000

---

### 📋 Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Oracle Database**: Access to Oracle database with appropriate permissions
- **Operating System**: Linux, macOS, or Windows (with WSL)

---

### 🔒 Security Notes

- The package does NOT include `node_modules` (installed via setup.sh)
- No `.env` files included (create from `.env.example`)
- No sensitive data or credentials in the package
- Recommended to use SSH tunneling or reverse proxy for production

---

### 📚 Documentation

Included documentation files:
- **README.md** - Project overview and features
- **GETTING_STARTED.md** - Complete setup and usage guide
- **DOCUMENTATION_INDEX.md** - Documentation navigation guide (NEW!)
- **MONITOR_GUIDE.md** - Real-time monitoring guide (NEW!)
- **PORTABILITY_GUIDE.md** - Transfer between machines
- **REMOTE_ACCESS.md** - GCP/AWS/VPS deployment
- **RESTART_GUIDE.md** - Restart and troubleshooting

---

### 🐛 Known Issues

None reported in this release.

---

### 🙏 Credits

**Author**: Diego Pafumi - Striim Senior Field Engineer

---

### 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub:
https://github.com/dpafumi/OJET_Troubleshooter/issues

---

### 📄 License

This project is provided as-is for Oracle OJET troubleshooting and diagnosis.

