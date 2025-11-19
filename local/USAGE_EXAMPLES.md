# Usage Examples - Wisdom MCP Server

This guide shows practical examples of using all 16 MCP tools in Claude Desktop.

## 🎯 Quick Start Examples

### Daily Inspiration

**Get a random quote:**
```
Get me a random wisdom quote
```

**Get a category-specific quote:**
```
Give me a mindfulness quote for today
```

**Get a quote from a specific author:**
```
Show me a quote from David Allen
```

## 📊 Discovery & Exploration

### Browse the Collection

**See all categories:**
```
List all the quote categories available
```

**See all authors:**
```
Show me all the authors in the collection
```

**Get collection statistics:**
```
What are the statistics for the quote collection?
```

## 🔍 Search & Filter

### Basic Search

**Search by keyword:**
```
Find quotes about "courage"
```

**Search by author:**
```
Search for quotes by Marcus Aurelius
```

**Search by category:**
```
Show me all stoic quotes
```

### Advanced Search

**Search by theme:**
```
Find quotes with the theme of "boundaries"
```

**Search by tags:**
```
Search for quotes tagged with "mindset"
```

**Combine multiple filters:**
```
Find productivity quotes about "focus" by David Allen
```

## 💾 Collection Management

### Adding Quotes

**Add a new quote:**
```
Add this quote to my collection:
Text: "Success is not final, failure is not fatal: it is the courage to continue that counts."
Author: Winston Churchill
Source: Speech
Category: self-help
Theme: perseverance
Tags: courage, persistence, resilience
```

### Favorites

**Mark a quote as favorite:**
```
Mark quote #42 as a favorite
```

**View all favorites:**
```
Show me all my favorite quotes
```

**Unmark a favorite:**
```
Remove quote #42 from favorites
```

### Personal Notes

**Add notes to a quote:**
```
Add these notes to quote #15: "This reminds me of the importance of presence during code reviews. When I'm fully present, I catch more issues and learn more."
```

**View a quote with notes:**
```
Show me quote #15
```

### Managing the Collection

**Delete a quote:**
```
Delete quote #99 from the collection
```

## 🤖 AI-Powered Features

### Get Explanations

**Explain a quote:**
```
Explain quote #20 and how I can apply it to my work
```

**The AI will provide:**
- Context-aware explanation based on the quote's category
- Practical application examples
- Specific scenarios relevant to modern professionals

### Generate New Quotes

**Generate in Stoic style:**
```
Generate a Stoic quote about debugging
```

**Generate in different styles:**
```
Generate a mindfulness quote about work-life balance
```

```
Generate a productivity quote about meetings
```

```
Generate a self-help quote about imposter syndrome
```

```
Generate a relationships quote about team collaboration
```

## 📚 Workflow Examples

### Morning Routine

```
1. Get me a random quote for daily inspiration
2. Mark it as a favorite if I like it
3. Add notes about how I'll apply it today
```

### Research Mode

```
1. List all categories
2. Show me all productivity quotes
3. Find quotes about "clarity" in the productivity category
4. Explain quote #44
```

### Building a Personal Collection

```
1. Get collection statistics
2. Search for quotes about a topic I'm working on
3. Add my own favorite quotes
4. Mark the most impactful ones as favorites
5. Add personal reflections to my favorites
```

### Teaching/Learning Session

```
1. List all authors
2. Get a random quote from each category to compare philosophies
3. Generate modern interpretations in different styles
4. Explain how each philosophy applies to tech work
```

## 🎨 Creative Uses

### Theme-Based Exploration

```
1. Search for all quotes about "control"
2. Compare Stoic, Mindfulness, and Productivity perspectives
3. Generate a new quote synthesizing these views
```

### Author Deep Dive

```
1. Show me all quotes by Tara Brach
2. Explain her core philosophy through quote #16
3. Generate a Tara Brach-style quote about coding
```

### Category Comparison

```
1. Get a random stoic quote
2. Get a random mindfulness quote
3. Compare their approaches to the same problem
```

## 💡 Pro Tips

### For Students

- Use `get_stats` to track your collection growth
- Mark quotes you want to memorize as favorites
- Add notes with your interpretations for exam prep
- Generate quotes on topics you're studying

### For Developers

- Search "stress" to find quotes about managing work pressure
- Use productivity quotes for sprint planning inspiration
- Add notes with specific coding scenarios
- Generate quotes about debugging, code review, etc.

### For Teachers

- Use `list_categories` to show different philosophical approaches
- Compare quotes across authors on the same theme
- Use `generate_quote` to create discussion prompts
- Add teaching notes to quotes for future reference

## 🔧 Bulk Operations

### Import Multiple Quotes

1. Create a file in `local/quotes-source/my-quotes.txt`
2. Format: `"Quote text" - Author Name, Source Book`
3. Run: `npm run import my-quotes.txt`

**Example file content:**
```
"The only impossible journey is the one you never begin." - Tony Robbins, Awaken the Giant Within
"You miss 100% of the shots you don't take." - Wayne Gretzky, Interview
"Life is what happens when you're busy making other plans." - John Lennon, Beautiful Boy
```

## 📖 Advanced Query Examples

### Multi-Step Analysis

```
1. Search for quotes about "mindset"
2. For each result, get an AI explanation
3. Compare the different philosophical approaches
4. Generate a synthesized quote combining insights
```

### Personalized Wisdom Feed

```
1. Get a random quote from each of the 5 categories
2. Mark the most relevant one as a favorite
3. Add notes on how to apply it this week
4. Use get_favorites at the end of the week to review
```

### Topic Research

```
1. Search for quotes about "productivity"
2. Filter by category to see different approaches
3. Get explanations for the top 3 most relevant
4. Add your synthesis as notes
```

## 🚀 Integration Ideas

### Morning Dashboard
```
Ask Claude: "Give me my quote of the day: a random quote, mark it as favorite if it resonates, and explain how to apply it today"
```

### Weekly Review
```
Ask Claude: "Show me my weekly wisdom review: get_favorites, get_stats, and suggest themes I should explore next week"
```

### Learning Journey
```
Ask Claude: "Help me explore mindfulness: list all mindfulness quotes, explain the top 3, and generate a personal reflection prompt"
```

---

**Remember:** All these examples work seamlessly in Claude Desktop once the MCP server is configured. Just chat naturally with Claude!

Version 2.0.0 | 16 Tools | 5 Categories | 75+ Quotes
