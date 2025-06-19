# Scripts Directory

This directory contains CLI tools for managing React LLM installations and generating codebase context.

## Scripts Overview

### react-llm.js (Main CLI Tool)
**Purpose**: Primary CLI for installing and configuring React LLM in projects  
**Lines**: 275  
**Usage**: `npx react-llm <command> [options]`

#### Commands:

1. **install** - Sets up React LLM in a project
   ```bash
   npx react-llm install YOUR_GEMINI_API_KEY
   ```
   
   **What it does:**
   - Detects framework (Next.js or React)
   - Creates public directory if needed
   - Copies SQLite WASM file
   - Adds script to package.json
   - Injects script tag into layout/HTML
   - Sets up environment variables
   - Updates .gitignore

2. **generate** - Creates codebase context
   ```bash
   npx react-llm generate
   ```
   
   **What it does:**
   - Runs RepoMix to analyze codebase
   - Generates context JSON file
   - Saves to `public/codebase-context.json`
   - Verifies required files exist

#### Framework Detection:
```javascript
function detectFramework() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['next']) return 'next';
  if (deps['react']) return 'react';
  return null;
}
```

#### Installation Flow:

1. **For Next.js Projects:**
   - Looks for layout files in order:
     - `src/app/layout.tsx` (App Router)
     - `app/layout.tsx` (App Router)
     - `src/pages/_app.tsx` (Pages Router)
     - `pages/_app.tsx` (Pages Router)
   - Adds `<Script src="/react-llm.js" />`
   - Creates `.env.local` with API key
   - Uses `NEXT_PUBLIC_GEMINI_API_KEY`

2. **For React Projects:**
   - Looks for `public/index.html`
   - Injects script tag in body
   - Instructions for manual API key setup

#### Key Functions:

- `ensureDir(dir)` - Creates directories recursively
- `addScriptToPackageJson()` - Adds npm script
- `addScriptToLayout(framework)` - Injects script tag
- `setupEnvironmentVariables(framework, apiKey)` - Configures env vars
- `copySqliteWasm(publicDir)` - Copies WASM file from node_modules

#### Error Handling:
- Validates API key presence
- Checks file existence before operations
- Provides fallback instructions
- Clear error messages with solutions

### generate-context.js (Standalone Generator)
**Purpose**: Simpler script for generating codebase context  
**Lines**: 41  
**Usage**: `node scripts/generate-context.js generate`

**What it does:**
1. Runs RepoMix command
2. Reads generated output
3. Creates public directory
4. Saves context as JSON
5. Cleans up temp files

**Differences from main CLI:**
- Simpler implementation
- No framework detection
- No installation features
- Direct file operations

## RepoMix Integration

Both scripts use RepoMix for codebase analysis:
- Generates comprehensive code context
- Includes file contents and structure
- Respects .gitignore patterns
- Output used by Gemini AI for understanding

## File Management

### SQLite WASM
The scripts handle copying the SQLite WASM file from either:
1. Package's own dist directory (preferred)
2. node_modules as fallback

Location attempts:
```javascript
const possibleSources = [
  path.join(__dirname, '..', 'dist', 'sqlite3.wasm'),
  path.join(process.cwd(), 'node_modules', '@sqlite.org', 'sqlite-wasm', 'sqlite-wasm', 'jswasm', 'sqlite3.wasm'),
];
```

### Environment Variables
- Next.js: Uses `.env.local` with `NEXT_PUBLIC_` prefix
- React: Manual setup with `window.GEMINI_API_KEY`
- Automatically adds to `.gitignore`

## Usage in Projects

After installation, projects get:
1. NPM script: `"react-llm": "react-llm generate"`
2. Script tag in HTML/layout
3. SQLite WASM in public directory
4. Environment variable configuration

## Common Issues & Solutions

1. **WASM File Not Found**
   - Check if `sqlite3.wasm` exists in public/
   - Re-run install command
   - Verify node_modules has SQLite package

2. **Script Tag Not Added**
   - May need manual addition for custom layouts
   - Check console output for instructions
   - Verify layout file detection

3. **RepoMix Not Found**
   - Install globally: `npm i -g repomix`
   - Or add to project dependencies

4. **Buffer Size Errors**
   - Large codebases may exceed buffer
   - Script sets 10MB buffer limit
   - Consider excluding large files

## Development Notes

- Scripts use Node.js built-in modules only
- Compatible with npm, yarn, and pnpm
- Designed for zero-config experience
- Provides helpful error messages

## Future Improvements

1. **Enhanced Detection**
   - Support for more frameworks (Vue, Angular)
   - Custom layout file paths
   - Monorepo support

2. **Configuration**
   - Config file support
   - Custom RepoMix options
   - Exclude patterns

3. **Validation**
   - API key validation
   - Framework version checks
   - Dependency verification

4. **Features**
   - Update command
   - Uninstall command
   - Health check command