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
        <el-button text bg type="info" @click="create.open = true">{{
          i18n.createKey
        }}</el-button>
        <el-button text bg type="primary" @click="save">{{
          i18n.save
        }}</el-button>
      </div>
    </el-card>
  </el-scrollbar>
  <div>
    <el-dialog :title="i18n.createKey" v-model="create.open">
      <el-scrollbar style="height: calc(50vh)">
        <div>
          <div>
            <text>{{ i18n.saveKeyTo }}</text>
            <el-input
              v-model="create.saveLocation"
              :placeholder="i18n.jksLocation"
            >
              <template #append>
                <el-button @click="save_keystone">
                  <el-icon><FolderOpened /></el-icon
                ></el-button>
              </template>
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.keyAlias }}</text>
            <el-input v-model="create.keyalias" :placeholder="i18n.keyAlias">
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.keyPasswd }}</text>
            <el-input
              v-model="create.keypasswd"
              :placeholder="i18n.keyPasswd"
              type="password"
              show-password
            >
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.keyPasswdAgain }}</text>
            <el-input
              v-model="create.keypasswd2"
              :placeholder="i18n.keyPasswdAgain"
              type="password"
              show-password
            >
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.aliasPasswd }}</text>
            <el-input
              v-model="create.aliaspasswd"
              :placeholder="i18n.aliasPasswd"
              type="password"
              show-password
            >
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.aliasPasswdAgain }}</text>
            <el-input
              v-model="create.aliaspasswd2"
              :placeholder="i18n.aliasPasswdAgain"
              type="password"
              show-password
            >
            </el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.expireDay }}</text>
            <br />
            <el-input-number
              v-model="create.year"
              :min="1"
              :precision="0"
            ></el-input-number>
          </div>
        </div>
        <div v-show="create.advancedSetting">
          <br />
          <div>
            <text>{{ i18n.name }}</text>
            <el-input
              v-model="create.advanceOptions.name"
              :placeholder="i18n.name"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.org }}</text>
            <el-input
              v-model="create.advanceOptions.org"
              :placeholder="i18n.org"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.orgUnit }}</text>
            <el-input
              v-model="create.advanceOptions.orgUnit"
              :placeholder="i18n.orgUnit"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.locality }}</text>
            <el-input
              v-model="create.advanceOptions.locality"
              :placeholder="i18n.locality"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.state }}</text>
            <el-input
              v-model="create.advanceOptions.state"
              :placeholder="i18n.state"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.country }}</text>
            <el-input
              v-model="create.advanceOptions.country"
              :placeholder="i18n.country"
            ></el-input>
          </div>
          <br />
          <div>
            <text>{{ i18n.keyalg }}</text>
            <el-select
              v-model="create.advanceOptions.keyalg"
              :placeholder="i18n.keyalg"
            >
              <el-option label="RSA" value="RSA"></el-option>
              <el-option label="DSA" value="DSA"></el-option>
              <el-option label="EC" value="EC"></el-option>
            </el-select>
          </div>
          <br />
          <div>
            <text>{{ i18n.keysize }}</text>
            <br />
            <el-input-number
              v-model="create.advanceOptions.keysize"
              :min="1024"
              :max="8192"
              :step="256"
              :precision="0"
            ></el-input-number>
          </div>
          <br />
          <div>
            <text>{{ i18n.sigalg }}</text>
            <el-select
              v-model="create.advanceOptions.sigalg"
              :placeholder="i18n.sigalg"
            >
              <el-option
                label="SHA256withRSA"
                value="SHA256withRSA"
              ></el-option>
              <el-option
                label="SHA384withRSA"
                value="SHA384withRSA"
              ></el-option>
              <el-option
                label="SHA512withRSA"
                value="SHA512withRSA"
              ></el-option>
              <el-option label="SHA1withDSA" value="SHA1withDSA"></el-option>
            </el-select>
          </div>
        </div>
        <br />
        <div style="justify-self: end">
          <el-button text bg type="primary" @click="createKey">{{
            i18n.create
          }}</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style>
.el-input {
  margin-top: 5px;
}
</style>

<script setup>
import { FolderOpened } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { internationalization } from "../utils/i18n.js";
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
        createKey: undefined,
        saveKeyTo: undefined,
        keyPasswdAgain: undefined,
        aliasPasswd: undefined,
        aliasPasswdAgain: undefined,
        expireDay: undefined,
        name: undefined,
        org: undefined,
        orgUnit: undefined,
        locality: undefined,
        state: undefined,
        country: undefined,
        create: undefined,
        NoSamePasswd: undefined,
        JavaHomeNotFound: undefined,
        keyalg: undefined,
        keysize: undefined,
        sigalg: undefined,
        fileNotExists: undefined,
      },
      create: {
        open: false,
        saveLocation: "",
        keyalias: "",
        keypasswd: "",
        keypasswd2: "",
        aliaspasswd: "",
        aliaspasswd2: "",
        advancedSetting: false,
        year: 100,
        advanceOptions: {
          name: "",
          org: "",
          orgUnit: "",
          locality: "",
          state: "",
          country: "",
          keyalg: "RSA",
          keysize: 2048,
          sigalg: "SHA256withRSA",
        },
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
    save_keystone() {
      window.electronAPI
        .saveFile([
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
          this.create.saveLocation = result;
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
        window.electronAPI.checkFileExists(this.keystore).then((exists) => {
          if (!exists) {
            ElMessage({
              message: this.i18n.fileNotExists(this.keystore),
              type: "error",
              plain: true,
            });
            return;
          }
          let keyList;
          window.electronAPI.config.get("keys").then((res) => {
            if (res) {
              keyList = res;
            } else {
              keyList = {};
            }

            if (Object.keys(keyList).includes(this.name)) {
              ElMessage({
                message: this.i18n.HadSameKeyName,
                type: "error",
                plain: true,
              });
              return;
            } else {
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
            }
          });
        });
      }
    },
    createKey() {
      if (
        !this.create.keyalias ||
        !this.create.keypasswd ||
        !this.create.keypasswd2 ||
        !this.create.aliaspasswd ||
        !this.create.aliaspasswd2
      ) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
      } else {
        if (this.create.keypasswd != this.create.keypasswd2) {
          ElMessage({
            message: this.i18n.NoSamePasswd,
            type: "error",
            plain: true,
          });
          return;
        }
        if (this.create.aliaspasswd != this.create.aliaspasswd2) {
          ElMessage({
            message: this.i18n.NoSamePasswd,
            type: "error",
            plain: true,
          });
          return;
        } else {
          window.electronAPI.CheckJavaHome().then((result) => {
            if (result) {
              window.electronAPI
                .CreateKey(
                  this.create.saveLocation,
                  this.create.keypasswd,
                  this.create.keyalias,
                  this.create.aliaspasswd,
                  Number(this.create.year * 365),
                  this.create.advanceOptions.name,
                  this.create.advanceOptions.org,
                  this.create.advanceOptions.orgUnit,
                  this.create.advanceOptions.locality,
                  this.create.advanceOptions.state,
                  this.create.advanceOptions.country,
                  this.create.advanceOptions.keyalg,
                  this.create.advanceOptions.keysize,
                  this.create.advanceOptions.sigalg
                )
                .then((res) => {
                  if (res) {
                    ElMessage({
                      message: this.i18n.saveSuccess,
                      type: "success",
                      plain: true,
                    });
                    this.create.open = false;
                  }
                })
                .catch((err) => {
                  ElMessage({
                    message: err,
                    type: "error",
                    plain: true,
                  });
                });
            } else {
              ElMessage({
                message: this.i18n.JavaHomeNotFound,
                type: "error",
                plain: true,
              });
            }
          });
        }
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
    window.electronAPI.config.get("advancedSetting").then((res) => {
      if (res) {
        this.create.advancedSetting = res;
      }
    });
  },
};
</script>
