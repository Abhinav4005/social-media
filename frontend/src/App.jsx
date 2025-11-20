import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Notifications from './pages/Notification';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';
import Profile from './components/Users/Profile';
import FeedPage from './pages/FeedPage';
import PostDetail from './components/Posts/PostDetail';
import Settings from './pages/Setting';
import UpdateProfile from './components/Users/UpdateProfile';
import ChatPage from './pages/ChatPage';
import FriendsDetail from './components/Friends/FriendsDetail';
import SearchPage from './pages/SearchPage';
import SearchedUserProfile from './components/Users/SearchedUserProfile';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import FriendRequests from './components/Friends/FriendRequests';
import SahreModal from './Modal/SahreModal';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VideoCall from './components/Chat/VideoCall';

const App = () => {
  return (
    <Router>
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
          path="/feed"
          element={
            <PrivateRoute>
              <FeedPage />
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
          path="/share"
          element={
            <PrivateRoute>
              <SahreModal/>
            </PrivateRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage/>
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage/>
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
      </Routes>
    </Router>
  )
}

export default App