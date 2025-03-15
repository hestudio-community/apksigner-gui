export default {
  noKeyTip: "No key selected!",
  confirm: "Confirm",
  cancel: "Cancel",
  DeleteSuccess: "Successfully deleted",
  DeleteKey: "Delete key",
  DeleyeKeyTip: (keyname) => {
    return `Are you sure you want to delete the key "${keyname}"?`;
  },
  AddKey: "Add key",
  EditKey: "Edit key",
  AddKeyTips:
    "Currently, only Keystore (.jks) files are supported. Support for certificates with separate public and private keys will be added in future versions.",
  name: "Name",
  jksLocation: "Keystore location (.jks)",
  keyAlias: "Certificate alias",
  keyPasswd: "Certificate password",
  save: "Save",
  saveSuccess: "Successfully saved",
  keyStone: "Keystore",
  AllFiles: "All files",
  CheckDeficiencies: "Check if something is missing??",
  HadSameKeyName: "A key with the same name already exists",
  Setting: "Settings",
  apksignerLocation: "apksigner location",
  zipalignLocation: "zipalign location",
  advancedSettings: "Advanced settings",
  signAdvancedOptions: "Advanced options for signing",
  cacheCleanup: "Cache cleanup",
  clean: "Clean",
  advancedOptions: "Advanced Options",
  openAdvancedOptions: "Open Advanced Options",
  cacheCleanSuccess: "Cache Cleanup Successful",
  cacheCleanFailed: "Cache Cleanup Failed",
  advancedSettingWarning:
    "This Android signing tool provides advanced settings to offer more flexibility for experienced users. However, we are not responsible for any direct, indirect, incidental, special, or consequential damages caused by using advanced settings, including but not limited to device damage, data loss, and application malfunction. Before using advanced settings, please carefully consider and fully understand the potential risks involved. If you are unsure how to use advanced settings, it is recommended to seek professional technical support or avoid using this feature.\nBy using this tool, you acknowledge that you have read, understood, and accepted the above risk reminder and disclaimer.",
  apkLocation: "APK Location for Signing",
  minAndroidApi: "Minimum Android Framework API Level for Verification",
  autoDecideMinSDK: "Automatically Decide Min SDK",
  minSDKTooltip:
    "apksigner uses this to confirm the minimum Android framework API level at which the APK signature will pass verification. The higher this level, the stronger the security parameters the tool can use when signing the application, but this will limit the APK to devices running newer versions of Android. By default, apksigner uses the value of the minSdkVersion attribute in the application's manifest file.",
  autoDecideMaxSDK: "Automatically Decide Max SDK",
  maxSDKTooltip:
    "apksigner uses this to confirm the maximum Android framework API level at which the APK signature will pass verification. By default, the tool uses the highest possible API level.",
  signingScheme: "Signing Scheme",
  signingSchemeTooltip:
    "Determines whether apksigner will use the specified signing scheme to sign the given APK package. By default, it is determined jointly by minSDK and maxSDK.",
  autoDecideScheme: "Automatically Decide Signing Scheme for You",
  selectScheme: "Select Signing Scheme",
  zipalignTitle: "zipalign alignment",
  zipalignTooltip:
    "Optimize the APK file using zipalign before distributing it to end users. If you are building through Android Studio using the Android Gradle Plugin (AGP), this is done automatically.\nYou must use zipalign before signing the APK file. If you make further changes to the APK after signing it with apksigner, the signature will be invalidated.\nIf your APK contains shared libraries (.so files), use -P 16 to ensure they are aligned with the 16KiB page boundary suitable for mmap(2) in both 16KiB and 4KiB devices. For other files, their alignment is determined by zipalign's mandatory alignment parameter, which should be aligned to 4 bytes on both 32-bit and 64-bit systems",
  useZipalign: "Use Zipalign to Align APK",
  pageSize: "Page size",
  useZopfliRecompress: "Recompress using Zopfli",
  exportApkTo: "Export APK to",
  overwriteOriginal: "Overwrite original file",
  showLog: "Show log",
  sign: "Sign",
  chooseLanguage: "Choose language",
  isChangeLanguageTo: (lang) => {
    return `Do you want to switch the language to ${lang}?`;
  },
};
