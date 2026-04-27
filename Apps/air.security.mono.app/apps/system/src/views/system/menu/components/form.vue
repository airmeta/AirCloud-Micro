<template>
  <el-form ref="internalFormRef" :model="formData" :rules="rules" label-width="100px">
   
    <el-form-item label="应用信息" prop="appId">
      <el-tree-select
        v-model="formData.appId"
        placeholder="选择所属应用"
        :data="appOptions"
        :disabled="!!formData.id"
        filterable
        check-strictly
        :render-after-expand="false"
        @change="handleAppChange"
      />
    </el-form-item>
    <el-form-item label="菜单名称" prop="title">
      <el-input v-model="formData.title" placeholder="请输入菜单名称" />
    </el-form-item>
    <el-form-item label="父级菜单" prop="parentId">
      <el-tree-select
        v-model="formData.parentId"
        placeholder="选择上级菜单"
        :data="menuOptions"
        clearable
        filterable
        check-strictly
        :render-after-expand="false"
      />
    </el-form-item>
    <el-form-item label="菜单类型" prop="type">
      <el-radio-group v-model="formData.type"  :disabled="!!formData.id" @change="$emit('menu-type-change')">
        <el-radio :value="MenuTypeEnum.CATALOG">目录</el-radio>
        <el-radio :value="MenuTypeEnum.MENU">菜单</el-radio>
        <el-radio :value="MenuTypeEnum.BUTTON">按钮</el-radio>
        <el-radio :value="MenuTypeEnum.EXTLINK">外链</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="formData.type == MenuTypeEnum.EXTLINK" label="外链地址" prop="path">
      <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
    </el-form-item>

    <el-form-item
      v-if="formData.type == MenuTypeEnum.CATALOG || formData.type == MenuTypeEnum.MENU"
      prop="path"
    >
      <template #label>
        <div class="flex-y-center">
          路由路径
          <el-tooltip placement="bottom" effect="light">
            <template #content>
              定义应用中不同页面对应的 URL 路径，如 /system/user。
            </template>
            <el-icon class="ml-1 cursor-pointer">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-input
        v-if="formData.type == MenuTypeEnum.CATALOG"
        v-model="formData.path"
        placeholder="system"
      />
      <el-input v-else v-model="formData.path" placeholder="user" />
    </el-form-item>
    <el-form-item v-if="formData.type == MenuTypeEnum.MENU" prop="component">
      <template #label>
        <div class="flex-y-center">
          组件路径
          <el-tooltip placement="bottom" effect="light">
            <template #content>
              组件页面完整路径，相对于 src/views/，如 system/user/index，缺省后缀 .vue
            </template>
            <el-icon class="ml-1 cursor-pointer">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-input v-model="formData.component" placeholder="system/user/index" style="width: 95%">
        <template v-if="formData.type == MenuTypeEnum.MENU" #prepend>src/views/</template>
        <template v-if="formData.type == MenuTypeEnum.MENU" #append>.vue</template>
      </el-input>
    </el-form-item>

    <!-- <el-form-item v-if="formData.type == MenuTypeEnum.MENU">
      <template #label>
        <div class="flex-y-center">
          路由参数
          <el-tooltip placement="bottom" effect="light">
            <template #content>
              组件页面使用 `useRoute().query.参数名` 获取路由参数值。
            </template>
            <el-icon class="ml-1 cursor-pointer">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
      </template>

      <div v-if="!formData.params || formData.params.length === 0">
        <el-button type="success" plain @click="formData.params = [{ key: '', value: '' }]">
          添加路由参数
        </el-button>
      </div>

      <div v-else>
        <div v-for="(item, index) in formData.params" :key="index">
          <el-input v-model="item.key" placeholder="参数名" style="width: 100px" />
          <span class="mx-1">=</span>
          <el-input v-model="item.value" placeholder="参数值" style="width: 100px" />
          <el-icon
            v-if="formData.params.indexOf(item) === formData.params.length - 1"
            class="ml-2 cursor-pointer color-[var(--el-color-success)]"
            style="vertical-align: -0.15em"
            @click="formData.params.push({ key: '', value: '' })"
          >
            <CirclePlusFilled />
          </el-icon>
          <el-icon
            class="ml-2 cursor-pointer color-[var(--el-color-danger)]"
            style="vertical-align: -0.15em"
            @click="formData.params.splice(formData.params.indexOf(item), 1)"
          >
            <DeleteFilled />
          </el-icon>
        </div>
      </div>
    </el-form-item> -->

    <el-form-item v-if="formData.type !== MenuTypeEnum.BUTTON" prop="hide" label="显示状态">
      <el-radio-group v-model="formData.hide">
        <el-radio :value="1">显示</el-radio>
        <el-radio :value="0">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="排序" prop="sortNumber">
      <el-input-number v-model="formData.sortNumber" style="width: 100%;" controls-position="right" :min="0" />
    </el-form-item>

    <el-form-item v-if="formData.type == MenuTypeEnum.BUTTON" label="权限标识" prop="authority">
      <el-input v-model="formData.authority" placeholder="sys:user:add" />
    </el-form-item>

    <el-form-item v-if="formData.type !== MenuTypeEnum.BUTTON" label="图标" prop="icon">
      <icon-select v-model="formData.icon" />
    </el-form-item>
<!-- 
    <el-form-item v-if="formData.type == MenuTypeEnum.CATALOG" label="跳转路由">
      <el-input v-model="formData.redirect" placeholder="跳转路由" />
    </el-form-item> -->
  </el-form>
  <div class="dialog-footer" style="margin-top:12px; text-align: right">
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    <el-button @click="handleCancel">取 消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import type { FormInstance } from "element-plus";
import MenuAPI from "../apis/menu.api";
import { MenuPageService } from "../scripts/menu.page";
import MENU_ACTION from "../actions/menu.action";
import AppAPI from "../../app/apis/app.api";
import { MenuTypeEnum } from "@root/base/enums/system/menu-enum";

// 备份初始加载的菜单列表，切换应用时从备份中过滤以更新 menuOptions（避免重复请求）
const initialMenuList = ref<any[]>([]);
function handleAppChange(appId?: string) {
  try {
    const all = initialMenuList.value || [];
    const filtered = appId ? all.filter((m: any) => m.appId === appId) : all;
    // build tree then remove self when editing
    let tree = MENU_ACTION.getMenuSelectTree(filtered || []);
    const selfId = formData.value?.id || "";
    if (selfId) {
      const filterOutSelf = (nodes: any[] = []) => {
        return nodes.reduce((acc: any[], n: any) => {
          if (n.value === selfId) return acc;
          const children = filterOutSelf(n.children || []);
          acc.push({ ...n, children });
          return acc;
        }, [] as any[]);
      };
      tree = filterOutSelf(tree || []);
    }
    menuOptions.value = tree;
  } catch (e) {
    // ignore
  }
}

const internalFormRef = ref<FormInstance | null>(null);
// 直接使用 MenuPageService 中的 formData，避免在父子间重复绑定
const formData = MenuPageService.formData;
const emit = defineEmits(["success", "cancel",'menu-type-change'] as const);

defineExpose({
  validate: (cb: any) => internalFormRef.value?.validate(cb),
  resetFields: () => internalFormRef.value?.resetFields?.(),
  clearValidate: () => internalFormRef.value?.clearValidate?.(),
});

// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);
//应用选择下拉框
const appOptions = ref<OptionType[]>([]);

// 表单验证规则
const rules = reactive({
    appId: [{ required: true, message: "请选择所属应用", trigger: "blur" }],
    title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
    routeName: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
    path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
    component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
    hide: [{ required: true, message: "请选择显示状态", trigger: "change" }],
    sortNumber: [{ required: true, message: "请输入排序值", trigger: "blur" }],
    icon: [{ required: true, message: "请选择菜单图标", trigger: "blur" }],
});


onMounted(() => {
  //主动加载所有菜单 用query接口，并备份原始列表
  MenuAPI.query({}).then((response) => {
    const list = response.list || [];
    initialMenuList.value = list;
    //构造树形下拉数据（初始全部）
    menuOptions.value = MENU_ACTION.getMenuSelectTree(list);
    // 如果当前为编辑状态且已经有 appId，则按该 app 过滤父级菜单选项（在数据已加载后执行）
    if (formData.value && formData.value.appId) {
      handleAppChange(formData.value.appId);
    }
  });
  //加载应用列表
  AppAPI.query({}).then((response) => {
    appOptions.value = (response.list || []).map((app) => ({
      label: app.appName,
      value: app.appId,
    }));
  });
 });

// 将组件内部的 form ref 暴露给 MenuPageService，以便 MenuPageService.handleSubmit 能直接 validate
onMounted(() => {
  MenuPageService.menuFormRef = internalFormRef;
});

onUnmounted(() => {
  // 清理绑定
  MenuPageService.menuFormRef = ref(null);
});

// 提交表单并保存（通过 MenuPageService 代理 API）
async function handleSubmit() {
  // 委托给 MenuPageService 处理（它会使用 menuFormRef 和 formData）
  await MenuPageService.handleSubmit();
}

function handleCancel() {
  emit("cancel");
}





</script>