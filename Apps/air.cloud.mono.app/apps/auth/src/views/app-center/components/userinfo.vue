<template>
  <!-- 用户信息卡片 -->
  <div class="col-span-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 py-3.5 px-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <el-icon class="mr-2 text-blue-600">
            <User />
          </el-icon>
          用户信息
        </h3>
        <a href="#" class="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">编辑资料</a>
      </div>
      <div class="flex items-center space-x-4">
        <img
          src="https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20friendly%20asian%20person%20in%20modern%20office%20setting%20with%20clean%20white%20background%20and%20soft%20lighting%20for%20corporate%20headshot&width=80&height=80&seq=user-info-avatar-001&orientation=squarish"
          alt="用户头像" class="w-16 h-16 rounded-full object-cover" />
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">张三</h3>
          <p class="text-sm text-gray-600">信息技术部</p>
          <p class="text-sm text-gray-500 flex items-center">
            <el-icon class="mr-1">
              <User />
            </el-icon>
            系统管理员
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 通知公告模块 -->
  <div class="col-span-8">
    <!-- 1. 外层内边距从p-6减小为p-4，降低整体上下高度 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 py-2 px-6">
      <div class="flex items-center justify-between mb-3"> <!-- 2. 标题下方间距从mb-4减小为mb-3 -->
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <el-icon class="mr-2 text-blue-600">
            <Bell />
          </el-icon>
          通知公告
        </h3>
        <a href="#" class="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">查看全部</a>
      </div>
      <!-- 3. 通知项之间的间距从space-y-3减小为space-y-2 -->
      <div class="space-y-2">
        <div v-for="notice in notices" :key="notice.id"
          class="flex items-start space-x-3 p-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div>
            <span
              :class="notice.priority === 'high' ? 'bg-red-100 text-red-600' : notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
              {{ notice.priority === 'high' ? '重要' : notice.priority === 'medium' ? '一般' : '通知' }}
            </span>
          </div>
          <div class="notice-item-content">
            <p class="text-sm font-medium text-gray-900 truncate notice-item-content-title">{{ notice.title }}</p>
            <p class="text-xs text-gray-500 mt-1 notice-item-content-time">{{ notice.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
const notices = ref([
  {
    id: 1,
    title: '系统维护通知：本周六 22:00-24:00 进行系统升级',
    time: '2025-12-17 10:30',
    priority: 'high'
  },
  {
    id: 2,
    title: '新功能上线：移动端 APP 已支持指纹登录',
    time: '2025-12-16 14:20',
    priority: 'medium'
  },
  {
    id: 3,
    title: '安全提醒：请及时修改初始密码，提高账户安全性',
    time: '2025-12-15 09:15',
    priority: 'normal'
  }
]);


</script>
<style lang="scss" scoped>
@import url("../css/index.scss");
</style>