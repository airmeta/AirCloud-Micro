import type { App } from "vue";

import { setupDirective } from "@root/base/directives";
import { setupI18n } from "@root/base/lang";
import { setupStore } from "@root/base/store";
import { setupElIcons } from "@root/base/plugins/icons";
import { setupVxeTable } from "@root/base/plugins/vxeTable";
import { InstallCodeMirror } from "codemirror-editor-vue3";

export interface SetupAppPluginsOptions {
  setupRouter: (app: App<Element>) => void;
  setupPermission: () => void;
}

export function setupAppPlugins(app: App<Element>, options: SetupAppPluginsOptions) {
  const { setupRouter, setupPermission } = options;

  // 自定义指令(directive)
  setupDirective(app);
  // 路由(router)
  setupRouter(app);
  // 状态管理(store)
  setupStore(app);
  // 国际化
  setupI18n(app);
  // Element-plus图标
  setupElIcons(app);
  // 路由守卫
  setupPermission();
  // vxe-table
  setupVxeTable(app);
  // 注册 CodeMirror
  app.use(InstallCodeMirror);
}

export default setupAppPlugins;
