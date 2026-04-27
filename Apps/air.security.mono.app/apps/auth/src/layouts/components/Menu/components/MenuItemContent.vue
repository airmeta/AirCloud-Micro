<template>
  <MenuItemContent :icon="icon" :title="title" />
</template>

<script setup lang="ts">
import MenuItemContent from "@root/base/layouts/components/Menu/components/MenuItemContent.vue";

const props = defineProps<{
  icon?: string;
  title?: string;
}>();

const { icon, title } = toRefs(props);
</script>

<style lang="scss" scoped></style>
