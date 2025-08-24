import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Notifications from './pages/Notification';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Search from './pages/Search';
import Home from './pages/Home';
import Profile from './components/Users/Profile';
import FeedPage from './pages/FeedPage';
import PostDetail from './components/Posts/PostDetail';
import Settings from './pages/Setting';
import UpdateProfile from './components/Users/UpdateProfile';
import ChatPage from './pages/ChatPage';
import FriendsDetail from './components/Friends/FriendsDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path='/settings' element={<Settings/> }/>
        <Route path='/update-profile' element={<UpdateProfile />} />
        <Route path='/chat' element={<ChatPage/>}/>
        <Route path='/friends/:userId' element={<FriendsDetail />} />
      </Routes>
    </Router>
  )
}

export default App