# Building and Installing Nautus (Rust Version)

## Prerequisites

- **Rust**: Version 1.70 or later
  - Install from: https://rustup.rs/
- **Node.js**: Version 14 or later (for JavaScript script execution)
  - Install from: https://nodejs.org/

## Building from Source

```bash
# Clone the repository
git clone https://github.com/cabraviva/nautus.git
cd nautus

# Build in debug mode (faster compilation)
cargo build

# Or build in release mode (optimized binary)
cargo build --release

# The binary will be at:
# - Debug: target/debug/nautus
# - Release: target/release/nautus
```

## Installing

### Option 1: Install from Source (Recommended)

```bash
cd nautus
cargo install --path .
```

This will install the `nautus` binary to `~/.cargo/bin/` (make sure this is in your PATH).

### Option 2: Manual Installation

After building, copy the binary to a location in your PATH:

```bash
# On Linux/macOS
sudo cp target/release/nautus /usr/local/bin/

# Or to your home bin directory
cp target/release/nautus ~/.local/bin/
```

### Option 3: Run from Build Directory

You can run the binary directly without installing:

```bash
./target/release/nautus --help
```

## Verifying Installation

```bash
# Check version
nautus --version

# Show help
nautus --help

# Try the interactive TUI
nautus --tui
```

## First Project

Create your first Nautus project:

```bash
# Create a new directory for your project
mkdir my-project
cd my-project

# Initialize nautus
nautus create

# Edit the scripts in nautus/scripts/
# Then run your project
nautus run
```

## Development Dependencies

If you want to use JavaScript scripts that require specific npm packages, install them locally:

```bash
# In your project directory
npm init -y
npm install chalk fs-extra axios
```

The executor will automatically use locally installed packages.

## Updating

To update Nautus:

```bash
cd nautus
git pull
cargo install --path .
```

## Uninstalling

```bash
# If installed via cargo install
cargo uninstall nautus

# If installed manually, remove the binary
sudo rm /usr/local/bin/nautus
```

## Platform-Specific Notes

### Linux
No special requirements. Make sure you have build essentials installed:
```bash
sudo apt-get install build-essential
```

### macOS
Rust and Node.js should work out of the box. If you encounter issues with OpenSSL:
```bash
brew install openssl
```

### Windows
Install Rust via rustup and Node.js from the official website. Make sure to add both to your PATH.

## Troubleshooting

### "nautus: command not found"
Make sure `~/.cargo/bin` is in your PATH:
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.cargo/bin:$PATH"
```

### "Script execution failed"
Make sure Node.js is installed and in your PATH:
```bash
node --version
```

### Compilation errors
Update Rust to the latest version:
```bash
rustup update
```

## Next Steps

After installation, check out:
- [RUST_MIGRATION.md](RUST_MIGRATION.md) - Understanding the Rust migration
- [README.md](README.md) - Original Nautus documentation
- Run `nautus --help` to see all available commands
- Run `nautus --tui` to try the interactive interface
