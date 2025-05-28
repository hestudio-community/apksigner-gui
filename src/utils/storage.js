import path from "node:path";
import fs from "node:fs";

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
      fs.writeFileSync(this.configPath, JSON.stringify({}));
    }
    try {
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    } catch (error) {
      fs.writeFileSync(this.configPath, JSON.stringify({}));
      this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    }
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
}
