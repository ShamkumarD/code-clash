import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Brain, Zap, Target } from 'lucide-react';

const Practice: React.FC = () => {
  const levels = [
    { title: 'EASY', xp: '100 XP', color: 'text-emerald-400', desc: 'Basic logic and syntax' },
    { title: 'MEDIUM', xp: '250 XP', color: 'text-yellow-400', desc: 'Algorithms and data structures' },
    { title: 'HARD', xp: '500 XP', color: 'text-red-400', desc: 'Complex system design and optimization' },
    { title: 'EXPERT', xp: '1000 XP', color: 'text-purple-400', desc: 'Competitive programming challenges' },
  ];

  return (
    <div className="ml-20 p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">PRACTICE <span className="text-emerald-500">LAB</span></h1>
          <p className="text-white/40 font-mono">TRAIN YOUR BRAIN AGAINST THE AI</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {levels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md hover:border-emerald-500/50 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`text-xs font-black tracking-[0.2em] ${level.color}`}>{level.title}</div>
                <div className="text-white/20 font-mono text-xs">{level.xp}</div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase group-hover:text-emerald-500 transition-colors">
                {level.title} CHALLENGE
              </h3>
              <p className="text-white/40 text-sm mb-8">{level.desc}</p>
              <button className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all">
                START TRAINING
              </button>
            </motion.div>
          ))}
        </div>

        <section className="mt-12 bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500 rounded-2xl text-black">
              <Brain size={32} />
            </div>
            <div>
              <h3 className="text-white font-black text-xl uppercase tracking-tighter">AI BOT PRACTICE</h3>
              <p className="text-white/40 text-sm">Let Gemini generate a custom problem for you</p>
            </div>
          </div>
          <button className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all">
            GENERATE CHALLENGE
          </button>
        </section>
      </div>
    </div>
  );
};

export default Practice;
