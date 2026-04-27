import type { App } from "vue";
import { createPinia } from "pinia";
const store = createPinia();

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from "@root/base/store/modules/app-store";
export * from "@root/base/store/modules/settings-store";
export * from "@root/base/store/modules/tags-view-store";
export * from "@root/base/store/modules/user/user-store";
export * from "@root/base/store/modules/dict-store";
export * from "@root/base/store/modules/permission-store";

export { store };
