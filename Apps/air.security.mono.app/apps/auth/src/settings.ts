import { createAppSettings } from "@root/base/base_settings";

export const defaultSettings: AppSettings = createAppSettings({
  // 应用编号--迁移到新的地方部署时请更换为对应的AppId
  appId: "5340de08f1844e8b88367c1f3ba3f77d",
  // 应用公钥 --迁移到新的地方部署时请更换为对应的公钥
  appPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmj0GJKPR1oO4jwb4arVdVgqaG8PTvzaME9eTPkcBkKSbsLNPof3TfaQqhlnRUw2aOI1gvUYav5JY8UpasCIOuva0d+2UH3ene3PiagWQWHKOFbuLfiZjfjENG8n9z31CB2NclGuv4RhrtoyuxnwOMCtILN3GK5A6NoODNHryCO2y3DK6jzlBbI2tUqF9SzvLdLtigHe1ZjT/S2SL3f0r+JqmyC2jUXjRgkNW/xPaI4E/Gs7Ql+P7Jm6zWO2oyh0Yc+PRl2B6au90YKxwgAIZWNMenHkHbHfOtBCTMYkaKbGO24m/94F1Q/ofb0oE80d0dl2frZSEnTotLQX9QcX5MwIDAQAB",
  appName: "",
});

/**
 * 认证功能配置
 */
export const authConfig = {
  /**
   * Token自动刷新开关
   *
   * true: 启用自动刷新 - ACCESS_TOKEN_INVALID时尝试刷新token
   * false: 禁用自动刷新 - ACCESS_TOKEN_INVALID时直接跳转登录页
   *
   * 适用场景：后端没有刷新接口或不需要自动刷新的项目可设为false
   */
  enableTokenRefresh: true,
} as const;

// 主题色预设 - 经典配色方案
// 注意：修改默认主题色时，需要同步修改 @root/base/styles/variables.scss 中的 primary.base 值
export const themeColorPresets = [
  "#4080FF", // Arco Design 蓝 - 现代感强
  "#1890FF", // Ant Design 蓝 - 经典商务
  "#409EFF", // Element Plus 蓝 - 清新自然
  "#FA8C16", // 活力橙 - 温暖友好
  "#722ED1", // 优雅紫 - 高端大气
  "#13C2C2", // 青色 - 科技感
  "#52C41A", // 成功绿 - 活力清新
  "#F5222D", // 警示红 - 醒目强烈
  "#2F54EB", // 深蓝 - 稳重专业
  "#EB2F96", // 品红 - 时尚个性
];
