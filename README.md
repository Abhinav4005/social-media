# Social Hub

A modern, full-stack social media platform built with React, Express, and PostgreSQL. Connect with friends, share posts, chat in real-time, and share stories.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## Features

- 🔐 **Authentication** - Secure JWT-based auth with email verification and password reset
- 📝 **Posts & Comments** - Create, like, and comment on posts with nested replies
- 💬 **Real-time Chat** - One-on-one and group messaging with Socket.io
- 📹 **Video Calls** - WebRTC-powered video calling
- 👥 **Friends System** - Send/accept friend requests, manage friendships
- 📖 **Stories** - Share temporary stories that expire after 24 hours
- 🔔 **Notifications** - Real-time notifications for likes, comments, messages
- 🔍 **Global Search** - Search for users and posts
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Toggle between light and dark themes

## Tech Stack

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 5.0
- **Styling:** Tailwind CSS 4.1
- **State Management:** Redux Toolkit + Redux Persist
- **Routing:** React Router DOM 7.8
- **Data Fetching:** TanStack Query (React Query) 5.85
- **Real-time:** Socket.io Client 4.8
- **Video Calls:** Simple Peer (WebRTC)
- **Animations:** Framer Motion 12.23
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5.1
- **Database:** PostgreSQL with Prisma ORM 7.1
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io 4.8
- **File Upload:** Multer + ImageKit
- **Email:** Nodemailer
- **Caching:** Redis (Upstash)
- **Job Queue:** BullMQ + Bull Board
- **Rate Limiting:** express-rate-limit

## Project Structure

```
social-hub/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/      # Database, Redis, ImageKit configs
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation middleware
│   │   ├── services/    # Business logic
│   │   ├── socket/      # Socket.io handlers
│   │   ├── queues/      # BullMQ job queues
│   │   ├── workers/     # Background job processors
│   │   ├── utils/       # Helper functions
│   │   ├── lib/         # Third-party integrations
│   │   └── templates/   # Email templates
│   ├── prisma/          # Database schema & migrations
│   ├── uploads/         # File uploads (gitignored)
│   └── index.js         # Server entry point
│
└── frontend/            # React application
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store & slices
    │   ├── routes/      # Route guards
    │   ├── utils/       # Helper functions
    │   ├── Modal/       # Modal components
    │   ├── constant/    # Constants
    │   └── helper/      # Helper utilities
    └── public/          # Static assets
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **Redis** (or Upstash Redis account)
- **ImageKit** account (for image uploads)
- **Gmail** account (for email notifications)

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
   
   NODE_ENV=development
   ```

   Run database migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

   (Optional) Seed the database:
   ```bash
   npm run seed
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

### Running the Application

**Development Mode:**

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3000`

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

3. (Optional) Start background workers:
   ```bash
   cd backend
   npm run worker      # Story processing worker
   npm run cleanup     # Story cleanup worker
   ```

4. (Optional) View queue dashboard:
   Navigate to `http://localhost:3000/admin/queues`

**Production Build:**

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Main Endpoints

- **Auth:** `/auth` - Login, register, password reset
- **Users:** `/user` - User profiles, updates
- **Posts:** `/post` - CRUD operations for posts
- **Comments:** `/post/:id/comments` - Comment management
- **Chat:** `/chat` - Messaging and rooms
- **Friends:** `/friend` - Friend requests and management
- **Notifications:** `/notification` - User notifications
- **Stories:** `/story` - Story creation and viewing
- **Search:** `/global/search` - Global search

See [backend/README.md](./backend/README.md) for detailed API documentation.

## Design System

The application uses a consistent color scheme based on Tailwind CSS custom colors:

- **Primary:** Indigo (`primary-500`, `primary-600`, `primary-700`)
- **Secondary:** Purple (`secondary-500`, `secondary-600`)
- **Accent:** Blue (`accent-500`, `accent-600`)

All colors are defined in `frontend/src/styles/theme.css` using CSS custom properties for easy theming.

## Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## Database Management

```bash
# Open Prisma Studio (Database GUI)
cd backend
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run worker` - Start story processing worker
- `npm run cleanup` - Start story cleanup worker

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Abhinav**
- GitHub: [@Abhinav4005](https://github.com/Abhinav4005)

## Acknowledgments

- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Socket.io](https://socket.io/) for real-time capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [ImageKit](https://imagekit.io/) for image management

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Abhinav
