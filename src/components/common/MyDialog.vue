<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-15 09:56:38
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 14:14:59
-->
<script>
export default {
  name: 'MyDialog'
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
    affixProps: {
      type: Object,
      default: () => ({}),
    },
  }),
  { modelValue, affixProps } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const visible = ref(modelValue.value),
  myDialog = ref(null), autoAffixRef = ref(null);
watch(modelValue, (newVal) => {
  visible.value = newVal;
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

const $refs = reactive({});
setTimeout(() => {
  $refs.dialog = myDialog.value;
});
watch(autoAffixRef, (newRef) => {
  setTimeout(() => {
    for (const k in newRef.$refs) {
      if (!$refs[k]) $refs[k] = newRef.$refs[k];
    }
  });
});

defineExpose({
  $refs,
});
</script>

<template>
  <el-dialog
    ref="myDialog"
    v-model="visible"
    width="750px"
    top="10vh"
    :close-on-click-modal="false"
  >
    <AutoAffix ref="autoAffixRef" max-height="calc(80vh - 80px)" v-bind="affixProps" dialog>
      <template #up>
        <slot name="up" />
      </template>

      <slot />

      <template #down>
        <slot name="down" />
      </template>
    </AutoAffix>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>
