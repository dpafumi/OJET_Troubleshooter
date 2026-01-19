# 🌐 Remote Access Guide

This guide explains how to access OJET Troubleshooter from remote machines (GCP, AWS, other servers).

---

## 🎯 Overview

By default, the application is configured to accept connections from any IP address:
- **Frontend**: Port 3000 (binds to `0.0.0.0`)
- **Backend**: Port 3001 (binds to `0.0.0.0`)

---

## 🔧 Configuration

### ✅ Already Configured

The following files are already configured for remote access:

1. **`frontend/vite.config.js`**
   ```javascript
   server: {
     host: '0.0.0.0',  // Allows external connections
     port: 3000
   }
   ```

2. **`backend/server.js`**
   ```javascript
   app.listen(3001, '0.0.0.0', () => {
     console.log('Listening on 0.0.0.0:3001 (accessible externally)');
   });
   ```

---

## 🌍 Accessing from Remote Machine

### GCP (Google Cloud Platform)

1. **Configure Firewall Rules**
   ```bash
   # Allow port 3000 (frontend)
   gcloud compute firewall-rules create allow-ojet-frontend \
     --allow tcp:3000 \
     --source-ranges 0.0.0.0/0 \
     --description "Allow OJET Troubleshooter frontend"
   
   # Allow port 3001 (backend)
   gcloud compute firewall-rules create allow-ojet-backend \
     --allow tcp:3001 \
     --source-ranges 0.0.0.0/0 \
     --description "Allow OJET Troubleshooter backend"
   ```

2. **Access the Application**
   ```
   http://<EXTERNAL_IP>:3000
   ```
   
   Example: `http://10.142.0.20:3000`

### AWS (Amazon Web Services)

1. **Configure Security Group**
   - Go to EC2 → Security Groups
   - Add Inbound Rules:
     - Type: Custom TCP
     - Port: 3000
     - Source: 0.0.0.0/0 (or your IP)
     
     - Type: Custom TCP
     - Port: 3001
     - Source: 0.0.0.0/0 (or your IP)

2. **Access the Application**
   ```
   http://<PUBLIC_IP>:3000
   ```

### Other Cloud Providers / VPS

1. **Check Firewall**
   ```bash
   # Ubuntu/Debian (ufw)
   sudo ufw allow 3000/tcp
   sudo ufw allow 3001/tcp
   
   # CentOS/RHEL (firewalld)
   sudo firewall-cmd --permanent --add-port=3000/tcp
   sudo firewall-cmd --permanent --add-port=3001/tcp
   sudo firewall-cmd --reload
   ```

2. **Verify Ports are Open**
   ```bash
   # Check if ports are listening
   netstat -tuln | grep -E '3000|3001'
   
   # Or using ss
   ss -tuln | grep -E '3000|3001'
   ```

---

## 🔒 Security Recommendations

### For Production Use

1. **Restrict Source IPs**
   ```bash
   # GCP - Allow only your IP
   gcloud compute firewall-rules create allow-ojet-frontend \
     --allow tcp:3000 \
     --source-ranges YOUR_IP/32
   ```

2. **Use SSH Tunneling** (Most Secure)
   ```bash
   # On your local machine
   ssh -L 3000:localhost:3000 -L 3001:localhost:3001 user@remote-server
   
   # Then access via localhost
   http://localhost:3000
   ```

3. **Use Reverse Proxy with SSL**
   - Set up Nginx/Apache with SSL certificate
   - Proxy requests to ports 3000/3001
   - Use domain name instead of IP

---

## 🧪 Testing Remote Access

### From the Server
```bash
# Check if services are listening on all interfaces
netstat -tuln | grep -E '3000|3001'

# Expected output:
# tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN
# tcp        0      0 0.0.0.0:3001            0.0.0.0:*               LISTEN
```

### From Your Local Machine
```bash
# Test backend connectivity
curl http://<SERVER_IP>:3001/api/health

# Expected: {"status":"ok","timestamp":"..."}

# Test frontend (should return HTML)
curl http://<SERVER_IP>:3000
```

---

## 🐛 Troubleshooting

### Can't Connect from Remote Machine

1. **Check if application is running**
   ```bash
   ps aux | grep node
   ```

2. **Verify ports are listening on 0.0.0.0**
   ```bash
   netstat -tuln | grep -E '3000|3001'
   ```
   
   Should show `0.0.0.0:3000` and `0.0.0.0:3001`, NOT `127.0.0.1`

3. **Check firewall rules**
   ```bash
   # GCP
   gcloud compute firewall-rules list
   
   # Linux
   sudo ufw status
   # or
   sudo firewall-cmd --list-all
   ```

4. **Test from server itself**
   ```bash
   curl http://localhost:3000
   curl http://localhost:3001/api/health
   ```

---

## 📋 Quick Reference

| Component | Port | Bind Address | Access URL |
|-----------|------|--------------|------------|
| Frontend | 3000 | 0.0.0.0 | `http://<IP>:3000` |
| Backend | 3001 | 0.0.0.0 | `http://<IP>:3001/api/health` |

---

## 🎯 Next Steps

After configuring remote access:
1. ✅ Configure firewall rules
2. ✅ Start the application: `./start.sh`
3. ✅ Test connectivity from your local machine
4. ✅ Access the web interface: `http://<SERVER_IP>:3000`

