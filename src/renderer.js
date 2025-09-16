import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./element.scss";
import App from "./App.vue";
import { internationalization } from "./utils/i18nServices/client";

new internationalization()

const app = createApp(App);

app.use(ElementPlus);
app.mount("#app");
