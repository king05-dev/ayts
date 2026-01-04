# 🚀 Quick Start: AYTS E2E Testing

Get up and running with E2E tests in minutes!

## Prerequisites

Make sure you have:
- Node.js 18+ installed
- Both frontend and backend projects ready

## One-Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

## Running Tests

### Option 1: Easy Mode (Recommended)
```bash
# Run all tests with automatic checks
npm test
```

### Option 2: Development Mode
```bash
# Run tests with visual UI (great for debugging)
npm run test:ui

# Run tests with visible browser
npm run test:headed

# Debug tests step by step
npm run test:debug
```

### Option 3: View Results
```bash
# View detailed HTML report
npm run test:report
```

## Before Running Tests

1. **Start Frontend** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Start Backend** (in another terminal):
   ```bash
   cd ../ayts-api
   npm run dev:cloudflare
   ```

3. **Run Tests** (in a third terminal):
   ```bash
   npm test
   ```

## What the Tests Cover

✅ **Complete User Journey:**
- Location selection
- Store browsing
- Product selection
- Cart management
- Checkout process
- Order confirmation

✅ **Additional Scenarios:**
- Mobile responsiveness
- Error handling
- Performance checks

## Troubleshooting

**"Connection refused" error?**
- Make sure both servers are running
- Check ports: Frontend (3000), Backend (8787)

**Tests are slow?**
- Use `npm run test:ui` for faster iteration
- Run specific tests: `npm run test:e2e -- --grep "specific test"`

**Element not found?**
- The UI might have changed - update selectors in the test file
- Use `data-testid` attributes for stable selectors

## Pro Tips

1. **Use the UI Mode** - `npm run test:ui` lets you see tests run live
2. **Debug Mode** - `npm run test:debug` pauses at each step
3. **Screenshots** - Automatically captured on failures
4. **HTML Reports** - Detailed reports with screenshots and videos

## Need Help?

- Check the full guide: `tests/README.md`
- View test results: `npm run test:report`
- Examine screenshots: `test-results/` folder

Happy Testing! 🎭
