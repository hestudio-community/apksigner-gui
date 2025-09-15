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
            ><span class="material-symbols-outlined" style="font-size: 20px">
              code
            </span></el-button
          >
          <el-button text style="height: 32px; width: 32px" @click="open_about">
            <span class="material-symbols-outlined" style="font-size: 20px">
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
                  <el-icon><FolderOpened /></el-icon
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
                  <el-icon><FolderOpened /></el-icon
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
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <text>Java环境配置</text>
            </div>
            <div>
              <el-button text bg type="primary" @click="checkJavaEnv"
                >检查并保存</el-button
              >
            </div>
          </div>
          <br />
          <div style="display: flex; flex-direction: column">
            <el-checkbox
              v-model="JavaPath.AutoCheckJavaPath"
              @change="loadJavaPath"
              >自动从系统中读取Java环境</el-checkbox
            >
            <div v-show="!JavaPath.AutoCheckJavaPath">
              <el-input v-model="JavaPath.javapath" placeholder="Java路径">
                <template #append>
                  <el-button @click="open_java">
                    <el-icon><FolderOpened /></el-icon
                  ></el-button>
                </template>
              </el-input>
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
import { internationalization, supportLangList } from "../utils/i18n.js";
</script>

<script>
export default {
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
      JavaPath: {
        AutoCheckJavaPath: true,
        javapath: "",
      },
    };
  },
  methods: {
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
    async open_java() {
      window.electronAPI
        .openFile([
          {
            name: "java",
            extensions:
              (await window.electronAPI.SystemPlatform()) === "win32"
                ? ["exe"]
                : ["*"],
          },
        ])
        .then((result) => {
          this.JavaPath.javapath = result;
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
          }
        ).then(() => {
          this.advancedSetting = true;
          window.electronAPI.config.set("advancedSetting", true);
        });
      } else {
        window.electronAPI.config.set("advancedSetting", false);
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
      window.electronAPI.config.get("lang").then((result) => {
        if (this.lang.chooseLang != result) {
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
            }
          )
            .then(() => {
              window.electronAPI.config
                .set("lang", this.lang.chooseLang)
                .then(() => {
                  window.location.reload();
                });
            })
            .catch(() => {
              window.electronAPI.config.get("lang").then((result) => {
                this.lang.chooseLang = result;
              });
            });
        }
      });
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
    loadJavaPath() {
      if (this.JavaPath.AutoCheckJavaPath) {
        this.JavaPath.javapath = "";
      } else {
        window.electronAPI.config.get("JavaPath").then((result) => {
          this.JavaPath.javapath = result;
        });
      }
    },
    async checkJavaEnv() {
      window.electronAPI
        .CheckJavaPath(this.JavaPath.javapath)
        .then(async (data) => {
          if (data) {
            window.electronAPI.config.set("JavaPath", this.JavaPath.javapath);
            const platform = await window.electronAPI.SystemPlatform();
            if (platform === "win32") {
              let javapath;
              let keytoolpath;
              if (!this.JavaPath.javapath) {
                javapath = await window.electronAPI.SystemShell("where java");
                keytoolpath =
                  await window.electronAPI.SystemShell("where keytool");
              } else {
                javapath = this.JavaPath.javapath;
                keytoolpath = this.JavaPath.javapath.replace(
                  /\/java.exe$/,
                  "keytool.exe"
                );
              }
              ElMessageBox({
                message: `<p>环境配置正常</p><p>Java路径: ${javapath}</p><p>keytool路径: ${keytoolpath}</p>`,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
            } else if (platform === "darwin") {
              let javapath;
              let keytoolpath;
              if (!this.JavaPath.javapath) {
                javapath = await window.electronAPI.SystemShell("which java");
                keytoolpath =
                  await window.electronAPI.SystemShell("which keytool");
              } else {
                javapath = this.JavaPath.javapath;
                keytoolpath = this.JavaPath.javapath.replace(
                  /\/java$/,
                  "/keytool"
                );
              }
              ElMessageBox({
                message: `<p>环境配置正常</p><p>Java路径: ${javapath}</p><p>keytool路径: ${keytoolpath}</p>`,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
            } else {
              ElMessage({
                message: "环境配置正常",
                type: "success",
                plain: true,
              });
            }
          } else {
            ElMessage({
              message: "Java环境异常,请检查Java是否存在或者是否附带keytool",
              type: "error",
              plain: true,
            });
          }
        });
    },
  },
  async created() {
    const i18n = new internationalization();
    await i18n.init();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
  },
  mounted() {
    window.electronAPI.config.get("apksigner").then((result) => {
      this.apksigner = result;
    });
    window.electronAPI.config.get("zipalign").then((result) => {
      this.zipalign = result;
    });
    window.electronAPI.config.get("advancedSetting").then((result) => {
      this.advancedSetting = result;
    });
    window.electronAPI.config.get("lang").then((result) => {
      this.lang.chooseLang = result;
    });
    this.lang.langlist = Object.values(supportLangList);
    window.electronAPI.config.get("checkUpdate").then((result) => {
      this.AutoCheckUpdate = result;
    });
    window.electronAPI.isDevMode().then((result) => {
      this.isDevMode = result;
    });
    window.electronAPI.config.get("JavaPath").then((result) => {
      if (result) {
        this.JavaPath.AutoCheckJavaPath = false;
        this.JavaPath.javapath = result;
      } else {
        this.JavaPath.AutoCheckJavaPath = true;
        this.JavaPath.javapath = "";
      }
    });
  },
};
</script>
