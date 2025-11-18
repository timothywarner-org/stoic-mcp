import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Quote, QuotesData, SearchParams, QuoteStats } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const QUOTES_FILE = join(__dirname, '..', 'quotes.json');

export class QuoteStorage {
  private async readQuotes(): Promise<QuotesData> {
    try {
      const data = await readFile(QUOTES_FILE, 'utf-8');
      const parsed = JSON.parse(data);

      // Ensure metadata has required fields
      if (!parsed.metadata.categories) {
        parsed.metadata.categories = [];
      }
      if (!parsed.metadata.authors) {
        parsed.metadata.authors = [];
      }

      return parsed;
    } catch (error) {
      console.error('Error reading quotes file:', error);
      return {
        metadata: {
          lastId: 0,
          version: '2.0.0',
          lastModified: new Date().toISOString(),
          categories: [],
          authors: []
        },
        quotes: []
      };
    }
  }

  private async writeQuotes(data: QuotesData): Promise<void> {
    try {
      // Update lastModified timestamp
      data.metadata.lastModified = new Date().toISOString();

      // Update metadata with unique categories and authors
      const categories = new Set<string>();
      const authors = new Set<string>();

      data.quotes.forEach(quote => {
        categories.add(quote.category);
        authors.add(quote.author);
      });

      data.metadata.categories = Array.from(categories).sort();
      data.metadata.authors = Array.from(authors).sort();

      await writeFile(QUOTES_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing quotes file:', error);
      throw new Error('Failed to write quotes');
    }
  }

  async getRandomQuote(): Promise<Quote | null> {
    const data = await this.readQuotes();
    if (data.quotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    return data.quotes[randomIndex];
  }

  async searchQuotes(params: SearchParams): Promise<Quote[]> {
    const data = await this.readQuotes();
    let results = data.quotes;

    if (params.author) {
      results = results.filter(q =>
        q.author.toLowerCase().includes(params.author!.toLowerCase())
      );
    }

    if (params.category) {
      results = results.filter(q =>
        q.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params.theme) {
      results = results.filter(q =>
        q.theme.toLowerCase().includes(params.theme!.toLowerCase())
      );
    }

    if (params.tags && params.tags.length > 0) {
      results = results.filter(q => {
        if (!q.tags) return false;
        return params.tags!.some(tag =>
          q.tags!.some(qtag => qtag.toLowerCase().includes(tag.toLowerCase()))
        );
      });
    }

    if (params.query) {
      const searchLower = params.query.toLowerCase();
      results = results.filter(q =>
        q.text.toLowerCase().includes(searchLower) ||
        q.author.toLowerCase().includes(searchLower) ||
        q.theme.toLowerCase().includes(searchLower) ||
        q.category.toLowerCase().includes(searchLower) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    return results;
  }

  async addQuote(quote: Omit<Quote, 'id'>): Promise<Quote> {
    const data = await this.readQuotes();

    // Generate new ID from metadata
    const newId = data.metadata.lastId + 1;

    const newQuote: Quote = {
      ...quote,
      id: newId
    };

    data.quotes.push(newQuote);
    data.metadata.lastId = newId;
    await this.writeQuotes(data);

    return newQuote;
  }

  async updateQuote(id: number, updates: Partial<Quote>): Promise<Quote | null> {
    const data = await this.readQuotes();
    const index = data.quotes.findIndex(q => q.id === id);

    if (index === -1) return null;

    data.quotes[index] = { ...data.quotes[index], ...updates };
    await this.writeQuotes(data);

    return data.quotes[index];
  }

  async deleteQuote(id: number): Promise<boolean> {
    const data = await this.readQuotes();
    const initialLength = data.quotes.length;

    data.quotes = data.quotes.filter(q => q.id !== id);

    if (data.quotes.length === initialLength) {
      return false; // Quote not found
    }

    await this.writeQuotes(data);
    return true;
  }

  async getFavorites(): Promise<Quote[]> {
    const data = await this.readQuotes();
    return data.quotes.filter(q => q.favorite);
  }

  async toggleFavorite(id: number): Promise<Quote | null> {
    const data = await this.readQuotes();
    const quote = data.quotes.find(q => q.id === id);

    if (!quote) return null;

    quote.favorite = !quote.favorite;
    await this.writeQuotes(data);

    return quote;
  }

  async getStats(): Promise<QuoteStats> {
    const data = await this.readQuotes();
    const categoryCounts: Record<string, number> = {};
    const authorCounts: Record<string, number> = {};
    let favoriteCount = 0;

    data.quotes.forEach(quote => {
      // Count categories
      categoryCounts[quote.category] = (categoryCounts[quote.category] || 0) + 1;

      // Count authors
      authorCounts[quote.author] = (authorCounts[quote.author] || 0) + 1;

      // Count favorites
      if (quote.favorite) favoriteCount++;
    });

    return {
      totalQuotes: data.quotes.length,
      favoriteCount,
      categoryCounts,
      authorCounts
    };
  }

  async getQuoteById(id: number): Promise<Quote | null> {
    const data = await this.readQuotes();
    return data.quotes.find(q => q.id === id) || null;
  }

  async getRandomQuoteByCategory(category: string): Promise<Quote | null> {
    const data = await this.readQuotes();
    const categoryQuotes = data.quotes.filter(
      q => q.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryQuotes.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    return categoryQuotes[randomIndex];
  }

  async getRandomQuoteByAuthor(author: string): Promise<Quote | null> {
    const data = await this.readQuotes();
    const authorQuotes = data.quotes.filter(
      q => q.author.toLowerCase().includes(author.toLowerCase())
    );

    if (authorQuotes.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * authorQuotes.length);
    return authorQuotes[randomIndex];
  }

  async listCategories(): Promise<string[]> {
    const data = await this.readQuotes();
    return data.metadata.categories;
  }

  async listAuthors(): Promise<string[]> {
    const data = await this.readQuotes();
    return data.metadata.authors;
  }
}
