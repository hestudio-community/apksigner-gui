// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./element.scss";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus);
app.mount("#app");
