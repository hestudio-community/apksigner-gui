import { supportLangList } from "./config";
import { Config } from "../storage";
import { _log } from "../log";

const logger = new _log("i18nServices");

export class internationalization {
  constructor() {
    this.lang = null;
    this.userLang = {};
    this.reloadLang();
  }

  /**
   * Translation to user language
   * @param {string} source
   * @returns {string} Translated string
   */
  geti18n(source) {
    logger.log(`geti18n: ${source}`);
    return this.userLang[source];
  }

  reloadLang() {
    logger.startload("reloadLang");
    const config = new Config();
    let lang = config.get("lang");
    if (lang != null && supportLangList[lang]) {
      this.lang = lang;
      this.userLang = supportLangList[lang].library;
      logger.endload("reloadLang");
      return;
    }
    this.lang = "en-US";
    this.userLang = supportLangList["en-US"].library;
    logger.endload("reloadLang");
    return;
  }
}
