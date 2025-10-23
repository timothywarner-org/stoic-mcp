# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for delivering Stoic philosophy quotes with AI-powered explanations. Built as a demonstration project for O'Reilly Live Training, it showcases the architectural progression from local JSON storage to Azure Cosmos DB.

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

**`local/src/index.ts`** - Main MCP server entrypoint
- Initializes `QuoteStorage` and `DeepSeekService`
- Registers 9 tools (get_random_quote, search_quotes, add_quote, get_quote_explanation, toggle_favorite, get_favorites, update_quote_notes, delete_quote, generate_quote)
- Handles tool invocations via switch statement
- Uses stdio transport for communication

**`local/src/storage.ts`** - File-based storage layer
- Manages `quotes.json` with read/write operations
- Implements CRUD operations for quotes
- Auto-generates incrementing IDs
- Search/filter functionality by author, theme, or keyword

**`local/src/deepseek.ts`** - AI integration layer
- Integrates DeepSeek API for quote explanations
- Generates new Stoic-style quotes on demand
- Requires `DEEPSEEK_API_KEY` environment variable

**`local/src/types.ts`** - TypeScript interfaces
- `Quote` interface with id, text, author, source, theme, favorite, notes
- `QuotesData` wrapper for the JSON structure
- `SearchParams` for query parameters

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
    "stoic-mcp": {
      "command": "node",
      "args": [
        "C:\\github\\stoic-mcp\\local\\dist\\index.js"
      ]
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

### Schema v1.0.0

Root structure:
```typescript
{
  metadata: {
    lastId: number;        // Highest quote ID, used for ID generation
    version: string;       // Schema version (currently "1.0.0")
    lastModified: string;  // ISO timestamp, auto-updated on writes
  },
  quotes: Quote[]
}
```

Each quote has:
- `id`: Numeric auto-incrementing ID (generated from metadata.lastId)
- `text`: Quote text
- `author`: Author name
- `source`: Source book/work
- `theme`: Theme category (string)
- `favorite`: Boolean flag
- `notes`: Personal notes (string | null)
- `createdAt`: ISO timestamp when quote was added
- `addedBy`: Source of quote ("seed", "user", "manual")

### Bulk Import Utility

The `import-quotes.ts` utility allows bulk importing quotes:
- Source location: `local/quotes-source/` (all import files must be placed here)
- Run with: `npm run import <filename.txt>`
- Format: `"Quote text" - Author, Source` (one per line)
- Auto-detects themes from keywords (18 theme categories)
- Atomically appends to quotes.json
- Updates metadata.lastId and metadata.lastModified
- See `local/IMPORT_GUIDE.md` for full documentation
- Example: `npm run import sample-import.txt`

The Azure implementation will migrate this to Cosmos DB with similar schema.

## Module System

Uses ES modules (`"type": "module"` in package.json):
- Import statements use `.js` extensions for TypeScript files
- Uses `fileURLToPath` and `dirname` for `__dirname` equivalent

## Error Handling

- Storage operations return `null` for not found items
- DeepSeek service provides fallback messages when API key is missing
- Tool handlers wrap operations in try/catch and return error responses via MCP protocol
- Console.error used for server-side logging (visible in Claude Desktop logs)
