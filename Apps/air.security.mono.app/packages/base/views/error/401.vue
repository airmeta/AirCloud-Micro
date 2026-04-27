<template>
  <div class="p-5 pb-0 sm:p-10 lg:p-20 w-full">
    <el-button icon="arrow-left" @click="router.back()">返回</el-button>
    <el-row>
      <el-col :xs="24" :span="12">
        <h1 class="text-6xl font-bold text-[#484848]">Oops!</h1>
        <h2>你没有权限访问该页面</h2>
      </el-col>
      <el-col :xs="24" :span="12">
        <img src="../../assets/images/401.svg" class="w-full" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Page401" });
const router = useRouter();
</script>
