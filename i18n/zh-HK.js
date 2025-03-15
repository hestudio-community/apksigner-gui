export default {
  noKeyTip: "未選擇密鑰！",
  confirm: "確定",
  cancel: "取消",
  DeleteSuccess: "删除成功",
  DeleteKey: "刪除密鑰",
  DeleyeKeyTip: (keyname) => {
    return `確定要刪除密鑰 "${keyname}" 嗎？`;
  },
  AddKey: "添加密鑰",
  EditKey: "修改密鑰",
  AddKeyTips:
    "目前僅支持 密鑰庫 (.jks)文件。對於公私鑰分離的證書將在後續版本支持。",
  name: "名稱",
  jksLocation: "密鑰庫位置 (.jks)",
  keyAlias: "證書別名",
  keyPasswd: "證書密碼",
  save: "保存",
  saveSuccess: "保存成功",
  keyStone: "密鑰庫",
  AllFiles: "所有文件",
  CheckDeficiencies: "檢查一下是不是漏填了些什麼？？",
  HadSameKeyName: "已存在相同名稱的密鑰",
  Setting: "設置",
  apksignerLocation: "apksigner 位置",
  zipalignLocation: "zipalign 位置",
  advancedSettings: "高級設置",
  signAdvancedOptions: "簽名的高級選項",
  cacheCleanup: "緩存清理",
  clean: "清理",
  advancedOptions: "高級選項",
  openAdvancedOptions: "打開高級選項",
  cacheCleanSuccess: "緩存清理成功",
  cacheCleanFailed: "緩存清理失敗",
  advancedSettingWarning:
    "本安卓簽名工具提供高級設置功能旨在為有經驗的用戶提供更多靈活性。但對於因使用高級設置而導致的任何直接、間接、偶然、特殊或相應的損害，包括但不限於設備損壞、數據丟失、應用程序無法正常使用等，我們不承擔任何責任。在使用高級設置前，請您務必謹慎考慮，並充分了解相關操作可能帶來的風險。若您不確定如何進行高級設置，建議您尋求專業技術支持或避免使用該功能。\n使用本工具即表示您已閱讀、理解並接受上述風險提醒及免責聲明。",
  apkLocation: "需要簽名的 APK 位置",
  minAndroidApi: "通過驗證的最低 Android 框架 API 級別",
  autoDecideMinSDK: "自動決定 Min SDK",
  minSDKTooltip:
    "apksigner 用來確認 APK 簽名將通過驗證的最低 Android 框架 API 級別。該級別值越高，表示該工具在為應用簽名時可使用的安全參數越強，但這會限制 APK 只能用於搭載更新版本 Android 的設備。默認情況下，apksigner 會使用應用清單文件中的 minSdkVersion 屬性的值。",
  autoDecideMaxSDK: "自動決定 Max SDK",
  maxSDKTooltip:
    "apksigner 用來確認 APK 簽名將通過驗證的最高 Android 框架 API 級別。默認情況下，該工具會使用盡可能高的 API 級別。",
  signingScheme: "簽名方案",
  signingSchemeTooltip:
    "確定 apksigner 是否會使用指定的簽名方案為給定的 APK 軟件包簽名。默認情況下會根據 minSDK 和 maxSDK 共同決定。",
  autoDecideScheme: "自動為你決定簽名方案",
  selectScheme: "選擇簽名方案",
  zipalignTitle: "zipalign 對齊",
  zipalignTooltip:
    "在將 APK 文件分發給最終用戶之前，先使用 zipalign 進行優化。如果您通過使用 Android Gradle 插件 (AGP) 的 Android Studio 進行構建，系統會自動完成此操作。\n你必須在為 APK 文件簽名之前使用 zipalign。如果您在使用 apksigner 為 APK 簽名之後對 APK 做出了進一步更改，簽名便會失效。\n如果您的 APK 包含共享庫（.so 個文件），請使用 -P 16 以確保它們與適合 mmap(2) 的 16KiB 頁面邊界對齊 在 16KiB 和 4KiB 設備中。對於其他文件，其對齊方式由 zipalign 的強制性對齊參數，應按 4 個字節對齊 在 32 位和 64 位系統上運行",
  useZipalign: "使用 zipalign 對齊 APK",
  pageSize: "頁面大小",
  useZopfliRecompress: "使用 Zopfli 重新壓縮",
  exportApkTo: "將 APK 導出到",
  overwriteOriginal: "覆蓋原文件",
  showLog: "顯示日誌",
  sign: "簽名",
  chooseLanguage: "選擇語言",
  isChangeLanguageTo: (lang) => {
    return `是否將語言切換為 ${lang} ？`;
  },
};
