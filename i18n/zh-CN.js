export default {
  noKeyTip: "未选择密钥！",
  confirm: "确定",
  cancel: "取消",
  DeleteSuccess: "删除成功",
  DeleteKey: "删除密钥",
  DeleyeKeyTip: (keyname) => {
    return `确定要删除密钥 "${keyname}" 吗？`;
  },
  AddKey: "添加密钥",
  EditKey: "修改密钥",
  AddKeyTips:
    "目前仅支持 密钥库 (.jks)文件。对于公私钥分离的证书将在后续版本支持。",
  name: "名称",
  jksLocation: "密钥库位置 (.jks)",
  keyAlias: "证书别名",
  keyPasswd: "证书密码",
  save: "保存",
  saveSuccess: "保存成功",
  keyStore: "密钥库",
  AllFiles: "所有文件",
  CheckDeficiencies: "检查一下是不是漏填了些什么？？",
  HadSameKeyName: "已存在相同名称的密钥",
  Setting: "设置",
  apksignerLocation: "apksigner 位置",
  zipalignLocation: "zipalign 位置",
  advancedSettings: "高级设置",
  signAdvancedOptions: "签名的高级选项",
  cacheCleanup: "缓存清理",
  clean: "清理",
  advancedOptions: "高级选项",
  openAdvancedOptions: "打开高级选项",
  cacheCleanSuccess: "缓存清理成功",
  cacheCleanFailed: "缓存清理失败",
  advancedSettingWarning:
    "本安卓签名工具提供高级设置功能旨在为有经验的用户提供更多灵活性。但对于因使用高级设置而导致的任何直接、间接、偶然、特殊或相应的损害，包括但不限于设备损坏、数据丢失、应用程序无法正常使用等，我们不承担任何责任。在使用高级设置前，请您务必谨慎考虑，并充分了解相关操作可能带来的风险。若您不确定如何进行高级设置，建议您寻求专业技术支持或避免使用该功能。\n使用本工具即表示您已阅读、理解并接受上述风险提醒及免责声明。",
  apkLocation: "需要签名的 APK 位置",
  minAndroidApi: "通过验证的最低 Android 框架 API 级别",
  autoDecideMinSDK: "自动决定 Min SDK",
  minSDKTooltip:
    "apksigner 用来确认 APK 签名将通过验证的最低 Android 框架 API 级别。该级别值越高，表示该工具在为应用签名时可使用的安全参数越强，但这会限制 APK 只能用于搭载更新版本 Android 的设备。默认情况下，apksigner 会使用应用清单文件中的 minSdkVersion 属性的值。",
  autoDecideMaxSDK: "自动决定 Max SDK",
  maxSDKTooltip:
    "apksigner 用来确认 APK 签名将通过验证的最高 Android 框架 API 级别。默认情况下，该工具会使用尽可能高的 API 级别。",
  signingScheme: "签名方案",
  signingSchemeTooltip:
    "确定 apksigner 是否会使用指定的签名方案为给定的 APK 软件包签名。默认情况下会根据 minSDK 和 maxSDK 共同决定。",
  autoDecideScheme: "自动为你决定签名方案",
  selectScheme: "选择签名方案",
  zipalignTitle: "zipalign 对齐",
  zipalignTooltip:
    "在将 APK 文件分发给最终用户之前，先使用 zipalign 进行优化。如果您通过使用 Android Gradle 插件 (AGP) 的 Android Studio 进行构建，系统会自动完成此操作。\n你必须在为 APK 文件签名之前使用 zipalign。如果您在使用 apksigner 为 APK 签名之后对 APK 做出了进一步更改，签名便会失效。\n如果您的 APK 包含共享库（.so 个文件），请使用 -P 16 以确保它们与适合 mmap(2) 的 16KiB 页面边界对齐 在 16KiB 和 4KiB 设备中。对于其他文件，其对齐方式由 zipalign 的强制性对齐参数，应按 4 个字节对齐 在 32 位和 64 位系统上运行",
  useZipalign: "使用 zipalign 对齐 APK",
  pageSize: "页面大小",
  useZopfliRecompress: "使用 Zopfli 重新压缩",
  exportApkTo: "将 APK 导出到",
  overwriteOriginal: "覆盖原文件",
  showLog: "显示日志",
  sign: "签名",
  chooseLanguage: "选择语言",
  isChangeLanguageTo: (lang) => {
    return `是否将语言切换为 ${lang} ？`;
  },
  signSuccess: "签名成功",
  signFailed: "签名失败",
  back: "返回",
};
