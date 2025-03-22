<template>
  <h2>{{ i18n.AddKey }}</h2>
  <el-scrollbar style="max-height: calc(100vh - 120px)">
    <div>
      <text style="font-size: smaller">{{ i18n.AddKeyTips }}</text>
    </div>
    <el-card>
      <div>
        <div>
          <text>{{ i18n.name }}</text>
          <el-input v-model="name" :placeholder="i18n.name" />
        </div>
        <br />
        <div>
          <text>{{ i18n.jksLocation }}</text>
          <el-input v-model="keystore" :placeholder="i18n.jksLocation">
            <template #append>
              <el-button @click="open_keystore">
                <el-icon><FolderOpened /></el-icon
              ></el-button>
            </template>
          </el-input>
        </div>
        <br />
        <div>
          <text>{{ i18n.keyAlias }}</text>
          <el-input v-model="keyalias" :placeholder="i18n.keyAlias" />
        </div>
        <br />
        <div>
          <text>{{ i18n.keyPasswd }}</text>
          <el-input
            v-model="keypasswd"
            :placeholder="i18n.keyPasswd"
            type="password"
            show-password
          />
        </div>
      </div>
      <br />
      <div style="justify-self: end">
        <el-button text bg type="primary" @click="save">{{
          i18n.save
        }}</el-button>
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
import { geti18n } from "../utils/i18n.js";
</script>

<script>
export default {
  data() {
    return {
      name: "",
      keystore: "",
      keyalias: "",
      keypasswd: "",
      i18n: {
        AddKey: undefined,
        AddKeyTips: undefined,
        name: undefined,
        jksLocation: undefined,
        keyAlias: undefined,
        keyPasswd: undefined,
        save: undefined,
        saveSuccess: undefined,
        keyStore: undefined,
        AllFiles: undefined,
        CheckDeficiencies: undefined,
        HadSameKeyName: undefined,
      },
    };
  },
  methods: {
    open_keystore() {
      window.electronAPI
        .openFile([
          {
            name: this.i18n.keyStore,
            extensions: ["jks"],
          },
          {
            name: this.i18n.AllFiles,
            extensions: ["*"],
          },
        ])
        .then((result) => {
          this.keystore = result;
        });
    },
    save() {
      if (!this.name || !this.keystore || !this.keyalias || !this.keypasswd) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
      } else {
        if (localStorage.getItem(`key-${this.name}`)) {
          ElMessage({
            message: this.i18n.HadSameKeyName,
            type: "error",
            plain: true,
          });
          return;
        } else {
          localStorage.setItem(
            `key-${this.name}`,
            JSON.stringify({
              type: 1,
              keystore: this.keystore,
              keyalias: this.keyalias,
              keypasswd: this.keypasswd,
            })
          );
          ElMessage({
            message: this.i18n.saveSuccess,
            type: "success",
            plain: true,
          });
        }
      }
    },
  },
  created() {
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = geti18n(key);
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = geti18n(key);
    }
  },
};
</script>
