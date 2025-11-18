#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { QuoteStorage } from './storage.js';
import { DeepSeekService } from './deepseek.js';

const storage = new QuoteStorage();
const deepseek = new DeepSeekService();

const server = new Server(
  {
    name: 'wisdom-mcp-local',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_random_quote',
        description: 'Get a random wisdom quote from any author for inspiration',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_random_quote_by_category',
        description: 'Get a random quote from a specific category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Category to get quote from (stoic, mindfulness, productivity, self-help, relationships)',
            },
          },
          required: ['category'],
        },
      },
      {
        name: 'get_random_quote_by_author',
        description: 'Get a random quote from a specific author',
        inputSchema: {
          type: 'object',
          properties: {
            author: {
              type: 'string',
              description: 'Author name (e.g., "Marcus Aurelius", "Tara Brach", "David Allen")',
            },
          },
          required: ['author'],
        },
      },
      {
        name: 'get_quote_by_id',
        description: 'Get a specific quote by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            quote_id: {
              type: 'string',
              description: 'The ID of the quote',
            },
          },
          required: ['quote_id'],
        },
      },
      {
        name: 'search_quotes',
        description: 'Search for quotes by keyword, author, category, theme, or tags',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Keyword to search in quote text, author, theme, category, or tags',
            },
            author: {
              type: 'string',
              description: 'Filter by author name',
            },
            category: {
              type: 'string',
              description: 'Filter by category (stoic, mindfulness, productivity, self-help, relationships)',
            },
            theme: {
              type: 'string',
              description: 'Filter by theme (e.g., "control", "awareness", "boundaries")',
            },
          },
        },
      },
      {
        name: 'list_categories',
        description: 'List all available quote categories in the collection',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_authors',
        description: 'List all authors in the collection',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_stats',
        description: 'Get statistics about the quote collection (total quotes, categories, authors, favorites)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'add_quote',
        description: 'Add a new wisdom quote to the collection',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The quote text',
            },
            author: {
              type: 'string',
              description: 'The author of the quote',
            },
            source: {
              type: 'string',
              description: 'The source book or work',
            },
            category: {
              type: 'string',
              description: 'Category (stoic, mindfulness, productivity, self-help, relationships)',
            },
            theme: {
              type: 'string',
              description: 'The main theme (e.g., "courage", "awareness", "boundaries")',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional tags for better searchability',
            },
          },
          required: ['text', 'author', 'source', 'category', 'theme'],
        },
      },
      {
        name: 'get_quote_explanation',
        description: 'Get an AI-powered explanation of how to apply a quote to modern life and work',
        inputSchema: {
          type: 'object',
          properties: {
            quote_id: {
              type: 'string',
              description: 'The ID of the quote to explain',
            },
          },
          required: ['quote_id'],
        },
      },
      {
        name: 'generate_quote',
        description: 'Use AI to generate a new quote on a specific theme in a particular style',
        inputSchema: {
          type: 'object',
          properties: {
            theme: {
              type: 'string',
              description: 'The theme for the quote (e.g., "debugging", "work-life balance", "imposter syndrome")',
            },
            category: {
              type: 'string',
              description: 'Style category (stoic, mindfulness, productivity, self-help, relationships). Default: stoic',
            },
          },
          required: ['theme'],
        },
      },
      {
        name: 'toggle_favorite',
        description: 'Mark or unmark a quote as favorite',
        inputSchema: {
          type: 'object',
          properties: {
            quote_id: {
              type: 'string',
              description: 'The ID of the quote',
            },
          },
          required: ['quote_id'],
        },
      },
      {
        name: 'get_favorites',
        description: 'Get all quotes marked as favorites',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'update_quote_notes',
        description: 'Add or update personal notes on a quote',
        inputSchema: {
          type: 'object',
          properties: {
            quote_id: {
              type: 'string',
              description: 'The ID of the quote',
            },
            notes: {
              type: 'string',
              description: 'Your personal notes or reflections',
            },
          },
          required: ['quote_id', 'notes'],
        },
      },
      {
        name: 'delete_quote',
        description: 'Delete a quote from the collection',
        inputSchema: {
          type: 'object',
          properties: {
            quote_id: {
              type: 'string',
              description: 'The ID of the quote to delete',
            },
          },
          required: ['quote_id'],
        },
      },
    ],
  };
});

// Helper function to format a single quote
function formatQuote(q: any): string {
  let result = `"${q.text}"\n\n`;
  result += `— ${q.author}, ${q.source}\n`;
  result += `\nCategory: ${q.category}\n`;
  result += `Theme: ${q.theme}\n`;
  if (q.tags && q.tags.length > 0) {
    result += `Tags: ${q.tags.join(', ')}\n`;
  }
  result += `ID: ${q.id}${q.favorite ? ' ⭐' : ''}`;
  if (q.notes !== null) {
    result += `\n\nYour notes: ${q.notes}`;
  }
  return result;
}

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_random_quote': {
        const quote = await storage.getRandomQuote();
        if (!quote) {
          return {
            content: [{ type: 'text', text: 'No quotes available' }],
          };
        }
        return {
          content: [{ type: 'text', text: formatQuote(quote) }],
        };
      }

      case 'get_random_quote_by_category': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const quote = await storage.getRandomQuoteByCategory(args.category as string);
        if (!quote) {
          return {
            content: [
              {
                type: 'text',
                text: `No quotes found in category "${args.category}". Use list_categories to see available categories.`,
              },
            ],
          };
        }
        return {
          content: [{ type: 'text', text: formatQuote(quote) }],
        };
      }

      case 'get_random_quote_by_author': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const quote = await storage.getRandomQuoteByAuthor(args.author as string);
        if (!quote) {
          return {
            content: [
              {
                type: 'text',
                text: `No quotes found by author "${args.author}". Use list_authors to see available authors.`,
              },
            ],
          };
        }
        return {
          content: [{ type: 'text', text: formatQuote(quote) }],
        };
      }

      case 'get_quote_by_id': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const quote = await storage.getQuoteById(Number(args.quote_id));
        if (!quote) {
          return {
            content: [{ type: 'text', text: `Quote with ID ${args.quote_id} not found` }],
          };
        }
        return {
          content: [{ type: 'text', text: formatQuote(quote) }],
        };
      }

      case 'list_categories': {
        const categories = await storage.listCategories();
        if (categories.length === 0) {
          return {
            content: [{ type: 'text', text: 'No categories available yet' }],
          };
        }
        const stats = await storage.getStats();
        const formatted = categories
          .map((cat) => `• ${cat} (${stats.categoryCounts[cat]} quotes)`)
          .join('\n');
        return {
          content: [
            {
              type: 'text',
              text: `Available categories:\n\n${formatted}`,
            },
          ],
        };
      }

      case 'list_authors': {
        const authors = await storage.listAuthors();
        if (authors.length === 0) {
          return {
            content: [{ type: 'text', text: 'No authors available yet' }],
          };
        }
        const stats = await storage.getStats();
        const formatted = authors
          .map((author) => `• ${author} (${stats.authorCounts[author]} quotes)`)
          .join('\n');
        return {
          content: [
            {
              type: 'text',
              text: `Available authors:\n\n${formatted}`,
            },
          ],
        };
      }

      case 'get_stats': {
        const stats = await storage.getStats();
        let result = `📊 Quote Collection Statistics\n\n`;
        result += `Total Quotes: ${stats.totalQuotes}\n`;
        result += `Favorites: ${stats.favoriteCount}\n\n`;

        result += `Categories:\n`;
        Object.entries(stats.categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .forEach(([cat, count]) => {
            result += `  • ${cat}: ${count}\n`;
          });

        result += `\nTop Authors:\n`;
        Object.entries(stats.authorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .forEach(([author, count]) => {
            result += `  • ${author}: ${count}\n`;
          });

        return {
          content: [{ type: 'text', text: result }],
        };
      }

      case 'search_quotes': {
        const quotes = await storage.searchQuotes(args as any);
        if (quotes.length === 0) {
          return {
            content: [{ type: 'text', text: 'No quotes found matching your criteria' }],
          };
        }
        const formatted = quotes
          .map(
            (q) =>
              `[${q.id}${q.favorite ? ' ⭐' : ''}] "${q.text}"\n— ${q.author}, ${q.source}\nCategory: ${q.category} | Theme: ${q.theme}`
          )
          .join('\n\n');
        return {
          content: [{ type: 'text', text: `Found ${quotes.length} quote(s):\n\n${formatted}` }],
        };
      }

      case 'add_quote': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const newQuote = await storage.addQuote({
          text: args.text as string,
          author: args.author as string,
          source: args.source as string,
          category: args.category as string,
          theme: args.theme as string,
          tags: (args.tags as string[]) || [],
          favorite: false,
          notes: null,
          createdAt: new Date().toISOString(),
          addedBy: 'user',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Quote added successfully!\n\n${formatQuote(newQuote)}`,
            },
          ],
        };
      }

      case 'get_quote_explanation': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const quote = await storage.getQuoteById(Number(args.quote_id));
        if (!quote) {
          return {
            content: [{ type: 'text', text: `Quote with ID ${args.quote_id} not found` }],
          };
        }
        const explanation = await deepseek.explainQuote(quote);
        return {
          content: [
            {
              type: 'text',
              text: `"${quote.text}"\n— ${quote.author}, ${quote.source}\n\n📖 Explanation:\n\n${explanation}`,
            },
          ],
        };
      }

      case 'generate_quote': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const category = (args.category as string) || 'stoic';
        const generatedText = await deepseek.generateQuote(args.theme as string, category);
        return {
          content: [
            {
              type: 'text',
              text: `Generated ${category} quote on "${args.theme}":\n\n"${generatedText}"\n\nWould you like to add this to your collection? Use add_quote if so.`,
            },
          ],
        };
      }

      case 'toggle_favorite': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const updated = await storage.toggleFavorite(Number(args.quote_id));
        if (!updated) {
          return {
            content: [{ type: 'text', text: `Quote with ID ${args.quote_id} not found` }],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Quote ${updated.favorite ? 'marked as favorite ⭐' : 'removed from favorites'}\n\n"${updated.text}"\n— ${updated.author}`,
            },
          ],
        };
      }

      case 'get_favorites': {
        const favorites = await storage.getFavorites();
        if (favorites.length === 0) {
          return {
            content: [{ type: 'text', text: 'No favorite quotes yet' }],
          };
        }
        const formatted = favorites
          .map((q) => `[${q.id}] "${q.text}"\n— ${q.author}, ${q.source}\nCategory: ${q.category}`)
          .join('\n\n');
        return {
          content: [{ type: 'text', text: `Your ${favorites.length} favorite quote(s):\n\n${formatted}` }],
        };
      }

      case 'update_quote_notes': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const updated = await storage.updateQuote(Number(args.quote_id), {
          notes: args.notes as string,
        });
        if (!updated) {
          return {
            content: [{ type: 'text', text: `Quote with ID ${args.quote_id} not found` }],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Notes updated for:\n\n"${updated.text}"\n— ${updated.author}\n\nYour notes: ${updated.notes}`,
            },
          ],
        };
      }

      case 'delete_quote': {
        if (!args) {
          return {
            content: [{ type: 'text', text: 'Missing required arguments' }],
            isError: true,
          };
        }
        const deleted = await storage.deleteQuote(Number(args.quote_id));
        if (!deleted) {
          return {
            content: [{ type: 'text', text: `Quote with ID ${args.quote_id} not found` }],
          };
        }
        return {
          content: [{ type: 'text', text: `Quote ${args.quote_id} deleted successfully` }],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Wisdom MCP Local Server v2.0.0 running on stdio');
  console.error('Supporting: Stoic, Mindfulness, Productivity, Self-Help, and Relationship wisdom');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
