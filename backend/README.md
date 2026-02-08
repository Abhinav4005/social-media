# Social Hub Backend

Express.js REST API server for Social Hub with real-time capabilities, job queues, and PostgreSQL database.

## Architecture

### Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5.1
- **Database:** PostgreSQL 14+ with Prisma ORM 7.1
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io 4.8
- **File Storage:** ImageKit (cloud CDN)
- **Caching:** Redis (Upstash)
- **Job Queue:** BullMQ with Bull Board monitoring
- **Email:** Nodemailer (SMTP)
- **Rate Limiting:** express-rate-limit

### Folder Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js           # Prisma client instance
│   │   └── redis.js        # Redis connection
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── chat.controller.js
│   │   ├── friend.controller.js
│   │   ├── notification.controller.js
│   │   ├── story.controller.js
│   │   ├── image.controller.js
│   │   └── globalSearch.controller.js
│   │
│   ├── routes/              # API route definitions
│   │   ├── index.route.js  # Main router
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── post.route.js
│   │   ├── chat.route.js
│   │   ├── friend.route.js
│   │   ├── notification.route.js
│   │   ├── story.route.js
│   │   ├── image.route.js
│   │   └── global.route.js
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── upload.js       # Multer file upload
│   │
│   ├── services/            # Business logic layer
│   │   └── email.service.js
│   │
│   ├── socket/              # Socket.io handlers
│   │   ├── index.js        # Socket initialization
│   │   ├── chatHandler.js  # Chat events
│   │   ├── presenceHandler.js
│   │   └── notificationHandler.js
│   │
│   ├── queues/              # BullMQ job queues
│   │   ├── storyQueue.js
│   │   └── cleanupQueue.js
│   │
│   ├── workers/             # Background job processors
│   │   ├── storyWorker.js
│   │   └── storyCleanupWorker.js
│   │
│   ├── utils/               # Helper functions
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── validators.js
│   │
│   ├── lib/                 # Third-party integrations
│   │   ├── imagekit.js
│   │   └── redis.js
│   │
│   ├── templates/           # Email templates
│   │   └── passwordReset.js
│   │
│   └── monitor/             # Monitoring tools
│       └── queueMonitor.js  # Bull Board setup
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.js              # Database seeding script
│
├── uploads/                 # Local file uploads (gitignored)
├── index.js                 # Server entry point
├── package.json
└── .env                     # Environment variables (gitignored)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- Redis instance (or Upstash account)
- ImageKit account
- Gmail account (for emails)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` file with actual values

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. (Optional) Seed the database:
   ```bash
   npm run seed
   ```

### Running the Server

**Development mode:**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

**Production mode:**
```bash
npm start
```

**Background workers:**
```bash
# Terminal 1: Story processing worker
npm run worker

# Terminal 2: Story cleanup worker (runs hourly cron)
npm run cleanup
```

**Queue monitoring dashboard:**
Navigate to `http://localhost:3000/admin/queues`

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/verify-email` | Verify email address | No |

### Users (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/profile` | Get current user profile | Yes |
| GET | `/user/:userId` | Get user by ID | Yes |
| PUT | `/user/profile` | Update profile | Yes |
| PUT | `/user/cover-image` | Update cover image | Yes |
| PUT | `/user/profile-image` | Update profile image | Yes |
| GET | `/user/:userId/posts` | Get user's posts | Yes |
| GET | `/user/:userId/friends` | Get user's friends | Yes |

### Posts (`/post`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post` | Get all posts (feed) | Yes |
| GET | `/post/:postId` | Get post by ID | Yes |
| POST | `/post` | Create new post | Yes |
| PUT | `/post/:postId` | Update post | Yes |
| DELETE | `/post/:postId` | Delete post | Yes |
| POST | `/post/:postId/like` | Like/unlike post | Yes |
| GET | `/post/:postId/comments` | Get post comments | Yes |
| POST | `/post/:postId/comments` | Add comment | Yes |
| PUT | `/post/comment/:commentId` | Update comment | Yes |
| DELETE | `/post/comment/:commentId` | Delete comment | Yes |
| POST | `/post/comment/:commentId/like` | Like/unlike comment | Yes |

### Chat (`/chat`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/chat/rooms` | Get all chat rooms | Yes |
| GET | `/chat/room/:roomId` | Get room details | Yes |
| POST | `/chat/room` | Create new room | Yes |
| POST | `/chat/dm/:userId` | Create/get DM room | Yes |
| GET | `/chat/room/:roomId/messages` | Get room messages | Yes |
| POST | `/chat/room/:roomId/message` | Send message | Yes |
| PUT | `/chat/message/:messageId` | Edit message | Yes |
| DELETE | `/chat/message/:messageId` | Delete message | Yes |
| POST | `/chat/message/:messageId/reaction` | Add reaction | Yes |

### Friends (`/friend`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/friend/requests` | Get friend requests | Yes |
| GET | `/friend/list` | Get friends list | Yes |
| POST | `/friend/request/:userId` | Send friend request | Yes |
| PUT | `/friend/request/:requestId/accept` | Accept request | Yes |
| DELETE | `/friend/request/:requestId` | Reject request | Yes |
| DELETE | `/friend/:friendId` | Remove friend | Yes |
| POST | `/friend/follow/:userId` | Follow user | Yes |
| DELETE | `/friend/unfollow/:userId` | Unfollow user | Yes |

### Notifications (`/notification`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notification` | Get all notifications | Yes |
| PUT | `/notification/:notificationId/read` | Mark as read | Yes |
| PUT | `/notification/read-all` | Mark all as read | Yes |
| DELETE | `/notification/:notificationId` | Delete notification | Yes |

### Stories (`/story`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/story` | Get all active stories | Yes |
| GET | `/story/:storyId` | Get story by ID | Yes |
| POST | `/story` | Create new story | Yes |
| DELETE | `/story/:storyId` | Delete story | Yes |
| POST | `/story/:storyId/view` | Mark story as viewed | Yes |
| GET | `/story/:storyId/views` | Get story viewers | Yes |

### Search (`/global`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/global/search?q=query` | Search users and posts | Yes |

### Images (`/image`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/image/upload` | Upload image to ImageKit | Yes |

## Socket.io Events

### Connection
```javascript
// Client connects
socket.on('connect', () => {});

// User goes online
socket.emit('user:online', { userId });

// User goes offline
socket.emit('user:offline', { userId });
```

### Chat Events
```javascript
// Join a room
socket.emit('chat:join', { roomId });

// Leave a room
socket.emit('chat:leave', { roomId });

// Send message
socket.emit('chat:message', { roomId, message });

// Receive message
socket.on('chat:message', (message) => {});

// Typing indicator
socket.emit('chat:typing', { roomId, isTyping });
socket.on('chat:typing', ({ userId, isTyping }) => {});
```

### Notification Events
```javascript
// Receive notification
socket.on('notification:new', (notification) => {});
```

### Presence Events
```javascript
// User status changed
socket.on('user:status', ({ userId, status }) => {});
```

## Database Schema

### Main Models

- **User** - User accounts and profiles
- **Post** - User posts with images/videos
- **Comment** - Post comments (supports nested replies)
- **PostLike** / **CommentLike** - Like system
- **FriendShip** - Friend requests and connections
- **Follower** - Follow system
- **Room** - Chat rooms (DM and Group)
- **Message** - Chat messages
- **Notification** - User notifications
- **Story** - Temporary stories (24h expiry)
- **PasswordReset** - Password reset tokens

See `prisma/schema.prisma` for complete schema.

### Database Commands

```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Seed database
npm run seed
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/socialhub_db

# JWT
JWT_SECRET=your_secret_key

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="Social Hub <noreply@socialhub.com>"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_key
IMAGEKIT_PRIVATE_KEY=private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Environment
NODE_ENV=development
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register or login via `/auth/register` or `/auth/login`
2. Receive JWT token in response
3. Include token in subsequent requests

### Using the Token

```javascript
// HTTP Headers
Authorization: Bearer <your_jwt_token>

// Example with axios
axios.get('/api/v1/user/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Default:** 100 requests per 15 minutes per IP
- **Auth endpoints:** 5 requests per 15 minutes per IP

## Queue System

### Story Processing Queue

Handles story media processing and optimization.

**Worker:** `src/workers/storyWorker.js`

```bash
npm run worker
```

### Story Cleanup Queue

Automatically deletes expired stories (runs hourly).

**Worker:** `src/workers/storyCleanupWorker.js`

```bash
npm run cleanup
```

### Monitoring

View queue status at: `http://localhost:3000/admin/queues`

## Debugging

### Enable Debug Logs

```bash
DEBUG=* npm run dev
```

### Common Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env

**Redis connection failed:**
- Check Redis is running or Upstash credentials are correct

**Email not sending:**
- Verify SMTP credentials
- For Gmail, use App Password (not regular password)

## Logging

Logs are written to console in development mode.

For production, consider using:
- Winston
- Morgan
- Pino

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up Redis instance
- [ ] Configure email service
- [ ] Set up ImageKit
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring (e.g., PM2, New Relic)
- [ ] Configure logging
- [ ] Set up backups

### Deployment Platforms

- **Heroku:** Easy deployment with add-ons
- **Railway:** Simple PostgreSQL + Redis setup
- **Render:** Free tier available
- **AWS/GCP/Azure:** Full control, scalable
- **DigitalOcean:** VPS with managed databases

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [BullMQ Documentation](https://docs.bullmq.io/)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

Built with ❤️ using Node.js and Express
