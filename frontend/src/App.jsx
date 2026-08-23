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
import { ROUTES } from './constant/routes';

const Notifications = lazy(() => import('./features/notifications').then(m => ({ default: m.NotificationPage })));
const SignUpPage = lazy(() => import('./features/auth').then(m => ({ default: m.SignUpPage })));
const SignInPage = lazy(() => import('./features/auth').then(m => ({ default: m.SignInPage })));
const ForgotPasswordPage = lazy(() => import('./features/auth').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./features/auth').then(m => ({ default: m.ResetPasswordPage })));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./features/profile').then(m => ({ default: m.Profile })));
const SearchedUserProfile = lazy(() => import('./features/profile').then(m => ({ default: m.SearchedUserProfile })));
const UpdateProfile = lazy(() => import('./features/profile').then(m => ({ default: m.UpdateProfile })));
const PostDetail = lazy(() => import('./features/posts').then(m => ({ default: m.PostDetail })));
const SahreModal = lazy(() => import('./features/posts').then(m => ({ default: m.SahreModal })));
const ChatPage = lazy(() => import('./features/chat').then(m => ({ default: m.ChatPage })));
const VideoCall = lazy(() => import('./features/chat').then(m => ({ default: m.VideoCall })));
const FriendsDetail = lazy(() => import('./features/friends').then(m => ({ default: m.FriendsDetail })));
const FriendRequests = lazy(() => import('./features/friends').then(m => ({ default: m.FriendRequests })));
const Settings = lazy(() => import('./features/settings').then(m => ({ default: m.Setting })));
const SearchPage = lazy(() => import('./features/search').then(m => ({ default: m.SearchPage })));
const GroupsPage = lazy(() => import('./features/groups').then(m => ({ default: m.GroupsPage })));
const GroupDetailPage = lazy(() => import('./features/groups').then(m => ({ default: m.GroupDetailPage })));
const WatchPage = lazy(() => import('./features/watch').then(m => ({ default: m.WatchPage })));
const MarketplacePage = lazy(() => import('./features/marketplace').then(m => ({ default: m.MarketplacePage })));
const EventsPage = lazy(() => import('./features/events').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./features/events').then(m => ({ default: m.EventDetailPage })));
const SavedPage = lazy(() => import('./features/saved').then(m => ({ default: m.SavedPage })));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const SafetyCenterPage = lazy(() => import('./pages/SafetyCenterPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isChatOrCall = location.pathname.startsWith(ROUTES.CHAT) || location.pathname.startsWith('/video-call');
  const isMainFeed = location.pathname === ROUTES.HOME && isAuthenticated;
  const isAuthPage = location.pathname === ROUTES.SIGNIN || location.pathname === ROUTES.SIGNUP;

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
                    path={ROUTES.SIGNIN}
                    element={
                      <PublicRoute>
                        <SignInPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SIGNUP}
                    element={
                      <PublicRoute>
                        <SignUpPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path={ROUTES.HOME}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Feed display failed">
                          <Home />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.PROFILE}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Profile view failed">
                          <Profile />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.NOTIFICATIONS}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Notifications unavailable">
                          <Notifications />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/posts/:postId"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Post details failed to load">
                          <PostDetail />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SETTINGS}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Settings page error">
                          <Settings />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.UPDATE_PROFILE}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Profile update error">
                          <UpdateProfile />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.CHAT}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Chat service unavailable">
                          <ChatPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/chat/:roomId"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Chat room failed to load">
                          <ChatPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/friends/:userId"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Friend details error">
                          <FriendsDetail />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/search-page"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Search page error">
                          <SearchPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SEARCH}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Search page error">
                          <SearchPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/user/:userId"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="User profile error">
                          <SearchedUserProfile />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.FRIEND_REQUESTS}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Friend requests error">
                          <FriendRequests />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.GROUPS}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Groups page error">
                          <GroupsPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/groups/:id"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Group detail page error">
                          <GroupDetailPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.WATCH}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Watch page error">
                          <WatchPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.MARKETPLACE}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Marketplace page error">
                          <MarketplacePage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.EVENTS}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Events page error">
                          <EventsPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/events/:id"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Event detail page error">
                          <EventDetailPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SAVED}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Saved items error">
                          <SavedPage />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SHARE}
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Share dialog error">
                          <SahreModal />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.FORGOT_PASSWORD}
                    element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path={ROUTES.RESET_PASSWORD}
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
                        <ErrorBoundary compact title="Video call error">
                          <VideoCall />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/video-call/incoming"
                    element={
                      <PrivateRoute>
                        <ErrorBoundary compact title="Video call error">
                          <VideoCall />
                        </ErrorBoundary>
                      </PrivateRoute>
                    }
                  />
                  <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                  <Route path={ROUTES.FEATURES} element={<FeaturesPage />} />
                  <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
                  <Route path={ROUTES.TERMS} element={<TermsPage />} />
                  <Route path={ROUTES.HELP} element={<HelpCenterPage />} />
                  <Route path={ROUTES.GUIDELINES} element={<GuidelinesPage />} />
                  <Route path={ROUTES.SAFETY} element={<SafetyCenterPage />} />
                  <Route path={ROUTES.BLOG} element={<BlogPage />} />

                  {/* Catch-all 404 Route */}
                  <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
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
