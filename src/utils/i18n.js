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
  if (localStorage.getItem("lang") != null) {
    return localStorage.getItem("lang");
  } else {
    for (let i = 0; i < navigator.languages.length; i++) {
      for (let j = 0; j < supportLangList.length; j++) {
        if (navigator.languages[i] == supportLangList[j].lang) {
          localStorage.setItem("lang", navigator.languages[i]);
          return localStorage.getItem("lang");
        }
      }
    }
    localStorage.setItem("lang", "en-US");
    return localStorage.getItem("lang");
  }
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