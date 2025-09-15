<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside" :style="{ width: actualSidebarWidth + 'px' }">
        <div class="resize-handle-left" @mousedown="startResize('left', $event)"></div>
        <div class="resize-handle-right" @mousedown="startResize('right', $event)"></div>
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
                  @click="openSign = item"
                  tag="div"
                  text
                  bg
                  class="keybutton"
                >
                  <span
                    :style="keyTextStyle"
                  >{{ item }}</span>
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
                <el-icon><Setting /></el-icon>
              </el-button>
            </div>
            <div v-if="!darwin.isDarwin" style="margin-left: 8px;">
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
            <SettingPage />
          </el-drawer>
        </el-header>
        <div class="main">
          <el-scrollbar style="max-height: calc(100vh - 46px)">
            <div style="padding: 20px">
              <el-empty v-if="!openSign" :description="i18n.noKeyTip" />
              <Sign v-else :keyname="openSign" />
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

.resize-handle-left,
.resize-handle-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  -webkit-app-region: no-drag;
  z-index: 10;
}

.resize-handle-left {
  left: 0;
}

.resize-handle-right {
  right: 0;
}

.resize-handle-left:hover,
.resize-handle-right:hover {
  background-color: rgba(64, 158, 255, 0.3);
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
      sidebarWidth: 30, // 相对百分比，0%=128px，100%=50%页面宽度
      isResizing: false,
      resizeDirection: null,
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
    // 将相对百分比转换为实际像素值
    actualSidebarWidth() {
      const minWidth = 128; // 最小宽度128px (对应0%)
      const maxWidth = Math.min(window.innerWidth * 0.5, window.innerWidth); // 最大宽度50%页面宽度 (对应100%)
      const range = maxWidth - minWidth;
      
      // 确保范围有效
      if (range <= 0) {
        return minWidth;
      }
      
      // 验证sidebarWidth在0-100范围内
      const validatedPercent = Math.max(0, Math.min(100, this.sidebarWidth));
      const calculatedWidth = minWidth + (validatedPercent / 100) * range;
      
      // 再次验证结果在合理范围内
      return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
    },
    
    keyTextStyle() {
      return {
        textAlign: 'left',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        flex: '1',
        minWidth: '0'
      };
    }
  },
  methods: {
    startResize(direction, event) {
      this.isResizing = true;
      this.resizeDirection = direction;
      this.startX = event.clientX;
      
      // 记录当前的窗口宽度和范围，防止窗口大小改变后的瞬移
      const minWidth = 128;
      const maxWidth = Math.min(window.innerWidth * 0.5, window.innerWidth);
      this.resizeRange = Math.max(0, maxWidth - minWidth);
      this.resizeMinWidth = minWidth;
      
      // 计算当前实际像素宽度对应的百分比
      const currentActualWidth = this.actualSidebarWidth;
      if (this.resizeRange > 0) {
        this.startWidthPercent = ((currentActualWidth - minWidth) / this.resizeRange) * 100;
      } else {
        this.startWidthPercent = 0;
      }
      
      document.addEventListener('mousemove', this.doResize);
      document.addEventListener('mouseup', this.stopResize);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    
    doResize(event) {
      if (!this.isResizing) return;
      
      const deltaX = event.clientX - this.startX;
      
      // 使用在startResize时记录的固定范围
      const deltaPercent = (deltaX / this.resizeRange) * 100;
      let newWidthPercent;
      
      if (this.resizeDirection === 'right') {
        newWidthPercent = this.startWidthPercent + deltaPercent;
      } else {
        newWidthPercent = this.startWidthPercent - deltaPercent;
      }
      
      // 限制相对百分比范围：0% 到 100%
      newWidthPercent = Math.max(0, Math.min(100, newWidthPercent));
      
      // 计算对应的实际像素宽度
      const newActualWidth = this.resizeMinWidth + (newWidthPercent / 100) * this.resizeRange;
      
      // 重新计算在当前窗口尺寸下的百分比
      const currentMinWidth = 128;
      const currentMaxWidth = Math.min(window.innerWidth * 0.5, window.innerWidth);
      const currentRange = currentMaxWidth - currentMinWidth;
      
      // 确保实际宽度在当前窗口的合理范围内
      const clampedActualWidth = Math.max(currentMinWidth, Math.min(currentMaxWidth, newActualWidth));
      
      // 更新sidebarWidth为在当前窗口尺寸下的百分比
      if (currentRange > 0) {
        this.sidebarWidth = ((clampedActualWidth - currentMinWidth) / currentRange) * 100;
      } else {
        this.sidebarWidth = 0;
      }
      
      // 延迟更新文字宽度，确保DOM已更新
      this.$nextTick(() => {
        this.updateKeyTextWidth();
      });
    },
    
    updateKeyTextWidth() {
      // 由于使用了百分比布局，文字宽度会自动跟随侧边栏调整
      // 这个方法现在主要用于强制重新渲染，确保样式同步
      this.$forceUpdate();
    },
    
    stopResize() {
      this.isResizing = false;
      this.resizeDirection = null;
      
      document.removeEventListener('mousemove', this.doResize);
      document.removeEventListener('mouseup', this.stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // 保存侧边栏宽度到配置
      window.electronAPI.config.set("sidebarWidth", this.sidebarWidth);
    },
    
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
        // 更新密钥文字容器宽度
        this.$nextTick(() => {
          this.updateKeyTextWidth();
        });
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
    window.electronAPI.SystemPlatform().then(async (result) => {
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
    // 读取保存的侧边栏宽度
    window.electronAPI.config.get("sidebarWidth").then((savedWidth) => {
      const defaultSidebarWidth = 30;
      
      if (savedWidth !== null && savedWidth !== undefined) {
        // 验证侧边栏宽度范围 (0-100%)，超出范围则恢复默认值
        if (savedWidth < 0 || savedWidth > 100 || isNaN(savedWidth)) {
          console.warn(`Sidebar width ${savedWidth} is out of range (0-100), restoring default value ${defaultSidebarWidth}`);
          this.sidebarWidth = defaultSidebarWidth;
          window.electronAPI.config.set("sidebarWidth", defaultSidebarWidth);
        } else {
          this.sidebarWidth = savedWidth;
        }
      } else {
        // 使用默认值并保存
        this.sidebarWidth = defaultSidebarWidth;
        window.electronAPI.config.set("sidebarWidth", defaultSidebarWidth);
      }
    });

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
      window.electronAPI.config.get("lastUseKey").then((data) => {
        if (data && this.keyList.includes(data)) {
          this.openSign = data;
        } else {
          this.openSign = "";
        }
        // 初始化时也需要更新文字宽度
        this.$nextTick(() => {
          this.updateKeyTextWidth();
        });
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
