# Nautus Examples

This document provides examples of using Nautus (Rust version) with JavaScript scripts.

## Basic Examples

### Example 1: Simple Hello World

Create a project and run a simple script:

```bash
# Create project
mkdir my-app && cd my-app
nautus create

# Edit nautus/scripts/@Run.js
```

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info('Hello from Nautus!')
    const [code, output] = await cmd('echo "Hello World"')
    info(output)
}
```

```bash
# Run it
nautus run
```

### Example 2: Building a Node.js Project

```javascript
// nautus/scripts/@Build.js
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info('Building project...')
    
    // Install dependencies
    const [code1, output1] = await cmd('npm install')
    if (code1 !== 0) {
        error('Failed to install dependencies:', output1)
    }
    info('Dependencies installed')
    
    // Run build command
    const [code2, output2] = await cmd('npm run build')
    if (code2 !== 0) {
        error('Build failed:', output2)
    }
    info('Build successful!')
}
```

### Example 3: Testing with Multiple Steps

```javascript
// nautus/scripts/@Test.js
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info('Running tests...')
    
    // Run linter
    info('Step 1: Linting...')
    const [code1, output1] = await cmd('npm run lint')
    if (code1 !== 0) {
        warn('Linting issues found:', output1)
    } else {
        info('✓ Linting passed')
    }
    
    // Run unit tests
    info('Step 2: Unit tests...')
    const [code2, output2] = await cmd('npm test')
    if (code2 !== 0) {
        error('Tests failed:', output2)
    }
    info('✓ All tests passed')
    
    // Generate coverage report
    info('Step 3: Coverage report...')
    const [code3, output3] = await cmd('npm run coverage')
    info('Coverage report generated')
}
```

### Example 4: Platform-Specific Commands

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info(`Running on: ${os()}`)
    
    if (os() === 'linux' || os() === 'mac') {
        // Unix-like systems
        await cmd('ls -la')
        await cmd('pwd')
    } else if (os() === 'windows') {
        // Windows
        await cmd('dir')
        await cmd('cd')
    }
}
```

### Example 5: Using Spawn for Interactive Commands

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info('Starting development server...')
    
    // Spawn keeps the process running and shows output in real-time
    const exitCode = await spawn('npm', ['run', 'dev'])
    
    if (exitCode !== 0) {
        error('Server exited with error')
    }
}
```

### Example 6: Running Local npm Binaries

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    // Run a local npm binary (no need to specify node_modules/.bin/)
    info('Running TypeScript compiler...')
    await nodeBin('tsc', ['--project', 'tsconfig.json'])
    
    info('Running Webpack...')
    await nodeBin('webpack', ['--config', 'webpack.config.js'])
}
```

### Example 7: Calling Other Scripts

```javascript
// nautus/scripts/@Release.js
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    info('Starting release process...')
    
    // Run tests first
    info('Step 1: Running tests...')
    await script('Test')
    
    // Build the project
    info('Step 2: Building...')
    await script('Build')
    
    // Tag release
    info('Step 3: Tagging release...')
    const [code, output] = await cmd('git tag -a v1.0.0 -m "Release v1.0.0"')
    if (code !== 0) {
        error('Failed to tag release:', output)
    }
    
    info('✓ Release complete!')
}
```

### Example 8: Error Handling

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    try {
        const [code, output] = await cmd('some-command')
        
        if (code !== 0) {
            warn('Command failed but continuing...')
        }
    } catch (err) {
        // cmd() rejects with [code, output] on error
        const [exitCode, errorOutput] = err
        error('Fatal error:', errorOutput)
        // error() automatically calls exit(1)
    }
}
```

### Example 9: Using Node Modules

If you have local npm packages installed:

```javascript
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    const { chalk } = modules  // chalk for colors
    const { fs, path } = modules  // Node.js built-ins
    
    // Note: These modules need to be installed locally
    // npm install chalk fs-extra axios
    
    info(chalk.green('Success!'))
    info(chalk.red('Error!'))
    info(chalk.blue('Info!'))
}
```

### Example 10: Complex Workflow

```javascript
// nautus/scripts/@Run.js
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    const { path } = modules
    
    info('🚀 Starting application...')
    
    // Check if node_modules exists
    const [code1] = await cmd('test -d node_modules')
    if (code1 !== 0) {
        info('📦 Installing dependencies...')
        await cmd('npm install')
    }
    
    // Clean previous builds
    info('🧹 Cleaning...')
    await cmd('rm -rf dist/')
    
    // Transpile TypeScript
    if (await fileExists('tsconfig.json')) {
        info('📝 Compiling TypeScript...')
        await nodeBin('tsc')
    }
    
    // Run the app
    info('▶️ Starting server...')
    await spawn('node', ['dist/index.js'])
}

async function fileExists(path) {
    const [code] = await cmd(`test -f ${path}`)
    return code === 0
}
```

## Using the TUI

Launch the interactive menu:

```bash
nautus --tui
```

Navigate with arrow keys:
- ↑/↓ or j/k to move
- Enter to select
- q to quit

## Advanced Usage

### Custom Scripts

You can create any custom script in `nautus/scripts/`:

```bash
# Create custom script
echo 'module.exports = async (cmd, os, info) => {
    info("Custom script!")
}' > nautus/scripts/@MyScript.js

# Run it
nautus exec MyScript
```

### Prep, Run, Cleanup Flow

When you run `nautus run`, it executes scripts in this order:

1. `@Prep.js` - Preparation (install deps, setup, etc.)
2. `@Run.js` - Main execution
3. `@Cleanup.js` - Cleanup (even if Run fails)

### Using with CI/CD

Nautus works great in CI/CD pipelines:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Rust
        uses: actions-rs/toolchain@v1
      - name: Install Nautus
        run: cargo install --path .
      - name: Run tests
        run: nautus test
```

## Tips and Tricks

1. **Async/Await**: All scripts are async, so use `await` for commands
2. **Exit Codes**: Check command exit codes: `const [code, output] = await cmd('...')`
3. **Error Handling**: Use `try/catch` or check exit codes
4. **Platform Detection**: Use `os()` for platform-specific logic
5. **Real-time Output**: Use `spawn()` for long-running commands
6. **Local Binaries**: Use `nodeBin()` instead of global commands

## Getting Help

- Run `nautus --help` for all commands
- Run `nautus <command> --help` for command-specific help
- Check [RUST_MIGRATION.md](RUST_MIGRATION.md) for migration guide
- Check [BUILDING.md](BUILDING.md) for build instructions
