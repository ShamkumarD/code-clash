import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSocket } from '../hooks/useSocket';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Code2, Users, Play, Copy, Check, Send, Terminal } from 'lucide-react';

const Battle: React.FC = () => {
  const [user] = useAuthState(auth);
  const socket = useSocket();
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [code, setCode] = useState('// Start coding here...\n\nfunction solution() {\n  return "Hello World";\n}');
  const [remoteCode, setRemoteCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('room-update', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('remote-code-update', (newCode) => {
      setRemoteCode(newCode);
    });

    socket.on('battle-result', ({ userId, result }) => {
      alert(`Battle Result: ${userId === user?.uid ? 'You' : 'Opponent'} submitted!`);
    });

    return () => {
      socket.off('room-update');
      socket.off('remote-code-update');
      socket.off('battle-result');
    };
  }, [socket, user]);

  const createRoom = () => {
    const id = Math.random().toString(36).substring(7).toUpperCase();
    setRoomId(id);
    joinRoom(id);
  };

  const joinRoom = (id: string) => {
    if (!id || !socket || !user) return;
    socket.emit('join-room', { roomId: id, userId: user.uid, displayName: user.displayName });
    setInRoom(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (socket && inRoom) {
      socket.emit('code-update', { roomId, code: newCode });
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inRoom) {
    return (
      <div className="ml-20 min-h-screen flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl w-full max-w-2xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <Users size={40} className="text-black" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">MULTIPLAYER BATTLE</h1>
          <p className="text-white/40 mb-12 max-w-md mx-auto">Create a custom room and invite your friends for a 1v1 coding showdown.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={createRoom}
              className="bg-emerald-500 text-black py-6 rounded-3xl font-black text-xl hover:bg-emerald-400 transition-all flex flex-col items-center gap-2"
            >
              <Play size={24} />
              CREATE ROOM
            </button>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
              <input
                type="text"
                placeholder="ENTER ROOM ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white text-center font-mono focus:border-emerald-500 outline-none"
              />
              <button
                onClick={() => joinRoom(roomId)}
                className="bg-white/10 text-white py-3 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                JOIN ROOM
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="ml-20 h-screen flex flex-col p-6">
      <header className="flex items-center justify-between mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-white font-mono font-bold">ROOM: {roomId}</span>
            <button onClick={copyRoomId} className="text-white/30 hover:text-white transition-colors">
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4">
            {players.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500 text-xs font-bold">
                  {p.displayName[0]}
                </div>
                <span className="text-white/60 text-sm font-bold">{p.displayName}</span>
              </div>
            ))}
            {players.length < 2 && <span className="text-white/20 text-xs animate-pulse">WAITING FOR OPPONENT...</span>}
          </div>
        </div>
        <button
          onClick={() => socket?.emit('submit-code', { roomId, userId: user?.uid, result: 'success' })}
          className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Send size={18} />
          SUBMIT
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest px-2">
            <Terminal size={14} />
            Your Editor
          </div>
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="flex-1 bg-black/50 border border-white/10 rounded-3xl p-6 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none resize-none shadow-inner"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest px-2">
            <Users size={14} />
            Opponent's Progress
          </div>
          <div className="flex-1 bg-black/30 border border-white/5 rounded-3xl p-6 text-white/20 font-mono text-sm overflow-hidden relative">
            <pre className="whitespace-pre-wrap">{remoteCode || '// Waiting for opponent to type...'}</pre>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
