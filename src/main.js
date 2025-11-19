import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  shell,
  nativeImage,
} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn } from "node:child_process";
import { CheckJavaPath, CreateKey } from "./utils/CreateKey";
import { Config, Storage, importConfigHandler } from "./utils/storage";
import fs from "node:fs";
import { warn, error } from "./utils/alert";
import { internationalization } from "./utils/i18nServices/server";
import fixPath from "fix-path";
import { getSystemFonts } from "./utils/systemFonts";
import { Command } from "commander";
import { _log } from "./utils/log";
import { CheckUpdate } from "./utils/CheckUpdate";
import init from "./utils/init";

init();

const logger = new _log("main");

logger.info("Run Start.");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Ensure only one instance of the application is running
logger.startload("Process lock");
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  const i18n = new internationalization();
  error(i18n.geti18n("anotherAlreadyRunning"));
  logger.error(i18n.geti18n("anotherAlreadyRunning"));
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // When a second instance is launched, focus on the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
logger.endload("Process lock");

// argv
logger.startload("CLI");
const program = new Command();
program
  .name("APKSignerGUI")
  .description("Simple but complete APK signing tool.")
  .version(app.getVersion());
program.option("--allow-devtools", "Allow use devtools in Production mode.");
program.showHelpAfterError("(add --help for additional information)");
program.parse();
logger.endload("CLI");

const options = program.opts();
let allowDevtools = false;
if (options.allowDevtools || !app.isPackaged) {
  allowDevtools = true;
}

logger.startload("fixPath");
fixPath();
logger.endload("fixPath");

const storage = new Storage();
const config = new Config();

logger.startload("initializeConfig");
const initializeConfig = async () => {
  const versionCheckResult = await config.checkVersionCompatibility();
  if (!versionCheckResult) {
    return false;
  }

  return true;
};
logger.endload("initializeConfig");

// Save reference to mainWindow for use in IPC handlers
let mainWindow = null;

const createWindow = () => {
  // Get saved window size or use defaults
  logger.startload("createWindow");
  const windowConfig = config.get("windowSize") || {};
  const defaultWidth = 800;
  const defaultHeight = 600;
  const minWidth = 640;
  const minHeight = 480;

  // Validate and apply constraints with default restoration
  let width = windowConfig.width || defaultWidth;
  let height = windowConfig.height || defaultHeight;
  let needsReset = false;

  // Check if values exceed expected ranges and restore defaults
  if (width < minWidth) {
    width = defaultWidth;
    needsReset = true;
  }
  if (height < minHeight) {
    height = defaultHeight;
    needsReset = true;
  }

  // Apply minimum constraints
  width = Math.max(minWidth, width);
  height = Math.max(minHeight, height);

  // Reset to defaults if values were out of range
  if (needsReset) {
    config.set("windowSize", { width: defaultWidth, height: defaultHeight });
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    center: true,
    minWidth: minWidth,
    minHeight: minHeight,
    title: "APKSignerGUI",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false,
      devTools: allowDevtools,
    },
    // Add icon configuration
    icon: path.join(__dirname, "../icon.png"),
    titleBarStyle: "hiddenInset",
    show: true,
    frame: false,
    transparent: process.platform === "darwin",
    vibrancy: process.platform === "darwin" ? "under-window" : undefined,
  });

  // Save window size when it changes
  mainWindow.on("resize", () => {
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
      const [currentWidth, currentHeight] = mainWindow.getSize();
      config.set("windowSize", {
        width: currentWidth,
        height: currentHeight,
      });
    }
  });

  // Set Dock icon for Mac
  if (process.platform === "darwin") {
    const image = nativeImage.createFromPath(
      path.join(__dirname, "../build/icon.icns"),
    );
    app.dock.setIcon(image);
    console.log(path.join(__dirname, "../build/icon.icns"));
  }

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
  mainWindow.setHasShadow(true);
  logger.endload("createWindow");
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  // Initialize config and check version compatibility
  const canProceed = await initializeConfig();
  if (!canProceed) {
    return; // App will quit if version check fails
  }

  const i18n = await new internationalization();

  const AboutPanel = () => {
    dialog
      .showMessageBox({
        title: "APKSignerGUI",
        message: "APKSignerGUI",
        detail: `
${i18n.geti18n("version")}: ${app.getVersion()}
${i18n.geti18n("platform")}: ${process.platform}
${i18n.geti18n("architecture")}: ${process.arch}
${i18n.geti18n("workStatus")}: ${app.isPackaged ? "Product" : "Develop"} ${app.isPackaged & allowDevtools ? "with DevTools" : ""}
${i18n.geti18n("copyright")}: Copyright © 2025 heStudio Community
    `,
        type: "none",
        icon: path.join(__dirname, "../icon.png"),
        buttons: [
          process.platform == "win32" ? "Cancel" : i18n.geti18n("cancel"),
          i18n.geti18n("checkUpdate"),
          i18n.geti18n("viewInGithub"),
        ],
        cancelId: 0,
      })
      .then((response) => {
        if (response.response == 1) {
          CheckUpdate(true);
        } else if (response.response == 2) {
          shell.openExternal(
            "https://github.com/hestudio-community/apksigner-gui",
          );
        }
      });
  };

  if (process.platform == "darwin") {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: app.name,
          submenu: [
            {
              label: i18n.geti18n("aboutApp"),
              click: () => {
                AboutPanel();
              },
            },
            {
              label: i18n.geti18n("checkUpdate"),
              click: () => {
                CheckUpdate(true);
              },
            },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
        {
          label: "File",
          submenu: [{ role: "close" }],
        },
        { role: "editMenu" },
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            ...(allowDevtools ? [{ role: "toggleDevTools" }] : []),
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
          ],
        },
        { role: "windowMenu" },
        {
          role: "help",
          submenu: [
            {
              label: i18n.geti18n("reportIssue"),
              click: () => {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui/issues",
                );
              },
            },
            {
              label: i18n.geti18n("viewInGithub"),
              click: () => {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui",
                );
              },
            },
          ],
        },
      ]),
    );
  } else {
    Menu.setApplicationMenu(null);
  }

  ipcMain.handle("system:reloadLang", async (event) => {
    i18n.reloadLang();
    if (process.platform == "darwin") {
      Menu.setApplicationMenu(
        Menu.buildFromTemplate([
          {
            label: app.name,
            submenu: [
              {
                label: i18n.geti18n("aboutApp"),
                click: () => {
                  AboutPanel();
                },
              },
              {
                label: i18n.geti18n("checkUpdate"),
                click: () => {
                  CheckUpdate(true);
                },
              },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
          {
            label: "File",
            submenu: [{ role: "close" }],
          },
          { role: "editMenu" },
          {
            label: "View",
            submenu: [
              { role: "reload" },
              { role: "forceReload" },
              ...(allowDevtools ? [{ role: "toggleDevTools" }] : []),
              { type: "separator" },
              { role: "resetZoom" },
              { role: "zoomIn" },
              { role: "zoomOut" },
              { type: "separator" },
              { role: "togglefullscreen" },
            ],
          },
          { role: "windowMenu" },
          {
            role: "help",
            submenu: [
              {
                label: i18n.geti18n("reportIssue"),
                click: () => {
                  shell.openExternal(
                    "https://github.com/hestudio-community/apksigner-gui/issues",
                  );
                },
              },
              {
                label: i18n.geti18n("viewInGithub"),
                click: () => {
                  shell.openExternal(
                    "https://github.com/hestudio-community/apksigner-gui",
                  );
                },
              },
            ],
          },
        ]),
      );
    } else {
      Menu.setApplicationMenu(null);
    }
  });

  ipcMain.handle("dialog:openFile", async (event, filters) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "APKSignerGUI",
      properties: ["openFile", "showHiddenFiles"],
      filters: filters,
    });
    if (!canceled) {
      return filePaths[0];
    }
  });
  ipcMain.handle("dialog:saveFile", async (event, filters) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "APKSignerGUI",
      filters: filters,
    });
    if (!canceled) {
      return filePath;
    }
  });
  ipcMain.handle("system:platform", async () => {
    return process.platform;
  });
  ipcMain.handle("system:getFonts", async () => {
    try {
      return await getSystemFonts();
    } catch (error) {
      warn(`Failed to list fonts: ${error.message}`);
      return [];
    }
  });

  // DevTools handler - only allowed in development mode
  ipcMain.handle("devtools:open", async () => {
    if (mainWindow && allowDevtools) {
      mainWindow.webContents.openDevTools();
    }
  });

  ipcMain.handle("system:isDevMode", async () => {
    return allowDevtools;
  });

  // Windows control handlers
  if (process.platform != "darwin") {
    ipcMain.handle("windows:close", async () => {
      app.quit();
    });
    ipcMain.handle("windows:minimize", async () => {
      if (mainWindow) mainWindow.minimize();
    });
    ipcMain.handle("windows:maximize", async () => {
      if (!mainWindow) return;
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    });
  }

  ipcMain.handle("app:about", async () => {
    AboutPanel();
  });

  ipcMain.handle("app:checkUpdate", async (event, forceShow) => {
    CheckUpdate(forceShow);
  });

  ipcMain.handle("windows:isMaximized", async () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  ipcMain.handle("windows:isFullScreen", async () => {
    return mainWindow ? mainWindow.isFullScreen() : false;
  });

  ipcMain.handle("app:copyToTmp", async (event, file) => {
    return new Promise((resolve, reject) => {
      try {
        const tmpFilePath = storage.copyToTmp(file);
        resolve(tmpFilePath);
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle("app:clearTmpDir", async () => {
    return new Promise((resolve, reject) => {
      try {
        storage.clearTmpDir();
        resolve(true);
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle("system:shell", (event, shellCommand) => {
    return new Promise((resolve, reject) => {
      const shell = spawn(shellCommand, {
        shell: true,
      });

      let stdout = "";
      let stderr = "";

      shell.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      shell.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      shell.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(stderr || `Process exited with code ${code}`);
        }
      });

      shell.on("error", (err) => {
        reject(`Failed to start command: ${err.message}`);
      });
    });
  });

  importConfigHandler();

  ipcMain.handle("system:CheckJavaPath", (event, javapath) => {
    return new Promise((resolve, reject) => {
      try {
        const isJavaHomeValid = CheckJavaPath(javapath);
        if (isJavaHomeValid) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle("system:checkFileExists", (event, filePath) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(fs.existsSync(filePath));
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle(
    "app:createKey",
    (
      event,
      keyPath,
      keyPasswd,
      alias,
      aliasPasswd,
      expireDay,
      name,
      org,
      orgUnit,
      locality,
      state,
      country,
      keyalg,
      keysize,
      sigalg,
    ) => {
      return new Promise((resolve, reject) => {
        try {
          const result = CreateKey(
            keyPath,
            keyPasswd,
            alias,
            aliasPasswd,
            expireDay,
            name,
            org,
            orgUnit,
            locality,
            state,
            country,
            keyalg,
            keysize,
            sigalg,
          );
          resolve(result);
        } catch (error) {
          reject(error.message);
        }
      });
    },
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Remaining code stays unchanged
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
