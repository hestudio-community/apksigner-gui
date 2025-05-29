<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside">
        <div class="toolbar">
          <el-button text class="toolbutton" @click="openaddkey = true"
            ><el-icon><Plus /></el-icon
          ></el-button>
          <el-button text @click="RefreshKey" class="toolbutton refresh"
            ><el-icon><Refresh /></el-icon>
          </el-button>
          <div>
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
        <el-scrollbar style="max-height: calc(100vh - 100px - 18px)">
          <div v-loading="keyLoading">
            <div
              class="keybutton"
              style="display: flex; flex-direction: column"
              v-for="item in keyList"
            >
              <el-dropdown trigger="contextmenu" placement="bottom-end">
                <el-button
                  @click="openSign = item"
                  tag="div"
                  text
                  bg
                  style="
                    width: 190px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                  "
                >
                  <div
                    style="
                      text-align: left;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 135px;
                    "
                  >
                    <text>{{ item }}</text>
                  </div>
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
          <text>{{ openSign }}</text>
          <div class="headerbutton">
            <div>
              <el-button
                text
                style="height: 18px; width: 18px"
                @click="opensetting = true"
              >
                <el-icon><Setting /></el-icon>
              </el-button>
            </div>
            <div v-if="!darwin.isDarwin">
              <el-button
                text
                style="height: 18px; width: 18px"
                @click="WindowsMinimize"
              >
                <el-icon
                  ><Icon
                    icon="qlementine-icons:windows-minimize-16"
                    width="16"
                    height="16"
                /></el-icon>
              </el-button>
              <el-button
                text
                style="height: 18px; width: 18px"
                @click="WindowsMaximize"
                v-if="windows.isMaxmaximize"
              >
                <el-icon
                  ><Icon
                    icon="qlementine-icons:windows-unmaximize-16"
                    width="16"
                    height="16"
                /></el-icon>
              </el-button>
              <el-button
                text
                style="height: 18px; width: 18px"
                @click="WindowsMaximize"
                v-else
              >
                <el-icon
                  ><Icon
                    icon="qlementine-icons:windows-maximize-16"
                    width="16"
                    height="16"
                /></el-icon>
              </el-button>
              <el-button
                text
                style="height: 18px; width: 18px"
                @click="WindowsClose"
              >
                <el-icon
                  ><Icon
                    icon="qlementine-icons:close-16"
                    width="16"
                    height="16"
                /></el-icon>
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
            <SettingPage />
          </el-drawer>
        </el-header>
        <el-main class="main">
          <el-scrollbar style="max-height: calc(100vh - 100px)">
            <el-empty v-if="!openSign" :description="i18n.noKeyTip" />
            <Sign v-else :keyname="openSign" />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.aside {
  width: 100%;
  max-width: 200px;
  min-width: 50px;
  height: calc(100vh - 20px);
}

.toolbar {
  display: flex;
  flex-direction: row;
  height: 18px;
  margin-bottom: 8px;
  align-items: center;
  -webkit-app-region: drag;
}

.toolbutton {
  height: 18px;
  width: 18px;
  -webkit-app-region: no-drag;
}

.keybutton {
  width: 100%;
  margin-bottom: 10px;
}

.header {
  height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f3f5;
  -webkit-app-region: drag;
  margin-bottom: 8px;
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
}
.el-card {
  border-radius: 15px;
  margin: 10px;
}
.el-input__wrapper {
  border-radius: 10px;
}
.el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.el-input-number__decrease {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-top: 5.5px;
}

.el-input-number__increase {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-top: 5.5px;
}

.el-button {
  border-radius: 10px;
}

.el-message {
  border-radius: 10px;
}
.el-overlay {
  -webkit-backdrop-filter: blur(6.18px);
  backdrop-filter: blur(6.18px);
}

.el-message-box {
  border-radius: 15px;
}

.el-dialog {
  border-radius: 15px;
}

.element-rotate {
  transition: transform 0.618s ease;
  transform: rotate(360deg);
}
.el-select__wrapper {
  border-radius: 10px;
}
.el-scrollbar__view {
  border-radius: 15px;
}
.el-popper.is-pure {
  border-radius: 15px;
}

.el-dropdown-menu__item {
  border-radius: 15px;
}

.el-popper__arrow {
  left: 80% !important;
}

@media (prefers-color-scheme: dark) {
  .header {
    background-color: #141414;
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
import { Icon } from "@iconify/vue";
import SettingPage from "./components/Settings.vue";
import AddKey from "./components/AddKey.vue";
import EditKey from "./components/EditKey.vue";
import Sign from "./components/Sign.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { internationalization } from "./utils/i18n.js";
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
  methods: {
    async RefreshKey() {
      this.keyLoading = true;
      document.querySelector(".refresh").classList.add("element-rotate");
      setTimeout(() => {
        document.querySelector(".refresh").classList.remove("element-rotate");
      }, 618);
      this.keyList = [];
      window.electronAPI.config.get("keys").then((data) => {
        if (data) {
          this.keyList = Object.keys(data);
          if (!this.keyList.includes(this.openSign)) {
            this.openSign = "";
          }
        } else {
          this.openSign = "";
        }
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
        }
      ).then(() => {
        window.electronAPI.config.get("keys").then((data) => {
          if (data && data[keyname]) {
            delete data[keyname];
            window.electronAPI.config.set("keys", data);
          }
          ElMessage({
            message: this.i18n.DeleteSuccess,
            type: "success",
            plain: true,
          });
          this.RefreshKey();
        });
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
  },
  async created() {
    const i18n = new internationalization();
    await i18n.init();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
    window.electronAPI.SystemPlatfrom().then(async (result) => {
      if (result == "darwin") {
        this.darwin.isDarwin = true;
        document.querySelector(".toolbar").style.marginLeft = "64px";
        setInterval(async () => {
          const isFullScreen = await window.electronAPI.WindowsIsFullScreen();
          if (isFullScreen) {
            document.querySelector(".toolbar").style.marginLeft = "0px";
          } else {
            document.querySelector(".toolbar").style.marginLeft = "64px";
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
    window.electronAPI.config.get("checkUpdate").then((data) => {
      if (data == null) {
        window.electronAPI.config.set("checkUpdate", true);
        window.electronAPI.AppCheckUpdate(false);
      } else if (data) {
        window.electronAPI.AppCheckUpdate(false);
      }
    });

    setInterval(async () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.querySelector("html").classList.add("dark");
      } else {
        document.querySelector("html").classList.remove("dark");
      }
    }, 100);
    this.RefreshKey().then(() => {
      window.electronAPI.config.get("lastUseKey").then((data) => {
        if (data && this.keyList.includes(data)) {
          this.openSign = data;
        } else {
          this.openSign = "";
        }
      });
    });

    setInterval(async () => {
      if (this.keyList.includes(this.openSign)) {
        window.electronAPI.config.set("lastUseKey", this.openSign);
      }
    }, 100);
  },
};
</script>
