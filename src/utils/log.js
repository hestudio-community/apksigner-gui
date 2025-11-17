/**
 * @file log.js
 * @description This file is used to standardize and store logs for debugging purposes.
 */
import dayjs from "dayjs";

export class _log {
  /**
   *
   * @param {string} module Enter the module you are calling. If you are calling `utils/storage.js`, enter `storage`.
   */
  constructor(module) {
    this.module = module;
    this._loadTimers = Object.create(null);
  }

  log(log) {
    console.log(`[${dayjs().format()}][${this.module}][log] ${log}`);
  }

  debug(log) {
    console.debug(`[${dayjs().format()}][${this.module}][debug] ${log}`);
  }
  info(log) {
    console.info(`[${dayjs().format()}][${this.module}][info] ${log}`);
  }

  warn(log) {
    console.warn(`[${dayjs().format()}][${this.module}][warn] ${log}`);
  }

  error(log) {
    console.error(`[${dayjs().format()}][${this.module}][error] ${log}`);
  }

  startload(submodule) {
    this._loadTimers[submodule] = performance.now();
    this.info(`Loading ${submodule}`);
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
