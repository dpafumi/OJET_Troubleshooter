# OJET Troubleshooter

This is an application for technical diagnosis and validation of Oracle OJET.

## 🎯 Features

### 📄 Multiple Pages
- **OJET Validation**: Technical validation dashboard with 6 automated checks
- **OJET Troubleshooting**: Common problems and solutions guide
- **Show Commands**: OJET command reference with examples
- **Add/Remove Tables**: Step-by-step guides for table management

### 🔍 Technical Validations
- **Oracle Connection**: Sidebar for database credentials
- **6 Validation Categories**:
  - **Dictionary Dumps**: LogMiner dictionary file verification
  - **Table Instantiation**: Validation of tables prepared for CDC
  - **SCN Validation**: SCN consistency for dumps and tables
  - **Open Transactions**: Identification of long-running open transactions
  - **Check Other DB Values**: Critical database parameters and configuration

### 🔧 Automated Corrective Actions
- **Build Dictionary**: Executes `DBMS_LOGMNR_D.BUILD` to create dictionary dumps
- **Prepare Tables**: Executes `DBMS_CAPTURE_ADM.PREPARE_TABLE_INSTANTIATION` to prepare tables
- Confirmation before execution
- Detailed result feedback

### 🛠️ Integrated Troubleshooting
- Documented common problems
- Diagnostic commands
- Step-by-step solutions
- SQL examples with syntax

### 📚 Command Reference
- OJET commands organized by category
- Practical examples
- Sample outputs
- Copy to clipboard function

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite (build tool)
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- Node.js
- Express
- Oracle Database driver (oracledb)
- CORS

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Oracle Instant Client** installed on the system
3. **Oracle Database** with access to system views (v$archived_log, dba_capture_prepared_tables, etc.)

### Oracle Instant Client Installation

**macOS:**
```bash
brew install instantclient-basic
```

**Linux:**
```bash
# Download from Oracle website
# https://www.oracle.com/database/technologies/instant-client/downloads.html
```

## 🚀 Installation

### Quick Setup (Recommended)

```bash
cd OJET_Troubleshooter
chmod +x setup.sh
./setup.sh
```

The setup script will automatically:
- ✅ Check prerequisites (Node.js, npm)
- ✅ Install all dependencies
- ✅ Create configuration files
- ✅ Make scripts executable

### Manual Setup

If you prefer manual installation:

#### 1. Install Backend dependencies
```bash
cd backend
npm install
```

#### 2. Install Frontend dependencies
```bash
cd ../frontend
npm install
```

#### 3. Configure environment variables (Backend)
```bash
cd ../backend
cp .env.example .env
# Edit .env if necessary (default port: 3001)
```

#### 4. Make scripts executable
```bash
cd ..
chmod +x start.sh stop.sh restart.sh
```

## ▶️ Execution

### Quick Start (Recommended)

```bash
./start.sh
```

This will start both backend and frontend servers.

**URLs:**
- **Frontend (Web App)**: http://localhost:3000
- **Backend API**: http://localhost:3001

**To stop:**
```bash
./stop.sh
```

**To restart:**
```bash
./restart.sh
```

### Manual Execution

If you prefer to run servers separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# API server will run on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Web application will run on http://localhost:3000
```

## 📖 Usage

### Navigation
The application has 3 main pages accessible from the top navigation bar:
- **Validation**: Technical validations and diagnostics
- **Troubleshooting**: Common problems and solutions
- **Show Commands**: OJET command reference

### Page: OJET Validation

1. **Connect to Database**:
   - Enter credentials in the left sidebar
   - Host, Port (1521), SID, Username, Password
   - Click on "Connect to Database"

2. **Run Validations**:
   - Each card represents a validation category
   - For "Table Instantiation" and "SCN Validation": enter required parameters
   - Click on "Run Check" to execute the SQL query
   - View results in table format

3. **View SQL Queries**:
   - Click on "Show SQL Query" to see the exact query
   - All queries are based on the official OJET PDF

4. **🔧 Execute Corrective Actions**:
   - After running a validation, if problems are detected
   - Click on the corresponding action button (e.g., "Build Dictionary", "Prepare Tables")
   - Confirm the action in the confirmation dialog
   - View the detailed operation result
   - Re-run the validation to verify the problem is resolved
   - See [CORRECTIVE_ACTIONS_GUIDE.md](./CORRECTIVE_ACTIONS_GUIDE.md) for more details

### Page: OJET Troubleshooting

1. **Explore Common Problems**:
   - Each card shows a known problem
   - Read the problem reason
   - Review diagnostic commands
   - Follow step-by-step solutions

2. **Copy Commands**:
   - SQL commands are formatted and ready to copy
   - Includes practical examples

### Page: Show Commands

1. **Search Commands**:
   - Commands organized by category
   - Each command includes description, example, and expected output

2. **Copy to Clipboard**:
   - Click on the copy icon next to each command
   - Visual confirmation when copied


## 🎨 Project Structure

```
OJET_Troubleshooter/
├── backend/
│   ├── server.js          # Express API with endpoints
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Connection form
│   │   │   ├── Dashboard.jsx    # Card grid
│   │   │   └── CheckCard.jsx    # Individual card
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔐 Security

- Credentials are NOT stored in the frontend
- Connection is established via connection pool in the backend
- Parameter validation before executing queries
- Robust error handling

## 📦 Portability

This project is fully portable and can be easily transferred to another machine.

### Transfer to Another Machine

**Option 1: Use Package Script**
```bash
./package-for-transfer.sh
```

**Option 2: Copy Entire Folder**
```bash
# Copy OJET_Troubleshooter folder to new machine
# Then run:
cd OJET_Troubleshooter
./setup.sh
./start.sh
```

**Option 3: Use Git**
```bash
git clone <your-repo-url>
cd OJET_Troubleshooter
./setup.sh
./start.sh
```

See **PORTABILITY_GUIDE.md** for detailed instructions.

---

## 📝 Important Notes

1. **Oracle user must have permissions to query:**
   - `v$archived_log`
   - `dba_capture_prepared_tables`
   - `v$database`
   - `gv$transaction`
   - `v$parameter`
   - `global_name`

2. **For production environments, consider:**
   - User authentication
   - HTTPS
   - Rate limiting
   - Audit logging

3. **Default Ports:**
   - Frontend: `3000`
   - Backend: `3001`
   - These can be changed in `backend/.env` and `frontend/vite.config.js`

## 🐛 Troubleshooting

**Error: "ORA-12154: TNS:could not resolve the connect identifier"**
- Verify that Oracle Instant Client is installed
- Verify SID/Service Name format

**Error: "Connection pool not initialized"**
- Make sure to connect first using the sidebar
- Verify that the backend is running


## 👥 Author

Diego Pafumi - Striim Senior Field Engineer
