<template>
  <div>
    <div v-if="!openAdvancedSettings" class="mainPage">
      <h2 style="display: flex; justify-content: space-between">
        <text>{{ i18n.Setting }}</text>
        <div style="display: flex; flex-direction: row; margin-right: 2px">
          <el-button
            text
            style="height: 32px; width: 32px"
            @click="open_devtools"
            v-if="isDevMode"
            ><span class="material-symbols-rounded" style="font-size: 20px">
              code
            </span></el-button
          >
          <el-button text style="height: 32px; width: 32px" @click="open_about">
            <span class="material-symbols-rounded" style="font-size: 20px">
              info
            </span></el-button
          >
        </div>
      </h2>
      <el-scrollbar style="max-height: calc(100vh - 120px)">
        <el-card style="display: flex; flex-direction: column">
          <div>
            <text>{{ i18n.apksignerLocation }}</text>
            <el-input v-model="apksigner" placeholder="apksigner">
              <template #append>
                <el-button @click="open_apksigner">
                  <el-icon> <FolderOpened /> </el-icon
                ></el-button>
              </template>
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.zipalignLocation }}</text>
            <el-input v-model="zipalign" placeholder="zipalign">
              <template #append>
                <el-button @click="open_zipalign">
                  <el-icon> <FolderOpened /> </el-icon
                ></el-button>
              </template>
            </el-input>
          </div>
          <br />
          <div style="justify-self: end">
            <el-button text bg type="primary" @click="save_filepath">
              {{ i18n.save }}
            </el-button>
          </div>
        </el-card>
        <el-card>
          <div style="justify-self: end">
            <el-button text bg type="primary" @click="open_advancedSetting">{{
              i18n.advancedSettings
            }}</el-button>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <div v-else class="advancedSetting">
      <el-page-header @back="close_advancedSetting" :title="i18n.back">
        <template #content>
          <h3>{{ i18n.advancedSettings }}</h3>
        </template>
      </el-page-header>
      <el-scrollbar
        style="max-height: calc(100vh - 120px); height: calc(100vh - 120px)"
      >
        <el-card>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>{{ i18n.signAdvancedOptions }}</text>
            </div>
            <div>
              <el-switch
                v-model="advancedSetting"
                @change="openSignAdvancedSetting"
              />
            </div>
          </div>
        </el-card>
        <el-card>
          <div>
            <text>{{ i18n.chooseLanguage }}</text>
          </div>
          <br />
          <el-select v-model="lang.chooseLang" @change="changelanguage">
            <el-option
              v-for="item in lang.langlist"
              :key="item.lang"
              :label="item.display"
              :value="item.lang"
            />
          </el-select>
        </el-card>
        <el-card>
          <div>
            <text>{{ i18n.chooseFont }}</text>
          </div>
          <br />
          <el-select
            v-model="font.selected"
            filterable
            :loading="font.loading"
            @visible-change="handleFontDropdown"
            @change="changeFont"
          >
            <el-option
              :label="i18n.systemFontDefault"
              :value="font.systemDefaultValue"
            />
            <el-option
              v-for="item in font.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-card>
        <el-card>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>{{ i18n.cacheCleanup }}</text>
            </div>
            <div>
              <el-button
                text
                bg
                type="primary"
                :loading="cleaningTmpDir"
                @click="clearTmpDir"
                >{{ i18n.clean }}</el-button
              >
            </div>
          </div>
          <br />
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>{{ i18n.openAutoCheckUpdate }}</text>
            </div>
            <div>
              <el-switch
                v-model="AutoCheckUpdate"
                @change="ChangeAutoCheckUpdate"
              />
            </div>
          </div>
        </el-card>
        <el-card>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>{{ i18n.backupConfig }}</text>
            </div>
            <div>
              <el-button text bg type="primary" @click="backupConfig">{{
                i18n.backup
              }}</el-button>
            </div>
          </div>
          <br />
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>{{ i18n.restoreConfig }}</text>
            </div>
            <div>
              <el-button text bg type="primary" @click="restoreConfig">{{
                i18n.restore
              }}</el-button>
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
  </div>
</template>

<style>
.el-input {
  margin-top: 5px;
}

.el-page-header__title {
  font-size: 18px;
  color: gray;
}

/* 卡片样式 */
.el-card {
  border-radius: 8px;
}

.font-preview-wrapper {
  margin-top: 12px;
}

.font-preview-text {
  font-family: var(--app-font-preview, var(--app-font-stack));
}

/* 主页面和高级设置页面样式 */
.mainPage,
.advancedSetting {
  height: 100%;
  overflow: hidden;
}
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { internationalization } from "../utils/i18nServices/client.js";
import { supportLangList } from "../utils/i18nServices/config.js";
</script>

<script>
export default {
  emits: ["advancedSetting"],
  data() {
    return {
      apksigner: "",
      zipalign: "",
      advancedSetting: false,
      cleaningTmpDir: false,
      openAdvancedSettings: false,
      lang: {
        chooseLang: "",
        langlist: [],
      },
      font: {
        list: [],
        selected: "__SYSTEM_DEFAULT__",
        loading: false,
        loaded: false,
        systemDefaultValue: "__SYSTEM_DEFAULT__",
      },
      defaultFontStack:
        'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Microsoft JhengHei", "Noto Sans CJK SC", "Noto Sans CJK TC", Tahoma, Geneva, Verdana, sans-serif',
      i18n: {
        Setting: undefined,
        apksignerLocation: undefined,
        zipalignLocation: undefined,
        save: undefined,
        saveSuccess: undefined,
        advancedSettings: undefined,
        signAdvancedOptions: undefined,
        cacheCleanup: undefined,
        clean: undefined,
        CheckDeficiencies: undefined,
        advancedOptions: undefined,
        openAdvancedOptions: undefined,
        confirm: undefined,
        cancel: undefined,
        cacheCleanSuccess: undefined,
        cacheCleanFailed: undefined,
        advancedSettingWarning: undefined,
        chooseLanguage: undefined,
        chooseFont: undefined,
        systemFontDefault: undefined,
        isChangeLanguageTo: undefined,
        back: undefined,
        openAutoCheckUpdate: undefined,
        fileNotExists: undefined,
        backupConfig: undefined,
        restoreConfig: undefined,
        backup: undefined,
        restore: undefined,
        backupSuccess: undefined,
        restoreSuccess: undefined,
        restoreError: undefined,
        backupError: undefined,
      },
      AutoCheckUpdate: true,
      isDevMode: false,
    };
  },
  methods: {
    cleanupFontName(name) {
      if (!name || typeof name !== "string") {
        return "";
      }
      const withoutExtension = name
        .replace(/\.(ttf|otf|ttc|otc|dfont|woff2?|pcf)$/i, "")
        .replace(/\s*\(.*?\)\s*/g, " ")
        .trim();
      if (!withoutExtension) {
        return "";
      }
      return withoutExtension.replace(/\s+/g, " ").trim();
    },
    formatFontLabel(name) {
      const cleaned = this.cleanupFontName(name);
      if (!cleaned) {
        return typeof name === "string" ? name.trim() : "";
      }
      const replaced = cleaned
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();
      if (!replaced) {
        return cleaned;
      }
      return replaced
        .split(" ")
        .map((word) => {
          if (/^[A-Za-z]+$/.test(word)) {
            if (/^[A-Z]+$/.test(word)) {
              return word;
            }
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
          }
          return word;
        })
        .join(" ");
    },
    normalizeFontKey(name) {
      const cleaned = this.cleanupFontName(name);
      if (!cleaned) {
        return "";
      }
      return cleaned.toLowerCase().replace(/[\s_-]+/g, "");
    },
    handleFontDropdown(visible) {
      if (visible && !this.font.loaded) {
        this.loadFonts();
      }
    },
    async loadFonts() {
      if (this.font.loading || this.font.loaded) {
        return;
      }
      this.font.loading = true;
      try {
        const fonts = await window.electronAPI.getSystemFonts();
        if (Array.isArray(fonts)) {
          const dedupe = new Map();
          for (const entry of fonts) {
            if (entry && typeof entry === "object" && entry.value) {
              const value =
                typeof entry.value === "string" ? entry.value.trim() : "";
              if (!value) {
                continue;
              }
              const labelCandidate =
                entry.label && typeof entry.label === "string"
                  ? entry.label.trim()
                  : "";
              const label =
                labelCandidate || this.formatFontLabel(value) || value;
              const key = this.normalizeFontKey(value);
              if (!key) {
                continue;
              }
              const existing = dedupe.get(key);
              if (existing) {
                if (
                  existing.label === existing.value &&
                  label &&
                  label !== existing.label
                ) {
                  dedupe.set(key, { value, label });
                }
                continue;
              }
              dedupe.set(key, { value, label });
            } else if (typeof entry === "string") {
              const value = entry.trim();
              if (!value) {
                continue;
              }
              const key = this.normalizeFontKey(value);
              if (!key) {
                continue;
              }
              const label = this.formatFontLabel(value) || value;
              const existing = dedupe.get(key);
              if (existing) {
                if (
                  existing.label === existing.value &&
                  label !== existing.label
                ) {
                  dedupe.set(key, { value, label });
                }
                continue;
              }
              dedupe.set(key, { value, label });
            }
          }
          const items = Array.from(dedupe.values());
          items.sort((a, b) =>
            a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
          );
          let selectionChanged = false;
          if (
            this.font.selected &&
            this.font.selected !== this.font.systemDefaultValue
          ) {
            const selectedValue = this.font.selected.trim();
            if (selectedValue) {
              const valueMap = new Map(
                items.map((item) => [
                  this.normalizeFontKey(item.value),
                  item.value,
                ]),
              );
              const matched = valueMap.get(
                this.normalizeFontKey(selectedValue),
              );
              if (matched) {
                if (matched !== this.font.selected) {
                  this.font.selected = matched;
                  selectionChanged = true;
                }
              } else {
                items.unshift({
                  value: selectedValue,
                  label: this.formatFontLabel(selectedValue) || selectedValue,
                });
              }
            }
          }
          this.font.list = items;
          this.font.loaded = true;
          if (selectionChanged) {
            this.updateFontStack();
            window.electronAPI.config.set("fontFamily", this.font.selected);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.font.loading = false;
      }
    },
    changeFont() {
      this.updateFontStack();
      if (this.font.selected === this.font.systemDefaultValue) {
        window.electronAPI.config.del("fontFamily");
      } else {
        window.electronAPI.config.set("fontFamily", this.font.selected);
      }
    },
    updateFontStack() {
      const stack = this.createFontStack(this.font.selected);
      document.documentElement.style.setProperty("--app-font-stack", stack);
      document.documentElement.style.setProperty("--el-font-family", stack);
      document.documentElement.style.setProperty("--app-font-preview", stack);
    },
    createFontStack(fontName) {
      if (!fontName || fontName === this.font.systemDefaultValue) {
        return this.defaultFontStack;
      }
      return `${this.wrapFontName(fontName)}, ${this.defaultFontStack}`;
    },
    wrapFontName(name) {
      if (!name) {
        return "";
      }
      const trimmed = name.trim();
      if (!trimmed) {
        return "";
      }
      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        return trimmed;
      }
      const escaped = trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      if (/\s/.test(escaped) || escaped.includes("'")) {
        return `"${escaped}"`;
      }
      return escaped;
    },
    open_devtools() {
      window.electronAPI.openDevtools();
    },
    open_about() {
      window.electronAPI.AppAbout();
    },
    open_apksigner() {
      window.electronAPI
        .openFile([
          {
            name: "apksigner",
            extensions: ["*"],
          },
        ])
        .then((result) => {
          this.apksigner = result;
        });
    },
    open_zipalign() {
      window.electronAPI
        .openFile([
          {
            name: "zipalign",
            extensions: ["*"],
          },
        ])
        .then((result) => {
          this.zipalign = result;
        });
    },
    save_filepath() {
      if (!this.apksigner || !this.zipalign) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
        return;
      } else {
        window.electronAPI.checkFileExists(this.apksigner).then((exists) => {
          if (!exists) {
            ElMessage({
              message: this.i18n.fileNotExists(this.apksigner),
              type: "error",
              plain: true,
            });
            return;
          }
          window.electronAPI.config.set("apksigner", this.apksigner);
          window.electronAPI.checkFileExists(this.zipalign).then((exists) => {
            if (!exists) {
              ElMessage({
                message: this.i18n.fileNotExists(this.zipalign),
                type: "error",
                plain: true,
              });
              return;
            }
            window.electronAPI.config.set("zipalign", this.zipalign);
            ElMessage({
              message: this.i18n.saveSuccess,
              type: "success",
              plain: true,
            });
          });
        });
      }
    },
    open_advancedSetting() {
      this.openAdvancedSettings = true;
    },
    close_advancedSetting() {
      this.openAdvancedSettings = false;
    },
    openSignAdvancedSetting() {
      if (this.advancedSetting) {
        this.advancedSetting = false;
        ElMessageBox.confirm(
          this.i18n.advancedSettingWarning,
          this.i18n.advancedOptions,
          {
            confirmButtonText: this.i18n.openAdvancedOptions,
            cancelButtonText: this.i18n.cancel,
            confirmButtonClass: "el-button--danger",
            type: "danger",
          },
        ).then(() => {
          this.advancedSetting = true;
          window.electronAPI.config.set("advancedSetting", true);
          this.$emit("advancedSetting");
        });
      } else {
        window.electronAPI.config.set("advancedSetting", false);
        this.$emit("advancedSetting");
      }
    },
    clearTmpDir() {
      this.cleaningTmpDir = true;
      window.electronAPI.ClearTmpDir().then((result) => {
        if (typeof result == "boolean" && result) {
          ElMessage({
            message: this.i18n.cacheCleanSuccess,
            type: "success",
            plain: true,
          });
        } else {
          ElMessage({
            message: this.i18n.cacheCleanFailed,
            type: "error",
            plain: true,
          });
          console.error(result);
        }
        this.cleaningTmpDir = false;
      });
    },
    changelanguage() {
      const lang = window.electronAPI.config.get("lang");
      if (this.lang.chooseLang != lang) {
        let display = null;
        for (
          let index = 0;
          index < Object.values(supportLangList).length;
          index++
        ) {
          const element = Object.values(supportLangList)[index];
          if (element.lang == this.lang.chooseLang) {
            display = element.display;
          }
        }
        ElMessageBox.confirm(
          this.i18n.isChangeLanguageTo(display),
          this.i18n.chooseLanguage,
          {
            confirmButtonText: this.i18n.confirm,
            cancelButtonText: this.i18n.cancel,
            type: "warning",
          },
        )
          .then(() => {
            window.electronAPI.config.set("lang", this.lang.chooseLang);
            window.electronAPI.reloadLang();
            window.location.reload();
          })
          .catch(() => {
            this.lang.chooseLang = window.electronAPI.config.get("lang");
          });
      }
    },
    ChangeAutoCheckUpdate() {
      if (this.AutoCheckUpdate) {
        window.electronAPI.config.set("checkUpdate", true);
      } else {
        window.electronAPI.config.set("checkUpdate", false);
      }
    },
    async backupConfig() {
      try {
        const success = await window.electronAPI.backupConfig();
        if (success) {
          ElMessage({
            message: this.i18n.backupSuccess,
            type: "success",
            plain: true,
          });
        } else {
          ElMessage({
            message: this.i18n.backupError,
            type: "error",
            plain: true,
          });
        }
      } catch (error) {
        ElMessage({
          message: this.i18n.backupError,
          type: "error",
          plain: true,
        });
      }
    },
    async restoreConfig() {
      try {
        const success = await window.electronAPI.restoreConfig();
        if (success) {
          ElMessage({
            message: this.i18n.restoreSuccess,
            type: "success",
            plain: true,
          });
        } else {
          ElMessage({
            message: this.i18n.restoreError,
            type: "error",
            plain: true,
          });
        }
      } catch (error) {
        ElMessage({
          message: this.i18n.restoreError,
          type: "error",
          plain: true,
        });
      }
    },
  },
  async created() {
    const i18n = new internationalization();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
  },
  mounted() {
    this.apksigner = window.electronAPI.config.get("apksigner");
    this.zipalign = window.electronAPI.config.get("zipalign");
    this.advancedSetting = window.electronAPI.config.get("advancedSetting");
    this.lang.chooseLang = window.electronAPI.config.get("lang");
    this.lang.langlist = Object.values(supportLangList);
    this.AutoCheckUpdate = window.electronAPI.config.get("checkUpdate");
    const savedFont = window.electronAPI.config.get("fontFamily");
    if (savedFont && typeof savedFont === "string" && savedFont.trim()) {
      this.font.selected = savedFont;
    } else {
      this.font.selected = this.font.systemDefaultValue;
    }
    this.updateFontStack();
    this.loadFonts();
    window.electronAPI.isDevMode().then((data) => (this.isDevMode = data));
  },
};
</script>
