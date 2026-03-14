import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Send, Search, User } from 'lucide-react';

const Messages: React.FC = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // This is a simplified chat logic for the prototype
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, 'messages'), {
      senderId: user.uid,
      senderName: user.displayName,
      content: newMessage,
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  return (
    <div className="ml-20 h-screen flex p-6 gap-6">
      <aside className="w-80 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">MESSAGES</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-bold">G</div>
            <div>
              <div className="text-white font-bold text-sm">Global Chat</div>
              <div className="text-emerald-500/60 text-xs">Online</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md flex flex-col overflow-hidden">
        <header className="p-6 border-b border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-bold">G</div>
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Global Chat</h3>
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Real-time Sync</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/20 text-[10px] font-bold uppercase">{msg.senderName}</span>
              </div>
              <div
                className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                  msg.senderId === user?.uid
                    ? 'bg-emerald-500 text-black rounded-tr-none font-medium'
                    : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-6 border-t border-white/10 flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-emerald-500 outline-none transition-colors"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-black p-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send size={24} />
          </button>
        </form>
      </main>
    </div>
  );
};

export default Messages;
