import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { exec } from "node:child_process";
import fs from "node:fs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let tmp = undefined;

if (process.platform == "win32") {
  tmp = path.join(process.env.TEMP, "APKSignerGUI");
} else if (process.platform == "linux") {
  tmp = path.join("/tmp", "APKSignerGUI");
}

if (!fs.existsSync(tmp)) {
  fs.mkdirSync(tmp);
}

// 保存mainWindow的引用以便在IPC处理程序中使用
let mainWindow = null;

const createWindow = () => {
  Menu.setApplicationMenu(null);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // 添加图标配置
    icon: path.join(__dirname, "../icon.png"),
    titleBarStyle: "hidden",
    frame: false,
  });

  // 为Mac设置Dock图标
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

  app.setAboutPanelOptions({
    copyright: "Copyright © 2025 heStudio Community",
    iconPath: path.join(__dirname, "../icon.png"),
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", async (event, filters) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择文件 | APKSignerGUI",
      properties: ["openFile", "showHiddenFiles"],
      filters: filters,
    });
    if (!canceled) {
      return filePaths[0];
    }
  });
  ipcMain.handle("dialog:saveFile", async (event, filters) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "保存文件 | APKSignerGUI",
      filters: filters,
    });
    if (!canceled) {
      return filePath;
    }
  });
  ipcMain.handle("system:platfrom", async () => {
    return process.platform;
  });

  // 开发工具处理程序
  ipcMain.handle("devtools:open", async () => {
    if (mainWindow) mainWindow.webContents.openDevTools();
  });

  // Windows控制处理程序
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
    app.showAboutPanel();
  });

  ipcMain.handle("windows:isMaximized", async () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  ipcMain.handle("app:copyToTmp", async (event, file) => {
    const tmpPath = path.join(tmp, path.basename(file));
    fs.copyFileSync(file, tmpPath);
    return tmpPath;
  });

  ipcMain.handle("app:clearTmpDir", async () => {
    try {
      fs.rmdirSync(tmp, { recursive: true });
      fs.mkdirSync(tmp);
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  });

  ipcMain.handle(
    "system:shell",
    (event, shell) =>
      new Promise((resolve, reject) => {
        exec(shell, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      })
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 其余代码保持不变
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
