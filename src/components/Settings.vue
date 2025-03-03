<template>
  <h2 style="display: flex; justify-content: space-between">
    <text>设置</text>
    <div >
      <el-button
        text
        style="height: 32px; width: 32px"
        @click="open_devtools"
        ><Icon icon="fluent:window-dev-tools-20-regular" width="20" height="20"
      /></el-button>
    </div>
  </h2>

  <el-card>
    <div>
      <text>apksigner 位置</text>
      <el-input v-model="apksigner" placeholder="apksigner">
        <template #append>
          <el-button @click="open_apksinger">
            <el-icon><FolderOpened /></el-icon
          ></el-button>
        </template>
      </el-input>
    </div>
    <br />
    <div>
      <text>zipalign 位置</text>
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
      <el-button text bg type="primary" @click="save_filepath">保存</el-button>
    </div>
  </el-card>
</template>

<style>
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
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { Icon } from "@iconify/vue";
</script>

<script>
export default {
  data() {
    return {
      apksigner: "",
      zipalign: "",
    };
  },
  methods: {
    open_devtools() {
      window.electronAPI.openDevtools();
    },
    open_apksinger() {
      window.electronAPI.openFile().then((result) => {
        this.apksigner = result;
      });
    },
    open_zipalign() {
      window.electronAPI.openFile().then((result) => {
        this.zipalign = result;
      });
    },
    save_filepath() {
      localStorage.setItem("apksigner", this.apksigner);
      localStorage.setItem("zipalign", this.zipalign);
      ElMessage.success("保存成功");
    },
  },
  mounted() {
    this.apksigner = localStorage.getItem("apksigner");
    this.zipalign = localStorage.getItem("zipalign");
  },
};
</script>
