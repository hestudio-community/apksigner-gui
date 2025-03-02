<template>
  <div style="max-height: calc(100vh)">
    <el-container>
      <el-aside class="aside">
        <div class="buttonbox">
          <el-button text style="height: 32px; width: 32px"
            ><el-icon class="icon" @click="openaddkey = true"><Plus /></el-icon
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
          <div>
            <div>
              <el-button text style="height: 32px; width: 32px" @click="opensetting = true">
                <el-icon ><Setting /></el-icon>
              </el-button>

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
            </div>
          </div>
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
import SettingPage from "./components/Settings.vue";
import AddKey from "./components/AddKey.vue";
</script>

<script>
export default {
  data() {
    return {
      opensetting: false,
      openaddkey: false,
    };
  },
};
</script>
