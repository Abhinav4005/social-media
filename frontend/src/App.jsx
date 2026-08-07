import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SocketPresence from './SocketPresence.jsx';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import PageLoader from './components/Common/PageLoader';
import Footer from './pages/Footer';

// Dynamic React.lazy Code-Splitting for Route Pages
const Notifications = lazy(() => import('./pages/Notification'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./components/Users/Profile'));
const PostDetail = lazy(() => import('./components/Posts/PostDetail'));
const Settings = lazy(() => import('./pages/Setting'));
const UpdateProfile = lazy(() => import('./components/Users/UpdateProfile'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const FriendsDetail = lazy(() => import('./components/Friends/FriendsDetail'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SearchedUserProfile = lazy(() => import('./components/Users/SearchedUserProfile'));
const FriendRequests = lazy(() => import('./components/Friends/FriendRequests'));
const SahreModal = lazy(() => import('./Modal/SahreModal'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VideoCall = lazy(() => import('./components/Chat/VideoCall'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const SafetyCenterPage = lazy(() => import('./pages/SafetyCenterPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));

// Central App Shell Layout managing global components (e.g. Footer) without touching individual pages
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Hide footer on Chat, VideoCall, Auth pages, or logged-in Feed page
  const isChatOrCall = location.pathname.startsWith('/chat') || location.pathname.startsWith('/video-call');
  const isMainFeed = location.pathname === '/' && isAuthenticated;
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const shouldHideFooter = isChatOrCall || isMainFeed || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <SocketPresence />
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
              <Route
                path="/signin"
                element={
                  <PublicRoute>
                    <SignInPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUpPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts/:postId"
                element={
                  <PrivateRoute>
                    <PostDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-profile"
                element={
                  <PrivateRoute>
                    <UpdateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:roomId"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/friends/:userId"
                element={
                  <PrivateRoute>
                    <FriendsDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search-page"
                element={
                  <PrivateRoute>
                    <SearchPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <SearchPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <PrivateRoute>
                    <SearchedUserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/friend-requests"
                element={
                  <PrivateRoute>
                    <FriendRequests />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <PrivateRoute>
                    <GroupsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/watch"
                element={
                  <PrivateRoute>
                    <WatchPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <PrivateRoute>
                    <MarketplacePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <PrivateRoute>
                    <EventsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <PrivateRoute>
                    <SavedPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/share"
                element={
                  <PrivateRoute>
                    <SahreModal />
                  </PrivateRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/video-call/:roomId"
                element={
                  <PrivateRoute>
                    <VideoCall />
                  </PrivateRoute>
                }
              />
              <Route
                path="/video-call/incoming"
                element={
                  <PrivateRoute>
                    <VideoCall />
                  </PrivateRoute>
                }
              />
              {/* Static Informational Routes */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/guidelines" element={<GuidelinesPage />} />
              <Route path="/safety" element={<SafetyCenterPage />} />
              <Route path="/blog" element={<BlogPage />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </Router>
      </ToastProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
};

export default App;