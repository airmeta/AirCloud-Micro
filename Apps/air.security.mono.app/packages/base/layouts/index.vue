<template>
  <div class="layout-wrapper">
    <component :is="currentLayoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useLayout } from "@root/base/composables/layout/useLayout";
import LeftLayout from "@root/base/layouts/modes/left/index.vue";
import TopLayout from "@root/base/layouts/modes/top/index.vue";
import MixLayout from "@root/base/layouts/modes/mix/index.vue";
import { LayoutMode } from "@root/base/enums/settings/layout-enum";
  
const { currentLayout } = useLayout();
const route = useRoute();

/// Select the corresponding component based on the current layout mode
const currentLayoutComponent = computed(() => {
  const override = route.meta?.layout as LayoutMode | undefined;
  const layoutToUse = override ?? currentLayout.value;
  switch (layoutToUse) {
    case LayoutMode.TOP:
      return TopLayout;
    case LayoutMode.MIX:
      return MixLayout;
    case LayoutMode.LEFT:
    default:
      return LeftLayout;
  }
});
</script>

<style lang="scss" scoped>
.layout-wrapper {
  width: 100%;
  height: 100%;
}
</style>
