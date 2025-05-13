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
        <el-button text bg type="info" @click="createKey">
          {{ i18n.createKey }}
        </el-button>

        <el-button text bg type="primary" @click="save">
          {{ i18n.save }}
        </el-button>
      </div>
    </el-card>

    <el-dialog
      v-model="showCreateKeyDialog"
      :title="i18n.createKey"
      width="400px"
      :modal="true"
      :draggable="false"
      :close-on-click-modal="false"
      :custom-class="'el-dialog--round'"
    >
      <el-form label-position="top">
        <el-form-item :label="i18n.javaLocation">
          <el-input
            v-model="javaLocation"
            :placeholder="i18n.javaLocation"
            readonly
          >
            <template #append>
              <el-button @click="open_keystore(true)">
                <el-icon><FolderOpened /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="i18n.AliasPassword">
          <el-input
            v-model="AliasPassword"
            :placeholder="i18n.AliasPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item :label="i18n.keyAlias">
          <el-input v-model="keyalias" :placeholder="i18n.keyAlias" />
        </el-form-item>
        <el-form-item :label="i18n.keyPasswd">
          <el-input
            v-model="keypasswd"
            :placeholder="i18n.keyPasswd"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateKeyDialog = false">{{
          i18n.cancel || "取消"
        }}</el-button>
        <el-button type="primary" @click="showCreateKeyDialog = false">{{
          i18n.save
        }}</el-button>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>

<style>
.el-input {
  margin-top: 5px;
}
.el-dialog {
  border-radius: 16px !important;
  overflow: hidden;
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
      AliasPassword: "",
      showCreateKeyDialog: false, // 控制弹窗显示
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
        createKey: undefined,
        AliasPassword: undefined, // 别名密码
        javaLocation: undefined, // Java路径
      },
    };
  },
  methods: {
    open_keystore(javaOnly = false) {
      let filters;
      if (javaOnly) {
        filters = [
          {
            name: "Java",
            extensions: ["exe", "bin", "java", "jar"],
          },
        ];
      } else {
        filters = [
          {
            name: this.i18n.keyStore,
            extensions: ["jks"],
          },
          {
            name: this.i18n.AllFiles,
            extensions: ["*"],
          },
        ];
      }
      window.electronAPI.openFile(filters).then((result) => {
        if (javaOnly) {
          this.javaLocation = result;
        } else {
          this.keystore = result;
        }
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
    // 创建密钥预留接口
    createKey() {
      this.showCreateKeyDialog = true;
    },
  },
  created() {
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = geti18n(key);
    }
  },
};
</script>
