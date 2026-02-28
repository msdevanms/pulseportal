export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  keywords: string[];
  isNew?: boolean;
  factCheck?: {
    status: 'verified' | 'unverified' | 'disputed' | 'developing';
    score: number;
    reason?: string;
  };
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface SearchState {
  query: string;
  results: NewsItem[];
  isLoading: boolean;
  error: string | null;
}
