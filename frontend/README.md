# Social Hub Frontend

Modern React application for Social Hub with real-time features, beautiful UI, and responsive design.

## Tech Stack

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
- **HTTP Client:** Axios

## Folder Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   ├── Chat/           # Chat components
│   │   ├── Friends/        # Friend-related components
│   │   ├── Notifications/  # Notification components
│   │   ├── Photos/         # Photo gallery
│   │   ├── Posts/          # Post components
│   │   ├── Share/          # Share functionality
│   │   ├── UI/             # Base UI components
│   │   └── Users/          # User profile components
│   │
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── FeedPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── SignInPage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── Setting.jsx
│   │   ├── SearchPage.jsx
│   │   ├── Notification.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   │
│   ├── store/              # Redux store
│   │   ├── index.js       # Store configuration
│   │   ├── authSlice.js   # Auth state
│   │   ├── postSlice.js   # Posts state
│   │   └── userSlice.js   # User state
│   │
│   ├── routes/             # Route guards
│   │   ├── PublicRoute.jsx
│   │   └── PrivateRoute.jsx
│   │
│   ├── styles/             # Styling files
│   │   ├── theme.css      # Theme variables
│   │   └── index.css      # Global styles
│   │
│   ├── utils/              # Utility functions
│   │   └── constants.js
│   │
│   ├── Modal/              # Modal components
│   │   └── ShareModal.jsx
│   │
│   ├── constant/           # Constants
│   ├── helper/             # Helper functions
│   ├── api/                # API client
│   ├── assets/             # Static assets
│   ├── socket.js           # Socket.io client
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
│
├── public/                 # Static files
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_SOCKET_URL=http://localhost:3000
   ```

### Running the App

**Development mode:**
```bash
npm run dev
```
App runs on `http://localhost:5173`

**Production build:**
```bash
npm run build
npm run preview
```

**Linting:**
```bash
npm run lint
```

## Design System

### Color Palette

The application uses a consistent color scheme defined in `src/styles/theme.css`:

- **Primary (Indigo):** Main CTAs, buttons, links
  - `primary-500`, `primary-600`, `primary-700`
  
- **Secondary (Purple):** Secondary actions, highlights
  - `secondary-500`, `secondary-600`, `secondary-700`
  
- **Accent (Blue):** Info messages, badges
  - `accent-500`, `accent-600`, `accent-700`

### Using Theme Colors

```jsx
// Correct - Use theme colors
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click Me
</button>

// Avoid - Hardcoded colors
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  Click Me
</button>
```

### Gradients

```jsx
// Use predefined gradient classes
<div className="bg-gradient-hero">
  Hero Section
</div>

// Or use CSS custom properties
<div style={{ background: 'var(--gradient-vibrant)' }}>
  Vibrant Background
</div>
```

## State Management

### Redux Store

The app uses Redux Toolkit for state management with persistence:

```javascript
// Example: Using auth state
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';

const MyComponent = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    dispatch(login(credentials));
  };

  return <div>{user?.name}</div>;
};
```

### Available Slices

- **authSlice** - Authentication state (user, token, isAuthenticated)
- **postSlice** - Posts and feed data
- **userSlice** - User profile data

## API Integration

### Axios Instance

API calls are made using Axios with automatic token injection:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### React Query

For data fetching with caching:

```javascript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => api.get('/post').then(res => res.data),
});
```

## Real-time Features

### Socket.io Connection

```javascript
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token'),
  },
});

// Listen for events
socket.on('chat:message', (message) => {
  console.log('New message:', message);
});

// Emit events
socket.emit('chat:join', { roomId: '123' });
```

## Routing

### Route Structure

- `/` - Home/Landing page
- `/signin` - Sign in page (public)
- `/signup` - Sign up page (public)
- `/feed` - Main feed (protected)
- `/profile` - User profile (protected)
- `/chat` - Chat page (protected)
- `/chat/:roomId` - Specific chat room (protected)
- `/posts/:postId` - Post detail (protected)
- `/settings` - Settings page (protected)
- `/notifications` - Notifications (protected)
- `/search-page` - Search (protected)
- `/user/:userId` - Other user's profile (protected)
- `/friends/:userId` - Friends list (protected)
- `/friend-requests` - Friend requests (protected)
- `/video-call/:roomId` - Video call (protected)

### Route Guards

```jsx
// Public routes (redirect to feed if authenticated)
<PublicRoute>
  <SignInPage />
</PublicRoute>

// Protected routes (redirect to signin if not authenticated)
<PrivateRoute>
  <FeedPage />
</PrivateRoute>
```

## Component Patterns

### Functional Components with Hooks

```jsx
import React, { useState, useEffect } from 'react';

const MyComponent = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data
  }, [userId]);

  return <div>{data?.name}</div>;
};

export default MyComponent;
```

### Reusable UI Components

Create reusable components in `src/components/UI/`:

```jsx
// Button.jsx
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition';
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Responsive Design

All components should be mobile-first and responsive:

```jsx
<div className="
  w-full 
  px-4 sm:px-6 lg:px-8
  max-w-7xl mx-auto
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
">
  {/* Content */}
</div>
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage
npm run test:coverage
```

## Build & Deployment

### Production Build

```bash
npm run build
```

Build output goes to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

- **Vercel** - Recommended (zero-config)
- **Netlify** - Easy deployment
- **AWS S3 + CloudFront** - Scalable
- **GitHub Pages** - Free hosting

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
VITE_SOCKET_URL=https://your-api-domain.com
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

2. **State Management**
   - Use local state for UI-only state
   - Use Redux for global/shared state
   - Use React Query for server state

3. **Performance**
   - Use React.memo for expensive components
   - Implement code splitting with React.lazy
   - Optimize images and assets

4. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation works

5. **Code Quality**
   - Follow ESLint rules
   - Write meaningful component and variable names
   - Add comments for complex logic

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

---

Built with ❤️ using React and Vite
