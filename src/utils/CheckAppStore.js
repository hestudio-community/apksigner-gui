function CheckWindowsStore() {
  if (process.platform === "win32") {
    if (process.windowsStore === true) return true;
  }
  return false;
}

function CheckAppStore() {
  if (CheckWindowsStore()) {
    return true;
  } else return false;
}
export { CheckAppStore };
