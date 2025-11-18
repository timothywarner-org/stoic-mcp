# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server delivering wisdom from ancient Stoic philosophers and modern personal development authors, including Tara Brach, David Allen, Jen Sincero, Robert Glover, and Mark Manson. Built as a demonstration project for O'Reilly Live Training, it showcases MCP architecture, TypeScript development, and AI integration using the latest MCP SDK (v1.22.0).

## Repository Structure

This is a **monorepo** with npm workspaces:

- `local/` - Local implementation using JSON file storage (fully functional)
- `azure/` - Azure implementation with Cosmos DB (planned/in development)

The project demonstrates a migration path from simple local development to cloud-based production deployment.

## Development Commands

### Root Level (Monorepo)
```bash
npm run build        # Build all workspaces
npm run test         # Run tests in all workspaces
npm run clean        # Clean all workspaces
```

### Local Implementation
```bash
cd local
npm install          # Install dependencies
npm run build        # Compile TypeScript to dist/
npm run watch        # Watch mode for development
npm run dev          # Build and run in one command
npm start            # Run the built server
npm run clean        # Remove dist/ folder
```

## Architecture

### MCP Server Pattern

The local implementation follows the Anthropic Model Context Protocol specification:

- **Transport**: Uses `StdioServerTransport` for communication with Claude Desktop
- **Server Setup**: Configured in `local/src/index.ts` with server metadata and capabilities
- **Tool Registration**: Tools are registered via `ListToolsRequestSchema` handler
- **Tool Execution**: Handled by `CallToolRequestSchema` handler with a switch statement

### Core Components

**`local/src/index.ts`** - Main MCP server entrypoint (v2.0.0)
- Initializes `QuoteStorage` and `DeepSeekService`
- Registers 16 tools covering discovery, search, management, and AI features
- Core tools: get_random_quote, get_random_quote_by_category, get_random_quote_by_author, get_quote_by_id
- Discovery: list_categories, list_authors, get_stats
- Search: search_quotes (with category, theme, tags support)
- Management: add_quote, toggle_favorite, get_favorites, update_quote_notes, delete_quote
- AI: get_quote_explanation, generate_quote
- Handles tool invocations via switch statement
- Uses stdio transport for communication

**`local/src/storage.ts`** - File-based storage layer
- Manages `quotes.json` with read/write operations
- Implements CRUD operations for quotes
- Auto-generates incrementing IDs
- Advanced search/filter by author, category, theme, tags, or keyword
- Analytics methods: getStats(), listCategories(), listAuthors()
- Specialized retrieval: getRandomQuoteByCategory(), getRandomQuoteByAuthor()
- Auto-maintains metadata (categories, authors lists)

**`local/src/deepseek.ts`** - AI integration layer
- Integrates DeepSeek API for quote explanations
- Category-aware prompting (Stoic, Mindfulness, Productivity, Self-Help, Relationships)
- Generates quotes in different styles based on category
- Context-specific explanations tailored to quote category
- Requires `DEEPSEEK_API_KEY` environment variable

**`local/src/types.ts`** - TypeScript interfaces
- `Quote` interface with id, text, author, source, category, theme, tags, favorite, notes, createdAt, addedBy
- `QuotesData` wrapper for the JSON structure
- `QuotesMetadata` with lastId, version, categories, authors tracking
- `SearchParams` for query parameters (query, author, category, theme, tags)
- `QuoteStats` for analytics data

### Data Flow

1. User makes request in Claude Desktop
2. MCP server receives tool call via stdio
3. Request handler routes to appropriate method (storage or DeepSeek)
4. Storage operations read/write to `quotes.json`
5. AI operations call DeepSeek API with structured prompts
6. Response formatted and returned via MCP protocol

## Configuration

### Environment Variables

- `DEEPSEEK_API_KEY` - Required for AI features (explanations and quote generation)
  - Can be set in `.env` file (local development)
  - Can be set in Claude Desktop config (production use)

### Claude Desktop Integration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wisdom-mcp": {
      "command": "node",
      "args": [
        "C:\\github\\stoic-mcp\\local\\dist\\index.js"
      ],
      "env": {
        "DEEPSEEK_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Notes:
- DEEPSEEK_API_KEY is inherited from system environment variables
- Update the path to match your installation location
- Use double backslashes on Windows

## Data Storage

The local implementation uses `local/quotes.json` for persistence.

### Schema v2.0.0

Root structure:
```typescript
{
  metadata: {
    lastId: number;        // Highest quote ID, used for ID generation
    version: string;       // Schema version (currently "2.0.0")
    lastModified: string;  // ISO timestamp, auto-updated on writes
    categories: string[];  // Array of unique categories in collection
    authors: string[];     // Array of unique authors in collection
  },
  quotes: Quote[]
}
```

Each quote has:
- `id`: Numeric auto-incrementing ID (generated from metadata.lastId)
- `text`: Quote text
- `author`: Author name
- `source`: Source book/work
- `category`: Category (stoic | mindfulness | productivity | self-help | relationships)
- `theme`: Specific theme within category (e.g., "courage", "awareness", "boundaries")
- `tags`: Optional array of searchable tags (e.g., ["mindset", "strength", "power"])
- `favorite`: Boolean flag
- `notes`: Personal notes (string | null)
- `createdAt`: ISO timestamp when quote was added
- `addedBy`: Source of quote ("seed", "user", "manual", "ai")

### Categories

The collection is organized into 5 main categories:

- **stoic**: Ancient Stoic philosophers (Marcus Aurelius, Seneca, Epictetus)
- **mindfulness**: Mindfulness and meditation teachers (Tara Brach)
- **productivity**: Personal productivity experts (David Allen)
- **self-help**: Self-empowerment and personal growth (Jen Sincero, Mark Manson)
- **relationships**: Healthy relationships and boundaries (Robert Glover)

### Bulk Import Utility

The `import-quotes.ts` utility allows bulk importing quotes:
- Source location: `local/quotes-source/` (all import files must be placed here)
- Run with: `npm run import <filename.txt>`
- Format: `"Quote text" - Author, Source` (one per line)
- Auto-detects category from author name
- Auto-detects theme from quote content keywords
- Auto-generates empty tags array (can be manually filled later)
- Atomically appends to quotes.json
- Updates metadata.lastId, lastModified, categories, and authors
- Example: `npm run import sample-import.txt`

## Package Information

- **Name**: wisdom-mcp-local (v2.0.0)
- **MCP SDK**: @modelcontextprotocol/sdk v1.22.0
- **Node**: 18+
- **TypeScript**: 5.3.3
- **License**: MIT

## Module System

Uses ES modules (`"type": "module"` in package.json):
- Import statements use `.js` extensions for TypeScript files
- Uses `fileURLToPath` and `dirname` for `__dirname` equivalent

## Error Handling

- Storage operations return `null` for not found items
- DeepSeek service provides fallback messages when API key is missing
- Tool handlers wrap operations in try/catch and return error responses via MCP protocol
- Console.error used for server-side logging (visible in Claude Desktop logs)
