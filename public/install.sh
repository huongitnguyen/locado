#!/bin/bash
#
# Locado Installer
# https://locado.hxd.app
#
# Usage: curl -fsSL https://locado.hxd.app/install.sh | bash
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored output
info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Banner
echo ""
echo "  _                        _       "
echo " | |    ___   ___ __ _  __| | ___  "
echo " | |   / _ \ / __/ _\` |/ _\` |/ _ \ "
echo " | |__| (_) | (_| (_| | (_| | (_) |"
echo " |_____\___/ \___\__,_|\__,_|\___/ "
echo ""
echo "  Local Domain Manager"
echo "  https://locado.hxd.app"
echo ""

# Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  darwin)
    OS="darwin"
    info "Detected macOS"
    ;;
  linux)
    OS="linux"
    info "Detected Linux"
    ;;
  mingw*|msys*|cygwin*)
    error "Windows is not supported via this script. Please download manually from GitHub releases."
    ;;
  *)
    error "Unsupported operating system: $OS"
    ;;
esac

# Detect Architecture
ARCH=$(uname -m)
case "$ARCH" in
  x86_64|amd64)
    ARCH="amd64"
    info "Detected architecture: x86_64 (amd64)"
    ;;
  arm64|aarch64)
    ARCH="arm64"
    info "Detected architecture: ARM64"
    ;;
  *)
    error "Unsupported architecture: $ARCH"
    ;;
esac

# GitHub repo
REPO="xuandung38/locado"

# Get latest version
info "Fetching latest version..."
VERSION=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name"' | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
  error "Failed to get latest version. Check your internet connection."
fi

info "Latest version: $VERSION"

# Download URL
FILENAME="locado-${OS}-${ARCH}.tar.gz"
URL="https://github.com/${REPO}/releases/download/${VERSION}/${FILENAME}"

info "Downloading $FILENAME..."

# Create temp directory
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Download and extract
if ! curl -sL "$URL" -o "$TMPDIR/$FILENAME"; then
  error "Failed to download $URL"
fi

if ! tar -xzf "$TMPDIR/$FILENAME" -C "$TMPDIR"; then
  error "Failed to extract $FILENAME"
fi

# Check if binary exists
if [ ! -f "$TMPDIR/locado" ]; then
  error "Binary not found in archive"
fi

# Install location
INSTALL_DIR="/usr/local/bin"

# Check if we need sudo
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMPDIR/locado" "$INSTALL_DIR/locado"
  chmod +x "$INSTALL_DIR/locado"
else
  info "Requesting sudo access to install to $INSTALL_DIR..."
  sudo mv "$TMPDIR/locado" "$INSTALL_DIR/locado"
  sudo chmod +x "$INSTALL_DIR/locado"
fi

# Verify installation
if ! command -v locado &> /dev/null; then
  error "Installation failed. 'locado' command not found."
fi

# Print success
echo ""
info "Locado $VERSION installed successfully!"
echo ""
echo "  Usage:"
echo "    sudo locado          # Start server (requires sudo for ports 80/443)"
echo "    locado --help        # Show help"
echo "    locado update check  # Check for updates"
echo ""
echo "  Dashboard: http://localhost:2280"
echo ""
info "For more info, visit https://locado.hxd.app"
echo ""
