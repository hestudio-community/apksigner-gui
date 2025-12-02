const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const fs = require("node:fs");
const { execSync } = require("child_process");

const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

// generate version code
function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}
function getBranchName() {
  return run("git rev-parse --abbrev-ref HEAD");
}
function getShortCommitId() {
  return run("git rev-parse --short HEAD");
}
function getGitStatus() {
  const status = run("git status --porcelain");
  return status === "" ? null : "dirty";
}

const branchName = getBranchName();
const shortCommitId = getShortCommitId();
const gitStatus = getGitStatus();

const baseversion = String(
  JSON.parse(fs.readFileSync("package.json")).version,
).split("-")[0];
let appversion;

if (branchName === "main") {
  appversion = baseversion;
} else {
  appversion = baseversion + `-${branchName}+${shortCommitId}`;
  if (gitStatus !== null) {
    appversion = appversion + ".dirty";
  }
}

if (isCI) {
  const package = JSON.parse(fs.readFileSync("package.json"));
  package.version = appversion;
  fs.writeFileSync("package.json", JSON.stringify(package));
}

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./icons/icon",
    appBundleId: "com.hestudio.apksigner",
    executableName: "APKSignerGUI",
    appVersion: appversion.split("-")[0],
    buildVersion: appversion.split("-")[0],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        format: "ULFO",
        icon: "./icons/icon.icns",
        name: "APKSignerGUI",
      },
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "heStudio Community",
          homepage: "https://www.hestudio.net",
          bin: "APKSignerGUI",
          name: "apksignergui",
          icon: "./icons/icon.png",
          description: "APKSignerGUI",
          productDescription: "Simple but complete APK signing tool.",
          section: ["utils"],
        },
      },
      platforms: ["linux"],
    },
    {
      name: "@electron-forge/maker-zip",
      config: {
        platforms: ["linux"],
        name: "APKSignerGUI",
        icon: "./icons/icon.png",
      },
      platforms: ["linux"],
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        appUserModelId: "com.hestudio.apksigner",
        description: "Simple but complete APK signing tool.",
        icon: "./icons/icon.ico",
        language: 2052,
        manufacturer: "heStudio Community",
        name: "APKSignerGUI",
        upgradeCode: "01956ab5-b521-74ae-9066-695e7dbe0999",
      },
      platforms: ["win32"],
    },
    // 只在非CI环境下包含appx maker
    ...(isCI
      ? []
      : [
          {
            name: "@electron-forge/maker-appx",
            config: {
              assets: "./icons/assets",
              publisher: "CN=73AC1CCD-0F7C-48FE-A64D-F404735487C1",
              packageDescription: "Simple but complete APK signing tool.",
              manifest: `${
                process.arch === "arm64"
                  ? "./appxmanifests/AppXManifest_arm64.xml"
                  : "./appxmanifests/AppXManifest_x86_64.xml"
              }`,
            },
            platforms: ["win32"],
          },
        ]),
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: "src/main.js",
            config: "vite.main.config.mjs",
            target: "main",
          },
          {
            entry: "src/preload.js",
            config: "vite.preload.config.mjs",
            target: "preload",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.mjs",
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
