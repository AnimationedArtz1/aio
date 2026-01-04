import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="bg-white/[0.05] p-3 rounded-2xl rounded-tl-none border border-white/[0.05] inline-flex items-center gap-1.5 h-10 min-w-[60px] justify-center">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-slate-400"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-slate-400"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-slate-400"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

export default TypingIndicator;
