<template>
  <el-card>
    <div>
      <text>需要签名的 APK 位置</text>
    </div>
    <br />
    <div>
      <el-input v-model="input_apk" clearable placeholder="需要签名的 APK 位置">
        <template #append>
          <el-button @click="open_input_apk">
            <el-icon><FolderOpened /></el-icon
          ></el-button>
        </template>
      </el-input>
    </div>
  </el-card>
  <div v-if="advancedSetting">
    <el-card>
      <div>
        <text>通过验证的最低 Android 框架 API 级别</text>
      </div>
      <br />
      <div style="display: flex; flex-direction: row; align-items: center">
        <el-checkbox
          v-model="api.auto.min"
          label="自动决定 Min SDK"
          style="margin: 3px"
        />
        <el-tooltip placement="right"
          ><template #content
            ><div style="width: calc(30vw); max-width: fit-content">
              <text
                >apksigner 用来确认 APK 签名将通过验证的最低 Android 框架 API
                级别。该级别值越高，表示该工具在为应用签名时可使用的安全参数越强，但这会限制
                APK 只能用于搭载更新版本 Android 的设备。默认情况下，apksigner
                会使用应用清单文件中的 minSdkVersion 属性的值。</text
              >
            </div></template
          >
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
          label="自动决定 Max SDK"
          style="margin: 3px"
        />
        <el-tooltip placement="right"
          ><template #content
            ><div style="width: calc(30vw); max-width: fit-content">
              <text
                >apksigner 用来确认 APK 签名将通过验证的最高 Android 框架 API
                级别。默认情况下，该工具会使用尽可能高的 API 级别。</text
              >
            </div></template
          >
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
        <text>签名方案</text>
        <el-tooltip placement="right"
          ><template #content
            ><div style="width: calc(30vw); max-width: fit-content">
              <text
                >确定 apksigner 是否会使用指定的签名方案为给定的 APK
                软件包签名。默认清空下会根据 minSDK 和 maxSDK 共同决定。</text
              >
            </div></template
          >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <br />
      <div>
        <el-checkbox
          v-model="signplan.auto"
          label="自动为你决定签名方案"
          style="margin: 3px"
        />
        <div v-if="!signplan.auto" style="margin-top: 10px">
          <text>选择签名方案</text>
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
        <text>zipalign 对齐</text>
        <el-tooltip placement="right"
          ><template #content
            ><div style="width: calc(30vw); max-width: fit-content">
              <text
                >在将 APK 文件分发给最终用户之前，先使用 zipalign
                进行优化。如果您通过使用 Android Gradle 插件 (AGP) 的 Android
                Studio 进行构建，系统会自动完成此操作。</text
              >
              <br />
              <text>
                你必须在为 APK 文件签名之前使用 zipalign。如果您在使用 apksigner
                为 APK 签名之后对 APK 做出了进一步更改，签名便会失效。
              </text>
              <br />
              <text>
                如果您的 APK 包含共享库（.so 个文件），请使用 -P 16
                以确保它们与适合 mmap(2) 的 16KiB 页面边界对齐 在 16KiB 和 4KiB
                设备中。对于其他文件，其对齐方式由 zipalign
                的强制性对齐参数，应按 4 个字节对齐 在 32 位和 64 位系统上运行
              </text>
            </div></template
          >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <br />
      <div>
        <el-checkbox
          v-model="zipalign.status"
          label="使用 zipalign 对齐 APK"
          style="margin: 3px"
        />
      </div>
      <br v-if="zipalign.status" />
      <div v-if="zipalign.status">
        <div style="align-items: center">
          <text style="margin: 3px">页面大小</text>
          <el-select
            v-model="zipalign.config.P"
            placeholder="页面大小"
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
            label="使用 Zopfli 重新压缩"
            style="margin: 3px"
          />
        </div>
      </div>
    </el-card>
  </div>
  <el-card v-if="!output.rewrite">
    <div>
      <text>将 APK 导出到</text>
    </div>
    <br />
    <div>
      <el-input v-model="output.path" clearable placeholder="将 APK 导出到">
        <template #append>
          <el-button @click="save_apk">
            <el-icon><FolderOpened /></el-icon
          ></el-button>
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
        <el-checkbox v-model="output.rewrite" label="覆盖原文件" />
        <el-checkbox v-model="output.showSignLog" label="显示日志" />
      </div>
      <div>
        <el-button text bg type="primary" :loading="sign" @click="signButton"
          >签名</el-button
        >
      </div>
    </div>
    <br v-if="output.showSignLog" />
    <div v-if="output.showSignLog">
      <el-scrollbar style="max-height: 400px">
        <text>{{ stdout }}</text>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<style></style>

<script setup>
import { FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
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
        })
        .catch((error) => {
          this.stdout += error;
        });
    },
    signButton() {
      this.sign = true;
      this.stdout = "";
      if (!this.input_apk) {
        ElMessage({
          message: "检查一下是不是漏了些什么？？",
          type: "error",
          plain: true,
        });
        this.sign = false;
        return;
      } else {
        window.electronAPI.CopyToTmp(this.input_apk).then(async (result) => {
          const k = JSON.parse(localStorage.getItem("key-" + this.keyname));
          const apksigner = localStorage.getItem("apksigner");
          let script = `${apksigner} sign -v --ks ${k.keystone} --ks-key-alias ${k.keyalias} --ks-pass pass:${k.keypasswd}`;
          if (!this.output.rewrite) {
            if (!this.output.path) {
              ElMessage({
                message: "检查一下是不是漏了些什么？？",
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
              const zipalign = localStorage.getItem("zipalign");
              script += ` ${result}_zipalign.apk`;
              this.shell(
                `${zipalign} -v -P ${this.zipalign.config.P} -f ${
                  this.Zopfli ? "-z" : ""
                } 4 ${result} ${result}_zipalign.apk && ${script}`
              );
              this.sign = false;
              return;
            }
          }
          script += ` ${result}`;
          this.shell(`${script}`);
          this.sign = false;
        });
      }
    },
  },
  mounted() {
    setInterval(async () => {
      if (localStorage.getItem("advancedSetting") == 1) {
        this.advancedSetting = true;
      } else {
        this.advancedSetting = false;
      }
    }, 100);
  },
};
</script>
