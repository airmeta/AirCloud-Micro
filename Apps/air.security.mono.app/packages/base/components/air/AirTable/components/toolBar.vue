<template>
  <div class="air-table-toolbar">
    <div class="left">
      <slot name="toolbar-left"></slot>
      <!-- 当处于树模式且调用方允许时，显示展开/折叠按钮 -->
      <template v-if="props.showExpandButtons && props.treeMode">
        <el-button type="default" @click="toggleExpand">
          <el-icon v-if="!expanded">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
          </el-icon>
          <el-icon v-else>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg>
          </el-icon>
          {{ expanded ? '折叠全部' : '展开全部' }}
        </el-button>
      </template>
    </div>
    <div class="right">
       <!-- 刷新（图标） -->
        <el-tooltip content="刷新" placement="bottom">
          <div class="tool-item"  icon @click="$emit('refresh')" title="刷新">
            <el-icon>
              <Refresh />
            </el-icon>
          </div>
        </el-tooltip>
        <!-- 斑马纹 切换（图标） -->
        <el-tooltip :content="stripeTooltip" placement="bottom">
          <div class="tool-item"  :class="['icon-btn', { 'active': localStripe }]" icon @click="toggleStripe" title="斑马纹">
            <el-icon>
              <Grid />
            </el-icon>
          </div>
        </el-tooltip>

        <!-- 列选择（图标） -->
        <el-popover  trigger="click" width="180" placement="left-start">
          <div style="padding:8px 4px;">
            <div style="padding-right:8px;">
            <el-checkbox-group v-model="localVisible" @change="onChange">
              <ul class="col-list">
                <li v-for="col in selectableCols" :key="colKey(col)">
                  <el-checkbox :value="colKey(col)">{{ col.label || col.prop || col.key }}</el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </div>
            <div style="display:flex;align-items:center;justify-content:flex-end;margin-top:8px;gap:6px;">
              <el-button size="small" @click="selectAll">全选</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </div>
          </div>
          <template #reference>
            <div class="tool-item" icon title="列选择">
             <el-icon><Setting /></el-icon>
            </div>
          </template>
        </el-popover>
        <slot name="toolbar-right"></slot>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Refresh, List, Grid } from '@element-plus/icons-vue';

interface Col {
  prop?: string;
  key?: string;
  label?: string;
  type?: string;
}

const props = withDefaults(defineProps<{
  columns?: Col[];
  visible?: string[];
  stripe?: boolean;
  showAdd?: boolean;
  // 树模式相关：外部告知当前是否为树模式 + 是否显示展开/折叠按钮
  treeMode?: boolean;
  showExpandButtons?: boolean;
}>(), {
  columns: () => [],
  visible: () => [],
  stripe: false,
  showAdd: false,
  treeMode: false,
  showExpandButtons: false,
});

const emit = defineEmits<{
  (e: 'update:visible', val: string[]): void;
  (e: 'update:stripe', val: boolean): void;
  (e: 'refresh'): void;
  (e: 'add'): void;
  (e: 'expand-all'): void;
  (e: 'collapse-all'): void;
}>();

const expanded = ref(false);
function toggleExpand() {
  expanded.value = !expanded.value;
  emit(expanded.value ? 'expand-all' : 'collapse-all');
}

const selectableCols = computed(() => (props.columns || []).filter(c => c.type !== 'selection' && c.type !== 'index'));

function colKey(c: Col) {
  return String(c.prop ?? c.key ?? '');
}

const localVisible = ref<string[]>(props.visible && props.visible.length ? [...props.visible] : selectableCols.value.map(colKey));
const localStripe = ref<boolean>(!!props.stripe);

watch(() => props.visible, (v) => {
  if (v && v.length) localVisible.value = [...v];
});

watch(() => props.stripe, (v) => {
  localStripe.value = !!v;
});

function onChange(val: string[]) {
  emit('update:visible', val);
}

function toggleStripe() {
  localStripe.value = !localStripe.value;
  emit('update:stripe', localStripe.value);
}

function selectAll() {
  localVisible.value = selectableCols.value.map(colKey);
  emit('update:visible', localVisible.value);
}

function reset() {
  localVisible.value = selectableCols.value.map(colKey);
  emit('update:visible', localVisible.value);
}

const stripeTooltip = computed(() => (localStripe.value ? '关闭斑马纹' : '开启斑马纹'));

</script>

<style scoped>
.air-table-toolbar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:10px;
}
.air-table-toolbar .left{flex:1}
.air-table-toolbar .right{display:flex;gap:0;align-items:center}
.icon-btn{background:transparent;border:1px solid transparent;padding:6px}
.icon-btn.active{color:var(--el-color-primary)}
.col-list{padding:0;margin:0;width:180px;overflow-x:auto;}
.col-list li{list-style:none;margin:2px 0;overflow-x: auto;}

.tool-item{
    margin-left:5px;
}
.right{
    height: 20px;
}
</style>
