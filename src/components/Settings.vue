<template>
  <h2 style="display: flex; justify-content: space-between">
    <text>设置</text>
    <div style="display: flex; flex-direction: row">
      <el-button text style="height: 32px; width: 32px" @click="open_devtools"
        ><Icon icon="fluent:window-dev-tools-20-regular" width="20" height="20"
      /></el-button>
      <el-button text style="height: 32px; width: 32px" @click="open_about"
        ><Icon icon="mdi:about-circle-outline" width="20" height="20"
      /></el-button>
    </div>
  </h2>
  <el-scrollbar style="max-height: calc(100vh - 120px)">
    <el-card style="display: flex; flex-direction: column">
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
        <el-button text bg type="primary" @click="save_filepath"
          >保存</el-button
        >
      </div>
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
        <div><text style="margin: 3px">高级选项</text></div>
        <div>
          <el-switch
            v-model="advancedSetting"
            @change="openAdvancedSetting"
            style="margin: 3px"
          />
        </div>
      </div>
    </el-card>
  </el-scrollbar>
</template>

<style>
.el-input {
  margin-top: 5px;
}
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Icon } from "@iconify/vue";
</script>

<script>
export default {
  data() {
    return {
      apksigner: "",
      zipalign: "",
      advancedSetting: false,
    };
  },
  methods: {
    open_devtools() {
      window.electronAPI.openDevtools();
    },
    open_about() {
      window.electronAPI.AppAbout();
    },
    open_apksinger() {
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
          message: "检查一下是不是漏了些什么？？",
          type: "error",
          plain: true,
        });
        return;
      } else {
        localStorage.setItem("apksigner", this.apksigner);
        localStorage.setItem("zipalign", this.zipalign);
        ElMessage({
          message: "保存成功",
          type: "success",
          plain: true,
        });
      }
    },
    openAdvancedSetting() {
      if (this.advancedSetting) {
        this.advancedSetting = false;
        ElMessageBox.confirm(
          "本安卓签名工具提供高级设置功能旨在为有经验的用户提供更多灵活性。但对于因使用高级设置而导致的任何直接、间接、偶然、特殊或相应的损害，包括但不限于设备损坏、数据丢失、应用程序无法正常使用等，我们不承担任何责任。在使用高级设置前，请您务必谨慎考虑，并充分了解相关操作可能带来的风险。若您不确定如何进行高级设置，建议您寻求专业技术支持或避免使用该功能。\n使用本工具即表示您已阅读、理解并接受上述风险提醒及免责声明。",
          "高级选项",
          {
            confirmButtonText: "打开高级选项",
            cancelButtonText: "取消",
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
  },
  mounted() {
    this.apksigner = localStorage.getItem("apksigner");
    this.zipalign = localStorage.getItem("zipalign");
    if (localStorage.getItem("advancedSetting") == 1) {
      this.advancedSetting = true;
    }
  },
};
</script>
