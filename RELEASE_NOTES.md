# Release Notes

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
- **Command Reference**: OJET commands with examples and copy-to-clipboard
- **Table Management**: Guides for adding/removing tables
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

