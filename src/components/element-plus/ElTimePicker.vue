<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-14 10:08:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-20 15:37:08
-->
<script>
import { ElTimePicker } from 'element-plus';

export default {
  name: 'ElTimePicker',
  components: {
    DatePicker: ElTimePicker,
  },
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: [String, Date, Array],
      default: () => (null),
    },
  }),
  { modelValue } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const datePicker = ref(null), value = ref(modelValue.value), isValueChange = ref(false);
function doChange() {
  const el = datePicker.value;
  el && el.focus();
}
watch(modelValue, (newVal) => {
  if (isValueChange.value) {
    isValueChange.value = false;
    return;
  }
  value.value = newVal;
});
watch(value, (newVal) => {
  isValueChange.value = true;
  emit('update:modelValue', newVal);
});
</script>

<template>
  <div
    ref="datePicker"
    class="date_editor_wrap"
    tabindex="-1"
  >
    <DatePicker v-model="value" v-bind="$attrs" @change="doChange" v-on="$attrs" />
  </div>
</template>

<style lang="scss" scoped>
.date_editor_wrap {
  display: inline-block;

  &:focus {
    outline: none;

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
    }
  }
}
</style>
