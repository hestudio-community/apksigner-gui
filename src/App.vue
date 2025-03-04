<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside">
        <div class="buttonbox">
          <el-button
            text
            style="height: 32px; width: 32px"
            @click="openaddkey = true"
            ><el-icon><Plus /></el-icon
          ></el-button>
          <el-button
            text
            style="height: 32px; width: 32px"
            @click="keyRemoveStatus = !keyRemoveStatus"
            ><el-icon><Minus /></el-icon>
          </el-button>
          <el-button
            text
            style="height: 32px; width: 32px"
            @click="RefreshKey"
            class="refresh"
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
          </div>
        </div>
        <br />
        <div v-loading="keyLoading">
          <div
            class="keybutton"
            style="display: flex; flex-direction: column"
            v-for="item in keyList"
          >
            <el-button
              @click=""
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
              <div>
                <transition name="rotate-fade">
                  <el-button
                    text
                    style="height: 32px; width: 32px"
                    v-show="keyRemoveStatus"
                    @click="RemoveKey(item)"
                    ><el-icon><RemoveFilled /></el-icon
                  ></el-button>
                </transition>
              </div>
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
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <text>标题</text>
          <div class="headerbutton">
            <div>
              <el-button
                text
                style="height: 32px; width: 32px"
                @click="opensetting = true"
              >
                <el-icon><Setting /></el-icon>
              </el-button>
            </div>
            <div v-show="!darwin.isDarwin">
              <el-button
                text
                style="height: 32px; width: 32px"
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
                style="height: 32px; width: 32px"
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
                style="height: 32px; width: 32px"
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
                style="height: 32px; width: 32px"
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
        <el-main style="background-color: #ffffff" class="main">Main</el-main>
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

.buttonbox {
  display: flex;
  flex-direction: row;
}

.keybutton {
  width: 100%;
  margin-bottom: 10px;
}

.header {
  justify-self: center;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f3f5;
  -webkit-app-region: drag;
}

.headerbutton {
  -webkit-app-region: no-drag;
  display: flex;
  flex-direction: row;
}

.main {
  border-radius: 15px;
  height: 100%;
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
}
.el-input__wrapper {
  border-radius: 10px;
}
.el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
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

.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: opacity 0.309s ease, transform 0.618s ease;
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg);
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}

.element-rotate {
  transition: transform 0.618s ease;
  transform: rotate(360deg);
}
</style>

<script setup>
import {
  Plus,
  Minus,
  Setting,
  Refresh,
  RemoveFilled,
} from "@element-plus/icons-vue";
import { Icon } from "@iconify/vue";
import SettingPage from "./components/Settings.vue";
import AddKey from "./components/AddKey.vue";
import { ElMessage, ElMessageBox } from "element-plus";
</script>

<script>
export default {
  data() {
    return {
      opensetting: false,
      openaddkey: false,
      windows: {
        isMaxmaximize: false,
      },
      darwin: {
        isDarwin: false,
      },
      keyList: [],
      keyLoading: true,
      keyRemoveStatus: false,
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
      const MyList = localStorage;
      for (let i = 0; i < MyList.length; i++) {
        if (MyList.key(i).substring(0, 4) == "key-") {
          await this.keyList.push(
            MyList.key(i).substring(4, MyList.key(i).length)
          );
        }
      }
      this.keyLoading = false;
    },
    RemoveKey(keyname) {
      ElMessageBox.confirm(`确定要删除密钥 "${keyname}" 吗？`, "删除密钥", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        localStorage.removeItem(`key-${keyname}`);
        ElMessage({
          message: "删除成功",
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
  },
  mounted() {
    window.electronAPI.SystemPlatfrom().then(async (result) => {
      if (result == "darwin") {
        this.darwin.isDarwin = true;
        document.querySelector(".buttonbox").style.marginTop = "16px";
      } else {
        setInterval(async () => {
          this.windows.isMaxmaximize =
            await window.electronAPI.WindowsIsMaximized();
        }, 100);
      }
    });
    this.RefreshKey();
  },
};
</script>
