import { supportLangList } from "./config";

export class internationalization {
  constructor() {
    this.lang = null;
    this.userLang = {};
    let lang = window.electronAPI.config.get("lang");
    if (lang != null && supportLangList[lang]) {
      this.lang = lang;
      this.userLang = supportLangList[lang].library;
      return;
    } else {
      this.init();
    }
  }

  init() {
    let lang = window.electronAPI.config.get("lang");
    if (lang != null && supportLangList[lang]) {
      this.lang = lang;
      this.userLang = supportLangList[lang].library;
      return;
    }

    for (let i = 0; i < navigator.languages.length; i++) {
      const navLang = navigator.languages[i];
      if (supportLangList[navLang]) {
        this.lang = navLang;
        this.userLang = supportLangList[navLang].library;
        window.electronAPI.config.set("lang", navLang);
        return;
      }
    }

    this.lang = "en-US";
    this.userLang = supportLangList[this.lang].library;
    window.electronAPI.config.set("lang", this.lang);
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
