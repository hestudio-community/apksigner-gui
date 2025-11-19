import path from "node:path";
import fs from "node:fs";
import { app, dialog, ipcMain } from "electron";
import { warn } from "./alert";
import { _log } from "./log";

const logger = new _log("storage");

function compareVersions(v1, v2) {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

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
    logger.startload("storage");
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
        "APKSignerGUI",
      );
    }
    logger.endload("storage");
  }

  clearTmpDir() {
    logger.startload("clearTmpDir");
    fs.rmSync(this.tmp, { recursive: true, force: true });
    fs.mkdirSync(this.tmp);
    logger.endload("clearTmpDir");
  }

  copyToTmp(filePath) {
    logger.startload("copyToTmp");
    const fileName = path.basename(filePath);
    const tmpFilePath = path.join(this.tmp, fileName);
    fs.copyFileSync(filePath, tmpFilePath);
    logger.endload("copyToTmp");
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
    logger.startload("Config");
    super();
    this.configPath = path.join(this.appdata, "config.json");
    this.defaults = {
      sidebarWidth: 30,
      windowSize: { width: 800, height: 600 },
      checkUpdate: true,
      advancedSetting: false,
    };

    if (!fs.existsSync(this.configPath)) {
      const defaultConfig = {
        version: app.getVersion(),
        ...this.defaults,
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig));
    }
    logger.log("Loading config from database.");
    try {
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    } catch (error) {
      const defaultConfig = {
        version: app.getVersion(),
        ...this.defaults,
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig));
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    }
    logger.endload("Config");
  }

  /**
   * Determine the compatibility of configuration files with the running version.
   * @returns {Promise<boolean>}
   */
  async checkVersionCompatibility() {
    logger.log("Checking config version.");
    const currentVersion = app.getVersion();
    const configVersion = this.config.version;

    if (!configVersion) {
      this.config.version = currentVersion;
      fs.writeFileSync(this.configPath, JSON.stringify(this.config));
      return true;
    }

    const versionComparison = compareVersions(currentVersion, configVersion);

    if (versionComparison < 0) {
      logger.warn(
        `Current application version (${currentVersion}) is lower than configuration file version (${configVersion}). This may cause compatibility issues.`,
      );
      const result = await dialog.showMessageBoxSync({
        type: "error",
        title: "Version Compatibility Warning",
        message: "Configuration File Version Compatibility Issue",
        detail: `Current application version (${currentVersion}) is lower than configuration file version (${configVersion}). This may cause compatibility issues.`,
        buttons: ["Cancel", "Open Anyway"],
        cancelId: 0,
        defaultId: 0,
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
    logger.info(`GET CONFIG: ${key}`);
    return this.config[key];
  }
  /**
   *
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    logger.info(`SET CONFIG: ${key}`);
    this.config[key] = value;
    logger.log(`Sync database.`);
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
  }
  /**
   *
   * @param {string} key
   */
  del(key) {
    logger.info(`DEL CONFIG: ${key}`);
    delete this.config[key];
    logger.log(`Sync database.`);
    fs.writeFileSync(this.configPath, JSON.stringify(this.config));
  }
  /**
   *
   * @param {string} path
   */
  backup(path) {
    logger.info(`Backup database to ${path}`);
    const backupPath = path;
    fs.copyFileSync(this.configPath, backupPath);
  }
  /**
   *
   * @param {string} path
   */
  async restore(path) {
    logger.info(`Restore database from ${path}`);
    if (fs.existsSync(path)) {
      try {
        // First, read and validate the backup file
        const backupData = JSON.parse(fs.readFileSync(path, "utf-8"));
        const currentVersion = app.getVersion();
        const backupVersion = backupData.version;

        // Check version compatibility
        if (
          backupVersion &&
          compareVersions(currentVersion, backupVersion) < 0
        ) {
          const result = await dialog.showMessageBox({
            type: "warning",
            title: "Version Compatibility Warning",
            message: "Backup File Version Compatibility Issue",
            detail: `Current application version (${currentVersion}) is lower than backup file version (${backupVersion}). This may cause compatibility issues.`,
            buttons: ["Cancel", "Restore Anyway"],
            defaultId: 0,
            cancelId: 0,
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
          message:
            "Configuration restored successfully. You will need to manually restart the application for the changes to take effect.",
          buttons: ["Quit App"],
        });

        if (restartResult.response === 0) {
          app.exit();
        }

        return true;
      } catch (error) {
        dialog.showErrorBox(
          "Restore Error",
          `Failed to restore configuration: ${error.message}`,
        );
        return false;
      }
    } else {
      dialog.showErrorBox("Restore Error", "Backup file does not exist.");
      return false;
    }
  }
}

export function importConfigHandler() {
  logger.startload("importConfigHandler");
  const config = new Config();

  ipcMain.on("config:get", (event, key) => {
    try {
      const value = config.get(key);
      event.returnValue = value;
    } catch (error) {
      event.returnValue = null;
      warn(`Failed to get config key: ${error.message}`, error.message);
    }
  });
  ipcMain.on("config:set", (event, key, value) => {
    try {
      config.set(key, value);
      event.returnValue = true;
    } catch (error) {
      event.returnValue = false;
      warn(`Failed to set config key: ${error.message}`, error.message);
    }
  });
  ipcMain.on("config:del", (event, key) => {
    try {
      config.del(key);
      event.returnValue = true;
    } catch (error) {
      event.returnValue = false;
      warn(`Failed to delete config key: ${error.message}`, error.message);
    }
  });

  ipcMain.handle("config:backup", async (event) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: "Backup Configuration",
          defaultPath: `config-backup-${new Date().toISOString().split("T")[0]}.json`,
          filters: [
            { name: "JSON Files", extensions: ["json"] },
            { name: "All Files", extensions: ["*"] },
          ],
        });
        if (!canceled && filePath) {
          config.backup(filePath);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error.message);
      }
    });
  });

  ipcMain.handle("config:restore", async (event) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: "Restore Configuration",
          properties: ["openFile"],
          filters: [
            { name: "JSON Files", extensions: ["json"] },
            { name: "All Files", extensions: ["*"] },
          ],
        });
        if (!canceled && filePaths.length > 0) {
          const success = await config.restore(filePaths[0]);
          resolve(success);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error.message);
      }
    });
  });
  logger.endload("importConfigHandler");
}
