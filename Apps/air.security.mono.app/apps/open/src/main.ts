import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 暗黑主题样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@root/base/themes/element-plus-theme/index.scss";
import "vxe-table/lib/style.css";
// 暗黑模式自定义变量
import "@root/base/styles/dark/css-vars.css";
import "@root/base/styles/index.scss";
import "uno.css";

// 过渡动画
import "animate.css";

// 自动为某些默认事件（如 touchstart、wheel 等）添加 { passive: true },提升滚动性能并消除控制台的非被动事件监听警告
import "default-passive-events";

import { defaultSettings } from "./settings";

import { setDefaultSettings } from "@root/base/base_settings";
import { initRouteHelper } from "@root/base/router/routerConvert";
import Components from "@root/base";

setDefaultSettings(defaultSettings);

initRouteHelper("views");
const app = createApp(App);
// 注册插件
app.use(Components);
app.use(setupPlugins);
app.mount("#app");
