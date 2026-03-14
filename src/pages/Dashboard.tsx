import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Trophy, Zap, Target, Star, TrendingUp, Award } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };

    fetchProfile();

    // Real-time leaderboard preview
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTopPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  if (!profile) return null;

  const stats = [
    { label: 'Total XP', value: profile.xp, icon: <Star className="text-yellow-400" /> },
    { label: 'Global Rank', value: profile.rank, icon: <Trophy className="text-emerald-400" /> },
    { label: 'Wins', value: profile.stats.wins, icon: <Zap className="text-orange-400" /> },
    { label: 'Solved', value: profile.stats.problemsSolved, icon: <Target className="text-blue-400" /> },
  ];

  return (
    <div className="ml-20 p-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">
              COMMAND <span className="text-emerald-500">CENTER</span>
            </h1>
            <p className="text-white/40 font-mono">WELCOME BACK, {profile.displayName.toUpperCase()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-1">Current Tier</span>
            <span className="text-emerald-500 font-black text-xl tracking-tighter">{profile.rank.toUpperCase()}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
                <TrendingUp size={16} className="text-white/20" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Award className="text-emerald-500" />
                  RECENT ACHIEVEMENTS
                </h2>
                <button className="text-emerald-500 text-sm font-bold hover:underline">VIEW ALL</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 font-bold">10</div>
                  <div>
                    <div className="text-white font-bold text-sm">First Blood</div>
                    <div className="text-white/30 text-xs">Win your first 1v1 battle</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-40">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/40 font-bold">?</div>
                  <div>
                    <div className="text-white font-bold text-sm">Code Ninja</div>
                    <div className="text-white/30 text-xs">Solve 50 problems in Python</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Trophy size={20} className="text-yellow-400" />
                TOP PLAYERS
              </h2>
              <div className="space-y-4">
                {topPlayers.map((player, i) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm ${i === 0 ? 'text-yellow-400' : 'text-white/20'}`}>#{i + 1}</span>
                      <div className="w-8 h-8 bg-white/10 rounded-lg overflow-hidden">
                        {player.photoURL ? <img src={player.photoURL} alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40">CQ</div>}
                      </div>
                      <span className="text-white font-bold text-sm truncate max-w-[80px]">{player.displayName}</span>
                    </div>
                    <span className="text-emerald-500 font-mono text-xs font-bold">{player.xp} XP</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
