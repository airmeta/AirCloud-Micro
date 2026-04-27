import type { App } from "vue";

import { setupAppPlugins } from "@root/base/plugins/app";
import { setupRouter } from "@/router";
import { setupPermission } from "./permission";

export default {
  install(app: App<Element>) {
    setupAppPlugins(app, {
      setupRouter,
      setupPermission,
    });
  },
};
