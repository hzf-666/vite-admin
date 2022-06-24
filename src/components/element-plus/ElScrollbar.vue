<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-26 14:05:16
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-16 17:28:19
-->
<script>
import { ElScrollbar } from 'element-plus';

export default {
  name: 'ElScrollbar',
  components: {
    Scrollbar: ElScrollbar,
  },
};
</script>

<script setup>
const props = defineProps({
    height: {
      type: [Number, String],
      default: () => ('100%'),
    },
    maxHeight: {
      type: [Number, String],
      default: () => (''),
    },
  }),
  { height, maxHeight } = toRefs(props);

const _height = ref(''), _maxHeight = ref(''), scrollbar = ref(null);
function handleValue(val) {
  if ($typeOf(val) === 'number') {
    return val + 'px';
  }
  return val;
}
watch(height, (newVal) => {
  _height.value = handleValue(newVal);
}, {
  immediate: true,
});
watch(maxHeight, (newVal) => {
  _maxHeight.value = handleValue(newVal);
}, {
  immediate: true,
});
function scrollTo(...args) {
  return scrollbar.value.scrollTo(...args);
}
function setScrollTop(...args) {
  return scrollbar.value.setScrollTop(...args);
}
function setScrollLeft(...args) {
  return scrollbar.value.setScrollLeft(...args);
}
function update(...args) {
  return scrollbar.value.update(...args);
}

const $refs = reactive({});
setTimeout(() => {
  $refs.scrollbar = scrollbar.value;
});

defineExpose({
  scrollTo, setScrollTop, setScrollLeft, update,
  $refs,
});
</script>

<template>
  <Scrollbar
    ref="scrollbar"
    class="my_scrollbar"
    :style="{
      'max-height': _maxHeight,
      'height': _maxHeight ? 'auto' : _height,
    }"
  >
    <slot />
  </Scrollbar>
</template>

<style lang="scss" scoped>
.my_scrollbar {
  :deep(> .el-scrollbar__wrap) {
    height: 100% !important;
    max-height: inherit !important;
  }
}
</style>
