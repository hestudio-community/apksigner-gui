import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn } from "node:child_process";
import { CheckJavaHome, CreateKey } from "./utils/CreateKey";
import { Config, Storage } from "./utils/storage";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Ensure only one instance of the application is running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log("Another instance is already running, exiting current instance");
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // When a second instance is launched, focus on the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const storage = new Storage();
const config = new Config();

// Save reference to mainWindow for use in IPC handlers
let mainWindow = null;

const CheckUpdate = (forceShow) => {
  fetch(
    "https://api.github.com/repos/hestudio-community/apksigner-gui/releases/latest"
  )
    .then(async (response) => {
      const data = await response.json();
      if (data.name == `v${app.getVersion()}`) {
        if (forceShow) {
          dialog
            .showMessageBox({
              title: "APKSignerGUI",
              message: "APKSignerGUI",
              detail: "You are using the latest version.",
              type: "info",
              buttons: ["OK", "View in Github"],
            })
            .then((response) => {
              if (response.response == 1) {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui/releases/latest"
                );
              }
            });
        }
      } else {
        dialog
          .showMessageBox({
            title: "APKSignerGUI",
            message: "APKSignerGUI",
            detail: `New version ${data.name} is available.`,
            type: "info",
            buttons: ["Close", "Download Now", "View in Github"],
          })
          .then((response) => {
            if (response.response == 1) {
              if (process.platform == "darwin" && process.arch == "arm64") {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    ""
                  )}_arm64.dmg`
                );
              } else if (process.platform == "win32" && process.arch == "x64") {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    ""
                  )}_amd64.msi`
                );
              } else if (
                process.platform == "win32" &&
                process.arch == "arm64"
              ) {
                shell.openExternal(
                  `https://github.com/hestudio-community/apksigner-gui/releases/download/${
                    data.name
                  }/apksignergui_${String(data.name).replace(
                    "v",
                    ""
                  )}_arm64.msi`
                );
              } else {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui/releases/latest"
                );
              }
            } else if (response.response == 2) {
              shell.openExternal(
                "https://github.com/hestudio-community/apksigner-gui/releases/latest"
              );
            }
          });
      }
    })
    .catch((error) => {
      if (forceShow) {
        dialog.showErrorBox("APKSignerGUI", "Failed to check for updates.");
      }
    });
};

const AboutPanel = () => {
  dialog
    .showMessageBox({
      title: "APKSignerGUI",
      message: "APKSignerGUI",
      detail: `
Version: ${app.getVersion()}
Platform: ${process.platform}
Architecture: ${process.arch}
WorkStatus: ${app.isPackaged ? "Product" : "Develop"}
Copyright: Copyright © 2025 heStudio Community
    `,
      type: "none",
      icon: path.join(__dirname, "../icon.png"),
      buttons: ["Close", "Check Update", "View in Github"],
    })
    .then((response) => {
      if (response.response == 1) {
        CheckUpdate(true);
      } else if (response.response == 2) {
        shell.openExternal(
          "https://github.com/hestudio-community/apksigner-gui"
        );
      }
    });
};

const createWindow = () => {
  if (process.platform == "darwin") {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: app.name,
          submenu: [
            {
              label: "About APKSignerGUI",
              click: () => {
                AboutPanel();
              },
            },
            {
              label: "Check Update",
              click: () => {
                CheckUpdate(true);
              },
            },
            {
              label: "View in Github",
              click: () => {
                shell.openExternal(
                  "https://github.com/hestudio-community/apksigner-gui"
                );
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
      ])
    );
  } else {
    Menu.setApplicationMenu(null);
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // Add icon configuration
    icon: path.join(__dirname, "../icon.png"),
    titleBarStyle: "hiddenInset",
    frame: false,
  });

  // Set Dock icon for Mac
  if (process.platform === "darwin") {
    const { nativeImage } = require("electron");
    const image = nativeImage.createFromPath(
      path.join(__dirname, "../build/icon.icns")
    );
    app.dock.setIcon(image);
    console.log(path.join(__dirname, "../build/icon.icns"));
  }

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  mainWindow.setMinimumSize(640, 480);
  mainWindow.setHasShadow(true);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
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
  ipcMain.handle("system:platfrom", async () => {
    return process.platform;
  });

  // DevTools handler
  ipcMain.handle("devtools:open", async () => {
    if (mainWindow) mainWindow.webContents.openDevTools();
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

  ipcMain.handle("config:get", (event, key) => {
    return new Promise((resolve, reject) => {
      try {
        const value = config.get(key);
        resolve(value);
      } catch (error) {
        reject(error.message);
      }
    });
  });
  ipcMain.handle("config:set", (event, key, value) => {
    return new Promise((resolve, reject) => {
      try {
        config.set(key, value);
        resolve(true);
      } catch (error) {
        reject(error.message);
      }
    });
  });
  ipcMain.handle("config:del", (event, key) => {
    return new Promise((resolve, reject) => {
      try {
        config.del(key);
        resolve(true);
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle("system:checkJavaHome", (event) => {
    return new Promise((resolve, reject) => {
      try {
        const isJavaHomeValid = CheckJavaHome();
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
      sigalg
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
            sigalg
          );
          resolve(result);
        } catch (error) {
          reject(error.message);
        }
      });
    }
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
