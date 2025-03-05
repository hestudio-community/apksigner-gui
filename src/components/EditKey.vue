<template>
  <h2>修改密钥</h2>
  <el-scrollbar style="max-height: calc(100vh - 120px)">
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
  </el-scrollbar>
</template>

<style>
.el-input {
  margin-top: 5px;
}
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
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
  props: {
    keyname: {
      type: String,
      required: true,
    },
  },
  methods: {
    open_keystone() {
      window.electronAPI
        .openFile([
          {
            name: "密钥库",
            extensions: ["jks"],
          },
          {
            name: "所有文件",
            extensions: ["*"],
          },
        ])
        .then((result) => {
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
        if (this.name != this.keyname) {
          localStorage.removeItem(`key-${this.keyname}`);
        }
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
  mounted() {
    const key = JSON.parse(localStorage.getItem(`key-${this.keyname}`));
    this.name = this.keyname;
    this.keystone = key.keystone;
    this.keyalias = key.keyalias;
    this.keypasswd = key.keypasswd;
  },
};
</script>
