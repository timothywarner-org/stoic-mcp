# Stoic MCP - Local Implementation

Local Node.js MCP server using JSON file storage for Stoic philosophy quotes.

## Features

- ✅ **CRUD Operations**: Full create, read, update, delete support
- 📝 **JSON Storage**: Simple file-based persistence
- 🤖 **AI Integration**: DeepSeek-powered quote explanations
- ⭐ **Favorites**: Mark quotes that resonate
- 🔍 **Search**: Filter by author, theme, or keywords
- 📝 **Personal Notes**: Add reflections to quotes

## Prerequisites

- Node.js 18+ and npm
- DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)

## Quick Start

### 1. Install Dependencies

```bash
cd local
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
DEEPSEEK_API_KEY=your_key_here
```

### 3. Build and Run

```bash
npm run build
npm start
```

### 4. Configure in Claude Desktop

Add to your Claude Desktop config:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

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

**Notes:**
- Update the path to match your installation location
- Use double backslashes on Windows (e.g., `C:\\github\\...`)
- DEEPSEEK_API_KEY is inherited from system environment variables

## Available Tools

### `get_random_quote`
Get a random Stoic quote for inspiration.

**Example:** "I need some motivation"

### `search_quotes`
Search by author, theme, or keyword.

**Parameters:**
- `query` (optional): Keyword search
- `author` (optional): Filter by author
- `theme` (optional): Filter by theme

**Example:** "Find quotes about courage by Marcus Aurelius"

### `add_quote`
Add a new quote to the collection.

**Parameters:**
- `text`: The quote text
- `author`: Quote author
- `source`: Source book/work
- `theme`: Main theme

### `get_quote_explanation`
Get AI-powered practical explanation.

**Parameters:**
- `quote_id`: ID of the quote

**Example:** "Explain quote 5 in terms of handling production incidents"

### `toggle_favorite`
Mark or unmark as favorite.

**Parameters:**
- `quote_id`: ID of the quote

### `get_favorites`
Retrieve all favorite quotes.

### `update_quote_notes`
Add personal notes to a quote.

**Parameters:**
- `quote_id`: ID of the quote
- `notes`: Your reflection

### `delete_quote`
Remove a quote from the collection.

**Parameters:**
- `quote_id`: ID of the quote

### `generate_quote`
Use AI to generate new Stoic-style quote.

**Parameters:**
- `theme`: Theme for generation (e.g., "debugging", "code review")

## Data Structure

Quotes are stored in `quotes.json`:

```json
{
  "quotes": [
    {
      "id": "1",
      "text": "Quote text here",
      "author": "Marcus Aurelius",
      "source": "Meditations",
      "theme": "control",
      "favorite": false,
      "notes": ""
    }
  ]
}
```

## Development

```bash
# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean
```

## Troubleshooting

**Issue:** "DEEPSEEK_API_KEY not set" warning

**Solution:** Ensure your `.env` file exists and contains your API key, or set it in Claude Desktop config.

**Issue:** Quotes not persisting

**Solution:** Check file permissions on `quotes.json` and ensure the path is correct.

## Next Steps

Ready to scale to Azure? Check out the [Azure implementation](../azure/README.md) using Cosmos DB.

## License

MIT - See root LICENSE file
