import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Zap, Users, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 ml-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-7xl font-black text-white mb-6 tracking-tighter">
          MASTER THE <span className="text-emerald-500">CODE</span>
          <br />
          CONQUER THE <span className="text-emerald-500">QUEST</span>
        </h1>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          The world's first 3D gamified coding platform. Battle in real-time, 
          solve AI-powered challenges, and climb the global ranks.
        </p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate('/play')}
            className="bg-emerald-500 text-black px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20"
          >
            START BATTLE
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
          >
            PRACTICE MODE
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 w-full max-w-6xl">
        {[
          { icon: <Zap className="text-yellow-400" />, title: "Real-time Battles", desc: "1v1 coding duels with live sync" },
          { icon: <Terminal className="text-emerald-400" />, title: "AI Challenges", desc: "Dynamic problems by Gemini" },
          { icon: <Users className="text-blue-400" />, title: "Guild System", desc: "Join teams and compete together" },
          { icon: <Trophy className="text-purple-400" />, title: "Global Ranks", desc: "Bronze to Diamond tiers" },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:border-emerald-500/50 transition-colors"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-white font-bold mb-2">{feature.title}</h3>
            <p className="text-white/40 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
