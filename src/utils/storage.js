import path from "node:path";
import fs from "node:fs";
import { app, dialog } from "electron";

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  return 0;
}

export class Storage {
  constructor() {
    if (process.platform == "win32") {
      this.tmp = path.join(process.env.TEMP, "APKSignerGUI");
      this.appdata = path.join(process.env.APPDATA, "APKSignerGUI");
    } else if (process.platform == "linux") {
      this.tmp = path.join("/tmp", "APKSignerGUI");
      this.appdata = path.join(process.env.HOME, ".config", "APKSignerGUI");
    } else if (process.platform == "darwin") {
      this.tmp = path.join(process.env.HOME, "/Library/Caches", "APKSignerGUI");
      this.appdata = path.join(
        process.env.HOME,
        "/Library/Application Support",
        "APKSignerGUI"
      );
    }

    if (!fs.existsSync(this.tmp)) {
      fs.mkdirSync(this.tmp, { recursive: true });
    }
    if (!fs.existsSync(this.appdata)) {
      fs.mkdirSync(this.appdata, { recursive: true });
    }
  }

  clearTmpDir() {
    fs.rmSync(this.tmp, { recursive: true, force: true });
    fs.mkdirSync(this.tmp);
  }

  copyToTmp(filePath) {
    const fileName = path.basename(filePath);
    const tmpFilePath = path.join(this.tmp, fileName);
    fs.copyFileSync(filePath, tmpFilePath);
    return tmpFilePath;
  }
}

/**
 * Config Class
 * Manages application configuration settings.
 * @extends Storage
 *
 */
export class Config extends Storage {
  constructor() {
    super();
    this.configPath = path.join(this.appdata, "config.json");
    if (!fs.existsSync(this.configPath)) {
      const defaultConfig = {
        version: app.getVersion()
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig));
    }
    try {
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    } catch (error) {
      const defaultConfig = {
        version: app.getVersion()
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig));
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    }
  }

  async checkVersionCompatibility() {
    const currentVersion = app.getVersion();
    const configVersion = this.config.version;
    
    if (!configVersion) {
      this.config.version = currentVersion;
      fs.writeFileSync(this.configPath, JSON.stringify(this.config));
      return true;
    }
    
    const versionComparison = compareVersions(currentVersion, configVersion);
    
    if (versionComparison < 0) {
      const result = await dialog.showMessageBox({
        type: "warning",
        title: "Version Compatibility Warning",
        message: "Configuration File Version Compatibility Issue",
        detail: `Current application version (${currentVersion}) is lower than configuration file version (${configVersion}). This may cause compatibility issues.`,
        buttons: ["Cancel", "Open Anyway"],
        defaultId: 0,
        cancelId: 0
      });
      
      if (result.response === 0) {
        app.quit();
        return false;
      }
    }
    
    this.config.version = currentVersion;
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
    return true;
  }
  /**
   *
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this.config[key];
  }
  /**
   *
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this.config[key] = value;
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
  }
  /**
   *
   * @param {string} key
   */
  del(key) {
    delete this.config[key];
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
  }
  /**
   *
   * @param {string} path
   */
  backup(path) {
    const backupPath = path;
    fs.copyFileSync(this.configPath, backupPath);
  }
  /**
   *
   * @param {string} path
   */
  async restore(path) {
    if (fs.existsSync(path)) {
      try {
        // First, read and validate the backup file
        const backupData = JSON.parse(fs.readFileSync(path, "utf-8"));
        const currentVersion = app.getVersion();
        const backupVersion = backupData.version;
        
        // Check version compatibility
        if (backupVersion && compareVersions(currentVersion, backupVersion) < 0) {
          const result = await dialog.showMessageBox({
            type: "warning",
            title: "Version Compatibility Warning",
            message: "Backup File Version Compatibility Issue",
            detail: `Current application version (${currentVersion}) is lower than backup file version (${backupVersion}). This may cause compatibility issues.`,
            buttons: ["Cancel", "Restore Anyway"],
            defaultId: 0,
            cancelId: 0
          });
          
          if (result.response === 0) {
            return false; // User cancelled
          }
        }
        
        // Proceed with restore
        fs.copyFileSync(path, this.configPath);
        this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
        
        // Update version to current version
        this.config.version = currentVersion;
        fs.writeFileSync(this.configPath, JSON.stringify(this.config));
        
        const restartResult = await dialog.showMessageBox({
          type: "info",
          title: "Restore Successful",
          message: "Configuration restored successfully. You will need to manually restart the application for the changes to take effect.",
          buttons: ["Quit App"],
        });
        
        if (restartResult.response === 0) {
          app.exit();
        }
        
        return true;
      } catch (error) {
        dialog.showErrorBox("Restore Error", `Failed to restore configuration: ${error.message}`);
        return false;
      }
    } else {
      dialog.showErrorBox("Restore Error", "Backup file does not exist.");
      return false;
    }
  }
}
