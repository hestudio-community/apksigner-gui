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
        <el-popover
          placement="right"
          width="30vw"
          style="max-width: fit-content"
          trigger="hover"
          :content="i18n.minSDKTooltip"
        >
          <template #reference>
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </template>
        </el-popover>
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
        <el-popover
          placement="right"
          width="30vw"
          style="max-width: fit-content"
          trigger="hover"
          :content="i18n.maxSDKTooltip"
        >
          <template #reference>
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </template>
        </el-popover>
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
        <el-popover
          placement="left"
          width="30vw"
          style="max-width: fit-content"
          trigger="hover"
          :content="i18n.signingSchemeTooltip"
        >
          <template #reference>
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </template>
        </el-popover>
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
        <el-popover
          placement="right"
          width="30vw"
          style="max-width: fit-content"
          trigger="hover"
          :content="i18n.zipalignTooltip"
        >
          <template #reference>
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </template>
        </el-popover>
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
    advancedSetting: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      input_apk: "",
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
    signButton() {
      this.sign = true;
      this.stdout = "";

      // 1. Validate input
      if (!this.input_apk) {
        ElMessage({
          message: this.i18n.CheckDeficiencies,
          type: "error",
          plain: true,
        });
        this.sign = false;
        return;
      }

      // 2. Check if file exists
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

        // 3. Copy to temporary directory
        window.electronAPI.CopyToTmp(this.input_apk).then((tmpPath) => {
          const key = window.electronAPI.config.get("keys")[this.keyname];
          const apksigner = window.electronAPI.config.get("apksigner");
          const zipalign = window.electronAPI.config.get("zipalign");

          // Validate apksigner path
          if (!apksigner) {
            ElMessage({
              message: this.i18n.noApksignerLocation,
              type: "error",
              plain: true,
            });
            this.sign = false;
            return;
          }

          // Validate output path if not overwriting
          if (!this.output.rewrite && !this.output.path) {
            ElMessage({
              message: this.i18n.CheckDeficiencies,
              type: "error",
              plain: true,
            });
            this.sign = false;
            return;
          }

          // 4. Build options object
          const options = {
            apkPath: tmpPath,
            outputPath: this.output.rewrite ? this.input_apk : this.output.path,
            overwrite: this.output.rewrite,
            keystore: key.keystore,
            keyAlias: key.keyalias,
            keyPassword: key.keypasswd,
            apksignerPath: apksigner,
          };

          // 5. Add advanced settings
          if (this.advancedSetting) {
            if (!this.api.auto.min) {
              options.minSdkVersion = this.api.min;
            }
            if (!this.api.auto.max) {
              options.maxSdkVersion = this.api.max;
            }

            if (!this.signplan.auto) {
              options.v1SigningEnabled = this.signplan.plans.includes("V1");
              options.v2SigningEnabled = this.signplan.plans.includes("V2");
              options.v3SigningEnabled = this.signplan.plans.includes("V3");
              options.v4SigningEnabled = this.signplan.plans.includes("V4");
            }

            if (this.zipalign.status) {
              if (!zipalign) {
                ElMessage({
                  message: this.i18n.noZipalignLocation,
                  type: "error",
                  plain: true,
                });
                this.sign = false;
                return;
              }
              options.useZipalign = true;
              options.zipalignPath = zipalign;
              options.pageSize = this.zipalign.config.P;
              options.useZopfli = this.zipalign.config.Zopfli;
            }
          }

          // 6. Call signing service
          window.electronAPI
            .SignAPK(options)
            .then((stdout) => {
              this.stdout += stdout;
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
        });
      });
    },
  },
  async created() {
    const i18n = new internationalization();
    for (let i = 0; i < Object.keys(this.i18n).length; i++) {
      const key = Object.keys(this.i18n)[i];
      this.i18n[key] = i18n.geti18n(key);
    }
  },
  mounted() {},
};
</script>
