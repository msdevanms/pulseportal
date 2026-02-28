import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MapPin, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsGridProps {
  items: NewsItem[];
}

export const NewsGrid: React.FC<NewsGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card group overflow-hidden flex flex-col h-full hover:border-emerald-500/30 transition-all"
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-emerald-500 text-zinc-950 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                {item.source}
              </span>
              {item.isNew && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-white text-zinc-950 text-[10px] font-black rounded-full uppercase tracking-wider shadow-lg border border-emerald-500"
                >
                  New
                </motion.span>
              )}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-4 text-zinc-500 text-xs mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.publishedAt}
              </span>
              {item.location && (
                <span className="flex items-center gap-1 text-emerald-400/80">
                  <MapPin className="w-3 h-3" />
                  {item.location.name}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-zinc-100 mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-zinc-400 text-sm mb-6 line-clamp-3 flex-1">
              {item.description}
            </p>
            
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors"
            >
              Read full update
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
