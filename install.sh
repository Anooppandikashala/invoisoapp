#!/bin/bash

set -e

APP_NAME="Invoiso"
REPO_OWNER="<your-user>"
REPO_NAME="<your-repo>"

ARCH=$(uname -m)

if [ "$ARCH" != "x86_64" ]; then
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

INSTALL_MODE="deb"

if [ "$1" = "--appimage" ]; then
    INSTALL_MODE="appimage"
fi

echo "Fetching latest release info..."

LATEST_TAG=$(curl -s "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest" \
    | grep '"tag_name":' \
    | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
    echo "Failed to fetch latest release."
    exit 1
fi

VERSION="${LATEST_TAG#v}"

echo "Latest version: ${VERSION}"

if ! command -v lsb_release >/dev/null 2>&1; then
    echo "Unable to detect Linux distribution."
    INSTALL_MODE="appimage"
else

    UBUNTU_VERSION=$(lsb_release -rs)

    echo "Detected Ubuntu ${UBUNTU_VERSION}"

    case "$UBUNTU_VERSION" in

        22.04)

            if [ "$INSTALL_MODE" = "deb" ]; then
                FILE_NAME="Invoiso-${VERSION}-ubuntu22.deb"
            else
                FILE_NAME="Invoiso-${VERSION}-x86_64.AppImage"
            fi
            ;;

        24.04)

            if [ "$INSTALL_MODE" = "deb" ]; then
                FILE_NAME="Invoiso-${VERSION}-ubuntu24.deb"
            else
                FILE_NAME="Invoiso-${VERSION}-ubuntu24-x86_64.AppImage"
            fi
            ;;

        *)

            echo ""
            echo "Your Ubuntu version is not officially supported by the DEB package."
            echo ""
            echo "We recommend using the AppImage version instead."
            echo ""

            read -p "Continue with AppImage installation? (y/n): " CHOICE

            case "$CHOICE" in
                y|Y)
                    INSTALL_MODE="appimage"

                    FILE_NAME="Invoiso-${VERSION}-x86_64.AppImage"
                    ;;
                *)
                    echo "Installation cancelled."
                    exit 0
                    ;;
            esac
            ;;
    esac
fi

if [ "$INSTALL_MODE" = "appimage" ] && [ -z "$FILE_NAME" ]; then
    FILE_NAME="Invoiso-${VERSION}-x86_64.AppImage"
fi

DOWNLOAD_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${LATEST_TAG}/${FILE_NAME}"

TEMP_FILE="/tmp/${FILE_NAME}"

echo ""
echo "Downloading ${FILE_NAME}..."

if command -v wget >/dev/null 2>&1; then
    wget -O "${TEMP_FILE}" "${DOWNLOAD_URL}"
else
    curl -L "${DOWNLOAD_URL}" -o "${TEMP_FILE}"
fi

echo ""

if [[ "${FILE_NAME}" == *.deb ]]; then

    echo "Installing DEB package..."

    sudo apt update
    sudo apt install -y "${TEMP_FILE}"

    echo ""
    echo "${APP_NAME} installed successfully!"

else

    echo "Installing AppImage..."

    chmod +x "${TEMP_FILE}"

    mkdir -p "$HOME/Applications"

    FINAL_PATH="$HOME/Applications/${FILE_NAME}"

    mv "${TEMP_FILE}" "${FINAL_PATH}"

    echo ""
    echo "AppImage installed successfully!"

    echo ""
    echo "Run using:"
    echo "${FINAL_PATH}"
fi