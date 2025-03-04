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
          <el-button text style="height: 32px; width: 32px"
            ><el-icon><Minus /></el-icon>
          </el-button>
          <el-button text style="height: 32px; width: 32px" @click="RefreshKey"
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
            >
              <AddKey />
            </el-drawer>
          </div>
        </div>
        <br />
        <div
          class="keybutton"
          style="display: flex; flex-direction: column"
          v-for="item in keyList"
          :v-loading="keyLoading"
        >
          <el-button @click="" text bg style="width: 190px">
            <text style="text-align: left">{{ item }}</text>
          </el-button>
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
  justify-content: start;
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
</style>

<script setup>
import { Plus, Minus, Setting, Refresh } from "@element-plus/icons-vue";
import { Icon } from "@iconify/vue";
import SettingPage from "./components/Settings.vue";
import AddKey from "./components/AddKey.vue";
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
      keyLoading: true
    };
  },
  methods: {
    RefreshKey() {
      this.keyList = [];
      const MyList = localStorage;
      for (let i = 0; i < MyList.length; i++) {
        if (MyList.key(i).substring(0, 4) == "key-") {
          this.keyList.push(MyList.key(i).substring(4, MyList.key(i).length));
        }
      }
      this.keyLoading = false;
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
