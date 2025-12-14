<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside" :style="{ width: actualSidebarWidth + 'px' }">
        <div class="toolbar">
          <el-button
            text
            type="text"
            class="toolbutton"
            @click="openaddkey = true"
            :icon="Plus"
          />
          <el-button
            text
            type="text"
            @click="RefreshKey"
            class="toolbutton refresh"
            :icon="Refresh"
          />
          <div>
            <div
              class="resize-handle-right"
              @mousedown="startResize('right', $event)"
            ></div>
            <el-drawer
              v-model="openaddkey"
              class="addkey"
              :show-close="false"
              destroy-on-close
              :with-header="false"
              size="350"
              direction="ltr"
              @close="RefreshKey"
            >
              <AddKey />
            </el-drawer>
            <el-drawer
              v-model="editkey.status"
              class="addkey"
              :show-close="false"
              destroy-on-close
              :with-header="false"
              size="350"
              direction="ltr"
              @close="RefreshKey"
            >
              <EditKey :keyname="editkey.keyname" />
            </el-drawer>
          </div>
        </div>
        <el-scrollbar
          style="max-height: calc(100vh - 48px); -webkit-app-region: no-drag"
        >
          <div v-loading="keyLoading">
            <div
              class="keybuttongroup"
              style="display: flex; flex-direction: column"
              v-for="item in keyList"
            >
              <el-dropdown trigger="contextmenu" placement="bottom-end">
                <el-button
                  @click="changeKey(item)"
                  tag="div"
                  text
                  bg
                  class="keybutton"
                >
                  <span :style="keyTextStyle">{{ item }}</span>
                </el-button>
                <template #dropdown>
                  <el-dropdown-item
                    :icon="Edit"
                    @click="
                      editkey.status = true;
                      editkey.keyname = item;
                    "
                    >{{ i18n.editKey }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :icon="RemoveFilled"
                    @click="RemoveKey(item)"
                    >{{ i18n.DeleteKey }}</el-dropdown-item
                  >
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-title">
            <text>{{ openSign }}</text>
          </div>
          <div class="headerbutton">
            <div>
              <el-button
                text
                type="text"
                style="height: 18px; width: 18px"
                @click="opensetting = true"
              >
                <el-icon>
                  <Setting />
                </el-icon>
              </el-button>
            </div>
            <div v-if="!darwin.isDarwin" style="margin-left: 8px">
              <el-button
                text
                type="text"
                style="height: 18px; width: 18px"
                @click="WindowsMinimize"
              >
                <el-icon
                  ><span
                    class="material-symbols-outlined"
                    style="font-size: 18px"
                  >
                    remove
                  </span></el-icon
                >
              </el-button>
              <el-button
                text
                type="text"
                style="height: 18px; width: 18px"
                @click="WindowsMaximize"
                v-if="windows.isMaxmaximize"
              >
                <el-icon
                  ><span
                    class="material-symbols-outlined"
                    style="font-size: 18px"
                  >
                    collapse_content
                  </span></el-icon
                >
              </el-button>
              <el-button
                text
                type="text"
                style="height: 18px; width: 18px"
                @click="WindowsMaximize"
                v-else
              >
                <el-icon
                  ><span
                    class="material-symbols-outlined"
                    style="font-size: 18px"
                  >
                    expand_content
                  </span></el-icon
                >
              </el-button>
              <el-button
                text
                type="text"
                style="height: 18px; width: 18px"
                @click="WindowsClose"
              >
                <el-icon
                  ><span
                    class="material-symbols-outlined"
                    style="font-size: 18px"
                  >
                    close
                  </span></el-icon
                >
              </el-button>
            </div>
          </div>
          <el-drawer
            v-model="opensetting"
            class="settings"
            :show-close="false"
            destroy-on-close
            :with-header="false"
            size="350"
          >
            <SettingPage @advanced-setting="checkAdvancedSetting" />
          </el-drawer>
        </el-header>
        <div class="main">
          <el-scrollbar style="max-height: calc(100vh - 46px)">
            <div style="padding: 20px">
              <el-empty v-if="!openSign" :description="i18n.noKeyTip" />
              <Sign
                v-else
                :keyname="openSign"
                :advanced-setting="advancedSetting"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.aside {
  width: 200px;
  min-width: 128px;
  max-width: 50%;
  height: calc(100vh - 20px);
  -webkit-app-region: drag;
  position: relative;
}

.resize-handle-right {
  position: absolute;
  top: 36px;
  bottom: 10px;
  width: 4px;
  cursor: col-resize;
  -webkit-app-region: no-drag;
  z-index: 10;
  right: 0;
}

.resize-handle-right:hover {
  background-color: #fba4144d;
}

.toolbar {
  display: flex;
  flex-direction: row;
  height: 18px;
  margin-bottom: 8px;
  align-items: center;
}

.toolbutton {
  height: 18px;
  width: 18px;
  -webkit-app-region: no-drag;
}

.keybuttongroup {
  width: 100%;
  margin-bottom: 10px;
}

.keybutton {
  width: calc(100% - 20px) !important;
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-start !important;
  min-width: 0 !important;
  overflow: hidden !important;
}

.keybutton span {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  flex: 1 !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.header {
  height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  margin-bottom: 8px;
}

.header-title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.headerbutton {
  -webkit-app-region: no-drag;
  display: flex;
  flex-direction: row;
}

.main {
  border-radius: 15px;
  height: 100%;
  background-color: #ffffff;
}

.settings {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.addkey {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  -webkit-app-region: no-drag;
}

@media (prefers-color-scheme: dark) {
  .header {
    color: #e5eaf3;
  }

  .main {
    background-color: #1d1e1f;
  }
}
</style>

<script setup>
import {
  Plus,
  Setting,
  Refresh,
  RemoveFilled,
  Edit,
} from "@element-plus/icons-vue";
import SettingPage from "./components/Settings.vue";
import AddKey from "./components/AddKey.vue";
import EditKey from "./components/EditKey.vue";
import Sign from "./components/Sign.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { internationalization } from "./utils/i18nServices/client.js";
</script>

<script>
export default {
  data() {
    return {
      opensetting: false,
      openaddkey: false,
      editkey: {
        status: false,
        keyname: "",
      },
      windows: {
        isMaxmaximize: false,
      },
      darwin: {
        isDarwin: false,
      },
      keyList: [],
      keyLoading: true,
      openSign: "",
      sidebarWidth: 30,
      isResizing: false,
      advancedSetting: false,
      i18n: {
        noKeyTip: undefined,
        confirm: undefined,
        cancel: undefined,
        DeleteSuccess: undefined,
        DeleteKey: undefined,
        DeleyeKeyTip: undefined,
        editKey: undefined,
      },
    };
  },
  computed: {
    actualSidebarWidth() {
      const minWidth = 128;
      const maxWidth = Math.min(window.innerWidth * 0.5, window.innerWidth);
      const range = maxWidth - minWidth;

      if (range <= 0) {
        return minWidth;
      }

      const validatedPercent = Math.max(0, Math.min(100, this.sidebarWidth));
      const calculatedWidth = minWidth + (validatedPercent / 100) * range;

      return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
    },

    keyTextStyle() {
      return {
        textAlign: "left",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        flex: "1",
        minWidth: "0",
      };
    },
  },
  methods: {
    checkAdvancedSetting() {
      const advancedSetting = window.electronAPI.config.get("advancedSetting");
      if (advancedSetting) {
        this.advancedSetting = advancedSetting;
      } else {
        this.advancedSetting = false;
      }
    },
    startResize(direction, event) {
      this.isResizing = true;
      this.startX = event.clientX;

      const minWidth = 128;
      const maxWidth = Math.min(window.innerWidth * 0.5, window.innerWidth);
      this.resizeRange = Math.max(0, maxWidth - minWidth);
      this.resizeMinWidth = minWidth;

      const currentActualWidth = this.actualSidebarWidth;
      if (this.resizeRange > 0) {
        this.startWidthPercent =
          ((currentActualWidth - minWidth) / this.resizeRange) * 100;
      } else {
        this.startWidthPercent = 0;
      }

      document.addEventListener("mousemove", this.doResize);
      document.addEventListener("mouseup", this.stopResize);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },

    doResize(event) {
      if (!this.isResizing) return;

      const deltaX = event.clientX - this.startX;

      const deltaPercent = (deltaX / this.resizeRange) * 100;
      let newWidthPercent;

      newWidthPercent = this.startWidthPercent + deltaPercent;

      newWidthPercent = Math.max(0, Math.min(100, newWidthPercent));

      const newActualWidth =
        this.resizeMinWidth + (newWidthPercent / 100) * this.resizeRange;

      const currentMinWidth = 128;
      const currentMaxWidth = Math.min(
        window.innerWidth * 0.5,
        window.innerWidth,
      );
      const currentRange = currentMaxWidth - currentMinWidth;

      const clampedActualWidth = Math.max(
        currentMinWidth,
        Math.min(currentMaxWidth, newActualWidth),
      );

      if (currentRange > 0) {
        this.sidebarWidth =
          ((clampedActualWidth - currentMinWidth) / currentRange) * 100;
      } else {
        this.sidebarWidth = 0;
      }

      this.$nextTick(() => {
        this.updateKeyTextWidth();
      });
    },

    updateKeyTextWidth() {
      this.$forceUpdate();
    },

    stopResize() {
      this.isResizing = false;

      document.removeEventListener("mousemove", this.doResize);
      document.removeEventListener("mouseup", this.stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      window.electronAPI.config.set("sidebarWidth", this.sidebarWidth);
    },

    async RefreshKey() {
      this.keyLoading = true;
      document.querySelector(".refresh").classList.add("element-rotate");
      setTimeout(() => {
        document.querySelector(".refresh").classList.remove("element-rotate");
      }, 618);
      this.keyList = [];
      const keys = window.electronAPI.config.get("keys");
      if (keys) {
        this.keyList = Object.keys(keys);
        if (!this.keyList.includes(this.openSign)) {
          this.openSign = "";
        }
      } else {
        this.openSign = "";
      }
      this.$nextTick(() => {
        this.updateKeyTextWidth();
      });
      this.keyLoading = false;
    },
    RemoveKey(keyname) {
      ElMessageBox.confirm(
        this.i18n.DeleyeKeyTip(keyname),
        this.i18n.DeleteKey,
        {
          confirmButtonText: this.i18n.confirm,
          cancelButtonText: this.i18n.cancel,
          type: "warning",
        },
      ).then(() => {
        const keys = window.electronAPI.config.get("keys");
        if (keys && keys[keyname]) {
          delete keys[keyname];
          window.electronAPI.config.set("keys", keys);
        }
        ElMessage({
          message: this.i18n.DeleteSuccess,
          type: "success",
          plain: true,
        });
        this.RefreshKey();
      });
    },
    WindowsClose() {
      window.electronAPI.WindowsClose();
    },
    WindowsMinimize() {
      window.electronAPI.WindowsMinimize();
    },
    WindowsMaximize() {
      window.electronAPI.WindowsMaximize();
    },
    changeKey(keyname) {
      this.openSign = keyname;
      window.electronAPI.config.set("lastUseKey", keyname);
    },
  },
  async created() {
    const i18n = new internationalization();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
    window.electronAPI.SystemPlatform().then(async (result) => {
      if (result == "darwin") {
        this.darwin.isDarwin = true;
        setInterval(async () => {
          const isFullScreen = await window.electronAPI.WindowsIsFullScreen();
          if (isFullScreen) {
            document.querySelector(".toolbar").style.marginLeft = "0px";
          } else {
            document.querySelector(".toolbar").style.marginLeft = "72px";
          }
        }, 100);
      } else {
        document.querySelector(".toolbar").style.marginLeft = "0px";
        setInterval(async () => {
          this.windows.isMaxmaximize =
            await window.electronAPI.WindowsIsMaximized();
        }, 100);
      }
    });
  },
  mounted() {
    const savedWidth = window.electronAPI.config.get("sidebarWidth");
    const defaultSidebarWidth = 30;

    if (savedWidth !== null && savedWidth !== undefined) {
      if (savedWidth < 0 || savedWidth > 100 || isNaN(savedWidth)) {
        console.warn(
          `Sidebar width ${savedWidth} is out of range (0-100), restoring default value ${defaultSidebarWidth}`,
        );
        this.sidebarWidth = defaultSidebarWidth;
        window.electronAPI.config.set("sidebarWidth", defaultSidebarWidth);
      } else {
        this.sidebarWidth = savedWidth;
      }
    } else {
      this.sidebarWidth = defaultSidebarWidth;
      window.electronAPI.config.set("sidebarWidth", defaultSidebarWidth);
    }

    const checkUpdate = window.electronAPI.config.get("checkUpdate");
    if (checkUpdate == null) {
      window.electronAPI.config.set("checkUpdate", true);
      window.electronAPI.AppCheckUpdate(false);
    } else if (checkUpdate) {
      window.electronAPI.AppCheckUpdate(false);
    }

    setInterval(async () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.querySelector("html").classList.add("dark");
        if (this.darwin.isDarwin) {
          document.body.style.backgroundColor = "transparent";
          const selectors = await document.querySelectorAll(".keybutton");
          for (let i = 0; i < selectors.length; i++) {
            selectors[i].style.backgroundColor = "rgba(0, 0, 0, 0.3)";
            selectors[i].style.color = "#E5EAF3";
            if (selectors[i].textContent === this.openSign) {
              selectors[i].style.backgroundColor = "rgba(209, 136, 3, 1.0)";
              selectors[i].style.color = "#ffffff";
            }
          }
        } else {
          const selectors = await document.querySelectorAll(".keybutton");
          for (let i = 0; i < selectors.length; i++) {
            selectors[i].style.backgroundColor = "rgba(0, 0, 0, 1.0)";
            selectors[i].style.color = "#E5EAF3";
            if (selectors[i].textContent === this.openSign) {
              selectors[i].style.backgroundColor = "rgba(209, 136, 3, 1.0)";
              selectors[i].style.color = "#ffffff";
            }
          }
        }
      } else {
        document.querySelector("html").classList.remove("dark");
        if (this.darwin.isDarwin) {
          document.body.style.backgroundColor = "transparent";
          const selectors = await document.querySelectorAll(".keybutton");
          for (let i = 0; i < selectors.length; i++) {
            selectors[i].style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            selectors[i].style.color = "#303133";
            if (selectors[i].textContent === this.openSign) {
              selectors[i].style.backgroundColor = "rgba(251, 164, 20, 1.0)";
              selectors[i].style.color = "#ffffff";
            }
          }
        } else {
          const selectors = await document.querySelectorAll(".keybutton");
          for (let i = 0; i < selectors.length; i++) {
            selectors[i].style.backgroundColor = "rgba(255, 255, 255, 1.0)";
            selectors[i].style.color = "#303133";
            if (selectors[i].textContent === this.openSign) {
              selectors[i].style.backgroundColor = "rgba(251, 164, 20, 1.0)";
              selectors[i].style.color = "#ffffff";
            }
          }
        }
      }
    }, 100);
    this.RefreshKey().then(() => {
      const lastUseKey = window.electronAPI.config.get("lastUseKey");
      if (lastUseKey && this.keyList.includes(lastUseKey)) {
        this.openSign = lastUseKey;
      } else {
        this.openSign = "";
      }
      this.$nextTick(() => {
        this.updateKeyTextWidth();
      });
    });
    this.checkAdvancedSetting();
  },
};
</script>
