# Changelog

All notable changes to the Wisdom MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-18

### 🎉 Major Release - Multi-Author Wisdom Platform

This release transforms the project from a Stoic-only quote server to a comprehensive wisdom platform featuring 5 philosophical categories and 8 renowned authors.

### Added

#### New Authors & Categories
- **Mindfulness**: Tara Brach (Radical Acceptance, Radical Compassion, True Refuge)
- **Productivity**: David Allen (Getting Things Done)
- **Self-Help**: Jen Sincero (You Are a Badass), Mark Manson (The Subtle Art of Not Giving a F*ck)
- **Relationships**: Robert Glover (No More Mr. Nice Guy)
- **75 curated quotes** across all categories (up from 20)

#### New MCP Tools (7 new tools)
- `get_random_quote_by_category` - Get quotes from specific wisdom categories
- `get_random_quote_by_author` - Get quotes from specific authors
- `get_quote_by_id` - Retrieve quotes by ID
- `list_categories` - Browse all available categories with counts
- `list_authors` - Browse all authors with quote counts
- `get_stats` - Collection analytics (totals, categories, authors, favorites)
- Enhanced `search_quotes` - Now supports category and tags filtering

#### Enhanced Features
- **Category-aware AI prompting** - DeepSeek explanations adapt to quote category
- **Tags support** - All quotes now have searchable tags
- **Auto-updating metadata** - Categories and authors automatically tracked
- **Statistics & analytics** - Track collection growth and usage
- **Enhanced search** - Filter by category, theme, tags, author, or keyword

#### Developer Experience
- Comprehensive `README.md` with full documentation
- `USAGE_EXAMPLES.md` with practical examples for all 16 tools
- `CHANGELOG.md` (this file) for tracking changes
- `.env.example` for easy environment setup
- `sample-import.txt` for learning the import format
- Enhanced TypeScript interfaces (`QuoteStats`, updated `Quote`)

### Changed

#### Breaking Changes
- **Package renamed** from `stoic-mcp-local` to `wisdom-mcp-local`
- **Schema v2.0.0** - New quote structure with `category` and `tags` fields
- **MCP server name** changed to `wisdom-mcp` in configurations
- **Quote interface** now requires `category` field

#### Improvements
- **MCP SDK upgraded** from v1.0.4 to v1.22.0 (latest)
- **Storage layer enhanced** with new methods:
  - `getStats()` - Collection analytics
  - `listCategories()` - Get all categories
  - `listAuthors()` - Get all authors
  - `getRandomQuoteByCategory()` - Category-filtered random quotes
  - `getRandomQuoteByAuthor()` - Author-filtered random quotes
  - `getQuoteById()` - Direct quote retrieval
- **Import utility** now auto-detects category from author name
- **Search algorithm** expanded to include category and tags
- **Quote formatting** enhanced with category, theme, and tags display

#### Data Schema Changes
```typescript
// v1.0.0 Quote
{
  id, text, author, source, theme, favorite, notes, createdAt, addedBy
}

// v2.0.0 Quote (added fields)
{
  id, text, author, source, 
  category,        // NEW: stoic | mindfulness | productivity | self-help | relationships
  theme, 
  tags,            // NEW: string[] for enhanced search
  favorite, notes, createdAt, addedBy
}

// v2.0.0 Metadata (added fields)
{
  lastId, version, lastModified,
  categories,      // NEW: string[] tracking unique categories
  authors          // NEW: string[] tracking unique authors
}
```

### Fixed
- Import utility now properly handles category field
- Metadata automatically updates when quotes are added/deleted
- TypeScript compilation with strict type checking

### Documentation
- Updated `CLAUDE.md` with v2.0.0 architecture
- Enhanced `README.md` with complete feature documentation
- Added `USAGE_EXAMPLES.md` with practical examples
- Added `.env.example` for environment setup
- Added `sample-import.txt` for bulk import learning

### Technical Details
- **Dependencies**: @modelcontextprotocol/sdk v1.22.0
- **Node**: 18+ required
- **TypeScript**: 5.3.3
- **Total Tools**: 16 (was 9)
- **Total Quotes**: 75 (was 20)
- **Categories**: 5 (was 1)
- **Authors**: 8 (was 3)

---

## [1.0.0] - 2025-10-23

### Initial Release - Stoic Philosophy MCP Server

#### Added
- Basic MCP server implementation with stdio transport
- JSON-based local storage (`quotes.json`)
- 20 curated Stoic quotes from Marcus Aurelius, Seneca, and Epictetus
- 9 MCP tools:
  - `get_random_quote` - Random quote retrieval
  - `search_quotes` - Search by author, theme, or keyword
  - `add_quote` - Add new quotes
  - `get_quote_explanation` - AI-powered explanations via DeepSeek
  - `generate_quote` - AI quote generation
  - `toggle_favorite` - Mark favorites
  - `get_favorites` - View favorites
  - `update_quote_notes` - Personal notes
  - `delete_quote` - Remove quotes
- Bulk import utility (`import-quotes.ts`)
- DeepSeek AI integration for explanations
- Theme-based auto-detection (18 themes)

#### Technical Implementation
- MCP SDK v1.0.4
- TypeScript with ES modules
- File-based JSON storage
- Auto-incrementing IDs from metadata
- Schema v1.0.0

---

## Future Roadmap

### Planned for v2.1.0
- [ ] Export functionality (PDF, CSV, Markdown)
- [ ] Quote of the Day feature with scheduling
- [ ] Enhanced AI with context memory
- [ ] Quote sharing with formatting options

### Planned for v3.0.0
- [ ] Azure Cosmos DB implementation
- [ ] Multi-user support
- [ ] REST API layer
- [ ] Web UI for quote management
- [ ] Advanced analytics and insights

---

**Built for O'Reilly Live Training**
*Teaching MCP Architecture, TypeScript, and AI Integration*
