import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Battle from './pages/Battle';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Practice from './pages/Practice';

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-transparent font-sans selection:bg-emerald-500/30">
        <ThreeBackground />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/play" element={user ? <Battle /> : <Navigate to="/auth" />} />
          <Route path="/practice" element={user ? <Practice /> : <Navigate to="/auth" />} />
          <Route path="/messages" element={user ? <Messages /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
