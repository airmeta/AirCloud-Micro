<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
    <el-form-item label="标签" prop="label">
      <el-input v-model="form.label" maxlength="128" placeholder="字典类型" show-word-limit />
    </el-form-item>
    <el-form-item label="编码" prop="code">
      <el-input v-model="form.code" maxlength="64" placeholder="DICT_TYPE" show-word-limit />
    </el-form-item>
    <el-form-item label="值" prop="value">
      <el-input v-model="form.value" maxlength="256" placeholder="001" show-word-limit />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model="form.description" maxlength="512" placeholder="描述" show-word-limit />
    </el-form-item>

    <el-form-item label="扩展" prop="meta">
      <el-input type="textarea" v-model="form.meta" placeholder="扩展信息(JSON/字符串/链接)" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { DictForm } from '../dtos/dict.dto';

const props = defineProps<{ model?: DictForm }>();
const formRef = ref();

const form = reactive<DictForm>({
  id: props.model?.id || '',
  parentId: props.model?.parentId || '',
  code: props.model?.code || '',
  label: props.model?.label || '',
  value: props.model?.value || '',
  description: props.model?.description || '',
  meta: props.model?.meta || ''
});

watch(() => props.model, (v) => {
  if (v) {
    Object.assign(form, v as any);
  }
});

const rules = {
  code: [
    { required: true, message: '编码不能为空', trigger: 'blur' },
    { max: 64, message: '编码长度不能超过64', trigger: 'blur' }
  ],
  label: [
    { required: true, message: '标签不能为空', trigger: 'blur' },
    { max: 128, message: '标签长度不能超过128', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '值不能为空', trigger: 'blur' },
    { max: 256, message: '值长度不能超过256', trigger: 'blur' }
  ],
  description: [
    { max: 512, message: '描述长度不能超过512', trigger: 'blur' }
  ]
};

function validate() {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) resolve(true);
      else reject(false);
    });
  });
}

function getValues() {
  return { ...form } as DictForm;
}

defineExpose({ validate, getValues });
</script>
