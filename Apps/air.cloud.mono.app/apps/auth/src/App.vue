<template>
  <el-config-provider :locale="locale" :size="size">
    <!-- 开启水印 -->
    <!-- <el-watermark
      :font="{ color: fontColor }"
      :content="showWatermark ? defaultSettings.watermarkContent : ''"
      :z-index="9999"
      class="wh-full"
    > -->
    <router-view />

    <!-- AI 助手 -->
    <!-- <AiAssistant v-if="enableAiAssistant" /> -->
    <!-- </el-watermark> -->
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore, useSettingsStore, useUserStore } from "@/store";
import { defaultSettings } from "@/settings";
import { ThemeMode, ComponentSize } from "@/enums";
import AiAssistant from "@/components/AiAssistant/index.vue";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();

const locale = computed(() => appStore.locale);
const size = computed(() => appStore.size as ComponentSize);
const showWatermark = computed(() => settingsStore.showWatermark);


</script>
