# ShopMind AI — Shopping, Made Smarter with AI

An AI-assisted shopping application engineered for intelligent e-commerce product discovery and comparison. It demonstrates natural-language product discovery, constraint extraction, user-controlled comparison (up to 5 products), dynamic recommendation ranking (top 3 highlights), verified marketplace checkout routing (Amazon, Flipkart), and a multi-tiered feedback collection pipeline.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system tokens
- **Design Language**: Stripe / Linear aesthetic with Inter typography and subtle elevations
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)
- **State Management**: React Context (`CompareContext`, `SavedContext`, `AuthContext`, `SearchHistoryContext`)
- **Persistence**: `localStorage` (saved products, compare queues, mock authentication, feedback records)

---

## 🌟 Key Features

1. **Natural-Language Discovery**
   - Submit real-world search prompts (e.g., *"Laptop under ₹60,000 for coding with 16GB RAM"*).
   - Clickable example prompts that allow editing before searching.
   - Simulated AI requirement breakdown banner showing parsed Budget, Category, Purpose, and Key Specifications.

2. **Comparison Workflow (2 to 5 Products)**
   - Strict limit of 5 products with live counter (*"3 of 5 products selected"*).
   - Floating comparison dock across all pages with remove triggers and clear action.
   - Enforces a minimum of 2 products before comparison can occur.

3. **Top 3 Recommendations Engine**
   - When 5 products are selected: Ranks all 5, highlights top 3, displays remaining 2 under *"Other Compared Products"*.
   - When 4 products are selected: Ranks all 4, highlights top 3, displays remaining 1 under *"Other Compared Products"*.
   - When 3 products are selected: Ranks those 3.
   - When 2 products are selected: Ranks only those 2.
   - Never adds unselected items or invents a 3rd recommendation when $< 3$ are chosen.
   - Displays **#1 Best Match** badge and transparent score breakdown.

4. **Multi-Tiered Feedback System**
   - **In-Search Feedback**: *"Did we understand what you were looking for?"* with expandable correction input.
   - **Product Card Feedback**: Thumbs up/down sentiment tracking that prevents duplicate submission per session.
   - **General Feedback Page (`/feedback`)**: Category dropdown, accessible 5-star rating control, message with character counter, optional email, and session history display.

5. **Saved Products & Account Profile**
   - Bookmark any product with the heart icon; view and manage in `/saved`.
   - Mock Login & Sign Up with client-side validation and *"Auto-fill Demo"* button.
   - Profile overview displaying saved count, comparison count, and recent search history with one-click re-run.

6. **Fully Responsive Mobile-First Design**
   - Tested at 320px, 375px, 768px, 1024px, 1440px.
   - Mobile hamburger navigation drawer.
   - Tabular comparison matrix transforms to stacked spec cards on mobile viewports.

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── common/          # Reusable UI badges, rating stars, alert banners
│   ├── layout/          # Navbar, mobile drawer, footer
│   ├── search/          # NaturalLanguageSearchBar, ExamplePrompts, QueryInterpretationBadge
│   ├── products/        # ProductCard, ProductGrid
│   ├── comparison/      # ComparisonBar dock, TopRecommendations, ComparisonMatrix
│   └── feedback/        # SearchFeedback, ProductFeedbackWidget, StarRatingInput
├── context/             # CompareContext, SavedContext, AuthContext, SearchHistoryContext
├── data/                # Mock catalog (Laptops, Phones, Headphones, Monitors)
├── pages/               # Home, Search, Explore, Details, Compare, Feedback, Saved, Auth, Account
├── types/               # TypeScript models for Products, Feedback, and Users
└── utils/               # Formatters, Search & NLP parsing, Multi-factor ranking engine
```

---

## 🎓 Academic Presentation Notes

- This project is completely client-side and requires zero external API keys or subscription services.
- The models in `src/types/` are structured to directly mirror Pydantic schemas for future integration with a Python FastAPI backend and MongoDB database.
