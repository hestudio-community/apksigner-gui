<template>
  <h2>{{ this.i18n.EditKey }}</h2>
  <el-scrollbar style="max-height: calc(100vh - 120px)">
    <el-card>
      <div>
        <div>
          <text>{{ this.i18n.name }}</text>
          <el-input v-model="name" :placeholder="this.i18n.name" />
        </div>
        <br />
        <div>
          <text>{{ this.i18n.name }}</text>
          <el-input v-model="keystone" :placeholder="this.i18n.jksLocation">
            <template #append>
              <el-button @click="open_keystone">
                <el-icon><FolderOpened /></el-icon
              ></el-button>
            </template>
          </el-input>
        </div>
        <br />
        <div>
          <text>{{ this.i18n.keyAlias }}</text>
          <el-input v-model="keyalias" :placeholder="this.i18n.keyAlias" />
        </div>
        <br />
        <div>
          <text>{{ this.i18n.keyPasswd }}</text>
          <el-input
            v-model="keypasswd"
            :placeholder="this.i18n.keyPasswd"
            type="password"
            show-password
          />
        </div>
      </div>
      <br />
      <div style="justify-self: end">
        <el-button text bg type="primary" @click="save">{{
          this.i18n.save
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
import { i18n } from "./../utils/i18n.js";
</script>

<script>
export default {
  data() {
    return {
      name: "",
      keystone: "",
      keyalias: "",
      keypasswd: "",
      i18n: {
        EditKey: undefined,
        AddKeyTips: undefined,
        name: undefined,
        jksLocation: undefined,
        keyAlias: undefined,
        keyPasswd: undefined,
        save: undefined,
        saveSuccess: undefined,
        keyStone: undefined,
        AllFiles: undefined,
        CheckDeficiencies: undefined,
        HadSameKeyName: undefined,
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
    open_keystone() {
      window.electronAPI
        .openFile([
          {
            name: this.i18n.keyStone,
            extensions: ["jks"],
          },
          {
            name: this.i18n.AllFiles,
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
          message: this.i18n.HadSameKeyName,
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
          message: this.i18n.saveSuccess,
          type: "success",
          plain: true,
        });
      }
    },
  },
  created() {
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      eval(
        `this.i18n.${Object.keys(this.i18n)[i]} = i18n("${
          Object.keys(this.i18n)[i]
        }")`
      );
    }
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
