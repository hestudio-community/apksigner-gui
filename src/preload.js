// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  openDevtools: () => ipcRenderer.invoke("devtools:open"),
  WindowsClose: () => ipcRenderer.invoke("windows:close"),
  WindowsMaximize: () => ipcRenderer.invoke("windows:maximize"),
  WindowsMinimize: () => ipcRenderer.invoke("windows:minimize"),
  WindowsIsMaximized: () => ipcRenderer.invoke("windows:isMaximized"),
});
