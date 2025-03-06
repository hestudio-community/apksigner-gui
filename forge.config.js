const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './icons/icon',
    appBundleId: "com.hestudio.apksigner"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        icon: './icons/icon.icns',
        name: "APKSignerGUI"
      },
      platfrom: ["darwin"]
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'heStudio Community',
          homepage: 'https://www.hestudio.net'
        }
      },
      platfrom: ["linux"]
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://www.hestudio.net'
        }
      },
      platfrom: ["linux"]
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        appUserModelId: "com.hestudio.apksigner",
        description: "Simple but complete APK signing tool.",
        icon: "./icons/icon.ico",
        language: 2052,
        manufacturer: 'heStudio Community',
        name: "APKSignerGUI",
        upgradeCode: "01956ab5-b521-74ae-9066-695e7dbe0999"
      },
      platfrom: ["win32"]
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
