import path from "node:path";
import fs from "node:fs";

export class Storage {
  constructor() {
    if (process.platform == "win32") {
      this.tmp = path.join(process.env.TEMP, "APKSignerGUI");
    } else if (process.platform == "linux") {
      this.tmp = path.join("/tmp", "APKSignerGUI");
    } else if (process.platform == "darwin") {
      this.tmp = path.join(process.env.HOME, "/Library/Caches", "APKSignerGUI");
    }

    if (!fs.existsSync(this.tmp)) {
      fs.mkdirSync(this.tmp);
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
