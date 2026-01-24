<template>
  <div class="max-w-7xl mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <el-icon class="text-white text-xl">
            <Platform />
          </el-icon>
        </div>
        <h1 class="text-xl font-bold text-gray-900">{{ appName }}</h1>
      </div>
      <!-- 搜索框 -->
      <div class="flex-1 max-w-md mx-8">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="搜索系统、功能或文档..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <el-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            <Search />
          </el-icon>
        </div>
      </div>
      <!-- 右侧功能区 -->
      <div class="flex items-center space-x-4">
        <!-- 通知中心 -->
        <!-- <div class="relative cursor-pointer" @click="showNotifications = !showNotifications">
              <el-icon class="text-gray-600 text-xl hover:text-blue-600 transition-colors">
                <Bell />
              </el-icon>
              <span
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </div> -->
        <!-- 主题切换 -->
        <div class="cursor-pointer" @click="toggleTheme">
          <el-icon class="text-gray-600 text-xl hover:text-blue-600 transition-colors">
            <Sunny />
          </el-icon>
        </div>
        <!-- 用户头像菜单 -->
        <div class="relative" @click="showUserMenu = !showUserMenu">
          <div
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20friendly%20asian%20person%20in%20modern%20office%20setting%20with%20clean%20white%20background%20and%20soft%20lighting%20for%20corporate%20headshot&width=40&height=40&seq=user-avatar-001&orientation=squarish"
              alt="用户头像" class="w-8 h-8 rounded-full object-cover" />
            <span class="text-sm font-medium text-gray-700">{{ account.UserName }}</span>
            <el-icon class="text-gray-400 text-sm">
              <ArrowDown />
            </el-icon>
          </div>
          <!-- 用户菜单下拉 -->
          <div v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ account.UserName }}</p>
              <p class="text-xs text-gray-500">系统管理员</p>
            </div>
            <a href="#"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <el-icon class="inline mr-2">
                <User />
              </el-icon>个人资料
            </a>
            <a href="#"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              <el-icon class="inline mr-2">
                <Setting />
              </el-icon>系统设置
            </a>
            <hr class="my-1 border-gray-100" />
            <a href="#"
              class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap">
              <el-icon class="inline mr-2">
                <SwitchButton />
              </el-icon>退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 通知弹窗 -->
  <div v-if="showNotifications" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click="showNotifications = false">
    <div class="fixed top-16 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto"
      @click.stop>
      <div class="p-4 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900">通知中心</h3>
      </div>
      <div class="p-4 space-y-3">
        <div v-for="notification in notifications" :key="notification.id"
          class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>

import { getClientAppConfig } from '@/store/modules/client/client';
import { userAccount } from '@/store/modules/user/user-account';
import { getAccountInfo } from '@/utils/auth';
import { ref, onMounted } from 'vue';
const searchQuery = ref('');
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notifications = ref([
  {
    id: 1,
    title: '您有 3 个待处理的审批任务',
    time: '5 分钟前'
  },
  {
    id: 2,
    title: '系统将在今晚 22:00 进行维护',
    time: '1 小时前'
  },
  {
    id: 3,
    title: '新的安全策略已生效',
    time: '2 小时前'
  }
]);

const appName = ref<string>("");
const account = ref<userAccount>(new Object() as userAccount);
onMounted(() => {
  // 模拟从接口获取应用名称
  var appInfo = getClientAppConfig();
  if (appInfo != null) {
    var name = appInfo.appName;
    appName.value = name;
  }
  var userInfo = getAccountInfo() as userAccount;
  if (userInfo != null) {
    account.value = userInfo;
  }

});

const toggleTheme = () => {
  console.log('切换主题');
};

const viewDetails = (approvalId: number) => {
  console.log('查看详情:', approvalId);
};
const openThemeSettings = () => {
  console.log('打开主题设置');
};
</script>
<style lang="scss" scoped>
@import url("../css/index.scss");
</style>