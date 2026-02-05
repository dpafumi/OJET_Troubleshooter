#!/bin/bash

# OJET Troubleshooter - Deployment Package Creator
# This script creates a clean deployment package for customers

VERSION="1.3.0"
PACKAGE_NAME="OJET_Troubleshooter-v${VERSION}"
BUILD_DIR="build"

echo "🚀 Creating OJET Troubleshooter Deployment Package v${VERSION}"
echo "============================================================"

# Create build directory
echo "📁 Creating build directory..."
rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}/${PACKAGE_NAME}

# Copy application files
echo "📋 Copying application files..."
cp -r backend ${BUILD_DIR}/${PACKAGE_NAME}/
cp -r frontend ${BUILD_DIR}/${PACKAGE_NAME}/

# Copy scripts
echo "📜 Copying scripts..."
cp start.sh ${BUILD_DIR}/${PACKAGE_NAME}/
cp stop.sh ${BUILD_DIR}/${PACKAGE_NAME}/
cp restart.sh ${BUILD_DIR}/${PACKAGE_NAME}/

# Copy documentation
echo "📚 Copying documentation..."
cp README.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp INSTALLATION.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp DEPLOYMENT_GUIDE.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp OJET_QUERIES_GUIDE.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp MONITOR_GUIDE.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp RELEASE_NOTES.md ${BUILD_DIR}/${PACKAGE_NAME}/
cp LICENSE ${BUILD_DIR}/${PACKAGE_NAME}/ 2>/dev/null || echo "No LICENSE file found"

# Create logs directory
echo "📊 Creating logs directory..."
mkdir -p ${BUILD_DIR}/${PACKAGE_NAME}/logs
touch ${BUILD_DIR}/${PACKAGE_NAME}/logs/.gitkeep

# Clean up development files
echo "🧹 Cleaning up development files..."
rm -rf ${BUILD_DIR}/${PACKAGE_NAME}/backend/node_modules
rm -rf ${BUILD_DIR}/${PACKAGE_NAME}/frontend/node_modules
rm -rf ${BUILD_DIR}/${PACKAGE_NAME}/frontend/dist
rm -rf ${BUILD_DIR}/${PACKAGE_NAME}/backend/.env
rm -rf ${BUILD_DIR}/${PACKAGE_NAME}/frontend/.env

# Create .gitignore for the package
echo "📝 Creating .gitignore..."
cat > ${BUILD_DIR}/${PACKAGE_NAME}/.gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build outputs
frontend/dist/

# Logs
logs/*.log
*.log

# Environment files
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Process IDs
*.pid
EOF

# Create installation verification script
echo "✅ Creating verification script..."
cat > ${BUILD_DIR}/${PACKAGE_NAME}/verify-installation.sh << 'EOF'
#!/bin/bash

echo "🔍 Verifying OJET Troubleshooter Installation"
echo "=============================================="

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Found: $NODE_VERSION"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "⚠️  Warning: Node.js 18.x or higher is recommended"
    fi
else
    echo "❌ Not found - Please install Node.js 18.x or higher"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ Found: v$NPM_VERSION"
else
    echo "❌ Not found - Please install npm"
    exit 1
fi

# Check directory structure
echo -n "Checking directory structure... "
if [ -d "backend" ] && [ -d "frontend" ]; then
    echo "✅ OK"
else
    echo "❌ Missing backend or frontend directory"
    exit 1
fi

# Check scripts
echo -n "Checking scripts... "
if [ -f "start.sh" ] && [ -f "stop.sh" ] && [ -f "restart.sh" ]; then
    echo "✅ OK"
else
    echo "❌ Missing required scripts"
    exit 1
fi

# Check if dependencies are installed
echo -n "Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo "✅ Installed"
else
    echo "⚠️  Not installed - Run: cd backend && npm install"
fi

echo -n "Checking frontend dependencies... "
if [ -d "frontend/node_modules" ]; then
    echo "✅ Installed"
else
    echo "⚠️  Not installed - Run: cd frontend && npm install"
fi

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies if not already installed:"
echo "   cd backend && npm install && cd .."
echo "   cd frontend && npm install && cd .."
echo "2. Start the application:"
echo "   ./start.sh"
echo "3. Access the application at http://localhost:3000"
EOF

chmod +x ${BUILD_DIR}/${PACKAGE_NAME}/verify-installation.sh

# Create README for the package
echo "📄 Creating package README..."
cat > ${BUILD_DIR}/${PACKAGE_NAME}/PACKAGE_README.txt << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           OJET Troubleshooter - Deployment Package           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Thank you for downloading OJET Troubleshooter!

QUICK START:
============

1. Verify your system meets the requirements:
   ./verify-installation.sh

2. Install dependencies:
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..

3. Start the application:
   ./start.sh

4. Open your browser:
   http://localhost:3000

DOCUMENTATION:
==============

- README.md              - Overview and features
- INSTALLATION.md        - Detailed installation guide
- DEPLOYMENT_GUIDE.md    - Deployment instructions
- OJET_QUERIES_GUIDE.md  - Ojet Queries documentation
- MONITOR_GUIDE.md       - Monitor feature guide
- RELEASE_NOTES.md       - Version history

SUPPORT:
========

GitHub: https://github.com/dpafumi/OJET_Troubleshooter
Issues: https://github.com/dpafumi/OJET_Troubleshooter/issues

EOF

# Create tarball
echo "📦 Creating tarball..."
cd ${BUILD_DIR}
tar -czf ${PACKAGE_NAME}.tar.gz ${PACKAGE_NAME}
cd ..

# Create zip file
echo "🗜️  Creating zip file..."
cd ${BUILD_DIR}
zip -r -q ${PACKAGE_NAME}.zip ${PACKAGE_NAME}
cd ..

# Calculate checksums
echo "🔐 Calculating checksums..."
cd ${BUILD_DIR}
sha256sum ${PACKAGE_NAME}.tar.gz > ${PACKAGE_NAME}.tar.gz.sha256
sha256sum ${PACKAGE_NAME}.zip > ${PACKAGE_NAME}.zip.sha256
cd ..

# Display results
echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 Package files:"
echo "   - ${BUILD_DIR}/${PACKAGE_NAME}.tar.gz"
echo "   - ${BUILD_DIR}/${PACKAGE_NAME}.zip"
echo ""
echo "🔐 Checksums:"
echo "   - ${BUILD_DIR}/${PACKAGE_NAME}.tar.gz.sha256"
echo "   - ${BUILD_DIR}/${PACKAGE_NAME}.zip.sha256"
echo ""
echo "📊 Package size:"
du -sh ${BUILD_DIR}/${PACKAGE_NAME}.tar.gz
du -sh ${BUILD_DIR}/${PACKAGE_NAME}.zip
echo ""
echo "🎉 Ready for deployment!"

