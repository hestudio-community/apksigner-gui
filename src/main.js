import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
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
    icon: path.join(__dirname, "../build/logo.png"),
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
  mainWindow.setMinimumSize(640, 480)
  mainWindow.setHasShadow(true);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // 将所有IPC处理程序注册放在这里，确保只注册一次
  ipcMain.handle("dialog:openFile", async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择文件 | APKSingerGUI",
      properties: ["openFile", "showHiddenFiles"],
    });
    if (!canceled) {
      return filePaths[0];
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

  // 窗口状态处理程序
  ipcMain.handle("windows:isMaximized", async () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

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
