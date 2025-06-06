<div align="center">
   <img src="./../../icons/icon.png" width="128px" />
   <h1 style="text-align: center">APKSignerGUI</h1>
   <img src="./../../images/apphome.png" width="384px"/>
   <p style="text-align: center">簡單又完整的APK簽名圖形化工具</p>
</div>

---

<div align="center">
   <a href="../../README.md">English</a> | 
   <a href="./README_CN.md">简体中文</a> | 
   <a href="./README_HK.md">繁體中文</a>
</div>

---

### 特點

- **上手簡單**：面向小白使用者，只需要導入 APK 就可以直接簽名。
- **功能完整**：面向資深使用者，提供了 Google 官方提供的所有簽名參數支援。
- **相容性好**：支援多種作業系統和架構，包括 Windows、Linux、macOS 等。
- **餅畫的圓**：初期專案，有許多不完善的地方，給大佬們留下足夠的擴展空間。

### 如何安裝

1. 前往 [Release](https://github.com/hestudio-community/apksigner-gui/releases/latest) 下載最新版本。
2. Windows 使用者可以使用 [WinGet](https://learn.microsoft.com/zh-tw/windows/package-manager/winget/) 安裝。

   ```powershell
   winget install "heStudioCommunity.APKSignerGUI(Machine-MSI)"
   ```

   當然，你也可以透過 Microsoft Store 下載。

   <a href="https://apps.microsoft.com/detail/9n3q8bk8dp86?mode=direct">
   <img src="https://get.microsoft.com/images/zh-tw%20dark.svg" width="200"/>
   </a>

3. 參考文末方式建構。

### 關於相容性

已知支援的平台（由官方打包並經過測試）：

- **Windows**：Windows 10/11 x86_64（其中 Windows10 為最新版本）、Windows 10/11 ARM64（其中 Windows10 為最新版本）
- **Linux**：Debian 12 及其衍生版本 x86_64 和 ARM64 平台。
- **macOS**：所有採用了 Apple Silicon 的 macOS 10.11 以上設備

其他平台可能需要你自行編譯。

#### 為什麼不支援 32 位系統或處理器？

我們認為 32 位系統已經落伍，甚至已無法維持基本運作。許多系統和軟體廠商已不再提供 32 位應用程式和系統。我們認為你幾乎不可能在 32 位系統上完成軟體開發，因為許多開發工具或目標平台已不支援 32 位系統。如果你仍使用 32 位系統，我們相信你有能力讓此應用程式運作。

### 如何使用？

1. 開啟應用程式後，應會看到如下介面。點選右上角設定進行首次配置。
   ![](./../../images/1.png)
2. 在 `sdk/build-tools/<版本號>` 目錄中找到 `apksigner` 和 `zipalign`，然後點選儲存。
   ![](./../../images/2.png)
3. 點選左側空白區域關閉設定，然後點選左上角 `+` 新增金鑰。
   ![](./../../images/3.png)
4. 點選右側空白區域關閉頁面，選中左側的簽名，然後開始簽名安裝包。
   ![](./../../images/apphome.png)

### 找到你的語言

[![Crowdin](https://badges.crowdin.net/apksignergui/localized.svg)](https://crowdin.com/project/apksignergui)

我們致力於為全球使用者提供一致的體驗，若你願意為此專案貢獻翻譯，我們將誠摯感謝你。

你可以透過以下兩種方式提交翻譯：

- 在 [Crowdin](https://crowdin.com/project/apksignergui) 平台提交翻譯。
- 編輯原始碼中 `i18n` 目錄下的語言檔案並提交。

找不到你的語言？同樣有兩種方式新增：

- 若使用 [Crowdin](https://crowdin.com/project/apksignergui) 平台，請提交 issue，我們將預留語言項目供你翻譯。
- 你也可以複製 `i18n` 目錄下你熟悉的語言檔案進行翻譯，提交後我們會完成其餘作業。

我們的語言代碼遵循 [ISO 639-1](https://zh.wikipedia.org/wiki/ISO_639-1)，國家/地區代碼則依據 [ISO 3166-1](https://zh.wikipedia.org/wiki/ISO_3166-1)。

感謝 [Crowdin](https://crowdin.com/) 提供開源授權。

### 如何建構？

#### 不打包

1. 安裝 [NodeJS 22 LTS](https://nodejs.org/)
2. 使用 `npm install` 安裝依賴。
3. 使用 `npm run package` 建構。
4. 在 `./out/` 目錄中取得建構物。

#### macOS

1. 安裝 [NodeJS 22 LTS](https://nodejs.org/)
2. 使用 `npm install` 安裝依賴。
3. 使用 `npm run make` 建構。
4. 在 `./out/make` 目錄中取得建構物。

#### Windows

##### ZIP 打包（推薦）

1. 安裝 [NodeJS 22 LTS](https://nodejs.org/)
2. 使用 `npm install` 安裝依賴。
3. 編輯 `forge.config.js`。
   將

   ```javascript
   {
      name: "@electron-forge/maker-wix",
      config: {
        // ...
      },
      platfrom: ["win32"],
   },
   ```

   更換為

   ```javascript
   {
     name: "@electron-forge/maker-zip",
     platfrom: ["win32"],
   }
   ```

4. 使用 `npm run make` 建構。
5. 在 `./out/make` 目錄中取得建構物。

##### MSI 打包

1. 安裝 [NodeJS 22 LTS](https://nodejs.org/)
2. 使用 `npm install` 安裝依賴。
3. 安裝 [WiX Toolset v3](https://github.com/wixtoolset/wix3/releases/download/wix3141rtm/wix314-binaries.zip)。
4. 將其路徑加入系統 `PATH` 環境變數。
5. 使用 `npm run make` 建構。
6. 在 `./out/make` 目錄中取得建構物。

#### Linux（Debian 及其衍生系統）

1. 安裝 [NodeJS 22 LTS](https://nodejs.org/)
2. 使用 `npm install` 安裝依賴。
3. 使用 `npm run make` 建構。
4. 在 `./out/make` 目錄中取得建構物。
