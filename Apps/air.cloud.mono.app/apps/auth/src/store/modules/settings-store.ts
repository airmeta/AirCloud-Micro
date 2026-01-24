import { defaultSettings } from "@/settings";
import { SidebarColor, ThemeMode } from "@/enums/settings/theme-enum";
import type { LayoutMode } from "@/enums/settings/layout-enum";
import { applyTheme, generateThemeColors, toggleSidebarColor } from "@/utils/theme";
import { STORAGE_KEYS } from "@/constants";

// 🎯 设置项类型定义
interface SettingsState {
  // 界面显示设置
  settingsVisible: boolean;
  showTagsView: boolean;
  showAppLogo: boolean;
  showWatermark: boolean;
  enableAiAssistant: boolean;

  // 布局设置
  layout: LayoutMode;
  sidebarColorScheme: string;

  // 主题设置
  theme: ThemeMode;
  themeColor: string;
}

// 🎯 可变更的设置项类型
type MutableSetting = Exclude<keyof SettingsState, "settingsVisible">;
type SettingValue<K extends MutableSetting> = SettingsState[K];

export const useSettingsStore = defineStore("setting", () => {
  // 设置面板可见性
  const settingsVisible = ref<boolean>(false);

  // 是否显示标签页视图
  const showTagsView = useStorage<boolean>(
    STORAGE_KEYS.SHOW_TAGS_VIEW,
    defaultSettings.showTagsView
  );

  // 是否显示应用Logo
  const showAppLogo = useStorage<boolean>(STORAGE_KEYS.SHOW_APP_LOGO, defaultSettings.showAppLogo);

  // 是否显示水印
  const showWatermark = useStorage<boolean>(
    STORAGE_KEYS.SHOW_WATERMARK,
    defaultSettings.showWatermark
  );

  // 是否启用 AI 助手
  const enableAiAssistant = useStorage<boolean>(
    STORAGE_KEYS.ENABLE_AI_ASSISTANT,
    defaultSettings.enableAiAssistant
  );

  // 侧边栏配色方案
  const sidebarColorScheme = useStorage<string>(
    STORAGE_KEYS.SIDEBAR_COLOR_SCHEME,
    defaultSettings.sidebarColorScheme
  );

  // 布局模式
  const layout = useStorage<LayoutMode>(STORAGE_KEYS.LAYOUT, defaultSettings.layout as LayoutMode);

  // 主题颜色
  const themeColor = useStorage<string>(STORAGE_KEYS.THEME_COLOR, defaultSettings.themeColor);

  // 主题模式（亮色/暗色）
  const theme = useStorage<ThemeMode>(STORAGE_KEYS.THEME, defaultSettings.theme);

  // 设置项映射，用于统一管理
  const settingsMap = {
    showTagsView,
    showAppLogo,
    showWatermark,
    enableAiAssistant,
    sidebarColorScheme,
    layout,
  } as const;
  // 监听侧边栏配色变化
  watch(
    [sidebarColorScheme],
    ([newSidebarColorScheme]) => {
      toggleSidebarColor(newSidebarColorScheme === SidebarColor.CLASSIC_BLUE);
    },
    { immediate: true }
  );

  // 通用设置更新方法
  function updateSetting<K extends keyof typeof settingsMap>(key: K, value: SettingValue<K>): void {
    const setting = settingsMap[key];
    if (setting) {
      (setting as Ref<any>).value = value;
    }
  }

  // 主题更新方法
  function updateTheme(newTheme: ThemeMode): void {
    theme.value = newTheme;
  }

  function updateThemeColor(newColor: string): void {
    themeColor.value = newColor;
  }

  function updateSidebarColorScheme(newScheme: string): void {
    sidebarColorScheme.value = newScheme;
  }

  function updateLayout(newLayout: LayoutMode): void {
    layout.value = newLayout;
  }

  // 设置面板控制
  function toggleSettingsPanel(): void {
    settingsVisible.value = !settingsVisible.value;
  }

  function showSettingsPanel(): void {
    settingsVisible.value = true;
  }

  function hideSettingsPanel(): void {
    settingsVisible.value = false;
  }

  // 重置所有设置
  function resetSettings(): void {
    showTagsView.value = defaultSettings.showTagsView;
    showAppLogo.value = defaultSettings.showAppLogo;
    showWatermark.value = defaultSettings.showWatermark;
    enableAiAssistant.value = defaultSettings.enableAiAssistant;
    sidebarColorScheme.value = defaultSettings.sidebarColorScheme;
    layout.value = defaultSettings.layout as LayoutMode;
    themeColor.value = defaultSettings.themeColor;
    theme.value = defaultSettings.theme;
  }

  return {
    // 状态
    settingsVisible,
    showTagsView,
    showAppLogo,
    showWatermark,
    enableAiAssistant,
    sidebarColorScheme,
    layout,
    themeColor,
    theme,

    // 更新方法
    updateSetting,
    updateTheme,
    updateThemeColor,
    updateSidebarColorScheme,
    updateLayout,

    // 面板控制
    toggleSettingsPanel,
    showSettingsPanel,
    hideSettingsPanel,

    // 重置功能
    resetSettings,
    //应用Id
    appId: defaultSettings.appId,
    appPublicKey: defaultSettings.appPublicKey
  };
});
