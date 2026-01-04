    🌱 AYTS — Local Marketplace App

    A community-driven platform to browse and order from local stores.

    📌 Project Overview

    AYTS is a mobile-first marketplace connecting users to local community stores such as groceries, pharmacies, vegetable vendors, water refillers, and construction suppliers. Users select their location and browse available stores, products, and place orders for delivery.

    This project is currently frontend-first using v0 with Supabase planned for backend integration.

    🎨 Branding

    Name: AYTS

    Primary Color: Green — #1D6E3E

    Logo Concept: Map pin combined with a shopping bag

    Design Style: Clean, modern, rounded, community-friendly UI

    📱 User Flow (Updated)
    1. Landing Page (Location Selector included)

    The landing screen includes:

    Welcome message

    Subtext

    Location selector dropdown

    CTA: Select My Location

    Next: Goes directly to Store Categories Page.

    2. Store Categories Page

    Displays category cards such as:

    Grocery

    Pharmacy

    Vegetables

    Water Refillers

    Construction Supplies

    Local Businesses

    Next: Selecting a category → Store List Page

    3. Store List Page

    Shows stores available in the selected location + category.

    Each store card includes:

    Image

    Name

    Category

    (Optional) distance

    Next: Selecting a store → Store Page

    4. Store Page

    Store details:

    Banner

    Name

    Verified badge

    Tabs: Products | Info

    Products shown as cards with:

    Image

    Name

    Price

    Add to Cart

    Next: Selecting a product → Product Details Page

    5. Product Details Page

    Elements:

    Large image

    Name and price

    Description

    Quantity selector

    Add to Cart

    Next:

    User can go back

    Or open Cart

    6. Cart Page

    Displays:

    Cart items

    Quantity steppers

    Prices

    Total summary

    Next: Checkout → Checkout Page

    7. Checkout Page

    Form fields:

    Name

    Phone

    Delivery address

    Notes

    Includes order summary + Place Order button.

    Next: → Order Confirmation Page

    8. Order Confirmation Page

    Shows:

    Success check icon

    “Your order has been placed!”

    Button: Back to Home

    Next: Returns user to Store Categories Page (location remains saved).

    🔗 Connected Screen Logic

    We built a complete navigation flow ensuring:

    Location selected on landing page flows to every screen

    Category → Store List → Store → Product → Cart → Checkout → Confirmation

    Global state planned for:

    selectedLocation

    selectedCategory

    cartItems

    🧩 v0 Prompts Created

    We generated:

    Individual prompts for every screen

    A master prompt to connect all screens

    An updated master prompt after removing the separate location-selector page

    Branding guidance for consistent design across all screens

    These prompts now represent the full UX/UI foundation of the AYTS app.

    🛠️ Next Steps (Recommended)

    You can proceed with any of these:

    Frontend

    Generate reusable component library (buttons, inputs, cards) in v0

    Export v0 project to Next.js or React

    Add router + global state (Zustand / Context)

    Backend Setup (Supabase)

    Create database schema:

    Locations

    Categories

    Stores

    Products

    Cart

    Orders

    Prepare API endpoints (REST or RPC)

    Vendor / Admin Tools

    Vendor onboarding UI

    Store dashboard

    Product management screen

    Branding

    Finalize logo

    Create color system + typography scale