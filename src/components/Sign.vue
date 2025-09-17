<template>
  <el-card>
    <div>
      <text>{{ i18n.apkLocation }}</text>
    </div>
    <br />
    <div>
      <el-input v-model="input_apk" clearable :placeholder="i18n.apkLocation">
        <template #append>
          <el-button @click="open_input_apk">
            <el-icon><FolderOpened /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
  </el-card>
  <div v-if="advancedSetting">
    <el-card>
      <div>
        <text>{{ i18n.minAndroidApi }}</text>
      </div>
      <br />
      <div style="display: flex; flex-direction: row; align-items: center">
        <el-checkbox
          v-model="api.auto.min"
          :label="i18n.autoDecideMinSDK"
          style="margin: 3px"
        />
        <el-tooltip placement="right">
          <template #content>
            <div style="width: calc(30vw); max-width: fit-content">
              <text>{{ i18n.minSDKTooltip }}</text>
            </div>
          </template>
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
        <el-input
          v-model="api.min"
          v-if="!api.auto.min"
          type="number"
          placeholder="Min SDK"
          style="margin: 3px"
        />
      </div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <el-checkbox
          v-model="api.auto.max"
          :label="i18n.autoDecideMaxSDK"
          style="margin: 3px"
        />
        <el-tooltip placement="right">
          <template #content>
            <div style="width: calc(30vw); max-width: fit-content">
              <text>{{ i18n.maxSDKTooltip }}</text>
            </div>
          </template>
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
        <el-input
          v-model="api.max"
          v-if="!api.auto.max"
          type="number"
          placeholder="Max SDK"
          style="margin: 3px"
        />
      </div>
    </el-card>
    <el-card>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <text>{{ i18n.signingScheme }}</text>
        <el-tooltip placement="right">
          <template #content>
            <div style="width: calc(30vw); max-width: fit-content">
              <text>{{ i18n.signingSchemeTooltip }}</text>
            </div>
          </template>
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <br />
      <div>
        <el-checkbox
          v-model="signplan.auto"
          :label="i18n.autoDecideScheme"
          style="margin: 3px"
        />
        <div v-if="!signplan.auto" style="margin-top: 10px">
          <text>{{ i18n.selectScheme }}</text>
          <el-checkbox-group v-model="signplan.plans">
            <el-checkbox label="V1" value="V1" />
            <el-checkbox label="V2" value="V2" />
            <el-checkbox label="V3" value="V3" />
            <el-checkbox label="V4" value="V4" />
          </el-checkbox-group>
        </div>
      </div>
    </el-card>
    <el-card>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <text>{{ i18n.zipalignTitle }}</text>
        <el-tooltip placement="right">
          <template #content>
            <div style="width: calc(30vw); max-width: fit-content">
              <text>{{ i18n.zipalignTooltip }}</text>
            </div>
          </template>
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <br />
      <div>
        <el-checkbox
          v-model="zipalign.status"
          :label="i18n.useZipalign"
          style="margin: 3px"
        />
      </div>
      <br v-if="zipalign.status" />
      <div v-if="zipalign.status">
        <div style="align-items: center">
          <text style="margin: 3px">{{ i18n.pageSize }}</text>
          <el-select
            v-model="zipalign.config.P"
            :placeholder="i18n.pageSize"
            style="width: 240px"
          >
            <el-option
              v-for="item in zipalign.options.P"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <br />
        <div>
          <el-checkbox
            v-model="zipalign.config.Zopfli"
            :label="i18n.useZopfliRecompress"
            style="margin: 3px"
          />
        </div>
      </div>
    </el-card>
  </div>
  <el-card v-if="!output.rewrite">
    <div>
      <text>{{ i18n.exportApkTo }}</text>
    </div>
    <br />
    <div>
      <el-input
        v-model="output.path"
        clearable
        :placeholder="i18n.exportApkTo"
        disabled
      >
        <template #append>
          <el-button @click="save_apk">
            <el-icon><FolderOpened /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
  </el-card>
  <el-card>
    <div
      style="
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        width: 100%;
      "
    >
      <div>
        <el-checkbox v-model="output.rewrite" :label="i18n.overwriteOriginal" />
        <el-checkbox v-model="output.showSignLog" :label="i18n.showLog" />
      </div>
      <div>
        <el-button text bg type="primary" :loading="sign" @click="signButton">
          {{ i18n.sign }}
        </el-button>
      </div>
    </div>
    <br v-if="output.showSignLog" />
    <div v-if="output.showSignLog">
      <text>{{ stdout }}</text>
    </div>
  </el-card>
</template>

<style></style>

<script setup>
import { FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { internationalization } from "../utils/i18nServices/client.js";
</script>

<script>
export default {
  props: {
    keyname: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input_apk: "",
      advancedSetting: false,
      api: {
        auto: {
          min: true,
          max: true,
        },
        min: 1,
        max: 1,
      },
      signplan: {
        auto: true,
        plans: [],
      },
      zipalign: {
        status: false,
        config: {
          P: 16,
          Zopfli: false,
        },
        options: {
          P: [
            {
              value: 4,
              label: "4KiB",
            },
            {
              value: 16,
              label: "16KiB",
            },
            {
              value: 64,
              label: "64KiB",
            },
          ],
        },
      },
      output: {
        rewrite: true,
        path: "",
        showSignLog: false,
      },
      sign: false,
      stdout: "",
      i18n: {
        apkLocation: undefined,
        minAndroidApi: undefined,
        autoDecideMinSDK: undefined,
        minSDKTooltip: undefined,
        autoDecideMaxSDK: undefined,
        maxSDKTooltip: undefined,
        signingScheme: undefined,
        signingSchemeTooltip: undefined,
        autoDecideScheme: undefined,
        selectScheme: undefined,
        zipalignTitle: undefined,
        zipalignTooltip: undefined,
        useZipalign: undefined,
        pageSize: undefined,
        useZopfliRecompress: undefined,
        exportApkTo: undefined,
        overwriteOriginal: undefined,
        showLog: undefined,
        sign: undefined,
        CheckDeficiencies: undefined,
        signSuccess: undefined,
        signFailed: undefined,
        noApksignerLocation: undefined,
        noZipalignLocation: undefined,
        fileNotExists: undefined,
      },
    };
  },
  methods: {
    open_input_apk() {
      window.electronAPI
        .openFile([
          {
            name: "APK",
            extensions: ["apk"],
          },
        ])
        .then((result) => {
          this.input_apk = result;
        });
    },
    save_apk() {
      window.electronAPI
        .saveFile([
          {
            name: "APK",
            extensions: ["apk"],
          },
        ])
        .then((result) => {
          this.output.path = result;
        });
    },
    shell(shell) {
      window.electronAPI
        .SystemShell(shell)
        .then(async (result) => {
          this.stdout += result;
          this.sign = false;
          ElMessage({
            message: this.i18n.signSuccess,
            type: "success",
            plain: true,
          });
        })
        .catch((error) => {
          this.stdout += error;
          this.sign = false;
          ElMessage({
            message: this.i18n.signFailed,
            type: "error",
            plain: true,
          });
        });
    },
    signButton() {
      this.sign = true;
      this.stdout = "";
      if (!this.input_apk) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
        this.sign = false;
        return;
      } else {
        window.electronAPI.checkFileExists(this.input_apk).then((exists) => {
          if (!exists) {
            ElMessage({
              message: this.i18n.fileNotExists(this.input_apk),
              type: "error",
              plain: true,
            });
            this.sign = false;
            return;
          }
          window.electronAPI.CopyToTmp(this.input_apk).then(async (result) => {
            const key = window.electronAPI.config.get("keys")[this.keyname];
            const apksigner = window.electronAPI.config.get("apksigner");
            if (!apksigner) {
              ElMessage({
                message: this.i18n.noApksignerLocation,
                type: "error",
                plain: true,
              });
              this.sign = false;
              return;
            }
            let script = `${apksigner} sign -v --ks ${key.keystore} --ks-key-alias ${key.keyalias} --ks-pass pass:${key.keypasswd}`;
            if (!this.output.rewrite) {
              if (!this.output.path) {
                ElMessage({
                  message: this.i18n.CheckDeficiencies,
                  type: "error",
                  plain: true,
                });
                this.sign = false;
                return;
              } else {
                script += ` --out ${this.output.path}`;
              }
            } else {
              script += ` --out ${this.input_apk}`;
            }
            if (this.advancedSetting) {
              if (!this.api.auto.min) {
                script += ` --min-sdk-version ${this.api.min}`;
              }
              if (!this.api.auto.max) {
                script += ` --max-sdk-version ${this.api.max}`;
              }
              if (!this.signplan.auto) {
                script += ` --v1-signing-enabled ${this.signplan.plans.includes(
                  "V1"
                )}`;
                script += ` --v2-signing-enabled ${this.signplan.plans.includes(
                  "V2"
                )}`;
                script += ` --v3-signing-enabled ${this.signplan.plans.includes(
                  "V3"
                )}`;
                script += ` --v4-signing-enabled ${this.signplan.plans.includes(
                  "V4"
                )}`;
              }
              if (this.zipalign.status) {
                const zipalign = window.electronAPI.config.get("zipalign");
                if (!zipalign) {
                  ElMessage({
                    message: this.i18n.noZipalignLocation,
                    type: "error",
                    plain: true,
                  });
                  this.sign = false;
                  return;
                }
                script += ` ${result}_zipalign.apk`;
                console.log(
                  `${zipalign} -v -P ${this.zipalign.config.P} -f ${
                    this.zipalign.config.Zopfli ? "-z" : ""
                  } 4 ${result} ${result}_zipalign.apk && ${script}`
                );
                this.shell(
                  `${zipalign} -v -P ${this.zipalign.config.P} -f ${
                    this.zipalign.config.Zopfli ? "-z" : ""
                  } 4 ${result} ${result}_zipalign.apk && ${script}`
                );
                return;
              } else {
                script += ` ${result}`;
                this.shell(`${script}`);
              }
            } else {
              script += ` ${result}`;
              this.shell(`${script}`);
            }
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
    setInterval(async () => {
      const advancedSetting = window.electronAPI.config.get("advancedSetting");
      if (advancedSetting) {
        this.advancedSetting = advancedSetting;
      } else {
        this.advancedSetting = false;
      }
    }, 100);
  },
};
</script>
