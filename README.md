<div align="center">
   <img src="./icons/icon.png" width="128px" />
   <h1 style="text-align: center">APKSignerGUI</h1>
   <img src="./images/apphome.png" width="384px"/>
   <p style="text-align: center">Simple and complete graphical tool for APK signing</p>
</div>

---

<div align="center">
   <a href="./README.md">English</a> | 
   <a href="./i18n/README/README_CN.md">简体中文</a> | 
   <a href="./i18n/README/README_HK.md">繁體中文</a>
</div>

---

### Features

- **Beginner-Friendly**: Designed for novice users. Just import an APK to sign it directly.
- **Fully Featured**: Supports all signing parameters provided by Google for advanced users.
- **High Compatibility**: Works on multiple operating systems and architectures, including Windows, Linux, and macOS.
- **Room for Growth**: As an early-stage project, it's not perfect—leaving plenty of room for contribution and extension.

### How to Install

1. Go to the [Release](https://github.com/hestudio-community/apksigner-gui/releases/latest) page to download the latest version.
2. Windows users can install it using [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

   ```powershell
   winget install "heStudioCommunity.APKSignerGUI(Machine-MSI)"
   ```

   Alternatively, download it from the Microsoft Store:

   <a href="https://apps.microsoft.com/detail/9n3q8bk8dp86?mode=direct">
   <img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200"/>
   </a>

3. Or build it yourself as described below.

### macOS Installation Issues

When installing on macOS, you may encounter the error `“APKSignerGUI.app” is damaged and can't be opened. You should move it to the Trash.` This is usually not because the file is actually damaged. To completely avoid this issue, we'd need to pay Apple $99 annually for a trusted certificate, which we cannot afford. To use the software, you'll need to perform some additional steps:

1. Download and move the app to your Applications folder.
2. Open Terminal and run:
   ```shell
   xattr -d com.apple.quarantine /Applications/APKSignerGUI.app
   ```
3. Open the application and start using it.

### Compatibility

Officially supported platforms (prebuilt and tested):

- **Windows**: Windows 10/11 x86_64 (latest version), Windows 10/11 ARM64 (latest version)
- **Linux**: Debian 12 and derivatives, x86_64 and ARM64
- **macOS**: Apple Silicon devices running macOS 10.11 or later

Other platforms may require manual compilation.

#### Why no 32-bit support?

We believe 32-bit systems are obsolete and often incapable of basic operations. Most vendors no longer support them. It's highly unlikely you can do modern software development on such systems. If you're still using one, we trust you're capable of compiling this tool yourself.

### How to Use?

1. Open the application. You should see a screen like this. Click the top-right gear icon to configure settings.
   ![](./images/1.png)
2. Locate `apksigner` and `zipalign` in your `sdk/build-tools/<version>` directory and click save.
   ![](./images/2.png)
3. Click the left blank area to close settings. Then click the top-left `+` to add a key.
   ![](./images/3.png)
4. Click the right blank area to close the page, select the key from the left, and start signing your APK.
   ![](./images/apphome.png)

### Find Your Language

[![Crowdin](https://badges.crowdin.net/apksignergui/localized.svg)](https://crowdin.com/project/apksignergui)

We're committed to providing a consistent experience for users worldwide. If you'd like to help with translation, we truly appreciate it.

You can contribute in two ways:

- Submit translations via the [Crowdin platform](https://crowdin.com/project/apksignergui).
- Submit translated language files under the `i18n` directory of the source code.

Didn't find your language? Add it using either method:

- Submit an issue and we’ll add the language to Crowdin for you.
- Copy an existing language file under `i18n`, translate it, and submit it—we’ll handle the rest.

Use [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) for language codes and [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) for region codes.

Thanks to [Crowdin](https://crowdin.com/) for providing an open-source license.

### How to Build?

#### Without Packaging

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Run `npm install` to install dependencies.
3. Run `npm run package` to build.
4. Find the output in `./out/`.

#### macOS

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Run `npm install` to install dependencies.
3. Run `npm run make` to build.
4. Find the output in `./out/make`.

#### Windows

##### ZIP Packaging (Recommended)

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Run `npm install` to install dependencies.
3. Edit `forge.config.js`:

   Replace:

   ```javascript
   {
      name: "@electron-forge/maker-wix",
      config: {
        // ...
      },
      platfrom: ["win32"],
   },
   ```

   With:

   ```javascript
   {
     name: "@electron-forge/maker-zip",
     platfrom: ["win32"],
   }
   ```

4. Run `npm run make` to build.
5. Find the output in `./out/make`.

##### MSI Packaging

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Run `npm install` to install dependencies.
3. Install [WiX Toolset v3](https://github.com/wixtoolset/wix3/releases/download/wix3141rtm/wix314-binaries.zip).
4. Add WiX binaries to your `PATH` environment variable.
5. Run `npm run make` to build.
6. Find the output in `./out/make`.

#### Linux (Debian and Derivatives)

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Run `npm install` to install dependencies.
3. Run `npm run make` to build.
4. Find the output in `./out/make`.
