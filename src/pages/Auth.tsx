import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Github, Chrome } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
          setError('Please verify your email before logging in.');
          await auth.signOut();
          return;
        }
        navigate('/dashboard');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        
        // Initialize user profile
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          displayName: email.split('@')[0],
          email: email,
          xp: 0,
          level: 1,
          rank: 'Bronze',
          stats: { wins: 0, losses: 0, problemsSolved: 0, likes: 0 },
          createdAt: new Date().toISOString()
        });
        
        alert('Verification email sent! Please check your inbox.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          xp: 0,
          level: 1,
          rank: 'Bronze',
          stats: { wins: 0, losses: 0, problemsSolved: 0, likes: 0 },
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ml-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-4xl font-black text-white mb-2 text-center">
          {isLogin ? 'WELCOME BACK' : 'JOIN THE QUEST'}
        </h2>
        <p className="text-white/40 text-center mb-8">
          {isLogin ? 'Enter your credentials to continue' : 'Create an account to start your journey'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">OR CONTINUE WITH</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl text-white hover:bg-white/10 transition-all"
          >
            <Chrome size={20} />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl text-white hover:bg-white/10 transition-all">
            <Github size={20} />
            GitHub
          </button>
        </div>

        <p className="text-center mt-8 text-white/40 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
