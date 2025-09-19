// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (filters) => ipcRenderer.invoke("dialog:openFile", filters),
  saveFile: (filters) => ipcRenderer.invoke("dialog:saveFile", filters),
  openDevtools: () => ipcRenderer.invoke("devtools:open"),
  WindowsClose: () => ipcRenderer.invoke("windows:close"),
  WindowsMaximize: () => ipcRenderer.invoke("windows:maximize"),
  WindowsMinimize: () => ipcRenderer.invoke("windows:minimize"),
  WindowsIsMaximized: () => ipcRenderer.invoke("windows:isMaximized"),
  WindowsIsFullScreen: () => ipcRenderer.invoke("windows:isFullScreen"),
  SystemPlatform: () => ipcRenderer.invoke("system:platform"),
  CopyToTmp: (file) => ipcRenderer.invoke("app:copyToTmp", file),
  ClearTmpDir: () => ipcRenderer.invoke("app:clearTmpDir"),
  SystemShell: (shell) => ipcRenderer.invoke("system:shell", shell),
  AppAbout: () => ipcRenderer.invoke("app:about"),
  AppCheckUpdate: (forceShow) =>
    ipcRenderer.invoke("app:checkUpdate", forceShow),
  CheckJavaPath: (javapath) =>
    ipcRenderer.invoke("system:CheckJavaPath", javapath),
  CreateKey: (
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
  ) =>
    ipcRenderer.invoke(
      "app:createKey",
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
    ),
  config: {
    get: (key) => ipcRenderer.sendSync("config:get", key),
    set: (key, value) => ipcRenderer.sendSync("config:set", key, value),
    del: (key) => ipcRenderer.sendSync("config:del", key),
  },
  backupConfig: () => ipcRenderer.invoke("config:backup"),
  restoreConfig: () => ipcRenderer.invoke("config:restore"),
  checkFileExists: (filePath) =>
    ipcRenderer.invoke("system:checkFileExists", filePath),
  isDevMode: () => ipcRenderer.invoke("system:isDevMode"),
});
