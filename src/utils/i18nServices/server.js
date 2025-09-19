import { supportLangList } from "./config";
import { Config } from "../storage";

export class internationalization {
  constructor() {
    const config = new Config();
    this.lang = null;
    this.userLang = {};
    let lang = config.get("lang");
    if (lang != null && supportLangList[lang]) {
      this.lang = lang;
      this.userLang = supportLangList[lang].library;
      return;
    }
  }

  /**
   * Translation to user language
   * @param {string} source
   * @returns {string} Translated string
   */
  geti18n(source) {
    return this.userLang[source];
  }
}
