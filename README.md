# Invoiso — Landing Page

This folder contains the static landing page for **Invoiso**, hosted on GitHub Pages at:
**https://invoiso.co.in/**

---

## Linux Quick Install

The download page shows two terminal install options. Keep this README and the visible commands in `download.html` in sync when the install script changes.

### DEB package

Use this for Ubuntu 22.04 or 24.04:

```bash
curl -fsSL https://invoiso.co.in/install.sh | bash -s -- --deb
```

### AppImage

Use this for other Linux distributions or when a portable app is preferred:

```bash
curl -fsSL https://invoiso.co.in/install.sh | bash -s -- --appimage
```

The script fetches the latest GitHub release from `Anooppandikashala/invoiso`, selects the matching asset name, downloads it to `/tmp`, and either installs the DEB with `apt-get` or moves the AppImage to `~/Applications`.

---