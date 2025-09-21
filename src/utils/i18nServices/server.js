import { supportLangList } from "./config";
import { Config } from "../storage";

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
    return this.userLang[source];
  }

  reloadLang() {
    const config = new Config();
    let lang = config.get("lang");
    if (lang != null && supportLangList[lang]) {
      this.lang = lang;
      this.userLang = supportLangList[lang].library;
      return;
    }
    this.lang = "en-US";
    this.userLang = supportLangList["en-US"].library;
  }
}
