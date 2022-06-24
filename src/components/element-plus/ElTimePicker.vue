<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-14 10:08:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 14:41:25
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
    onChange: {
      type: Function,
      default: () => {},
    },
  }),
  { modelValue, onChange } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const datePicker = ref(null), realDatePicker = ref(null), value = ref(modelValue.value), isValueChange = ref(false);
function doChange(val) {
  isValueChange.value = true;
  emit('update:modelValue', val);
  const el = datePicker.value;
  el && el.focus();
  onChange.value(val);
}
watch(modelValue, (newVal) => {
  if (isValueChange.value) {
    isValueChange.value = false;
    return;
  }
  value.value = newVal;
});
function focus(...args) {
  return realDatePicker.value.focus(...args);
}
function blur(...args) {
  return realDatePicker.value.blur(...args);
}

const $refs = reactive({});
setTimeout(() => {
  $refs.timePicker = realDatePicker.value;
});

defineExpose({
  focus, blur,
  $refs,
});
</script>

<template>
  <div
    ref="datePicker"
    class="date_editor_wrap"
    tabindex="-1"
  >
    <DatePicker
      ref="realDatePicker"
      v-model="value"
      v-bind="$attrs"
      @change="doChange"
    />
  </div>
  <template v-if="true" />
</template>

<style lang="scss" scoped>
.date_editor_wrap {
  display: inline-block;

  &:focus {
    outline: none;

    :deep(.el-input) {
      &:not(.is-disabled) .el-input__wrapper {
        box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
      }
    }
  }
}
</style>
