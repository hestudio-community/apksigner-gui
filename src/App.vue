<template>
  <div style="max-height: calc(100vh - 20px)">
    <el-container>
      <el-aside class="aside">
        <div class="buttonbox">
          <el-icon class="icon"><Plus /></el-icon>
          <el-icon class="icon"><Minus /></el-icon>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <text>标题</text>
          <div>
            <div>
              <el-icon @click="opensetting = true"><Setting /></el-icon>
              <el-drawer
                v-model="opensetting"
                title="设置"
                class="settings"
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
}

.settings {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
</style>

<script setup>
import { Plus, Minus, Setting } from "@element-plus/icons-vue";
import SettingPage from "./components/Settings.vue"
</script>

<script>
export default {
  data() {
    return {
      opensetting: false
    }
  }
}
</script>