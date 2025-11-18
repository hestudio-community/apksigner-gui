/**
 * @file log.js
 * @description This file is used to standardize and store logs for debugging purposes.
 */
import dayjs from "dayjs";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

if (!process.env.APKSIGNERGUI_STARTINFO)
  process.env.APKSIGNERGUI_STARTINFO = `${dayjs().format()}-${app.getVersion()}-${process.platform}-${process.arch}`;

export class _log {
  /**
   *
   * @param {string} module Enter the module you are calling. If you are calling `utils/storage.js`, enter `storage`.
   */
  constructor(module) {
    this.module = module;
    this._loadTimers = Object.create(null);

    if (process.platform == "win32") {
      this.logdir = path.join(process.env.APPDATA, "APKSignerGUI", "logs");
    } else if (process.platform == "linux") {
      this.logdir = path.join(
        process.env.HOME,
        ".config",
        "APKSignerGUI",
        "logs"
      );
    } else if (process.platform == "darwin") {
      this.logdir = path.join(
        process.env.HOME,
        "/Library/Application Support",
        "APKSignerGUI",
        "logs"
      );
    }
    this.logfile = path.join(
      this.logdir,
      `${process.env.APKSIGNERGUI_STARTINFO}.log`
    );
    if (!fs.existsSync(this.logdir)) fs.mkdirSync(this.logdir);
    if (!fs.existsSync(this.logfile)) fs.writeFileSync(this.logfile, "");
  }

  log(log) {
    const l = `[${dayjs().format()}][${this.module}][log] ${log}`;
    fs.appendFileSync(this.logfile, `${l}\n`);
    console.log(l);
  }

  debug(log) {
    const l = `[${dayjs().format()}][${this.module}][debug] ${log}`;
    fs.appendFileSync(this.logfile, `${l}\n`);
    console.debug(l);
  }
  info(log) {
    const l = `[${dayjs().format()}][${this.module}][info] ${log}`;
    fs.appendFileSync(this.logfile, `${l}\n`);
    console.info(l);
  }

  warn(log) {
    const l = `[${dayjs().format()}][${this.module}][warn] ${log}`;
    fs.appendFileSync(this.logfile, `${l}\n`);
    console.warn(l);
  }

  error(log) {
    const l = `[${dayjs().format()}][${this.module}][error] ${log}`;
    fs.appendFileSync(this.logfile, `${l}\n`);
    console.error(l);
  }

  startload(submodule) {
    this._loadTimers[submodule] = performance.now();
    this.log(`Loading ${submodule}`);
  }

  endload(submodule) {
    const start = this._loadTimers[submodule];
    let duration = null;

    if (typeof start === "number") {
      duration = performance.now() - start;
      delete this._loadTimers[submodule];
    }
    if (duration != null) {
      this.log(`Loading complete ${submodule} (${duration.toFixed(3)} ms)`);
    } else {
      this.log(`Loading complete ${submodule}`);
    }
  }
}
