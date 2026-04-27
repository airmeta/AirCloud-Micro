<!-- 导出的代码使用 Tailwind CSS。请在您的开发环境中安装 Tailwind CSS 以确保所有样式正常工作。 -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 login-container" style="min-width: 65vw;">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <headers class="max-w-7xl mx-auto px-6 py-4"></headers>
    </header>
    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-12 gap-6">
        <userinfo></userinfo>
      </div>
      <div class="grid grid-cols-12">
        <apps></apps>
      </div>
      <div class="grid grid-cols-12">
        <tools></tools>
      </div>
    </main>
    <!-- 快捷操作区域 -->
    <div class="fixed right-6 bottom-6 flex flex-col space-y-3">
      <button @click="scrollToTop"
        class="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 !rounded-button whitespace-nowrap">
        <el-icon class="text-lg">
          <Top />
        </el-icon>
      </button>
      <button @click="toggleFullscreen"
        class="w-12 h-12 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 !rounded-button whitespace-nowrap">
        <el-icon class="text-lg">
          <FullScreen />
        </el-icon>
      </button>
      <button @click="openThemeSettings"
        class="w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 !rounded-button whitespace-nowrap">
        <el-icon class="text-lg">
          <Setting />
        </el-icon>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>

import apps from "./components/apps.vue";
import tools from "./components/tools.vue";
import userinfo from "./components/userinfo.vue";
import headers from "./components/headers.vue";
import { useSettingsStore } from "@/store";
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
const settingsStore = useSettingsStore();
const openThemeSettings = () => {
  settingsStore.showSettingsPanel();
};
</script>
<style lang="scss" scoped>
@import url("./css/index.scss");

// 添加伪元素作为背景层
.login-container::before {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  content: "";
  background: url("@root/base/assets/images/login-bg.png");
  background-position: center center;
  background-size: 100% 100%;

  min-width: 80vw !important;
}
</style>