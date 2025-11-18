export interface Quote {
  id: number;
  text: string;
  author: string;
  source: string;
  category: string; // "stoic" | "mindfulness" | "productivity" | "self-help" | "relationships"
  theme: string; // Specific topic within category
  tags?: string[]; // Additional searchable tags
  favorite: boolean;
  notes: string | null;
  createdAt: string;
  addedBy: string; // "seed" | "user" | "manual" | "ai"
}

export interface QuotesMetadata {
  lastId: number;
  version: string;
  lastModified: string;
  categories: string[]; // Track available categories
  authors: string[]; // Track available authors
}

export interface QuotesData {
  metadata: QuotesMetadata;
  quotes: Quote[];
}

export interface SearchParams {
  query?: string;
  author?: string;
  category?: string;
  theme?: string;
  tags?: string[];
}

export interface QuoteStats {
  totalQuotes: number;
  favoriteCount: number;
  categoryCounts: Record<string, number>;
  authorCounts: Record<string, number>;
}
