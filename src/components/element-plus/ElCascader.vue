<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-14 10:08:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 11:34:35
-->
<script>
import { ElCascader } from 'element-plus';

export default {
  name: 'ElCascader',
  components: {
    Cascader: ElCascader,
  },
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: [String, Number, Date, Array],
      default: () => (null),
    },
    custom: {
      type: Boolean,
      default: () => (false),
    },
    onChange: {
      type: Function,
      default: () => {},
    },
  }),
  { modelValue, custom, onChange } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const cascader = ref(null), realCascader = ref(null), value = ref(modelValue.value), isValueChange = ref(false);
function doChange(val) {
  isValueChange.value = true;
  emit('update:modelValue', val);
  const el = cascader.value, realEl = realCascader.value;
  el && el.focus();
  realEl && realEl.togglePopperVisible(false);
  onChange.value(val);
}
watch(modelValue, (newVal) => {
  if (isValueChange.value) {
    isValueChange.value = false;
    return;
  }
  value.value = newVal;
});
function getCheckedNodes(...args) {
  return realCascader.value.getCheckedNodes(...args);
}

const $refs = reactive({});
setTimeout(() => {
  $refs.cascader = realCascader.value;
});

defineExpose({
  getCheckedNodes,
  $refs,
});
</script>

<template>
  <div
    ref="cascader"
    class="cascader_wrap"
    tabindex="-1"
  >
    <Cascader
      ref="realCascader"
      v-model="value"
      v-bind="$attrs"
      @change="doChange"
    >
      <template v-if="custom" #default="scope">
        <slot v-bind="scope" />
      </template>
      <template #empty>
        <slot name="empty" />
      </template>
    </Cascader>
  </div>
  <template v-if="true" />
</template>

<style lang="scss" scoped>
.cascader_wrap {
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
