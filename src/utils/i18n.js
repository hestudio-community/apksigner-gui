import zhCN from "../../i18n/zh-CN";
import zhHK from "../../i18n/zh-HK";
import enUS from "../../i18n/en-US";

const supportLangList = [
  {
    lang: "zh-CN",
    display: "简体中文",
    library: zhCN,
  },
  {
    lang: "zh-HK",
    display: "繁體中文",
    library: zhHK,
  },
  {
    lang: "en-US",
    display: "English (US)",
    library: enUS,
  },
];

export { supportLangList };

/**
 * Get User Language
 * @returns
 */
function getLang() {
  let lang;
  window.electronAPI.config.get("lang").then((value) => {
    if (value != null) {
      lang = value;
    }
  })
  if (lang == null) {
    for (let i = 0; i < navigator.languages.length; i++) {
      for (let j = 0; j < supportLangList.length; j++) {
        if (navigator.languages[i] == supportLangList[j].lang) {
          lang = navigator.languages[i];
          window.electronAPI.config.set("lang", lang);
          return lang
        }
      }
    }
    lang = "en-US";
    window.electronAPI.config.set("lang", lang);
  }
  return lang
}

export { getLang };

const userLang = ((langName) => {
  for (let i = 0; i < supportLangList.length; i++) {
    if (langName == supportLangList[i].lang) {
      return supportLangList[i].library;
    }
  }
})(getLang());

/**
 * Translation to user language
 * @param {string} source
 * @returns {string} Translated string
 */
export function geti18n(source) {
  return userLang[source];
}