import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User, Heart, Calendar, MapPin, Link as LinkIcon, Edit3 } from 'lucide-react';

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setProfile(docSnap.data());
    };
    fetchProfile();
  }, [user]);

  const handleLike = async () => {
    if (!user || liked) return;
    await updateDoc(doc(db, 'users', user.uid), {
      'stats.likes': increment(1)
    });
    setProfile((prev: any) => ({
      ...prev,
      stats: { ...prev.stats, likes: prev.stats.likes + 1 }
    }));
    setLiked(true);
  };

  if (!profile) return null;

  return (
    <div className="ml-20 min-h-screen">
      <div className="h-64 bg-gradient-to-r from-emerald-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -bottom-20 left-10 flex items-end gap-8">
          <div className="w-40 h-40 bg-black rounded-[2.5rem] border-8 border-black overflow-hidden shadow-2xl">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-500 text-black text-5xl font-black">
                {profile.displayName[0]}
              </div>
            )}
          </div>
          <div className="mb-4">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{profile.displayName}</h1>
            <p className="text-white/60 font-mono text-sm">@{profile.uid.substring(0, 8)}</p>
          </div>
        </div>
        <button className="absolute bottom-4 right-10 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 font-bold text-sm">
          <Edit3 size={16} />
          EDIT PROFILE
        </button>
      </div>

      <div className="mt-32 px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-white font-black mb-6 uppercase tracking-widest text-sm">About Me</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Passionate coder exploring the boundaries of 3D web and competitive programming. 
              Always up for a 1v1 challenge!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin size={16} />
                <span>Cyberspace, Web3</span>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <Calendar size={16} />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-500 text-sm font-bold">
                <LinkIcon size={16} />
                <a href="#" className="hover:underline">github.com/{profile.displayName.toLowerCase()}</a>
              </div>
            </div>
          </section>

          <button
            onClick={handleLike}
            disabled={liked}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
              liked ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            {profile.stats.likes} LIKES
          </button>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-white font-black mb-6 uppercase tracking-widest text-sm">Battle Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-white/40">Win Rate</span>
                  <span className="text-emerald-500">75%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-2xl font-black text-white">{profile.stats.wins}</div>
                  <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Total Wins</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-2xl font-black text-white">{profile.stats.losses}</div>
                  <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Total Losses</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-white font-black mb-6 uppercase tracking-widest text-sm">Preferred Stack</h2>
            <div className="flex flex-wrap gap-3">
              {['React', 'TypeScript', 'Three.js', 'Node.js', 'Tailwind', 'Firebase'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-xs font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
