# CyberGuardian Platform Deployment Guide

## Project Overview
CyberGuardian is a comprehensive cybersecurity platform built with React, Express.js, and TypeScript. It includes interactive security tools, threat management, analytics, and educational resources.

## Prerequisites
- Node.js 18+ 
- npm or yarn package manager

## Installation
```bash
npm install
```

## Development
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend on port 3000
npm run client  # Frontend on port 5173
```

## Production Build
```bash
npm run build
```

## Deployment Options

### Option 1: Vercel Deployment (Recommended for Frontend)

1. **Prepare for Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configuration:**
   Create `vercel.json`:
   ```json
   {
     "builds": [
       {
         "src": "client/src/main.tsx",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       },
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/src/main.tsx"
       }
     ]
   }
   ```

4. **Environment Variables:**
   Set in Vercel dashboard:
   - `NODE_ENV=production`
   - `PORT=3000`

### Option 2: Kinsta Application Hosting

1. **Prepare Repository:**
   - Push code to GitHub/GitLab
   - Ensure `package.json` has correct scripts

2. **Kinsta Setup:**
   - Connect your Git repository
   - Choose Node.js runtime
   - Set build command: `npm run build`
   - Set start command: `npm start`

3. **Required Scripts in package.json:**
   ```json
   {
     "scripts": {
       "build": "tsc && vite build",
       "start": "node dist/server/index.js",
       "dev": "concurrently \"npm run server\" \"npm run client\"",
       "server": "tsx server/index.ts",
       "client": "vite"
     }
   }
   ```

4. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=8080` (Kinsta default)

### Option 3: Traditional VPS/Cloud Server

1. **Server Setup:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application:**
   ```bash
   # Clone/upload your code
   npm install
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js
   ```

3. **PM2 Configuration (ecosystem.config.js):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'cyberguardian',
       script: 'dist/server/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development'
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

## Docker Deployment

1. **Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Deploy:**
   ```bash
   docker build -t cyberguardian .
   docker run -p 3000:3000 cyberguardian
   ```

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data
   - Use platform-specific secret management
   - Set secure session keys

2. **HTTPS:**
   - Enable SSL/TLS certificates
   - Use reverse proxy (nginx) if needed

3. **CORS:**
   - Configure appropriate origins
   - Restrict API access

## Monitoring

1. **Health Endpoint:**
   - Available at `/health`
   - Returns application status

2. **Logging:**
   - Application logs available
   - Consider external logging services

## Troubleshooting

1. **Build Issues:**
   - Ensure Node.js version compatibility
   - Clear node_modules and reinstall

2. **Runtime Issues:**
   - Check environment variables
   - Verify port configuration
   - Review application logs

## Support
For deployment issues, check the platform-specific documentation or contact support.