import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    { icon: <User size={20} />, title: 'Account', desc: 'Personal info, email, password' },
    { icon: <Bell size={20} />, title: 'Notifications', desc: 'Battle alerts, messages, updates' },
    { icon: <Shield size={20} />, title: 'Privacy', desc: 'Visibility, blocked users, security' },
    { icon: <Globe size={20} />, title: 'Language', desc: 'Preferred coding languages' },
    { icon: <Palette size={20} />, title: 'Appearance', desc: 'Themes, animations, 3D effects' },
  ];

  return (
    <div className="ml-20 p-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">SYSTEM <span className="text-emerald-500">CONFIG</span></h1>
          <p className="text-white/40 font-mono">ADJUST YOUR EXPERIENCE</p>
        </header>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{section.title}</h3>
                  <p className="text-white/30 text-sm">{section.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-emerald-500 group-hover:border-emerald-500 transition-all">
                →
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl">
          <h3 className="text-red-500 font-bold mb-2 uppercase tracking-widest text-xs">Danger Zone</h3>
          <p className="text-white/40 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
