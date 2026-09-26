<<<<<<< HEAD
[README(1).md](https://github.com/user-attachments/files/32615771/README.1.md)
=======
>>>>>>> 62b983b (changes is readme and screenshots for it)
# FairTrip 🌍

<p align="center">
  <strong>Travel smarter. Eat better. Pay fairly.</strong><br />
  A location-aware travel, food, transport and visual-discovery platform built around one unified experience.
</p>

<p align="center">
  <img src="docs/screenshots/explore-home.png" alt="FairTrip Explore Home" width="100%" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## ✨ Overview

**FairTrip** is a smart travel-discovery platform designed to combine travel planning, local discovery, food discovery, public transport and image-based assistance in a single product.

Instead of building separate applications for destinations, food, maps and visual search, FairTrip connects these capabilities through a shared location, preference and recommendation layer.

### Core idea

```text
                ┌────────────────────┐
                │      FAIRTRIP      │
                └─────────┬──────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
     Explore             Food               Scan
       │                  │                  │
   Places + Map      Taste + Budget      Image + OCR
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                      Transport
                          │
                    Routes + Stops
                          │
                    Recommendation
                          │
                    Personalization
```

---

## 🎯 What FairTrip Solves

FairTrip is built around a simple question:

> **“What should I do, eat or take next from where I am, within my preferences and budget?”**

The system can use:

- 📍 Current location or searched starting point
- 💰 Budget
- 🍜 Food preferences
- 🕐 Time / meal context
- 🚶 Distance and walking effort
- 🚌 Transport availability
- 📷 Images, menus and visual input
- 🧠 AI-assisted interpretation

---

## 🚀 Features

| Module | What it does |
|---|---|
| **Explore** | Discover nearby places, attractions and travel options |
| **Location** | Use current location or search a city / landmark |
| **Map** | Show places, routes, markers and transport stops |
| **Food** | Search dishes and discover food based on taste and budget |
| **Personalization** | Store budget, taste, dietary and time preferences |
| **Scan** | Upload or capture images for visual understanding |
| **OCR / Menu** | Extract dishes and prices from restaurant menus |
| **Transport** | Find nearby stops, routes and alternatives |
| **Recommendations** | Combine multiple signals before presenting options |
| **Accounts** | Authentication, saved places, history and preferences |

---

## 🖥️ Screenshots

### Explore / Home

<p align="center">
  <img src="docs/screenshots/explore-home.png" alt="Explore home page" width="100%" />
</p>

The home experience focuses on travel discovery with a large hero, quick personalization, starting point and nearby discovery.

### Location + Map

<p align="center">
  <img src="docs/screenshots/location-map.png" alt="Location and map interface" width="100%" />
</p>

The starting-point interface allows the user to use their current location or search for another landmark/city before discovering nearby places.

### Food Discovery

<p align="center">
  <img src="docs/screenshots/food-discovery.png" alt="Food discovery page" width="100%" />
</p>

Food recommendations can consider taste, eating time, budget, dietary requirements and local context.

### Scan Processing

<p align="center">
  <img src="docs/screenshots/scan-processing.png" alt="Scan processing interface" width="100%" />
</p>

The scan workflow can show progressive states such as uploading, analyzing, identifying and preparing a result.

### Scan Upload

<p align="center">
  <img src="docs/screenshots/scan-upload.png" alt="Scan upload interface" width="100%" />
</p>

The user can drop an image or choose an image from the device and select the type of object they want FairTrip to understand.

### FairTrip Intelligence

<p align="center">
  <img src="docs/screenshots/scan-intelligence.png" alt="FairTrip intelligence interface" width="100%" />
</p>

The scan experience is intended to evolve into a broader visual assistant for food, clothes, products, tools, objects and unknown items.

---

## 🧩 Product Pages

### 1. Explore

```text
Navbar
  ↓
Hero
  ↓
Quick discovery / personalization
  ↓
Starting point
  ↓
Interactive map
  ↓
Nearby places
  ↓
Popular searches
  ↓
Travel features
  ↓
Footer
```

### 2. Food

```text
Navbar
  ↓
Food Hero
  ↓
Food Search
  ↓
Popular Searches
  ↓
Preferences
  ↓
Recommendations
  ↓
Restaurant / dish details
```

### 3. Scan

```text
Navbar
  ↓
FairTrip Intelligence
  ↓
Category selection
  ↓
Upload / Camera
  ↓
Processing state
  ↓
AI result
  ↓
Related information
```

### 4. Transport

```text
Navbar
  ↓
Start / Destination
  ↓
Nearby stops
  ↓
Route calculation
  ↓
Direct + alternative routes
  ↓
Map
  ↓
Walking + travel details
```

### 5. Account

```text
Profile
  ├── Preferences
  ├── Saved places
  ├── Search history
  ├── Scan history
  └── Settings
```

---

# 🏗️ Architecture

FairTrip should use a modular architecture so that map providers, AI providers, food data providers or transport sources can be replaced without rewriting the frontend.

## High-level architecture

```mermaid
flowchart TB
    U[User] --> W[Next.js Web App]
    W --> API[NestJS API]

    API --> AUTH[Auth Module]
    API --> LOC[Location Module]
    API --> FOOD[Food Module]
    API --> SCAN[Scan Module]
    API --> TRANS[Transport Module]
    API --> REC[Recommendation Module]

    AUTH --> PG[(PostgreSQL)]
    LOC --> CACHE[(Redis)]
    FOOD --> CACHE
    TRANS --> CACHE
    REC --> PG

    LOC --> MAPS[Map / Geocoding Providers]
    TRANS --> TRANSAPI[Transport Providers]
    FOOD --> FOODAPI[Food / Places Providers]
    SCAN --> OBJ[Object Storage]
    SCAN --> JOB[Background Worker]
    JOB --> OCR[OCR / Vision / AI]
    JOB --> PG
    JOB --> OBJ
```

---

## 🏛️ Layered Backend Architecture

```text
┌───────────────────────────────────────────────┐
│                 Presentation                  │
│            Next.js + React + Tailwind         │
└───────────────────────┬───────────────────────┘
                        │
┌───────────────────────▼───────────────────────┐
│                    API Layer                   │
│          NestJS Controllers + DTOs             │
└───────────────────────┬───────────────────────┘
                        │
┌───────────────────────▼───────────────────────┐
│                  Domain Layer                  │
│ Auth / Location / Food / Scan / Transport     │
└───────────────────────┬───────────────────────┘
                        │
┌───────────────────────▼───────────────────────┐
│                Service / Adapter Layer         │
│ Maps / AI / OCR / Storage / Transport APIs    │
└───────────────────────┬───────────────────────┘
                        │
┌───────────────────────▼───────────────────────┐
│                Infrastructure                  │
│ PostgreSQL / Redis / Object Storage / Worker   │
└───────────────────────────────────────────────┘
```

---

# 🧱 Project Structure

A GitHub repository can be organized like this:

```text
fairtrip/
│
├── apps/
│   ├── web/                         # Next.js frontend
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   ├── explore/
│   │   │   ├── food/
│   │   │   ├── scan/
│   │   │   ├── transport/
│   │   │   ├── account/
│   │   │   ├── api/                 # Frontend-only route handlers if needed
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── hero/
│   │   │   ├── map/
│   │   │   ├── food/
│   │   │   ├── scan/
│   │   │   ├── transport/
│   │   │   └── ui/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── public/
│   │   └── styles/
│   │
│   └── api/                         # NestJS backend
│       └── src/
│           ├── auth/
│           ├── users/
│           ├── location/
│           ├── places/
│           ├── food/
│           ├── scan/
│           ├── transport/
│           ├── recommendations/
│           ├── ai/
│           ├── storage/
│           ├── cache/
│           ├── common/
│           ├── app.module.ts
│           └── main.ts
│
├── packages/
│   ├── ui/                           # Shared UI components
│   ├── types/                        # Shared TypeScript types
│   └── config/                       # Shared eslint / tsconfig / constants
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docs/
│   ├── screenshots/
│   ├── architecture.md
│   └── api.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

> If you are building a smaller college/hackathon version first, you can keep `web`, `api` and `prisma` at the repository root and move to a monorepo later.

---

# 🛠️ Tech Stack

## Frontend

- **Next.js** – App Router and server/client rendering
- **React** – UI composition
- **TypeScript** – type safety
- **Tailwind CSS** – styling and responsive layout
- **Framer Motion** – page and component motion
- **MapLibre / Map provider SDK** – map interaction

## Backend

- **NestJS** – modular API and service layer
- **TypeScript** – shared language with the frontend
- **Prisma** – database access
- **PostgreSQL** – primary relational database
- **Redis** – caching, rate limiting and short-lived state

## AI / Vision

- OCR service
- Vision / image classification
- AI interpretation layer
- Recommendation engine

## Infrastructure

- Object storage for images
- Background worker for long-running scan jobs
- Docker for local development
- CDN / reverse proxy for production

---

# 🗺️ Map & Location Architecture

The map layer should be provider-independent.

```text
             LocationService
                    │
          ┌─────────┴─────────┐
          │                   │
     GeocodingAdapter    RoutingAdapter
          │                   │
      ┌───┴────┐          ┌───┴────┐
      │        │          │        │
   Provider A Provider B Provider A Provider B
```

Example interface:

```ts
export interface GeocodingProvider {
  search(query: string): Promise<LocationResult[]>;
  reverse(lat: number, lng: number): Promise<LocationResult>;
}
```

This prevents your controllers from being tightly coupled to one map provider.

---

# 🍜 Food Recommendation Architecture

Food recommendations should not live inside React components.

```text
Location
   +
Taste
   +
Budget
   +
Meal Time
   +
Dietary Preference
   +
Distance
        │
        ▼
Recommendation Service
        │
        ▼
Ranking / Filtering
        │
        ▼
Recommended Foods
```

A simplified scoring model could look like:

```text
score =
    taste_match
  + budget_match
  + distance_score
  + time_match
  + dietary_match
```

The exact ranking logic should remain in the backend/domain layer so it can evolve without redesigning the frontend.

---

# 📷 Scan / AI Architecture

The scan module should be asynchronous because OCR and vision processing can take longer than normal API requests.

```mermaid
sequenceDiagram
    participant User
    participant Web as Next.js
    participant API as NestJS
    participant Store as Object Storage
    participant Queue as Worker / Queue
    participant AI as OCR / Vision / AI
    participant DB as PostgreSQL

    User->>Web: Select / capture image
    Web->>API: POST /api/v1/scan
    API->>Store: Upload image
    API->>Queue: Create scan job
    API-->>Web: Return scanId
    Queue->>AI: Analyze image
    AI-->>Queue: Structured result
    Queue->>DB: Save result
    Web->>API: GET /api/v1/scan/:id
    API-->>Web: Scan status + result
```

### Scan states

```text
UPLOADING
   ↓
QUEUED
   ↓
ANALYZING
   ↓
IDENTIFIED
   ↓
COMPLETED
```

Possible failure state:

```text
ANALYZING → FAILED → RETRY
```

---

# 🔎 OCR / Menu Understanding

For menus:

```text
Menu Image
    ↓
OCR
    ↓
Raw Text
    ↓
Parser
    ↓
Dish + Price + Category
    ↓
Food Recommendation
```

Example response:

```json
{
  "restaurant": "Example Restaurant",
  "items": [
    {
      "name": "Masala Dosa",
      "price": 120,
      "category": "South Indian"
    },
    {
      "name": "Paneer Tikka",
      "price": 220,
      "category": "Starter"
    }
  ]
}
```

---

# 🚌 Transport Architecture

Transport should support both direct and multi-modal routes.

```text
Current Location
      │
      ▼
Nearby Stop Search
      │
      ├── Walk
      ├── Bus
      ├── Train
      └── Metro
      │
      ▼
Route Engine
      │
      ├── Direct route
      ├── Fastest route
      ├── Fewer transfers
      └── Lowest walking
      │
      ▼
Route Results
```

The backend should normalize different transport providers into one internal format.

---

# 🗄️ Database Design

Core entities:

```text
User
 ├── UserPreference
 ├── SearchHistory
 ├── SavedPlace
 └── Scan
       └── ScanResult

Place
 ├── Category
 └── Location

Restaurant
 └── FoodItem

TransportStop
 └── Route
```

Suggested Prisma models:

```text
User
UserPreference
SavedPlace
SearchHistory
Scan
ScanResult
Place
Restaurant
FoodItem
TransportStop
TransportRoute
```

Keep external provider IDs alongside your internal IDs so records can be synchronized without making third-party IDs your primary key.

---

# ⚡ Redis Strategy

Redis can be used for data that is expensive or repeated:

```text
Nearby places
Popular searches
Geocoding results
Transport lookups
Rate limiting
Temporary scan state
```

Example request flow:

```text
GET /food/popular
       │
       ▼
     Redis
      / \
   HIT   MISS
    │      │
    │      ▼
    │   Database/API
    │      │
    │      ▼
    │   Save cache
    │      │
    └──────┘
       │
       ▼
    Response
```

---

# 🔐 Security

Security should be part of the architecture, not a final add-on.

### API

- DTO validation
- Global validation pipe
- Authentication guards
- Authorization checks
- Rate limiting
- CORS policy
- Security headers
- Request size limits
- Structured error responses

### Uploads

```text
File received
   ↓
MIME validation
   ↓
Extension validation
   ↓
Size validation
   ↓
Storage isolation
   ↓
AI processing
```

Never trust a browser-provided filename or MIME type by itself.

### Secrets

Never commit:

```text
DATABASE_URL
JWT_SECRET
AI_API_KEY
MAP_API_KEY
STORAGE_SECRET
```

Use `.env` locally and secret management in production.

---

# 🌐 API Design

Version the API from the beginning:

```text
/api/v1/auth
/api/v1/users
/api/v1/location
/api/v1/places
/api/v1/food
/api/v1/scan
/api/v1/transport
/api/v1/recommendations
```

### Example endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login |
| `POST` | `/api/v1/auth/register` | Register |
| `GET` | `/api/v1/location/nearby` | Nearby location data |
| `GET` | `/api/v1/places/nearby` | Nearby places |
| `GET` | `/api/v1/food/search?q=` | Search food |
| `GET` | `/api/v1/food/popular` | Popular food |
| `POST` | `/api/v1/scan` | Create scan |
| `GET` | `/api/v1/scan/:id` | Scan result/status |
| `GET` | `/api/v1/transport/nearby` | Nearby stops |
| `POST` | `/api/v1/transport/route` | Route search |
| `GET` | `/api/v1/recommendations` | Personalized recommendations |

---

# 📦 Local Development

## Prerequisites

Install:

- Node.js 20+
- pnpm
- PostgreSQL
- Redis
- Git
- Docker (recommended)

## Clone

```bash
git clone https://github.com/<your-username>/fairtrip.git
cd fairtrip
```

## Install

```bash
pnpm install
```

## Environment

```bash
cp .env.example .env
```

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fairtrip"
REDIS_URL="redis://localhost:6379"

JWT_SECRET="change-me"
JWT_REFRESH_SECRET="change-me-too"

MAP_API_KEY=""
AI_API_KEY=""

STORAGE_ENDPOINT=""
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
STORAGE_BUCKET="fairtrip"
```

## Database

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## Run web

```bash
pnpm --filter web dev
```

## Run API

```bash
pnpm --filter api start:dev
```

---

# 🐳 Docker Development

A local development stack can contain:

```text
Next.js
NestJS
PostgreSQL
Redis
Worker
```

Example:

```bash
docker compose up -d
```

Then run migrations:

```bash
pnpm prisma migrate dev
```

---

# 🧪 Testing

Recommended test layers:

```text
Unit Tests
   ↓
Integration Tests
   ↓
API Tests
   ↓
End-to-End Tests
```

Important cases to test:

- Login / registration
- Location permissions denied
- Invalid map search
- Food search with no result
- Budget filtering
- Scan upload failures
- OCR errors
- AI timeout
- Redis unavailable
- External API unavailable
- Transport route with no result

---

# 📈 Performance

The application should avoid calling external APIs unnecessarily.

### Search

Use debouncing:

```text
User types
  ↓
wait 300–500ms
  ↓
request
```

### Images

- Compress uploads
- Generate optimized variants
- Use CDN/object storage
- Lazy load large media

### API

- Cache repeated reads
- Paginate lists
- Use database indexes
- Move AI processing to workers

---

# 🔭 Future Roadmap

### Phase 1 — Core

- [ ] Explore page
- [ ] Location search
- [ ] Map
- [ ] Food discovery
- [ ] Authentication

### Phase 2 — Intelligence

- [ ] Scan
- [ ] OCR
- [ ] Food recognition
- [ ] AI recommendations

### Phase 3 — Mobility

- [ ] Nearby transport
- [ ] Route planning
- [ ] Multi-modal routes
- [ ] Real-time data where available

### Phase 4 — Personalization

- [ ] Saved trips
- [ ] User preferences
- [ ] Search history
- [ ] Personalized home feed

### Phase 5 — Platform

- [ ] Hotels
- [ ] Events
- [ ] Experiences
- [ ] Offline mode
- [ ] Voice search
- [ ] Multilingual support

---

# 🧠 Engineering Principles

### 1. Provider independence

Map, food, transport and AI providers should be replaceable through adapters.

### 2. Domain-first backend

Business rules belong in services/domain modules, not controllers or UI components.

### 3. Async for expensive work

OCR, vision and AI analysis should use background jobs.

### 4. Cache intentionally

Cache repeated external lookups while keeping cache invalidation explicit.

### 5. Validate at the boundary

Every API request and file upload should be validated before it reaches business logic.

### 6. Keep secrets server-side

The browser should never receive private provider keys.

---

# 🤝 Contributing

1. Create a branch:

```bash
git checkout -b feature/food-recommendations
```

2. Make your changes.
3. Run tests and linting.
4. Commit with a meaningful message.
5. Open a pull request.

Example commit:

```text
feat(food): add budget-aware food recommendations
```

---

# 📄 License

Add your selected license before publishing the repository.

---

<p align="center">
  Built with ❤️ for smarter, fairer local travel discovery.
</p>
