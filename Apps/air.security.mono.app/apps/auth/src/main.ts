import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 暗黑主题样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@root/base/themes/element-plus-theme/index.scss";
import "vxe-table/lib/style.css";
import "@root/base/styles/dark/css-vars.css";
import "@root/base/styles/index.scss";
import "uno.css";

// 过渡动画
import "animate.css";

// 自动为某些默认事件（如 touchstart、wheel 等）添加 { passive: true },提升滚动性能并消除控制台的非被动事件监听警告
import { defaultSettings } from "./settings";
import { setDefaultSettings } from "@root/base/base_settings";

setDefaultSettings(defaultSettings);

const app = createApp(App);
// 注册插件
app.use(setupPlugins);
app.mount("#app");
