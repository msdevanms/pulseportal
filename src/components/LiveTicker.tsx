import React from 'react';
import { motion } from 'motion/react';
import { GripVertical } from 'lucide-react';
import { NewsItem } from '../types';

interface LiveTickerProps {
  items: NewsItem[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ items }) => {
  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-[90vw] max-w-4xl glass-card overflow-hidden py-3 shadow-2xl cursor-grab active:cursor-grabbing flex items-center"
    >
      <div className="pl-4 pr-2 text-zinc-600">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          {displayItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center px-8 border-r border-white/10">
              <span className={`font-mono text-xs mr-3 uppercase tracking-widest ${item.isNew ? 'text-white bg-emerald-500 px-2 rounded' : 'text-emerald-400'}`}>
                {item.isNew ? 'NEW' : 'LIVE'}
              </span>
              <span className="text-zinc-300 font-medium">{item.title}</span>
              <span className="mx-4 text-zinc-600">•</span>
              <span className="text-zinc-500 text-sm italic">{item.source}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
