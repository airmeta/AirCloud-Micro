<template>
  <!-- 常用工具栏 -->
  <div class="col-span-12 mt-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">常用工具</h3>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="grid grid-cols-6 gap-4">
        <div v-for="tool in tools" :key="tool.id"
          class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
          @click="useTool(tool.id)">
          <div
            class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <el-icon class="text-white text-xl">
              <component :is="tool.icon" />
            </el-icon>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ tool.name }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>

const tools = ref([
  { id: 1, name: '文档下载', icon: 'Document' },
  { id: 2, name: '帮助中心', icon: 'QuestionFilled' },
  { id: 3, name: '意见反馈', icon: 'ChatDotRound' },
  { id: 4, name: '系统状态', icon: 'Monitor' },
  { id: 5, name: '资源下载', icon: 'Download' },
  { id: 6, name: '数据统计', icon: 'DataAnalysis' }
]);
const useTool = (toolId: number) => {
  console.log('使用工具:', toolId);
};
</script>