<template>
  <el-card>
    <div>
      <text>需要签名的 APK 位置</text>
    </div>
    <br />
    <div>
      <el-input v-model="input_apk" clearable placeholder="要签名的 APK 位置">
        <template #append>
          <el-button @click="open_input_apk">
            <el-icon><FolderOpened /></el-icon
          ></el-button>
        </template>
      </el-input>
    </div>
  </el-card>
  <br />
  <el-card>
    <div>
      <text>通过验证的最低 Android 框架 API 级别</text>
    </div>
    <br />
    <div style="display: flex; flex-direction: row; align-items: center">
      <el-checkbox v-model="api.auto.min" label="自动决定 Min SDK" style="margin: 3px" />
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
      <el-checkbox v-model="api.auto.max" label="自动决定 Max SDK" style="margin: 3px" />
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
  <br />
  <el-card>
    <div
      style="display: flex; flex-direction: row; justify-content: space-between"
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
      <div style="display: flex; flex-direction: row; align-items: center">
        <el-switch v-model="signplan.auto" style="margin: 3px" /><text
          style="margin: 3px"
          >自动为你决定签名方案</text
        >
      </div>
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
      signplan: {
        auto: true,
        plans: [],
      },
      api: {
        auto: {
          min: true,
          max: true,
        },
        min: 1,
        max: 1,
      },
    };
  },
  methods: {
    open_input_apk() {
      window.electronAPI.openFile().then((result) => {
        this.input_apk = result;
      });
    },
  },
};
</script>
