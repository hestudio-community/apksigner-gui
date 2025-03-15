import zhCN from "../../i18n/zh-CN";

const supportLangList = [
  {
    lang: "zh-CN",
    display: "中文（简体）",
    library: zhCN,
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
    localStorage.setItem("lang", "zh-CN");
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
 */
export function i18n(source) {
  return userLang[source];
}
