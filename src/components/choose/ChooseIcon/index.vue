<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 18:17:38
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 13:35:31
-->
<script>
export default {
  name: 'ChooseIcon'
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { modelValue } = toRefs(props),
  emit = defineEmits(['update:modelValue', 'choose']);

const visible = ref(modelValue.value);
watch(modelValue, (newVal) => {
  visible.value = newVal;
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

function doChoose(iconName) {
  emit('choose', iconName);
}
</script>

<template>
  <MyDialog v-model="visible" width="50%" title="选择图标">
    <IconList @select="doChoose" />
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>
