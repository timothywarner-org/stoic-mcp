# Claude Desktop Configuration Guide

## Recommended Configuration

Use the direct `node` command instead of `npm start` for better reliability:

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

## Why Direct Node Command?

The `npm start` approach can cause issues with Claude Desktop:
- ❌ npm adds an extra process layer
- ❌ Can cause spawning issues on Windows
- ❌ May not handle stdio correctly

Direct `node` command:
- ✅ Simpler and more reliable
- ✅ Direct stdio connection
- ✅ Faster startup
- ✅ Better error visibility

## Configuration Steps

### 1. Ensure Build is Up-to-Date

```bash
cd C:\github\stoic-mcp\local
npm run build
```

### 2. Locate Config File

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 3. Add Stoic MCP Server

Edit the file and add the `stoic-mcp` entry to `mcpServers`.

### 4. Update Path

Replace `C:\\github\\stoic-mcp\\local\\dist\\index.js` with your actual installation path.

**Important:** Use double backslashes (`\\`) on Windows!

### 5. Restart Claude Desktop

Close and reopen Claude Desktop completely.

## Environment Variables

The server requires `DEEPSEEK_API_KEY` for AI features:

### Windows
1. Open System Properties → Environment Variables
2. Add user or system variable: `DEEPSEEK_API_KEY=your_key_here`
3. Restart Claude Desktop

### macOS/Linux
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export DEEPSEEK_API_KEY=your_key_here
```

**Note:** Claude Desktop automatically inherits system environment variables, so you don't need to specify it in the config.

## Verification

### 1. Check MCP Connection

Look for the MCP icon (🔌) in Claude Desktop.

### 2. Test a Tool

Ask Claude:
```
Give me a random Stoic quote.
```

### 3. Check Logs (if issues)

**Windows:**
```
%APPDATA%\Claude\logs\
```

**macOS:**
```
~/Library/Logs/Claude/
```

## Complete Example Config

Here's a complete config file with multiple MCP servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    },
    "stoic-mcp": {
      "command": "node",
      "args": [
        "C:\\github\\stoic-mcp\\local\\dist\\index.js"
      ]
    }
  }
}
```

## Troubleshooting

### Server Not Showing Up

1. Check JSON syntax is valid
2. Verify path to `index.js` is correct and uses double backslashes
3. Ensure `dist/index.js` exists (run `npm run build`)
4. Restart Claude Desktop completely

### DeepSeek API Not Working

1. Verify environment variable is set: `echo $DEEPSEEK_API_KEY` (macOS/Linux) or `echo %DEEPSEEK_API_KEY%` (Windows)
2. Restart Claude Desktop after setting environment variables
3. Check Claude Desktop logs for API errors

### Server Crashes

1. Check Claude Desktop logs
2. Verify Node.js version (18+)
3. Rebuild the project: `npm run build`
4. Check `quotes.json` is valid JSON

## Alternative: Development Mode

For development, you can rebuild on every change:

```json
{
  "mcpServers": {
    "stoic-mcp-dev": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "C:\\github\\stoic-mcp\\local"
    }
  }
}
```

But for production use, stick with the direct `node` command.

## Path Examples

### Windows
```json
"args": ["C:\\Users\\YourName\\projects\\stoic-mcp\\local\\dist\\index.js"]
```

### macOS/Linux
```json
"args": ["/Users/yourname/projects/stoic-mcp/local/dist/index.js"]
```

### WSL (Windows Subsystem for Linux)
```json
"args": ["/home/yourname/stoic-mcp/local/dist/index.js"]
```

## Security Note

Never commit your `claude_desktop_config.json` to version control if it contains API keys or tokens!
