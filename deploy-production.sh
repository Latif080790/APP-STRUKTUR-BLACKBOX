#!/bin/bash
#
# PRODUCTION DEPLOYMENT SCRIPT
# Professional Structural Analysis System
# Zero-Tolerance Engineering Solution
#
# This script prepares the system for production deployment
# in construction business environment

echo "🚀 PRODUCTION DEPLOYMENT SETUP"
echo "═══════════════════════════════════════════════════"
echo "📅 Deployment Date: $(date)"
echo "🏗️ System: Professional Structural Analysis"
echo "🎯 Target: Construction Business Production"
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 STEP 1: PRE-DEPLOYMENT CHECKLIST"
echo "───────────────────────────────────────────────────"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js Version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "✅ NPM Version: $NPM_VERSION"

# Check if all dependencies are installed
echo "🔍 Checking dependencies..."
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ All dependencies installed"
else
    echo "⚠️ Installing missing dependencies..."
    npm install
fi

echo ""
echo "📦 STEP 2: PRODUCTION BUILD"
echo "───────────────────────────────────────────────────"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist build

# Run production build
echo "🏗️ Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully"
else
    echo "❌ Production build failed"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh dist 2>/dev/null || du -sh build 2>/dev/null || echo "Unknown")
echo "📊 Build size: $BUILD_SIZE"

echo ""
echo "🔒 STEP 3: SECURITY & OPTIMIZATION"
echo "───────────────────────────────────────────────────"

# Create production environment file
cat > .env.production << EOL
# PRODUCTION ENVIRONMENT CONFIGURATION
NODE_ENV=production
VITE_ENV=production
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Professional Structural Analysis System
VITE_VERSION=1.0.0
VITE_BUILD_DATE=$(date -Iseconds)

# Security Settings
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_DEBUG_MODE=false
VITE_STRICT_MODE=true

# Performance Settings
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_CACHING=true
VITE_BUNDLE_ANALYZER=false

# Business Settings
VITE_ZERO_TOLERANCE_MODE=true
VITE_PROFESSIONAL_MODE=true
VITE_SNI_COMPLIANCE=true
EOL

echo "✅ Production environment configured"

# Create deployment configuration
cat > deploy.config.js << EOL
// PRODUCTION DEPLOYMENT CONFIGURATION
module.exports = {
  // Application Settings
  app: {
    name: 'professional-structural-analysis',
    version: '1.0.0',
    description: 'Zero-Tolerance Engineering Solution',
    author: 'Construction Engineering Team'
  },

  // Server Settings
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    maxConnections: 100,
    timeout: 30000
  },

  // Security Settings
  security: {
    helmet: true,
    cors: {
      origin: true,
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Performance Settings
  performance: {
    compression: true,
    caching: {
      maxAge: 86400000, // 1 day
      etag: true
    },
    staticFiles: {
      maxAge: 31536000000 // 1 year for static assets
    }
  },

  // Business Logic
  business: {
    zeroToleranceMode: true,
    professionalMode: true,
    sniCompliance: true,
    maxConcurrentUsers: 10,
    maxProjectsPerHour: 1000
  }
};
EOL

echo "✅ Deployment configuration created"

echo ""
echo "🌐 STEP 4: DEPLOYMENT OPTIONS"
echo "───────────────────────────────────────────────────"

echo "📋 Available deployment methods:"
echo ""

echo "🖥️ OPTION 1: LOCAL NETWORK DEPLOYMENT (Recommended for internal use)"
echo "   → Secure internal network access"
echo "   → Full control over data and access"
echo "   → Ideal for sensitive construction projects"
echo ""

echo "☁️ OPTION 2: CLOUD DEPLOYMENT (For distributed teams)"
echo "   → Remote access capability"
echo "   → Automatic scaling and backup"
echo "   → Professional SSL certificates"
echo ""

echo "💻 OPTION 3: DESKTOP APPLICATION (Offline capability)"
echo "   → Standalone application per engineer"
echo "   → Works without internet connection"
echo "   → Direct installation on workstations"
echo ""

echo "📊 STEP 5: PERFORMANCE OPTIMIZATION"
echo "───────────────────────────────────────────────────"

# Create performance monitoring script
cat > performance-monitor.js << EOL
/**
 * PRODUCTION PERFORMANCE MONITORING
 * Monitors system performance in production environment
 */

const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      memoryUsage: [],
      startTime: Date.now()
    };
    
    this.logFile = path.join(__dirname, 'performance.log');
  }

  logRequest(duration, success = true) {
    this.metrics.requests++;
    this.metrics.responseTime.push(duration);
    
    if (!success) {
      this.metrics.errors++;
    }

    // Log memory usage
    const memUsage = process.memoryUsage();
    this.metrics.memoryUsage.push(memUsage.heapUsed);

    // Write to log file every 100 requests
    if (this.metrics.requests % 100 === 0) {
      this.writeLog();
    }
  }

  writeLog() {
    const avgResponseTime = this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length;
    const avgMemory = this.metrics.memoryUsage.reduce((a, b) => a + b, 0) / this.metrics.memoryUsage.length;
    const errorRate = (this.metrics.errors / this.metrics.requests) * 100;
    const uptime = Date.now() - this.metrics.startTime;

    const logEntry = {
      timestamp: new Date().toISOString(),
      requests: this.metrics.requests,
      avgResponseTime: Math.round(avgResponseTime),
      avgMemoryMB: Math.round(avgMemory / 1024 / 1024),
      errorRate: errorRate.toFixed(2),
      uptimeHours: (uptime / (1000 * 60 * 60)).toFixed(2)
    };

    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\\n');
    console.log('📊 Performance logged:', logEntry);
  }

  getMetrics() {
    return this.metrics;
  }
}

module.exports = PerformanceMonitor;
EOL

echo "✅ Performance monitoring configured"

echo ""
echo "🛡️ STEP 6: BACKUP & RECOVERY"
echo "───────────────────────────────────────────────────"

# Create backup script
cat > backup.sh << EOL
#!/bin/bash
# AUTOMATED BACKUP SCRIPT
# Creates backup of system and data

BACKUP_DIR="./backups"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="structural_analysis_backup_\$DATE"

mkdir -p \$BACKUP_DIR

echo "🗄️ Creating backup: \$BACKUP_NAME"

# Backup source code
tar -czf "\$BACKUP_DIR/\$BACKUP_NAME.tar.gz" \\
  --exclude=node_modules \\
  --exclude=dist \\
  --exclude=build \\
  --exclude=.git \\
  --exclude=backups \\
  .

echo "✅ Backup created: \$BACKUP_DIR/\$BACKUP_NAME.tar.gz"

# Keep only last 10 backups
cd \$BACKUP_DIR
ls -t *.tar.gz | tail -n +11 | xargs rm -f
echo "🧹 Old backups cleaned up"
EOL

chmod +x backup.sh
echo "✅ Backup system configured"

echo ""
echo "📋 STEP 7: DEPLOYMENT INSTRUCTIONS"
echo "───────────────────────────────────────────────────"

# Create deployment instructions
cat > DEPLOYMENT-INSTRUCTIONS.md << 'EOL'
# 🚀 PRODUCTION DEPLOYMENT INSTRUCTIONS
## Professional Structural Analysis System

### 📋 PRE-DEPLOYMENT CHECKLIST

#### **System Requirements**
- [ ] Node.js 18+ installed
- [ ] NPM 9+ installed  
- [ ] Minimum 4GB RAM
- [ ] 10GB free disk space
- [ ] Network access for team

#### **Business Requirements**
- [ ] Licensed structural engineer assigned
- [ ] SNI standards documentation available
- [ ] Construction project portfolio ready
- [ ] Team training schedule prepared

---

### 🖥️ DEPLOYMENT OPTION 1: LOCAL NETWORK

#### **Step 1: Server Setup**
```bash
# 1. Copy built files to server
scp -r dist/ user@server:/var/www/structural-analysis/

# 2. Install serve globally
npm install -g serve

# 3. Start production server
serve -s dist -p 3000
```

#### **Step 2: Network Configuration**
```bash
# Configure firewall for internal network
sudo ufw allow from 192.168.1.0/24 to any port 3000

# Start server with network binding
serve -s dist -p 3000 -l 0.0.0.0
```

#### **Step 3: Access Configuration**
- **Internal URL:** `http://[SERVER-IP]:3000`
- **Access Control:** Internal network only
- **User Training:** Schedule team training sessions

---

### ☁️ DEPLOYMENT OPTION 2: CLOUD DEPLOYMENT

#### **Vercel Deployment (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy to Vercel
vercel --prod

# 3. Configure custom domain (optional)
vercel domains add structural-analysis.yourdomain.com
```

#### **Netlify Deployment**
```bash
# 1. Install Netlify CLI  
npm install -g netlify-cli

# 2. Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### **AWS/DigitalOcean Deployment**
```bash
# 1. Create server instance
# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Deploy with Docker
docker run -d -p 3000:3000 -v $(pwd)/dist:/usr/share/nginx/html nginx
```

---

### 💻 DEPLOYMENT OPTION 3: DESKTOP APPLICATION

#### **Electron Packaging**
```bash
# 1. Install electron-builder
npm install --save-dev electron-builder

# 2. Add to package.json
"main": "electron.js",
"scripts": {
  "electron": "electron .",
  "pack": "electron-builder --dir",
  "dist": "electron-builder"
}

# 3. Build desktop app
npm run dist
```

---

### 🔄 POST-DEPLOYMENT TASKS

#### **Immediate (Day 1)**
- [ ] Test all validation scenarios
- [ ] Verify zero-tolerance system active
- [ ] Confirm licensed engineer access
- [ ] Document access URLs and credentials

#### **Week 1**
- [ ] Train core engineering team
- [ ] Test with pilot construction project
- [ ] Monitor system performance
- [ ] Collect user feedback

#### **Month 1**
- [ ] Full team rollout
- [ ] Process optimization
- [ ] ROI measurement
- [ ] Compliance audit

---

### 📊 MONITORING & MAINTENANCE

#### **Daily Monitoring**
```bash
# Check system status
curl -I http://your-domain:3000

# Monitor performance logs
tail -f performance.log

# Check error rates
grep "ERROR" logs/*.log | wc -l
```

#### **Weekly Tasks**
- [ ] Performance review
- [ ] User feedback analysis  
- [ ] Security updates
- [ ] Backup verification

#### **Monthly Tasks**
- [ ] System optimization
- [ ] Professional engineering review
- [ ] Compliance audit
- [ ] Feature planning

---

### 🆘 TROUBLESHOOTING

#### **Common Issues**

**Issue: Server won't start**
```bash
# Check port availability
lsof -i :3000

# Kill conflicting processes
sudo kill -9 $(lsof -t -i:3000)

# Restart server
npm start
```

**Issue: Performance degradation**
```bash
# Monitor memory usage
free -h

# Check CPU usage  
top -p $(pgrep node)

# Restart if needed
pm2 restart structural-analysis
```

**Issue: Validation errors**
```bash
# Check calculation engine
node -e "console.log(require('./dist/assets/calculation-engine.js'))"

# Verify SNI compliance
grep -r "SNI" dist/

# Test zero-tolerance system
curl -X POST http://localhost:3000/api/validate
```

---

### 📞 SUPPORT CONTACTS

- **System Issues:** [IT Administrator]
- **Engineering Questions:** [Licensed Structural Engineer] 
- **Business Operations:** [Project Manager]
- **Emergency Support:** [24/7 Contact]

EOL

echo "✅ Deployment instructions created"

echo ""
echo "✅ PRODUCTION DEPLOYMENT SETUP COMPLETE"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo "1. Review deployment options in DEPLOYMENT-INSTRUCTIONS.md"
echo "2. Choose deployment method suitable for your business"
echo "3. Run backup.sh before deployment"
echo "4. Follow post-deployment checklist"
echo ""
echo "🎯 System is ready for production deployment!"
echo "🏗️ Zero-tolerance validation will ensure construction safety"
echo ""