import fs from "node:fs";
import path from "node:path";

export default function () {
  // create data dir
  let tmp;
  let appdata;
  if (process.platform == "win32") {
    tmp = path.join(process.env.TEMP, "APKSignerGUI");
    appdata = path.join(process.env.APPDATA, "APKSignerGUI");
  } else if (process.platform == "linux") {
    tmp = path.join("/tmp", "APKSignerGUI");
    appdata = path.join(process.env.HOME, ".config", "APKSignerGUI");
  } else if (process.platform == "darwin") {
    tmp = path.join(process.env.HOME, "/Library/Caches", "APKSignerGUI");
    appdata = path.join(
      process.env.HOME,
      "/Library/Application Support",
      "APKSignerGUI",
    );
  }

  if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
  if (!fs.existsSync(appdata)) fs.mkdirSync(appdata, { recursive: true });
}
