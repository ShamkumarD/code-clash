import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Code2, Trophy, User, MessageSquare, Settings, Play, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: <Code2 size={20} /> },
    { name: 'Play', path: '/play', icon: <Play size={20} /> },
    { name: 'Practice', path: '/practice', icon: <LayoutDashboard size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-20 bg-black/80 border-r border-white/10 flex flex-col items-center py-8 z-50 backdrop-blur-md">
      <div className="mb-12">
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Code2 className="text-black" size={28} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="text-white/50 hover:text-emerald-400 transition-colors p-3 rounded-xl hover:bg-white/5 group relative"
            title={item.name}
          >
            {item.icon}
            <span className="absolute left-20 bg-emerald-500 text-black px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {user && (
        <button
          onClick={() => auth.signOut()}
          className="mt-auto text-white/50 hover:text-red-400 p-3 rounded-xl hover:bg-white/5 transition-colors"
          title="Logout"
        >
          <User size={20} />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
