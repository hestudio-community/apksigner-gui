import zhCN from "../../i18n/zh-CN";
import zhHK from "../../i18n/zh-HK";
import enUS from "../../i18n/en-US";

const supportLangList = {
  "zh-CN": {
    lang: "zh-CN",
    display: "简体中文",
    library: zhCN,
  },
  "zh-HK": {
    lang: "zh-HK",
    display: "繁體中文",
    library: zhHK,
  },
  "en-US": {
    lang: "en-US",
    display: "English (US)",
    library: enUS,
  },
};

export { supportLangList };

export class internationalization {
  constructor() {
    this.lang = null;
    this.userLang = {};
  }

  async init() {
    let lang = await window.electronAPI.config.get("lang");
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
        await window.electronAPI.config.set("lang", navLang);
        return;
      }
    }

    this.lang = "en-US";
    this.userLang = supportLangList[this.lang].library;
    await window.electronAPI.config.set("lang", this.lang);
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
