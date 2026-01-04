import { test, expect } from '@playwright/test';

test.describe('AYTS Full E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
  });

  test('Complete user journey from landing to order confirmation', async ({ page }) => {
    // 1. Landing Page (Location Selector)
    await test.step('Landing Page - Location Selection', async () => {
      // Check welcome message
      await expect(page.locator('h1, .welcome-message')).toBeVisible();
      
      // Check location selector dropdown
      const locationDropdown = page.locator('select, [data-testid="location-selector"], .location-dropdown');
      await expect(locationDropdown).toBeVisible();
      
      // Select a location
      await locationDropdown.selectOption({ label: /Manila|Quezon City|Makati/i });
      
      // Click CTA button
      const selectLocationBtn = page.locator('button:has-text("Select My Location"), [data-testid="select-location-btn"]');
      await expect(selectLocationBtn).toBeVisible();
      await selectLocationBtn.click();
      
      // Wait for navigation to store categories
      await page.waitForURL('**/stores');
    });

    // 2. Store Categories Page
    await test.step('Store Categories Page', async () => {
      // Check category headers
      await expect(page.locator('h1, h2:has-text("Categories")')).toBeVisible();
      
      // Verify category cards exist
      const categories = ['Grocery', 'Pharmacy', 'Vegetables', 'Water Refillers'];
      for (const category of categories) {
        const categoryCard = page.locator(`.category-card:has-text("${category}"), [data-testid="category-${category.toLowerCase()}"]`);
        await expect(categoryCard).toBeVisible();
      }
      
      // Select Grocery category
      const groceryCategory = page.locator('.category-card:has-text("Grocery"), [data-testid="category-grocery"]');
      await groceryCategory.click();
      
      // Wait for navigation to store list
      await page.waitForURL('**/stores/**');
    });

    // 3. Store List Page
    await test.step('Store List Page', async () => {
      // Check store list header
      await expect(page.locator('h1:has-text("Grocery Stores"), h2:has-text("Stores")')).toBeVisible();
      
      // Verify store cards exist
      const storeCards = page.locator('.store-card, [data-testid="store-card"]');
      await expect(storeCards.first()).toBeVisible();
      
      // Check store card elements
      const firstStore = storeCards.first();
      await expect(firstStore.locator('img, .store-image')).toBeVisible();
      await expect(firstStore.locator('.store-name, h3')).toBeVisible();
      await expect(firstStore.locator('.store-category, .category')).toBeVisible();
      
      // Select first store
      await firstStore.click();
      
      // Wait for navigation to store page
      await page.waitForURL('**/stores/**');
    });

    // 4. Store Page
    await test.step('Store Page', async () => {
      // Check store details
      await expect(page.locator('.store-banner, .banner-image')).toBeVisible();
      await expect(page.locator('.store-name, h1')).toBeVisible();
      
      // Check tabs
      const productsTab = page.locator('button:has-text("Products"), [data-testid="products-tab"]');
      const infoTab = page.locator('button:has-text("Info"), [data-testid="info-tab"]');
      await expect(productsTab).toBeVisible();
      await expect(infoTab).toBeVisible();
      
      // Ensure Products tab is active
      await productsTab.click();
      
      // Verify product cards exist
      const productCards = page.locator('.product-card, [data-testid="product-card"]');
      await expect(productCards.first()).toBeVisible();
      
      // Check product card elements
      const firstProduct = productCards.first();
      await expect(firstProduct.locator('img, .product-image')).toBeVisible();
      await expect(firstProduct.locator('.product-name, h3')).toBeVisible();
      await expect(firstProduct.locator('.product-price, .price')).toBeVisible();
      await expect(firstProduct.locator('button:has-text("Add to Cart")')).toBeVisible();
      
      // Select first product
      await firstProduct.click();
      
      // Wait for navigation to product details
      await page.waitForURL('**/products/**');
    });

    // 5. Product Details Page
    await test.step('Product Details Page', async () => {
      // Check product details
      await expect(page.locator('.product-image-large, .main-image')).toBeVisible();
      await expect(page.locator('.product-name, h1')).toBeVisible();
      await expect(page.locator('.product-price, .price')).toBeVisible();
      await expect(page.locator('.product-description, .description')).toBeVisible();
      
      // Check quantity selector
      const quantitySelector = page.locator('.quantity-selector, [data-testid="quantity-selector"]');
      await expect(quantitySelector).toBeVisible();
      
      // Increase quantity
      const increaseBtn = page.locator('button:has-text("+"), [data-testid="quantity-increase"]');
      await increaseBtn.click();
      
      // Add to cart
      const addToCartBtn = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]');
      await expect(addToCartBtn).toBeVisible();
      await addToCartBtn.click();
      
      // Check for success message or cart update
      await expect(page.locator('.toast, .notification, .cart-badge')).toBeVisible({ timeout: 5000 });
      
      // Open cart
      const cartBtn = page.locator('button:has-text("Cart"), [data-testid="cart-button"]');
      await cartBtn.click();
      
      // Wait for navigation to cart page
      await page.waitForURL('**/cart');
    });

    // 6. Cart Page
    await test.step('Cart Page', async () => {
      // Check cart items
      const cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
      await expect(cartItems.first()).toBeVisible();
      
      // Check cart item elements
      const firstCartItem = cartItems.first();
      await expect(firstCartItem.locator('.item-name, h3')).toBeVisible();
      await expect(firstCartItem.locator('.item-price, .price')).toBeVisible();
      
      // Check quantity steppers
      const decreaseBtn = firstCartItem.locator('button:has-text("-"), [data-testid="quantity-decrease"]');
      const increaseBtn = firstCartItem.locator('button:has-text("+"), [data-testid="quantity-increase"]');
      await expect(decreaseBtn).toBeVisible();
      await expect(increaseBtn).toBeVisible();
      
      // Check price summary
      await expect(page.locator('.subtotal, .total-summary')).toBeVisible();
      await expect(page.locator('.total-amount, .grand-total')).toBeVisible();
      
      // Proceed to checkout
      const checkoutBtn = page.locator('button:has-text("Checkout"), [data-testid="checkout-btn"]');
      await expect(checkoutBtn).toBeVisible();
      await checkoutBtn.click();
      
      // Wait for navigation to checkout page
      await page.waitForURL('**/checkout');
    });

    // 7. Checkout Page
    await test.step('Checkout Page', async () => {
      // Check form fields
      await expect(page.locator('input[name="name"], #name')).toBeVisible();
      await expect(page.locator('input[name="phone"], #phone')).toBeVisible();
      await expect(page.locator('input[name="address"], #address, textarea[name="address"]')).toBeVisible();
      await expect(page.locator('textarea[name="notes"], #notes')).toBeVisible();
      
      // Fill out form
      await page.fill('input[name="name"], #name', 'John Doe');
      await page.fill('input[name="phone"], #phone', '+639123456789');
      await page.fill('input[name="address"], #address, textarea[name="address"]', '123 Test Street, Manila');
      await page.fill('textarea[name="notes"], #notes', 'Please deliver to the front desk');
      
      // Check order summary
      await expect(page.locator('.order-summary, .checkout-summary')).toBeVisible();
      await expect(page.locator('.total-amount, .final-total')).toBeVisible();
      
      // Place order
      const placeOrderBtn = page.locator('button:has-text("Place Order"), [data-testid="place-order-btn"]');
      await expect(placeOrderBtn).toBeVisible();
      await placeOrderBtn.click();
      
      // Wait for navigation to order confirmation
      await page.waitForURL('**/order-confirmation', { timeout: 10000 });
    });

    // 8. Order Confirmation Page
    await test.step('Order Confirmation Page', async () => {
      // Check success elements
      await expect(page.locator('.success-icon, .check-icon, [data-testid="success-icon"]')).toBeVisible();
      await expect(page.locator('h1:has-text("Your order has been placed"), .success-message')).toBeVisible();
      
      // Check back to home button
      const backToHomeBtn = page.locator('button:has-text("Back to Home"), [data-testid="back-home-btn"]');
      await expect(backToHomeBtn).toBeVisible();
      
      // Go back to home
      await backToHomeBtn.click();
      
      // Should return to landing page
      await page.waitForURL('**/');
    });
  });

  test('Navigation and responsive design', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // Check mobile navigation
    await expect(page.locator('.mobile-menu, .hamburger-menu')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.desktop-nav, .navbar')).toBeVisible();
  });

  test('Error handling and edge cases', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Test without selecting location
    const locationDropdown = page.locator('select, [data-testid="location-selector"]');
    await locationDropdown.selectOption({ index: 0 }); // Select empty/default option
    
    const selectLocationBtn = page.locator('button:has-text("Select My Location")');
    await selectLocationBtn.click();
    
    // Should show validation error
    await expect(page.locator('.error-message, .validation-error')).toBeVisible();
    
    // Test empty cart
    await page.goto('http://localhost:3000/cart');
    await expect(page.locator('.empty-cart, .cart-empty')).toBeVisible();
  });

  test('Performance and loading states', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check loading states
    const locationDropdown = page.locator('select, [data-testid="location-selector"]');
    await locationDropdown.selectOption({ label: /Manila/i });
    
    const selectLocationBtn = page.locator('button:has-text("Select My Location")');
    await selectLocationBtn.click();
    
    // Should show loading state
    await expect(page.locator('.loading, .spinner, [data-testid="loading"]')).toBeVisible({ timeout: 2000 });
    
    // Wait for content to load
    await expect(page.locator('.category-card')).toBeVisible({ timeout: 10000 });
  });
});
