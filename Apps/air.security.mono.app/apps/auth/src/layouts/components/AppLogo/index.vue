<template>
  <BaseAppLogo :collapse="collapse" />
</template>

<script lang="ts" setup>
import BaseAppLogo from "@root/base/layouts/components/AppLogo/index.vue";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
