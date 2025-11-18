# Wisdom MCP Server - Local Edition

> A comprehensive Model Context Protocol (MCP) server delivering wisdom from ancient Stoic philosophers and modern personal development authors. Built for O'Reilly Live Training with educational depth and rich documentation.

## 🌟 Overview

The Wisdom MCP Server provides Claude Desktop and other MCP clients with access to a curated collection of 75+ wisdom quotes from:

- **Stoic Philosophers**: Marcus Aurelius, Seneca, Epictetus
- **Mindfulness Teachers**: Tara Brach
- **Productivity Experts**: David Allen (Getting Things Done)
- **Self-Help Authors**: Jen Sincero, Mark Manson
- **Relationship Experts**: Robert Glover

### Version 2.0.0 - What's New

- ✅ **Latest MCP SDK** (v1.22.0) - Using cutting-edge protocol features
- ✅ **5 Wisdom Categories** - Stoic, Mindfulness, Productivity, Self-Help, Relationships
- ✅ **75+ Curated Quotes** - Hand-selected wisdom from 8 renowned authors
- ✅ **16 MCP Tools** - Comprehensive quote management and exploration
- ✅ **Smart AI Integration** - Context-aware explanations for each category
- ✅ **Tags & Themes** - Enhanced searchability and organization
- ✅ **Stats & Analytics** - Track your collection growth

## 📚 Features

### Core Capabilities

1. **Random Quote Access**
   - Get random quotes from any author
   - Filter by category (stoic, mindfulness, productivity, self-help, relationships)
   - Filter by specific author

2. **Advanced Search**
   - Full-text search across quote content
   - Filter by category, theme, author, or tags
   - Combine multiple search criteria

3. **Collection Management**
   - Add new quotes with full metadata
   - Update personal notes on quotes
   - Mark favorites
   - Delete quotes
   - Import quotes in bulk

4. **AI-Powered Features** (requires DEEPSEEK_API_KEY)
   - Get contextual explanations for any quote
   - Generate new quotes on custom themes
   - Category-specific AI prompting (e.g., Stoic vs. Mindfulness style)

5. **Analytics & Discovery**
   - View collection statistics
   - Browse by category
   - List all authors with quote counts
   - Track favorites

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Claude Desktop (for MCP integration)
- (Optional) DeepSeek API key for AI features

### Installation

\`\`\`bash
# Navigate to the local directory
cd local

# Install dependencies
npm install

# Build the project
npm run build

# Test the server
npm start
\`\`\`

### Configure Claude Desktop

Add to your \`claude_desktop_config.json\`:

**macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
**Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`

\`\`\`json
{
  "mcpServers": {
    "wisdom-mcp": {
      "command": "node",
      "args": [
        "/full/path/to/stoic-mcp/local/dist/index.js"
      ],
      "env": {
        "DEEPSEEK_API_KEY": "your-api-key-here"
      }
    }
  }
}
\`\`\`

**Note**: Replace \`/full/path/to/\` with your actual path. On Windows, use double backslashes or forward slashes.

### Verify Installation

1. Restart Claude Desktop
2. Look for the 🔨 hammer icon indicating MCP tools are available
3. Try asking Claude: "Get me a random wisdom quote"
4. You should see 16 tools available from the wisdom-mcp server

## 🛠️ Available MCP Tools

### Discovery & Browsing

1. **\`get_random_quote\`**
   - Get a random quote from the entire collection
   - Perfect for daily inspiration

2. **\`get_random_quote_by_category\`**
   - Parameters: \`category\` (stoic, mindfulness, productivity, self-help, relationships)
   - Get category-specific wisdom

3. **\`get_random_quote_by_author\`**
   - Parameters: \`author\` (e.g., "Marcus Aurelius", "Tara Brach")
   - Explore quotes from specific thinkers

4. **\`get_quote_by_id\`**
   - Parameters: \`quote_id\`
   - Retrieve a specific quote

5. **\`list_categories\`**
   - View all available categories with quote counts

6. **\`list_authors\`**
   - View all authors with quote counts

7. **\`get_stats\`**
   - Collection statistics: totals, categories, top authors, favorites

### Search & Filter

8. **\`search_quotes\`**
   - Parameters: \`query\`, \`author\`, \`category\`, \`theme\`, \`tags\`
   - Powerful multi-criteria search
   - Example: Find all productivity quotes about "focus"

### Personal Collection Management

9. **\`add_quote\`**
   - Parameters: \`text\`, \`author\`, \`source\`, \`category\`, \`theme\`, \`tags\` (optional)
   - Add quotes to your collection

10. **\`toggle_favorite\`**
    - Parameters: \`quote_id\`
    - Mark/unmark quotes as favorites

11. **\`get_favorites\`**
    - View all your favorite quotes

12. **\`update_quote_notes\`**
    - Parameters: \`quote_id\`, \`notes\`
    - Add personal reflections to quotes

13. **\`delete_quote\`**
    - Parameters: \`quote_id\`
    - Remove quotes from collection

### AI-Powered Features

14. **\`get_quote_explanation\`**
    - Parameters: \`quote_id\`
    - Get AI-powered practical explanations
    - Adapts to quote category (Stoic, Mindfulness, etc.)

15. **\`generate_quote\`**
    - Parameters: \`theme\`, \`category\` (optional)
    - Generate new quotes on custom themes
    - Style adapts to category

## 📖 Understanding the Data Model

### Quote Schema

\`\`\`typescript
{
  id: number;              // Auto-incrementing unique ID
  text: string;            // The quote text
  author: string;          // Author name
  source: string;          // Book or work
  category: string;        // stoic | mindfulness | productivity | self-help | relationships
  theme: string;           // Specific theme (e.g., "courage", "awareness", "boundaries")
  tags?: string[];         // Additional searchable tags
  favorite: boolean;       // User favorite flag
  notes: string | null;    // Personal notes
  createdAt: string;       // ISO timestamp
  addedBy: string;         // "seed" | "user" | "manual" | "ai"
}
\`\`\`

### Categories Explained

| Category | Focus | Example Authors |
|----------|-------|----------------|
| **stoic** | Ancient wisdom, control, virtue, resilience | Marcus Aurelius, Seneca, Epictetus |
| **mindfulness** | Presence, acceptance, compassion | Tara Brach |
| **productivity** | Systems, organization, stress-free productivity | David Allen |
| **self-help** | Empowerment, mindset, personal growth | Jen Sincero, Mark Manson |
| **relationships** | Boundaries, authenticity, healthy connections | Robert Glover |

For complete documentation, examples, and development guides, see the full README in the repository.

## 🎓 Learning Resources

This project demonstrates key MCP concepts:
- Server registration and capabilities
- Tool definition with JSON Schema
- Request handling patterns
- Transport layer (stdio)
- TypeScript best practices
- Error handling strategies

## 📄 License

MIT License - Free for educational and personal use

---

**Built for O'Reilly Live Training**
*Demonstrating MCP architecture, TypeScript development, and AI integration*

Version 2.0.0 | Node 18+ | MCP SDK 1.22.0
