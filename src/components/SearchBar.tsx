import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all rounded-full" />
        <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-full px-6 py-4 focus-within:border-emerald-500/50 transition-all">
          <Search className="w-5 h-5 text-zinc-400 mr-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Topic, വാർത്തകൾ, समाचार..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-500 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-zinc-950 font-bold rounded-full transition-all"
          >
            {isLoading ? 'Pulsing...' : 'Pulse'}
          </button>
        </div>
      </div>
    </form>
  );
};
