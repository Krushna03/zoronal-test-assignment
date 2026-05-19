# Review & Rate — MERN Stack Application

A full-stack company review platform built with the MERN stack (MongoDB, Express, React, Node) using **TypeScript** on both the backend and the frontend. Users can browse companies, filter by city, sort the list, view details, and submit reviews with star ratings. The aggregate company rating is computed from all reviews and displayed prominently.

The UI follows the provided Figma design (purple/violet brand, "Review&RATE" logo, card-based listings, dark "Detail Review" CTAs, and a clean review thread with avatars and star ratings).

---

## Tech Stack

**Backend**

- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- CORS, dotenv
- `ts-node` + `nodemon` for development

**Frontend**

- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com/) primitives (Button, Input, Textarea, Label, Select, Dialog, Card, Avatar) on top of Radix UI
- `lucide-react` icons
- React Router v6
- Axios

---

## Project Structure

```
test-2/
├── backend/
│   ├── src/
│   │   ├── config/db.ts                    # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── companyController.ts        # List, get, create + aggregate avgRating
│   │   │   └── reviewController.ts         # List/create reviews, like
│   │   ├── middleware/errorHandler.ts      # Central error handling + ApiError
│   │   ├── models/
│   │   │   ├── Company.ts
│   │   │   └── Review.ts
│   │   ├── routes/
│   │   │   ├── companyRoutes.ts
│   │   │   └── reviewRoutes.ts
│   │   ├── utils/
│   │   │   ├── asyncHandler.ts
│   │   │   └── seed.ts                     # Demo data seeder
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api/                            # axios + typed API clients
    │   ├── components/                     # Navbar, StarRating, CompanyCard, ReviewCard, Forms
    │   │   └── ui/                         # shadcn primitives: button, input, textarea, label, select, dialog, card, avatar
    │   ├── lib/utils.ts                    # cn() helper (clsx + tailwind-merge)
    │   ├── pages/                          # HomePage, CompanyDetailPage
    │   ├── types/                          # shared TS types
    │   ├── utils/format.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` _or_ a MongoDB Atlas connection string

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env       # (Windows) or: cp .env.example .env
# edit .env if needed
npm run seed                 # (optional) loads demo companies + reviews
npm run dev                  # starts the API at http://localhost:5000
```

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev                  # opens http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so no additional config is needed.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Companies

| Method | Endpoint            | Description                                                                                        |
| ------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/companies`        | List companies. Query: `search`, `city`, `sort=name\|rating\|newest`. Returns `avgRating` + `reviewCount` for each. |
| GET    | `/companies/:id`    | Get a single company (with aggregate `avgRating`, `reviewCount`).                                  |
| POST   | `/companies`        | Create a company. Body: `{ name, address, city, foundedOn, description?, logoText?, logoBgColor? }` |

### Reviews

| Method | Endpoint                                | Description                                                                                |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------ |
| GET    | `/companies/:companyId/reviews`         | List reviews for a company. Query: `sort=newest\|oldest\|rating\|relevance`. Includes `avgRating`. |
| POST   | `/companies/:companyId/reviews`         | Create a review. Body: `{ fullName, subject, reviewText, rating (1-5), avatarUrl? }`       |
| POST   | `/reviews/:id/like`                     | Increment the like counter on a review.                                                    |

### Health

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | Health check ping |

---

## Features Implemented

### Add Company
- Modal form launched via the **+ Add Company** button.
- Validates name, address, city, founded date; supports a logo letter + colour swatch.

### Company Listing
- Cards show logo, name, address, average rating (stars + numeric), review count, founded date, and a **Detail Review** CTA.
- **City filter** (chip input + "Find Company" button).
- **Search** by name / address / city (case-insensitive regex).
- **Sort** by name, rating, or newest.

### Add Review
- Modal launched from the company detail page via **+ Add Review**.
- Interactive star picker (1–5), required full name / subject / review text.

### Review Listing
- Shows reviewer name, date+time, rating, subject, and body.
- **Average rating** computed server-side and displayed above the review list.
- **Sort** by newest, oldest, highest rated, or most relevant (likes weighted).
- **Like** and **Share** interactions on each review (share uses Web Share API with clipboard fallback).

---

## Code Quality Notes

- Strict TypeScript on both ends (`"strict": true`) with shared types in `frontend/src/types`.
- Layered backend: `routes → controllers → models`, with a central `errorHandler` and an `asyncHandler` wrapper to avoid try/catch boilerplate.
- Typed Axios clients (`frontend/src/api/*.ts`) provide a clean SDK for components.
- Tailwind component classes (`btn-primary`, `card`, `input`, `label`) keep markup uncluttered and consistent with the Figma styles.
- Aggregations (`$lookup`, `$avg`) are done in MongoDB, not in JS, so listing performance scales with the data.

---

## Environment Variables

| Variable        | Default                                        | Description                       |
| --------------- | ---------------------------------------------- | --------------------------------- |
| `PORT`          | `5000`                                         | Express port                      |
| `MONGO_URI`     | `mongodb://127.0.0.1:27017/review_rate`        | Mongo connection string           |
| `CLIENT_ORIGIN` | `http://localhost:5173`                        | Allowed CORS origin for the SPA   |

For the frontend, you can optionally set `VITE_API_URL` (e.g. `http://localhost:5000/api`) if you don't want to use the Vite proxy.
