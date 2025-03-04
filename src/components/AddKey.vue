<template>
  <h2>添加密钥</h2>
  <div>
    <text style="font-size: smaller"
      >目前仅支持 密钥库 (.jks)
      文件。对于公私钥分离的证书将在后续版本支持。</text
    >
  </div>
  <br />
  <el-card>
    <div>
      <div>
        <text>名称</text>
        <el-input v-model="name" placeholder="名称" />
      </div>
      <br />
      <div>
        <text>密钥库位置 (.jks)</text>
        <el-input v-model="keystone" placeholder="密钥库位置 (.jks)">
          <template #append>
            <el-button @click="open_keystone">
              <el-icon><FolderOpened /></el-icon
            ></el-button>
          </template>
        </el-input>
      </div>
      <br />
      <div>
        <text>证书别名</text>
        <el-input v-model="keyalias" placeholder="证书别名" />
      </div>
      <br />
      <div>
        <text>证书密码</text>
        <el-input
          v-model="keypasswd"
          placeholder="证书密码"
          type="password"
          show-password
        />
      </div>
    </div>
    <br />
    <div style="justify-self: end">
      <el-button text bg type="primary" @click="save">保存</el-button>
    </div>
  </el-card>
</template>

<style>
.el-input {
  margin-top: 5px;
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
      name: "",
      keystone: "",
      keyalias: "",
      keypasswd: "",
    };
  },
  methods: {
    open_keystone() {
      window.electronAPI.openFile().then((result) => {
        this.keystone = result;
      });
    },
    save() {
      if (!this.name || !this.keystone || !this.keyalias || !this.keypasswd) {
        ElMessage({
          message: "检查一下是不是漏了些什么？？",
          type: "error",
          plain: true,
        });
      } else {
        localStorage.setItem(
          `key-${this.name}`,
          JSON.stringify({
            type: 1,
            keystone: this.keystone,
            keyalias: this.keyalias,
            keypasswd: this.keypasswd,
          })
        );
        ElMessage({
          message: "保存成功",
          type: "success",
          plain: true,
        });
      }
    },
  },
};
</script>
