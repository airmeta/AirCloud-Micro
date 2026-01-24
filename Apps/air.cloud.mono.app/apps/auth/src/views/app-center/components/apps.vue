<template>
  <!-- 子系统访问入口 -->
  <div class="col-span-12 mt-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">系统入口</h3>
    <div class="grid grid-cols-4 gap-6">
      <div v-for="appitem in apps" :key="appitem.appId"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
        @click="accessSystem(appitem.appId)">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
            <img :src="appitem.logoUrl" :alt="appitem.appName" class="w-full h-full object-cover" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ appitem.appName }}</h4>
          <p class="text-sm text-gray-600 mb-4">{{ appitem.description }}</p>
          <button
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap">
            立即访问
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>


const accessSystem = (systemId: string) => {
  APP_CENTER_API.goToApp(systemId).then((url) => {
    // 访问成功后的处理逻辑（如果有需要）
    console.log("访问系统成功，跳转到:", url);
    window.open(url, '_blank');
  }).catch((error) => {
    console.error("访问系统失败:", error);
    // 处理访问失败的情况（例如显示错误消息）
  });
};

import APP_CENTER_API from "../../app-center/script/index.api";
import { accountAppIdsRDto } from "../dto/accountAppIdsRDto";


const apps = ref<accountAppIdsRDto[]>([]);

onMounted(async () => {
  const res = await APP_CENTER_API.queryAccountApps();
  apps.value = res;
});





</script>