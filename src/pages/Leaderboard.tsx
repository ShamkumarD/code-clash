import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Star, Hash } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const getTierColor = (rank: string) => {
    switch (rank) {
      case 'Diamond': return 'text-blue-400';
      case 'Platinum': return 'text-cyan-400';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-slate-300';
      default: return 'text-orange-400';
    }
  };

  return (
    <div className="ml-20 p-10 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 mb-6"
          >
            <Trophy size={48} className="text-emerald-500" />
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase">HALL OF <span className="text-emerald-500">FAME</span></h1>
          <p className="text-white/40 font-mono">THE TOP CODERS IN THE MULTIVERSE</p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 text-white/30 text-xs font-bold uppercase tracking-widest">
            <div className="col-span-1 flex justify-center"><Hash size={14} /></div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2">Solved</div>
            <div className="col-span-2 text-right">XP Points</div>
          </div>

          <div className="divide-y divide-white/5">
            {players.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-1 flex justify-center">
                  {i < 3 ? (
                    <Medal className={i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-orange-400'} size={24} />
                  ) : (
                    <span className="text-white/20 font-black">#{i + 1}</span>
                  )}
                </div>
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    {player.photoURL ? <img src={player.photoURL} alt="" /> : <div className="w-full h-full flex items-center justify-center text-xs text-white/40">CQ</div>}
                  </div>
                  <span className="text-white font-bold">{player.displayName}</span>
                </div>
                <div className={`col-span-2 font-black text-xs tracking-tighter uppercase ${getTierColor(player.rank)}`}>
                  {player.rank}
                </div>
                <div className="col-span-2 text-white/60 font-mono text-sm">
                  {player.stats?.problemsSolved || 0}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-emerald-500 font-black text-lg tracking-tighter">{player.xp}</span>
                  <Star size={12} className="inline ml-1 text-emerald-500/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
