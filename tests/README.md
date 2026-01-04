# AYTS E2E Testing with Playwright

This directory contains end-to-end tests for the AYTS (At Your Tayo Service) application using Playwright.

## Test Coverage

The test suite covers the complete user journey:

1. **Landing Page** - Location selection and navigation
2. **Store Categories** - Category browsing and selection
3. **Store List** - Store discovery and filtering
4. **Store Page** - Product browsing within stores
5. **Product Details** - Product information and cart addition
6. **Cart Page** - Cart management and checkout
7. **Checkout Page** - Order placement and form submission
8. **Order Confirmation** - Success confirmation and return flow

Additional test scenarios:
- Navigation and responsive design
- Error handling and edge cases
- Performance and loading states

## Setup

### Prerequisites
- Node.js installed
- Frontend server running on `http://localhost:3000`
- Backend API server running on `http://localhost:8787` (for full integration tests)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run test:e2e:install
```

## Running Tests

### Development Mode
```bash
# Run tests in headless mode
npm run test:e2e

# Run tests with UI (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug
```

### CI/CD Mode
```bash
# Run tests for CI (headless, with retries)
npm run test:e2e
```

### Viewing Reports
```bash
# View HTML report
npm run test:e2e:report
```

## Test Structure

```
tests/
├── e2e/
│   └── ayts-full-flow.spec.ts    # Main E2E test suite
├── fixtures/                     # Test data and mock objects
└── README.md                     # This file
```

## Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retry on failure**: 2 times (CI only)
- **Screenshots**: On failure
- **Video**: On failure
- **Traces**: On first retry
- **Auto-start dev server**: Yes

## Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('specific scenario', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');
    
    // Act
    await page.locator('button').click();
    
    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors:
   ```html
   <button data-testid="submit-button">Submit</button>
   ```
   ```typescript
   await page.locator('[data-testid="submit-button"]').click();
   ```

2. **Use test steps** for better organization:
   ```typescript
   await test.step('Login process', async () => {
     // login logic
   });
   ```

3. **Wait for elements** properly:
   ```typescript
   await page.waitForURL('**/dashboard');
   await expect(page.locator('.dashboard')).toBeVisible();
   ```

4. **Handle async operations**:
   ```typescript
   await expect(page.locator('.notification')).toBeVisible({ timeout: 5000 });
   ```

## Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```

### VS Code Integration
Install the Playwright extension for VS Code for better debugging experience.

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded for failed tests
- Check `test-results` directory for artifacts

## Troubleshooting

### Common Issues

1. **Tests fail with "connection refused"**
   - Ensure the dev server is running on `http://localhost:3000`
   - Check if the port is correct in `playwright.config.ts`

2. **Tests timeout**
   - Increase timeout in the test or config
   - Check if the application is loading slowly

3. **Element not found**
   - Verify selectors are correct
   - Use `data-testid` attributes for more stable tests
   - Add explicit waits for dynamic content

4. **Flaky tests**
   - Add proper waits for network requests
   - Use `page.waitForLoadState('networkidle')` if needed
   - Increase retry count in configuration

### Environment Variables

Create a `.env.test` file for test-specific configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Continuous Integration

### GitHub Actions Example
```yaml
- name: Install Playwright
  run: npm run test:e2e:install

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Performance Testing

The test suite includes basic performance checks:
- Loading state verification
- Response time validation
- Resource loading confirmation

## Mobile Testing

Tests automatically run on mobile viewports:
- Pixel 5 (Android)
- iPhone 12 (iOS)

Additional mobile-specific tests can be added using:
```typescript
test('Mobile specific behavior', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // mobile test logic
});
```

## Accessibility Testing

While not explicitly included, Playwright can be extended with accessibility testing:
```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('Accessibility check', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## Data Management

For tests requiring specific data:
1. Use test fixtures for consistent test data
2. Clean up test data after each test
3. Use mock APIs for isolated testing

Example:
```typescript
import { test as base } from '@playwright/test';

type TestFixtures = {
  testData: TestData;
};

const test = base.extend<TestFixtures>({
  testData: async ({}, use) => {
    const data = createTestData();
    await use(data);
    await cleanupTestData(data);
  },
});
```
