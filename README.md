# Social Hub

A modern, full-stack enterprise social media platform built with React, Express, and PostgreSQL. Connect with friends, share posts, chat in real-time, share stories, and conduct video calls.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## Key Features & Security Architecture

- 🔐 **HttpOnly Cookie Authentication** - Secure, XSS-mitigated auth flow using `HttpOnly`, `Secure`, and `SameSite=Strict` cookies (no access tokens in `localStorage`).
- 🏗️ **Feature-Based Architecture** - Domain-driven frontend structure (`src/features/`) for modular, isolated, and scalable development.
- 📝 **Posts & Media Feed** - Create, edit, like, bookmark, and comment on posts with image uploads.
- 💬 **Real-time Chat & WebRTC Calls** - One-on-one and group messaging with Socket.io & peer-to-peer WebRTC video calling.
- 👥 **Friends System & Profiles** - Send/accept friend requests, explore profiles, and view user photo galleries.
- 📖 **Temporary Stories** - Share stories that automatically expire after 24 hours (processed via BullMQ background workers).
- 🛡️ **Privacy & Security** - User blocking, private profiles, rate-limiting, Helmet headers, and input sanitization.
- 💳 **Subscriptions & Payments** - Stripe integration for checkout sessions and tier access.
- 🤖 **MCP (Model Context Protocol) Support** - Exposes tools, analytics, and moderation endpoints for AI agent integration.
- 🔔 **Notifications & Search** - Real-time activity notifications and global search across users & posts.
- 🎨 **Modern Glassmorphic UI & Dark Mode** - Modern responsive theme built with Tailwind CSS & Framer Motion.

---

## Tech Stack

### Frontend
- **Framework:** React 18.2 (Vite 5.0)
- **Architecture:** Feature-Based / Domain-Driven Architecture
- **Styling:** Tailwind CSS 4.1
- **State Management:** Redux Toolkit + React Query (TanStack Query v5)
- **Security:** HttpOnly Cookie Auth (`withCredentials: true`), XSS-safe input sanitization
- **Real-time & Signaling:** Socket.io Client 4.8 + Simple Peer (WebRTC)
- **Animations & Icons:** Framer Motion 12.23 + Lucide React

### Backend
- **Runtime:** Node.js (ES Modules) with Express 5.1
- **Database:** PostgreSQL with Prisma ORM 7.1
- **Authentication:** JWT + `cookie-parser` + bcryptjs
- **Real-time:** Socket.io 4.8 with cookie-handshake authentication
- **File Upload:** Multer + ImageKit
- **Payments:** Stripe
- **AI Protocol:** Model Context Protocol (`@modelcontextprotocol/sdk`)
- **Caching & Job Queue:** Upstash Redis + BullMQ (with Bull Board Admin GUI)

---

## Project Structure

```
social-hub/
├── backend/              # Express.js API Server
│   ├── src/
│   │   ├── config/      # Database, Redis, ImageKit, Stripe configs
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Cookie auth, rate limits, error handler
│   │   ├── repositories/# Data access layer
│   │   ├── routes/      # API v1 routes
│   │   ├── services/    # Business logic layer
│   │   ├── socket/      # Socket.io handlers & auth middleware
│   │   ├── queues/      # BullMQ background job queues
│   │   └── workers/     # Background processors (story cleanup)
│   ├── prisma/          # Database schema & migrations
│   └── index.js         # Server entry point
│
└── frontend/            # React Application (Vite)
    ├── src/
    │   ├── features/    # Domain-based feature modules
    │   │   ├── auth/          # Authentication pages & components
    │   │   ├── posts/         # Feed, post card, comments, modals
    │   │   ├── chat/          # Chat sidebar, messaging, video call
    │   │   ├── profile/       # User profile & cover update
    │   │   ├── friends/       # Friend requests & lists
    │   │   ├── stories/       # Story tray & creation modal
    │   │   ├── settings/      # Account & privacy settings
    │   │   ├── notifications/ # Notification feed
    │   │   ├── groups/        # Community groups & modals
    │   │   ├── search/        # Global search
    │   │   ├── marketplace/   # Local marketplace
    │   │   ├── watch/         # Video feed
    │   │   ├── events/        # Upcoming events
    │   │   └── saved/         # Bookmarked posts
    │   ├── api/         # Domain API client modules (auth, posts, chat...)
    │   ├── components/  # Shared primitive components (UserAvatar, TabBar...)
    │   ├── constant/    # Centralized constants (API_ENDPOINTS, SOCKET_EVENTS...)
    │   ├── context/     # Theme & Toast contexts
    │   ├── hooks/       # Custom hooks (useAuth, useSocketPresence, useWebRTC)
    │   ├── pages/       # Layout pages (Navbar, Sidebar, Footer, FeedPage)
    │   └── store/       # Redux store & domain slices
    └── public/          # Static assets
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **Redis** (or Upstash Redis account)
- **ImageKit** account (for media storage)
- **Stripe** account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhinav4005/social-media.git
   cd social-hub
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file (see `backend/.env.example`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/socialhub_db
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   FRONTEND_BASE_URL=http://localhost:5173
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL="Social Hub <noreply@socialhub.com>"
   
   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=your-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your-public-key
   IMAGEKIT_PRIVATE_KEY=your-private-key
   IMAGEKIT_URL_ENDPOINT=your-endpoint
   
   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

   NODE_ENV=development
   ```

   Run database migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_SOCKET_URL=http://localhost:3000
   ```

### Running the Application

**Development Mode:**

1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3000`

2. Start frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

3. (Optional) Start background workers & view BullMQ Dashboard:
   ```bash
   cd backend
   npm run worker      # Story processing worker
   npm run cleanup     # Story cleanup worker
   ```
   Navigate to `http://localhost:3000/admin/queues`

---

## API Architecture & Centralized Constants

All API interactions are organized using single-source-of-truth constant registries:

- **`API_ENDPOINTS`** (`src/constant/apiEndpoints.js`): Maps all HTTP route paths (`/auth/login`, `/post/feed`, `/chat/rooms`, etc.).
- **`SOCKET_EVENTS`** (`src/constant/socketEvents.js`): Maps all Socket.IO & WebRTC signaling event names.
- **`QUERY_KEYS`** (`src/constant/queryKeys.js`): Maps React Query server cache keys.
- **`ROUTES`** (`src/constant/routes.js`): Maps application page routes.

---

## License

This project is licensed under the MIT License.

Made with ❤️ by [Abhinav](https://github.com/Abhinav4005)
