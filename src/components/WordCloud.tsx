import React from 'react';
import { motion } from 'motion/react';
import { NewsItem } from '../types';

interface WordCloudProps {
  items: NewsItem[];
}

export const WordCloud: React.FC<WordCloudProps> = ({ items }) => {
  // Extract and count keywords
  const keywordMap = items.reduce((acc, item) => {
    item.keywords?.forEach(kw => {
      if (!acc[kw]) {
        acc[kw] = { count: 0, url: item.url };
      }
      acc[kw].count += 1;
    });
    return acc;
  }, {} as Record<string, { count: number; url: string }>);

  const sortedKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20);

  if (sortedKeywords.length === 0) return null;

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Trending Keywords</h3>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center justify-center flex-1">
        {sortedKeywords.map(([word, data], idx) => {
          const size = Math.min(1.5, 0.8 + data.count * 0.2);
          const opacity = Math.min(1, 0.4 + data.count * 0.15);
          
          return (
            <motion.a
              key={word}
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.1, opacity: 1, color: '#10b981' }}
              style={{ fontSize: `${size}rem` }}
              className="text-zinc-300 font-bold cursor-pointer transition-colors hover:text-emerald-400"
            >
              {word}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
