<template>
  <div class="transition-container">
    <Transition :name="transitionName">
      <div v-if="!openAdvancedSettings" class="mainPage" key="main">
        <h2 style="display: flex; justify-content: space-between">
          <text>{{ i18n.Setting }}</text>
          <div style="display: flex; flex-direction: row">
            <el-button
              text
              style="height: 32px; width: 32px"
              @click="open_devtools"
              ><Icon
                icon="fluent:window-dev-tools-20-regular"
                width="20"
                height="20"
            /></el-button>
            <el-button text style="height: 32px; width: 32px" @click="open_about"
              ><Icon icon="mdi:about-circle-outline" width="20" height="20"
            /></el-button>
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
      <div v-else class="advancedSetting" key="advanced">
        <el-page-header @back="close_advancedSetting" :title="i18n.back">
          <template #content>
            <h3>{{ i18n.advancedSettings }}</h3>
          </template>
        </el-page-header>
        <el-scrollbar style="max-height: calc(100vh - 120px)">
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
                <text style="margin: 3px">{{ i18n.signAdvancedOptions }}</text>
              </div>
              <div>
                <el-switch
                  v-model="advancedSetting"
                  @change="openSignAdvancedSetting"
                  style="margin: 3px"
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
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <text style="margin: 3px">{{ i18n.cacheCleanup }}</text>
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
          </el-card>
        </el-scrollbar>
      </div>
    </Transition>
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

/* 容器样式 */
.transition-container {
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 120px);
}

/* 共用的过渡效果设置 - 优化动画体验 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.309s ease-in;
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
}

/* 从主页到高级设置(向左滑动) */
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

/* 从高级设置返回主页(向右滑动) */
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* 共用的静态状态 */
.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Icon } from "@iconify/vue";
import { geti18n, supportLangList } from "../utils/i18n.js";
</script>

<script>
export default {
  data() {
    return {
      apksigner: "",
      zipalign: "",
      advancedSetting: false,
      cleaningTmpDir: false,
      mainPage: true,
      openAdvancedSettings: false,
      transitionName: 'slide-left',
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
      },
      transitionName: "slide-left",
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
    save_filepath() {
      if (!this.apksigner || !this.zipalign) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
        return;
      } else {
        localStorage.setItem("apksigner", this.apksigner);
        localStorage.setItem("zipalign", this.zipalign);
        ElMessage({
          message: this.i18n.saveSuccess,
          type: "success",
          plain: true,
        });
      }
    },
    open_advancedSetting() {
      this.transitionName = 'slide-left';
      this.mainPage = false;
      this.openAdvancedSettings = true;
    },
    close_advancedSetting() {
      this.transitionName = 'slide-right';
      this.openAdvancedSettings = false;
      this.mainPage = true;
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
          localStorage.setItem("advancedSetting", 1);
          window.electronAPI.openAdvancedSetting();
        });
      } else {
        localStorage.setItem("advancedSetting", 0);
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
      if (this.lang.chooseLang != localStorage.getItem("lang")) {
        let display = null;
        for (let index = 0; index < supportLangList.length; index++) {
          const element = supportLangList[index];
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
            localStorage.setItem("lang", this.lang.chooseLang);
            window.location.reload();
          })
          .catch(() => {
            this.lang.chooseLang = localStorage.getItem("lang");
          });
      }
    },
  },
  created() {
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = geti18n(key);
    }
  },
  mounted() {
    this.apksigner = localStorage.getItem("apksigner");
    this.zipalign = localStorage.getItem("zipalign");
    this.lang.langlist = supportLangList;
    this.lang.chooseLang = localStorage.getItem("lang");
    if (localStorage.getItem("advancedSetting") == 1) {
      this.advancedSetting = true;
    }
  },
};
</script>
