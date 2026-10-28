# AI Shopping & Product Comparison Assistant
## Project Specification — `spec.md`

**Version:** 1.0.0  
**Project Type:** College Mini Project  
**Application:** AI-powered shopping assistant and product comparison platform  
**Frontend:** React.js + Vite  
**Backend:** Python + FastAPI  
**Database:** MongoDB  
**Currency:** Indian Rupee (INR)  
**Status:** Feature implementation specification

---

## 1. Project Overview

The AI Shopping & Product Comparison Assistant is a web application that helps users discover, evaluate, and compare products from online marketplaces based on their budget, requirements, and preferences.

The application uses AI-assisted product recommendations and product data retrieval to identify suitable products, display the best three recommendations, and allow users to compare products before visiting the original marketplace to purchase them.

Users can create an account, search for products, save favorite products to a wishlist, revisit previous searches after logging in, and compare selected products.

The application must use genuine product information retrieved through available APIs or supported scraping services. It must never fabricate product listings, prices, ratings, reviews, or product URLs.

### 1.1 Main objectives

- Simplify product discovery and purchasing decisions.
- Recommend the best three suitable products based on available evidence.
- Support product comparison for up to five selected products.
- Allow users to save and revisit their favorite products.
- Restore previous searches and comparisons after login.
- Provide a fast, responsive, accessible, and professional interface.
- Use AI to interpret requirements and explain recommendations.

### 1.2 Target users

- Students looking for products within a limited budget.
- Users comparing products across online marketplaces.
- Shoppers who want recommendations based on specific requirements.
- Returning users who want to access their saved products and search history.

---

## 2. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | User interface and reusable components |
| Build tool | Vite | Development server and production builds |
| Styling | Existing CSS framework or project styling | Responsive and consistent design |
| Backend | Python + FastAPI | API endpoints and business logic |
| Database | MongoDB | Users, products, wishlists, and search history |
| Authentication | Existing JWT-based authentication, if implemented | Secure login and user-specific access |
| AI | Existing configured AI provider | Requirement interpretation and recommendations |
| Product retrieval | Existing product API or ScraperAPI integration | Retrieve genuine product listings |
| HTTP client | Existing client, or `fetch`/Axios | Frontend-backend communication |
| Validation | Pydantic | Request and response validation |
| Testing | Existing test tools, or pytest and frontend test tools | Verify application behavior |

**Important:** Inspect the actual repository before making technology decisions. Reuse existing dependencies, environment variables, APIs, models, components, and architectural patterns wherever possible. Do not introduce a second authentication system or duplicate an existing feature.

---

## 3. Application Architecture

The application follows a React frontend, FastAPI backend, and MongoDB persistence architecture.

```text
React + Vite Frontend
        |
        | HTTP requests / JSON
        v
FastAPI Backend
        |
        +---- Authentication and Authorization
        |
        +---- Product Search and Retrieval
        |          |
        |          +---- Existing Product API / ScraperAPI
        |
        +---- AI Recommendation and Ranking
        |
        +---- Wishlist Management
        |
        +---- Search and Comparison History
        |
        v
MongoDB Database
```

### Architecture rules

1. React must not connect directly to MongoDB.
2. All database operations must be performed by the backend.
3. Protected endpoints must verify the authenticated user's identity.
4. External API keys and database credentials must remain on the backend.
5. The frontend must use the existing API configuration rather than hardcoding backend URLs throughout components.
6. AI recommendations must use actual retrieved product data as evidence.
7. Search, wishlist, history, and comparison functionality must work with the existing data models wherever possible.

---

## 4. User Roles and Authentication

### 4.1 Guest user

A guest user can:

- Open the home page.
- Search for products, subject to the application's existing authentication rules.
- View genuine search results.
- Open original product listings.
- Access Login and Sign Up pages.

If authentication is required to save a wishlist or search history, guests must be directed through the existing login flow.

### 4.2 Registered user

A registered user can:

- Log in and log out.
- Access their profile or account menu.
- Save and remove products from their wishlist.
- View saved products.
- Access previous searches and comparison results.
- Reopen previous results.
- Select up to five products for comparison.
- Manage their account using existing functionality.

### 4.3 Authentication requirements

- Preserve existing registration, login, token validation, and logout functionality.
- Use the existing JWT authentication implementation if present.
- Verify tokens on protected backend routes.
- Associate private data with the authenticated user's database identifier.
- Never accept a user ID supplied by the frontend as proof of authorization.
- Do not expose passwords, password hashes, tokens, or other secrets in API responses.
- Do not create a new authentication system if the existing one can support these requirements.

If the current project does not have authentication, implement a secure authentication flow using the existing FastAPI and MongoDB architecture.

---

## 5. Navigation Bar

Create a modern, responsive navigation bar consistent with the application's existing visual identity.

### 5.1 Navigation items

| Item | Behavior |
|---|---|
| Logo / Project name | Navigate to the home page |
| Home | Open the home page |
| Likes / Wishlist | Open saved products |
| Categories | Show supported product categories |
| Search | Focus or navigate to product search |
| Login / Sign Up | Display when the user is logged out |
| Profile / Account | Display when the user is logged in |

Only show the Categories item if the application supports categories. Do not introduce an unrelated category system just to fill the navigation bar.

### 5.2 Design requirements

- Responsive layouts for mobile, tablet, and desktop.
- Clear spacing, typography, and accessible icons.
- Smooth hover and focus transitions.
- Animated underline or active navigation indicator.
- Consistent light and dark themes, if supported.
- A mobile menu that opens and closes correctly.
- Correct navigation using the application's existing router.
- Accessible labels for icon-only buttons.
- Proper active, hover, focus, and disabled states.

The navigation bar must reuse existing components and styling tokens whenever possible.

---

## 6. Product Search

### 6.1 Search inputs

Users should be able to describe what they want in natural language.

Examples:

- "Best laptop under ₹60,000 for programming."
- "Wireless headphones under ₹3,000 with good battery life."
- "Smartphone with a good camera under ₹25,000."
- "Compare five laptops for college and gaming."

Where supported, allow users to specify:

- Product name or type.
- Budget or price range.
- Preferred brand.
- Required specifications.
- Intended use.
- Preferred marketplace.
- Other relevant constraints.

The interface must not require every optional field.

### 6.2 Search workflow

1. The user enters their requirements.
2. The frontend validates the input.
3. A loading state appears immediately after submission.
4. FastAPI receives the search request.
5. The backend interprets the requirements using the existing AI integration where appropriate.
6. The product retrieval service obtains real product listings.
7. The backend validates and normalizes available product data.
8. The recommendation engine ranks suitable products.
9. The frontend displays up to three top recommendations.
10. The backend persists the search and relevant result snapshot for authenticated users.
11. The user can save products, compare products, or revisit the search later.

Do not issue duplicate AI or product-retrieval requests for the same submission without a valid reason.

### 6.3 Product retrieval

Reuse the current product search integration, including ScraperAPI if already configured.

Requirements:

- Preserve the existing integration and request parameters unless a change is necessary.
- Handle rate limits, timeouts, unavailable pages, and malformed responses.
- Respect the applicable provider terms, website rules, and access restrictions.
- Do not assume that every marketplace provides a public API.
- Do not fabricate product information when a provider fails.
- Do not treat an AI-generated URL as a verified product listing.
- Cache eligible results only when permitted and appropriate.

### 6.4 Search validation

Reject or gracefully handle:

- Empty search requests.
- Invalid budgets.
- Unsupported input types.
- Malformed API responses.
- Requests that return no suitable products.
- External API timeouts or rate limits.

Show a useful error message and a retry option when a search fails.

---

## 7. Product Data Model

Normalize product information into a consistent structure before returning it to the frontend.

Example logical product structure:

```json
{
  "product_id": "provider-specific-product-id",
  "name": "Example Laptop",
  "image_url": "https://example.com/product-image.jpg",
  "price": {
    "amount": 54999,
    "currency": "INR"
  },
  "rating": 4.4,
  "rating_count": 1250,
  "description": "Available product description",
  "brand": "Example Brand",
  "marketplace": {
    "name": "Amazon",
    "logo_url": null
  },
  "product_url": "https://example.com/actual-product-listing",
  "specifications": {},
  "source": "configured-product-provider",
  "retrieved_at": "ISO-8601 timestamp"
}
```

This is an illustrative contract, not a requirement to replace an existing database schema.

### Data validation rules

- Product identifiers must be stable enough for deduplication within the available provider data.
- Prices must be numeric when supplied as prices.
- Ratings must use the source's documented scale.
- Missing ratings must remain missing, not default to five stars.
- Missing descriptions must remain empty or unavailable.
- Product URLs must come from verified source data.
- Marketplace names must reflect the actual source.
- Invalid or unavailable images must use a graceful fallback.
- Store retrieval timestamps when needed for history or freshness information.
- Do not assume every product has every field.

When prices are provided in INR, format them using Indian number grouping, such as `₹54,999`.

---

## 8. Product Cards

Each product card must display available information in a consistent, responsive layout.

### Required fields

1. Product image.
2. Product name.
3. Product rating, when available.
4. Product price, when available.
5. Product description, when available.
6. Original marketplace name or logo.
7. Link to the original product listing.
8. Like / Wishlist button.
9. Compare selection control, if supported by the current comparison workflow.

### Design requirements

- Use consistent image aspect ratios.
- Use `object-fit: contain` where appropriate for product images.
- Prevent images from stretching or overflowing.
- Keep product names and descriptions readable.
- Use consistent spacing, borders, shadows, and rounded corners.
- Add subtle hover animations without distracting the user.
- Make cards responsive across screen sizes.
- Use accessible button labels and keyboard focus indicators.
- Show a fallback when an image is unavailable.
- Hide or label missing data instead of inventing values.

### External product links

- Link to the actual source product page.
- Open external links safely in a new tab where appropriate.
- Use safe link attributes such as `rel="noopener noreferrer"` when using `target="_blank"`.
- Never invent a product URL or direct users to an unrelated listing.
- Handle expired or unavailable links gracefully.

---

## 9. Likes / Wishlist

### 9.1 Functional requirements

Users must be able to save products they like.

- Display a heart or bookmark button on each product card.
- Clicking the button saves the product.
- Clicking it again removes the product.
- Provide a dedicated Wishlist page.
- Display saved products with available images, names, prices, ratings, and product links.
- Show a friendly empty state when no products are saved.
- Prevent duplicate saved entries.
- Preserve the wishlist across page refreshes and future sessions.
- Associate saved products with the authenticated user.
- Reflect wishlist changes immediately in the UI.
- Handle failed save or removal requests without showing false success.

### 9.2 Persistence

Use MongoDB through FastAPI for authenticated wishlist persistence.

A logical wishlist record may contain:

```json
{
  "user_id": "authenticated-user-id",
  "product_id": "provider-product-id",
  "product_snapshot": {
    "name": "Example Laptop",
    "price": 54999,
    "currency": "INR",
    "product_url": "https://example.com/actual-listing"
  },
  "created_at": "ISO-8601 timestamp"
}
```

The actual schema should match the existing project's conventions.

### 9.3 Wishlist API contract

Adapt these routes to the existing route structure. Avoid duplicate endpoints when equivalent routes already exist.

| Method | Suggested endpoint | Purpose |
|---|---|---|
| GET | `/api/wishlist` | Retrieve current user's wishlist |
| POST | `/api/wishlist` | Add a product to the wishlist |
| DELETE | `/api/wishlist/{product_id}` | Remove a saved product |

Requirements:

- All wishlist endpoints require authentication.
- Validate product identifiers and submitted data.
- Enforce uniqueness for each user-product pair.
- Handle concurrent duplicate requests safely.
- Ensure one user cannot view or modify another user's wishlist.
- Use appropriate HTTP status codes and structured error responses.

### 9.4 Guest behavior

If a guest clicks Like, follow the existing authentication flow. If guest wishlist support already exists, preserve it and reconcile it with the authenticated user's wishlist according to the existing implementation.

Do not introduce a second login mechanism.

---

## 10. Search History and Previous Results

Users must be able to return to earlier product searches after logging in.

### 10.1 Requirements

- Save search queries for authenticated users.
- Store relevant result snapshots or references sufficient to reopen prior results.
- Save the search criteria, result identifiers, recommendation ordering, and timestamp where appropriate.
- Support reopening previous searches without repeating the original query.
- Restore saved comparison results when available.
- Show a helpful empty state when no history exists.
- Prevent users from accessing another user's private history.
- Avoid inventing old search results if stored information is missing.
- Handle outdated prices and unavailable listings transparently.

### 10.2 Search history model

A logical MongoDB document may contain:

```json
{
  "user_id": "authenticated-user-id",
  "query": "Best laptop under 60000 for programming",
  "filters": {
    "budget": 60000,
    "currency": "INR"
  },
  "recommended_product_ids": [
    "product-id-1",
    "product-id-2",
    "product-id-3"
  ],
  "result_snapshot": [],
  "created_at": "ISO-8601 timestamp"
}
```

The empty `result_snapshot` is a schema illustration, not a real search result. Store actual product data or stable references according to the existing architecture.

### 10.3 Search history API contract

| Method | Suggested endpoint | Purpose |
|---|---|---|
| GET | `/api/search-history` | Retrieve the current user's search history |
| GET | `/api/search-history/{search_id}` | Retrieve one saved search |
| POST | `/api/search` | Perform a search and save history when applicable |

Add a dedicated history deletion route only if required by the UI or privacy requirements.

### 10.4 Login restoration flow

1. User logs in successfully.
2. The frontend retrieves the authenticated user's saved history.
3. Previous searches are displayed in a history section.
4. Selecting an item retrieves its saved results.
5. The frontend renders the stored results without unnecessarily repeating the search.
6. If some listings are outdated, display their saved information and clearly indicate that current prices or availability have not been reverified.

Do not show private data from another account when users log out and log in with a different account.

---

## 11. Best Three Product Recommendations

### 11.1 Recommendation behavior

Display up to three products that best match the user's requirements.

Use the existing recommendation or ranking logic wherever possible. Do not replace a working algorithm without justification.

Ranking criteria may include:

- Budget compatibility.
- Match with required specifications.
- Suitability for the intended use.
- Actual available ratings and review counts.
- Price-to-feature value.
- Brand preferences, when provided.
- Availability of reliable product information.

### 11.2 Ranking rules

1. Apply mandatory user constraints first, such as a maximum budget, when price data is reliable.
2. Rank eligible products using the existing algorithm.
3. Use actual product data to calculate any new ranking features.
4. Handle missing data explicitly instead of assigning invented ratings.
5. Return up to three suitable recommendations.
6. Return fewer than three when fewer suitable products exist.
7. Do not duplicate the same product in the recommendation list.
8. Explain each recommendation using available product evidence.
9. Do not present AI-generated reasoning as verified product specifications.
10. Do not silently remove relevant products merely because some optional fields are unavailable.

### 11.3 Recommendation response

The following is a logical response structure:

```json
{
  "query": "Laptop under 60000 for programming",
  "recommendations": [
    {
      "product_id": "verified-product-id",
      "rank": 1,
      "reason": "Matches the budget and available programming-related requirements"
    }
  ],
  "total_recommendations": 1
}
```

The example contains a structural illustration only, not an actual recommendation.

### 11.4 Results presentation

- Show a clearly labeled "Top Recommendations" section.
- Display up to three ranked product cards.
- Explain why each product was selected.
- Show only evidence supported by actual data.
- If the application displays additional results, separate them from the top recommendations.
- Preserve the existing feature that lets users select up to five products for comparison.

**Important distinction:** The application may recommend three products while allowing the user to select up to five products from the available search results for a comparison.

---

## 12. Product Comparison

Preserve and improve the existing product comparison feature.

### 12.1 Requirements

- Allow users to select up to five products.
- Prevent duplicate product selections.
- Show a clear selected-product count.
- Disable further selection when the maximum is reached.
- Allow users to remove products from the selection.
- Compare available information in a readable table or responsive layout.
- Include price, ratings, specifications, brand, and marketplace when available.
- Clearly identify missing information.
- Provide access to the original product listings.
- Ensure comparison results are based on actual product data.
- Allow authenticated users to revisit saved comparison results.

### 12.2 Comparison interface

On desktop, use a comparison table with products as columns and attributes as rows.

On mobile, use horizontally scrollable comparisons or responsive product panels that remain usable on small screens.

Do not fabricate specifications to fill blank cells.

### 12.3 Comparison history

Where supported by the existing architecture, persist:

- The authenticated user identifier.
- Selected product identifiers.
- Relevant product snapshots.
- Comparison timestamp.
- Original search identifier, if applicable.

The comparison must remain understandable if live product data later changes.

---

## 13. Search Speed and Loading Experience

Improve perceived speed without compromising product accuracy or recommendation quality.

### 13.1 Immediate loading feedback

Immediately after a valid search submission:

- Display a loading indicator.
- Disable duplicate submission while the same request is pending.
- Show a message such as "Finding the best products for you..."
- Display skeleton product cards when useful.
- Keep navigation and unrelated interface elements responsive.

Skeleton cards are placeholders only. They must not be represented as actual product results.

### 13.2 Backend performance

Use the following techniques only where appropriate:

- Asynchronous FastAPI endpoints for I/O-bound operations.
- Parallel retrieval from independent product sources when permitted.
- Timeouts for external services.
- Caching of eligible, recently retrieved results.
- Request deduplication.
- Pagination or bounded history retrieval.
- Reuse of validated data instead of repeating AI calls unnecessarily.
- Efficient MongoDB indexes.
- Incremental result delivery only if the existing architecture supports it and it provides a meaningful benefit.

Avoid blocking the FastAPI event loop with synchronous operations inside asynchronous request handlers.

### 13.3 Result rendering

- Render valid results as soon as the backend has sufficient verified data.
- Avoid waiting for unrelated optional tasks to finish.
- Keep the frontend interactive during long requests.
- Prevent stale requests from overwriting newer search results.
- Cancel obsolete frontend requests when appropriate.
- Do not display stale cached results as fresh without indicating their status.
- Do not bypass validation or invent products to make the application appear faster.

### 13.4 Error and retry behavior

Handle:

- External API failure.
- AI provider failure.
- Rate limits.
- Request timeouts.
- Empty search results.
- Invalid product data.
- Network disconnection.
- Database persistence failure.

Display clear messages and a retry option when appropriate. Keep saved results accessible even if a new search fails.

---

## 14. User Interface and User Experience

### 14.1 Main pages

| Page | Purpose |
|---|---|
| Home | Project introduction and product search |
| Search Results | Top recommendations and other available results |
| Wishlist | Saved products |
| Search History | Previous searches |
| Comparison | Compare up to five products |
| Login | Existing authentication flow |
| Sign Up | Existing registration flow |
| Profile | Account details and existing account actions |

Only create pages that do not already exist. Reuse existing routes and components wherever possible.

### 14.2 Visual design

- Maintain the project's existing branding.
- Use a consistent color palette.
- Use readable typography and spacing.
- Apply subtle borders, shadows, and rounded corners.
- Provide clear buttons and input labels.
- Use consistent iconography.
- Avoid excessive animation and unnecessary visual effects.
- Maintain contrast and readable text sizes.
- Provide a clear visual hierarchy for recommendations and comparison results.

### 14.3 Responsive design

Verify the interface at representative mobile, tablet, and desktop widths.

The layout must support:

- Mobile navigation menus.
- Single-column product cards on narrow screens.
- Responsive multi-column product grids.
- Scrollable comparison tables or mobile comparison panels.
- Inputs and buttons that remain usable on touch devices.
- No accidental horizontal overflow outside intentionally scrollable regions.

### 14.4 Accessibility

- Use semantic HTML elements.
- Support keyboard navigation.
- Provide visible focus indicators.
- Include accessible labels for icon-only controls.
- Use appropriate heading hierarchy.
- Associate form labels with their inputs.
- Announce important loading and error status changes where appropriate.
- Do not use color alone to communicate status.
- Respect reduced-motion preferences when animations are present.

---

## 15. MongoDB Data Design

Inspect the current database models before creating new collections.

Potential logical collections include:

### Users

Store existing user account information and authentication-related fields according to the current implementation.

### Wishlist

Store authenticated-user/product relationships and the relevant saved product snapshot.

### Search History

Store user-specific search queries, criteria, timestamps, and sufficient result information for restoration.

### Comparison History

Store selected product identifiers and the relevant comparison snapshot, if comparison history is not already represented in search history.

### Optional product cache

Store eligible product retrieval results only when caching is permitted and useful.

### Database requirements

- Index frequently queried fields.
- Index user ownership fields.
- Enforce uniqueness for wishlist entries using the actual user and product identifiers.
- Use appropriate MongoDB document identifiers.
- Store timestamps consistently.
- Avoid unnecessary duplication of product data.
- Use safe update and deletion operations.
- Validate stored and retrieved data.
- Apply database changes through a safe, documented migration or migration script if needed.

Do not create a collection merely because it appears in this specification. Reuse equivalent existing collections.

---

## 16. Suggested Backend API Organization

The following is a reference structure, not a requirement to rename existing routes.

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/search` | Existing policy | Search for products |
| GET | `/api/search-history` | Required | List saved searches |
| GET | `/api/search-history/{search_id}` | Required | Retrieve a saved search |
| GET | `/api/wishlist` | Required | Retrieve wishlist |
| POST | `/api/wishlist` | Required | Add a product |
| DELETE | `/api/wishlist/{product_id}` | Required | Remove a product |
| POST | `/api/compare` | Existing policy | Compare selected products |
| GET | `/api/comparison-history` | Required | List saved comparisons |
| GET | `/api/comparison-history/{comparison_id}` | Required | Retrieve a saved comparison |
| GET | Existing profile endpoint | Required | Retrieve user profile |

### API implementation requirements

- Use Pydantic request and response models.
- Return consistent JSON structures.
- Use appropriate HTTP status codes.
- Validate request payloads.
- Protect private routes with the existing authentication mechanism.
- Apply ownership checks to every private resource.
- Avoid returning internal exceptions, credentials, or stack traces to clients.
- Use existing error-handling conventions.
- Keep external provider credentials on the server.
- Document any new endpoints using FastAPI's generated OpenAPI documentation.

---

## 17. Security and Privacy

Security is required for all authentication, wishlist, and history functionality.

- Never hardcode API keys or database credentials.
- Keep secrets in environment variables or the existing secret-management configuration.
- Do not commit `.env` files containing credentials.
- Provide a safe `.env.example` with placeholder values.
- Hash passwords securely if authentication is implemented.
- Verify authentication tokens on protected endpoints.
- Apply authorization checks to user-owned data.
- Validate all incoming requests.
- Avoid exposing private information in logs.
- Restrict cross-origin requests to the intended frontend origins.
- Use safe external links.
- Apply reasonable request limits to expensive AI and scraping endpoints.
- Do not log access tokens or sensitive user data.
- Follow data-retention and deletion requirements applicable to the project.

A frontend-only check is never sufficient to protect a user's wishlist or search history.

---

## 18. Environment Configuration

Preserve existing environment variables wherever possible.

A possible configuration, depending on the current repository, is:

```env
# Backend
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=ai_shopping_assistant
JWT_SECRET=replace_with_a_secure_random_secret

# External integrations
GEMINI_API_KEY=your_ai_provider_key
SCRAPERAPI_KEY=your_product_retrieval_key

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

These are illustrative names. Use the actual names expected by the existing application and AI provider.

### Configuration rules

- Never expose private keys through `VITE_` environment variables.
- Never hardcode credentials in source files.
- Do not rotate or rename existing secrets without a reason.
- Use a separate, secure JWT secret for production.
- Validate required environment variables during backend startup.
- Explain any new required configuration in the final report.
- If an integration is not configured, show a useful configuration error rather than fake results.

---

## 19. Suggested Project Structure

This is a reference structure for a new installation. For an existing project, preserve the actual directory layout unless a change is justified.

```text
ai-shopping-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── SearchHistory.jsx
│   │   │   ├── Comparison.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database/
│   │   ├── auth/
│   │   └── utils/
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── spec.md
```

Do not create empty duplicate components or folders if the existing project already has equivalent implementations.

---

## 20. Implementation Workflow for Antigravity / Codex

### Phase 1 — Inspect the existing repository

Before changing code:

1. Read the repository structure.
2. Inspect the frontend `package.json`.
3. Inspect the backend dependencies.
4. Identify existing routes and page components.
5. Identify authentication and token-handling logic.
6. Inspect MongoDB connection and data models.
7. Inspect product search and AI integrations.
8. Inspect the product retrieval service and its response structure.
9. Identify the existing ranking and comparison logic.
10. Identify existing wishlist, history, and loading functionality.
11. Review the current styling and responsive design.
12. Record implemented, incomplete, and missing features.

Create a short implementation checklist based on these findings.

### Phase 2 — Plan minimal changes

- Reuse existing components and API clients.
- Preserve existing working functionality.
- Avoid replacing dependencies without a clear reason.
- Avoid duplicate API endpoints and database collections.
- Plan safe schema changes only when necessary.
- Identify required environment configuration.
- Establish the existing project's test and build commands.

### Phase 3 — Implement core functionality

Recommended implementation order:

1. Fix the navigation bar and routing.
2. Complete product card data rendering.
3. Implement wishlist persistence.
4. Restore authenticated-user search history.
5. Complete the best-three recommendation display.
6. Preserve comparison of up to five products.
7. Improve loading, error, and empty states.
8. Polish responsive design and accessibility.
9. Add or update tests.
10. Verify the complete application.

The order may change to respect existing dependencies.

### Phase 4 — Validate

After implementation:

- Start the backend.
- Start the frontend.
- Verify the configured MongoDB connection.
- Test login and logout.
- Test search and product retrieval.
- Test wishlist operations.
- Test search-history restoration.
- Test comparison selection and persistence.
- Test empty and error states.
- Run available tests and production builds.
- Fix regressions caused by the changes.

### Phase 5 — Final report

Provide an accurate implementation report containing:

- Features added.
- Existing features preserved.
- Features fixed.
- Files created or modified.
- Database changes and migration steps.
- Environment variables required.
- Frontend and backend startup commands.
- Tests actually run and their results.
- Known limitations and external API dependencies.

Never claim a test passed unless it was actually executed successfully.

---

## 21. Testing and Acceptance Criteria

### Navigation

- [ ] Logo navigates to the home page.
- [ ] All supported navigation links work.
- [ ] Wishlist is accessible from the navbar.
- [ ] Login and account menus reflect authentication state.
- [ ] Mobile navigation works.
- [ ] Hover, focus, and active states are correct.
- [ ] Existing themes remain supported.

### Wishlist

- [ ] Products can be added to the wishlist.
- [ ] Products can be removed.
- [ ] Duplicate entries are prevented.
- [ ] Saved items remain after refreshing the page.
- [ ] Authenticated users see their own saved products.
- [ ] Users cannot access another user's wishlist.
- [ ] Empty state displays when there are no saved products.
- [ ] Failed operations do not falsely update persistent state.

### Search history

- [ ] Authenticated searches are persisted.
- [ ] Previous searches appear after login.
- [ ] Saved results can be reopened.
- [ ] Reopening history does not unnecessarily repeat the original search.
- [ ] Users see an empty state when history is absent.
- [ ] Search history is isolated by user.
- [ ] Outdated product data is labeled appropriately.

### Product cards

- [ ] Actual product images display correctly.
- [ ] Available prices and ratings are shown.
- [ ] Missing data is handled gracefully.
- [ ] Marketplace names match the real source.
- [ ] Original product URLs work.
- [ ] Wishlist controls work.
- [ ] Layout remains responsive.
- [ ] No fabricated product details are displayed.

### Recommendations and comparison

- [ ] Up to three top recommendations are displayed.
- [ ] Ranking uses existing logic and supported product evidence.
- [ ] Fewer than three products are shown when fewer qualify.
- [ ] Recommendation explanations are evidence-based.
- [ ] Up to five products can be selected for comparison.
- [ ] Duplicate selections are prevented.
- [ ] Comparison data reflects actual available information.
- [ ] Saved comparisons can be restored when supported.

### Performance and errors

- [ ] Loading feedback appears immediately after submission.
- [ ] Skeleton cards do not appear as real results.
- [ ] Duplicate submissions are handled.
- [ ] Slow requests do not unnecessarily block the interface.
- [ ] API errors show useful messages.
- [ ] Retry works where appropriate.
- [ ] Empty search results are handled correctly.
- [ ] Invalid responses do not generate fake products.

### Security

- [ ] Protected endpoints require valid authentication.
- [ ] Resource ownership is verified by the backend.
- [ ] Credentials are not committed or exposed to the browser.
- [ ] User data is isolated.
- [ ] External links are handled safely.

### Build and regression testing

- [ ] Frontend development server starts successfully.
- [ ] Backend starts successfully.
- [ ] Existing tests pass, or unrelated existing failures are documented.
- [ ] New tests cover changed functionality.
- [ ] Frontend production build succeeds.
- [ ] No new broken imports or routes remain.
- [ ] Browser and backend errors introduced by changes are resolved.

---

## 22. Performance and Quality Goals

These are proposed targets, not claims about current application performance.

- Render the search loading state immediately after submission.
- Avoid unnecessary duplicate requests.
- Keep navigation and unrelated interface interactions responsive during searches.
- Use bounded history queries and appropriate database indexes.
- Maintain a usable experience on mobile devices and slower connections.
- Avoid rendering large histories or excessive product cards at once.
- Validate all external product data before displaying it.
- Preserve recommendation quality while improving perceived speed.

Measure actual response times before claiming performance improvements.

---

## 23. Scope and Limitations

### Included in scope

- Responsive navigation.
- Existing authentication integration.
- Wishlist functionality.
- Persistent search history.
- Best-three recommendations.
- Product cards with genuine available data.
- Comparison of up to five products.
- Loading, error, and empty states.
- MongoDB persistence.
- API validation and authorization.
- Testing and implementation documentation.

### External dependencies

The following depend on available providers and configuration:

- Product availability and freshness.
- Marketplace product images and URLs.
- Ratings, review counts, and detailed specifications.
- AI recommendation quality.
- API rate limits and request latency.
- Product retrieval provider availability.

The application must clearly handle unavailable data and must never replace missing information with fabricated values.

---

## 24. Final Instructions for the Coding Agent

You are working on the AI Shopping & Product Comparison Assistant.

**For an existing repository:**

1. Inspect the entire codebase before modifying files.
2. Understand the frontend, FastAPI backend, MongoDB integration, authentication, product retrieval, and AI recommendation logic.
3. Identify existing functionality and missing requirements.
4. Make changes directly in the repository.
5. Preserve all working features and existing project conventions.
6. Reuse current dependencies, components, endpoints, and data models.
7. Implement real wishlist and history persistence.
8. Ensure secure, authenticated access to private user data.
9. Show up to three evidence-based recommendations while preserving comparison of up to five products.
10. Improve loading feedback without fabricating products or weakening validation.
11. Test all modified functionality and fix regressions.
12. Update documentation and provide the actual final implementation report.

**For a new repository:**

Use this specification as the implementation blueprint. Build the application using React + Vite, FastAPI, and MongoDB. Configure the existing or selected AI and product retrieval providers through backend environment variables.

**Do not stop after generating a plan, mockup, or sample code. Complete the implementation, run the available verification commands, and report any remaining blockers honestly.**

---

**End of specification — Version 1.0.0**
