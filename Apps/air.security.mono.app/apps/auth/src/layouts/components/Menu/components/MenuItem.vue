<template>
  <MenuItem :item="item" :base-path="basePath" :is-nest="isNest" />
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";
import MenuItem from "@root/base/layouts/components/Menu/components/MenuItem.vue";

const props = withDefaults(
  defineProps<{
    item: RouteRecordRaw;
    basePath: string;
    isNest?: boolean;
  }>(),
  {
    isNest: false,
  }
);

const { item, basePath, isNest } = toRefs(props);
</script>

<style lang="scss"></style>
