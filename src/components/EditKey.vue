<template>
  <h2>{{ i18n.editKey }}</h2>
  <el-scrollbar style="max-height: calc(100vh - 120px)">
    <el-card>
      <div>
        <div>
          <text>{{ i18n.name }}</text>
          <el-input v-model="name" :placeholder="i18n.name" />
        </div>
        <br />
        <div>
          <text>{{ i18n.name }}</text>
          <el-input v-model="keystore" :placeholder="i18n.jksLocation">
            <template #append>
              <el-button @click="open_keystore">
                <el-icon> <FolderOpened /> </el-icon
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
import { internationalization } from "../utils/i18nServices/client.js";
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
        editKey: undefined,
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
        fileNotExists: undefined,
        atLeast6Chars: undefined,
      },
    };
  },
  props: {
    keyname: {
      type: String,
      required: true,
    },
  },
  methods: {
    open_keystore() {
      window.electronAPI
        .openFile([
          {
            name: this.i18n.keyStore,
            extensions: ["jks", "keystore"],
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
          message: this.i18n.HadSameKeyName,
          type: "error",
          plain: true,
        });
      } else {
        if (this.keypasswd.length < 6) {
          ElMessage({
            message: this.i18n.atLeast6Chars,
            type: "error",
            plain: true,
          });
          return;
        }
        window.electronAPI.checkFileExists(this.keystore).then((exists) => {
          if (!exists) {
            ElMessage({
              message: this.i18n.fileNotExists(this.keystore),
              type: "error",
              plain: true,
            });
            return;
          }
          const keyList = window.electronAPI.config.get("keys");
          if (this.name != this.keyname) {
            delete keyList[this.keyname];
          }
          keyList[this.name] = {
            type: 1,
            keystore: this.keystore,
            keyalias: this.keyalias,
            keypasswd: this.keypasswd,
          };
          window.electronAPI.config.set("keys", keyList);
          ElMessage({
            message: this.i18n.saveSuccess,
            type: "success",
            plain: true,
          });
        });
      }
    },
  },
  async created() {
    const i18n = new internationalization();
    await i18n.init();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
  },
  mounted() {
    const keyInfo = window.electronAPI.config.get("keys")[this.keyname];
    this.name = this.keyname;
    this.keystore = keyInfo.keystore;
    this.keyalias = keyInfo.keyalias;
    this.keypasswd = keyInfo.keypasswd;
  },
};
</script>
