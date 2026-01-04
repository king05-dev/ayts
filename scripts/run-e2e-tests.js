#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command} ${args.join(' ')}`, 'cyan');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`Command completed successfully`, 'green');
        resolve(code);
      } else {
        log(`Command failed with exit code ${code}`, 'red');
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`Command error: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'test';
  
  log('🎭 AYTS E2E Test Runner', 'bright');
  log('========================', 'bright');

  try {
    switch (mode) {
      case 'install':
        log('Installing Playwright browsers...', 'yellow');
        await runCommand('npm', ['run', 'test:e2e:install']);
        break;
        
      case 'ui':
        log('Starting Playwright UI mode...', 'yellow');
        await runCommand('npm', ['run', 'test:e2e:ui']);
        break;
        
      case 'headed':
        log('Running tests in headed mode...', 'yellow');
        await runCommand('npm', ['run', 'test:e2e:headed']);
        break;
        
      case 'debug':
        log('Running tests in debug mode...', 'yellow');
        await runCommand('npm', ['run', 'test:e2e:debug']);
        break;
        
      case 'report':
        log('Opening test report...', 'yellow');
        await runCommand('npm', ['run', 'test:e2e:report']);
        break;
        
      case 'test':
      default:
        log('Running E2E tests...', 'yellow');
        
        // Check if dev server is running
        log('Checking if dev server is running...', 'blue');
        try {
          await runCommand('curl', ['-s', 'http://localhost:3000'], { stdio: 'pipe' });
          log('✓ Dev server is running', 'green');
        } catch (error) {
          log('✗ Dev server is not running on http://localhost:3000', 'red');
          log('Please start the dev server with: npm run dev', 'yellow');
          process.exit(1);
        }
        
        // Check if API server is running
        log('Checking if API server is running...', 'blue');
        try {
          await runCommand('curl', ['-s', 'http://localhost:8787/health'], { stdio: 'pipe' });
          log('✓ API server is running', 'green');
        } catch (error) {
          log('⚠ API server is not running on http://localhost:8787', 'yellow');
          log('Some tests may fail. Start the API server with: cd ../ayts-api && npm run dev:cloudflare', 'yellow');
        }
        
        // Run the tests
        await runCommand('npm', ['run', 'test:e2e']);
        
        log('✓ All tests completed!', 'green');
        log('View detailed report: npm run test:e2e:report', 'cyan');
        break;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n👋 Test runner interrupted', 'yellow');
  process.exit(0);
});

main();
