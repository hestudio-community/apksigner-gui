// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (filters) => ipcRenderer.invoke("dialog:openFile", filters),
  saveFile: (filters) => ipcRenderer.invoke("dialog:saveFile", filters),
  openDevtools: () => ipcRenderer.invoke("devtools:open"),
  WindowsClose: () => ipcRenderer.invoke("windows:close"),
  WindowsMaximize: () => ipcRenderer.invoke("windows:maximize"),
  WindowsMinimize: () => ipcRenderer.invoke("windows:minimize"),
  WindowsIsMaximized: () => ipcRenderer.invoke("windows:isMaximized"),
  SystemPlatfrom: () => ipcRenderer.invoke("system:platfrom"),
  CopyToTmp: (file) => ipcRenderer.invoke("app:copyToTmp", file),
  ClearTmpDir: () => ipcRenderer.invoke("app:clearTmpDir"),
  SystemShell: (shell) => ipcRenderer.invoke("system:shell", shell),
  AppAbout: () => ipcRenderer.invoke("app:about"),
  AppCheckUpdate: (forceShow) =>
    ipcRenderer.invoke("app:checkUpdate", forceShow),
  CheckJavaHome: () => ipcRenderer.invoke("system:checkJavaHome"),
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
    sigalg
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
      sigalg
    ),
});
