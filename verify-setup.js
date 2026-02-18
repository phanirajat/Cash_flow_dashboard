#!/usr/bin/env node

/**
 * Quick Twilio OTP Setup Verification Script
 * Run this to check if everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying OTP Setup...\n');

const checks = [];

// Check 1: Backend directory exists
const backendPath = path.join(__dirname, 'backend');
checks.push({
  name: 'Backend directory exists',
  pass: fs.existsSync(backendPath),
  file: 'backend/'
});

// Check 2: Backend package.json exists
const backendPkgPath = path.join(backendPath, 'package.json');
checks.push({
  name: 'Backend package.json exists',
  pass: fs.existsSync(backendPkgPath),
  file: 'backend/package.json'
});

// Check 3: Backend node_modules exists
const nodeModulesPath = path.join(backendPath, 'node_modules');
checks.push({
  name: 'Backend dependencies installed',
  pass: fs.existsSync(nodeModulesPath),
  file: 'backend/node_modules (run: cd backend && npm install)',
  warn: !fs.existsSync(nodeModulesPath)
});

// Check 4: .env.example exists
const envExamplePath = path.join(backendPath, '.env.example');
checks.push({
  name: '.env.example template exists',
  pass: fs.existsSync(envExamplePath),
  file: 'backend/.env.example'
});

// Check 5: .env exists
const envPath = path.join(backendPath, '.env');
checks.push({
  name: '.env file configured',
  pass: fs.existsSync(envPath),
  file: 'backend/.env (copy from .env.example and add Twilio credentials)',
  warn: !fs.existsSync(envPath)
});

// Check 6: src/server.ts exists
const serverPath = path.join(backendPath, 'src', 'server.ts');
checks.push({
  name: 'Express server configured',
  pass: fs.existsSync(serverPath),
  file: 'backend/src/server.ts'
});

// Check 7: OTP service exists
const otpServicePath = path.join(backendPath, 'src', 'services', 'otp.service.ts');
checks.push({
  name: 'OTP service exists',
  pass: fs.existsSync(otpServicePath),
  file: 'backend/src/services/otp.service.ts'
});

// Check 8: Auth routes exist
const authRoutesPath = path.join(backendPath, 'src', 'routes', 'auth.routes.ts');
checks.push({
  name: 'Auth API routes exist',
  pass: fs.existsSync(authRoutesPath),
  file: 'backend/src/routes/auth.routes.ts'
});

// Check 9: Frontend auth service updated
const authServicePath = path.join(__dirname, 'src', 'app', 'services', 'auth.service.ts');
const authServiceContent = fs.existsSync(authServicePath) ? fs.readFileSync(authServicePath, 'utf8') : '';
checks.push({
  name: 'Frontend calls backend API',
  pass: authServiceContent.includes('http.post'),
  file: 'src/app/services/auth.service.ts'
});

// Print results
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║            Setup Verification Results                     ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let passCount = 0;
let warnCount = 0;

checks.forEach(check => {
  if (check.pass) {
    console.log(`✅ ${check.name}`);
    passCount++;
  } else {
    console.log(`❌ ${check.name}`);
    console.log(`   File: ${check.file}`);
  }
  
  if (check.warn) {
    console.log(`   ⚠️  Warning: Set up required`);
    warnCount++;
  }
});

console.log('\n' + '═'.repeat(61));
console.log(`Results: ${passCount}/${checks.length} passed`);

if (warnCount > 0) {
  console.log(`⚠️  ${warnCount} setup step(s) needed`);
}

console.log('═'.repeat(61) + '\n');

// Next steps
if (passCount === checks.length && warnCount === 0) {
  console.log('🎉 All checks passed! Ready to run:\n');
  console.log('Terminal 1 (Backend):');
  console.log('  cd backend && npm run dev\n');
  console.log('Terminal 2 (Frontend):');
  console.log('  npm start\n');
} else {
  console.log('📝 Next steps:\n');
  
  const nodeModulesExists = fs.existsSync(nodeModulesPath);
  if (!nodeModulesExists) {
    console.log('1. Install backend dependencies:');
    console.log('   cd backend && npm install\n');
  }
  
  const envExists = fs.existsSync(envPath);
  if (!envExists) {
    console.log(`${nodeModulesExists ? '1' : '2'}. Configure Twilio credentials:`);
    console.log('   cp backend/.env.example backend/.env');
    console.log('   # Edit backend/.env with your Twilio Account SID, Auth Token, Phone Number\n');
  }
  
  console.log('📚 For detailed instructions, see: OTP_SETUP_GUIDE.md\n');
}
