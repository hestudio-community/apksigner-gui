<div align="center">
   <img src="./icons/icon.png" />
   <h1 style="text-align: center">APKSignerGUI</h1>
   <img src="./images/apphome.png" />
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

- **Easy to use**: Designed for beginners, just import the APK and sign it directly.
- **Complete functionality**: For advanced users, supports all signing parameters provided by Google.
- **Good compatibility**: Supports multiple operating systems and architectures, including Windows, Linux, MacOS, etc.
- **Ambitious plans**: An initial project with many imperfections, leaving plenty of room for expansion.

### How to install

1. Go to [Release](https://github.com/hestudio-community/apksigner-gui/releases/latest) to download the latest version.
2. Windows users can use [WinGet](https://learn.microsoft.com/en-us/windows/package-manager/winget/) to install.

   ```powershell
   winget install "heStudioCommunity.APKSignerGUI(Machine-MSI)"
   ```
   
   Of course, you can also download it from the Microsoft Store.

   <a href="https://apps.microsoft.com/detail/9n3q8bk8dp86?mode=direct">
   <img src="https://get.microsoft.com/images/en-us%20dark.svg" width="200"/>
   </a>
3. Build it using the method described at the end of this document.

### About compatibility

Known supported platforms (officially packaged and tested):

- **Windows**: Windows 10/11 x86_64 (Windows10 is the latest version), Windows 10/11 ARM64 (Windows10 is the latest version)
- **Linux**: Debian 12 and its derivatives x86_64 and ARM64 platforms, RedHat 9.5 and its derivatives x86_64 and ARM64 platforms
- **macOS**: All macOS 10.11 and above devices with Apple Silicon

Other platforms may require you to compile them yourself.

#### Why not support 32-bit systems or processors?

We believe that 32-bit systems are outdated and can no longer maintain basic operations. Many system and software vendors no longer provide 32-bit applications and systems. We think it's almost impossible to complete software development on a 32-bit system because many development tools or targets no longer support 32-bit systems. If you still use a 32-bit system, we believe you should be able to make this application work with your own efforts.

### How to use?

1. After opening the application, you should see an interface like this. Click the settings in the upper right corner to start the first configuration.
   ![](./images/1.png)
2. Find `apksigner` and `zipalign` in the `sdk/build-tools/<version>` directory, then click save.
   ![](./images/2.png)
3. Click the blank area on the left to close the settings, then click the `+` in the upper left corner to add a key.
   ![](./images/3.png)
4. Click the blank area on the right to close the page, select the signature on the left, and then start signing the installation package.
   ![](./images/apphome.png)

### Find your language

[![Crowdin](https://badges.crowdin.net/apksignergui/localized.svg)](https://crowdin.com/project/apksignergui)

We are committed to providing the same service and experience to users worldwide. If you are willing to provide relevant translations for this project, we will sincerely thank you.

You can submit translations in the following two ways:

- Submit translations on the [crowdin](https://crowdin.com/project/apksignergui) platform.
- Submit translations by editing the text of the corresponding language in the `i18n` directory of the source code.

Didn't find your language? There are also two ways to submit your language.

- If using the [crowdin](https://crowdin.com/project/apksignergui) platform, please submit an issue, and we will reserve the language on the platform for you to translate.
- You can also translate by copying one of the languages you know in the `i18n` directory of the source code. After submission, we will complete the remaining operations for you.

We require the language code to be based on [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1), and the country or region code to be based on [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1).

Thanks to [Crowdin](https://crowdin.com/) for the open source license provided for this project.

### How to build?

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Use `npm install` to install dependencies.
3. Use `npm run make` to build.
4. Get the build in the `./out/make` directory.

#### macOS

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Use `npm install` to install dependencies.
3. Use `npm run make` to build.
4. Get the build in the `./out/make` directory.

#### Windows

##### ZIP packaging (recommended)

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Use `npm install` to install dependencies.
3. Edit `forge.config.js`.
   Change
   ```javascript
   {
      name: "@electron-forge/maker-wix",
      config: {
        // ...
      },
      platfrom: ["win32"],
   },
   ```
   to
   ```javascript
   {
     name: "@electron-forge/maker-zip",
     platfrom: ["win32"],
   }
   ```
4. Use `npm run make` to build.
5. Get the build in the `./out/make` directory.

##### MSI packaging

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Use `npm install` to install dependencies.
3. Install [WiX Toolset v3](https://github.com/wixtoolset/wix3/releases/download/wix3141rtm/wix314-binaries.zip).
4. Configure environment variables to `PATH`.
5. Use `npm run make` to build.
6. Get the build in the `./out/make` directory.

#### Linux (Debian and its derivatives)

1. Install [NodeJS 22 LTS](https://nodejs.org/)
2. Use `npm install` to install dependencies.
3. Install build dependencies
   ```shell
   sudo apt install fakeroot rpm
   ```
   or
   ```shell
   sudo apt install fakeroot rpm-build
   ```
4. Use `npm run make` to build.
5. Get the build in the `./out/make` directory.
