<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside">
        <div class="buttonbox">
          <el-button
            text
            style="height: 32px; width: 32px"
            @click="openaddkey = true"
            ><el-icon class="icon"><Plus /></el-icon
          ></el-button>
          <el-button text style="height: 32px; width: 32px"
            ><el-icon class="icon"><Minus /></el-icon>
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
      </el-aside>
      <el-container>
        <el-header class="header">
          <text>标题</text>
          <div class="headerbutton">
            <el-button
              text
              style="height: 32px; width: 32px"
              @click="opensetting = true"
            >
              <el-icon><Setting /></el-icon>
            </el-button>
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
                ><Icon icon="qlementine-icons:close-16" width="16" height="16"
              /></el-icon>
            </el-button>
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
body {
  background-color: #f2f3f5;
  color: #303133;
}

.aside {
  width: 100%;
  max-width: 200px;
  min-width: 50px;
  height: calc(100vh - 20px);
  .buttonbox {
    display: flex;
    flex-direction: row;
    .icon {
      margin: 5px;
    }
  }
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
}

.main {
  border-radius: 15px;
  margin-right: 3px;
}

.settings {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.addkey {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.el-overlay {
  backdrop-filter: blur(6.18px);
}
</style>

<script setup>
import { Plus, Minus, Setting } from "@element-plus/icons-vue";
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
    };
  },
  methods: {
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
    setInterval(async () => {
      this.windows.isMaxmaximize =
        await window.electronAPI.WindowsIsMaximized();
    }, 100);
  },
};
</script>
