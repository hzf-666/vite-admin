<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-26 13:40:03
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-16 20:06:59
-->
<script>
export default {
  name: 'InfiniteScroll'
};
</script>

<script setup>
const props = defineProps({
    immediate: {
      type: Boolean,
      default: () => (true),
    },
    hasMore: {
      type: Boolean,
      default: () => (false),
    },
    distance: {
      type: Number,
      default: () => (0),
    },
    delay: {
      type: Number,
      default: () => (200),
    },
    load: {
      type: Function,
      default: null,
    },
    loadingText: {
      type: String,
      default: () => ('加载中...'),
    },
    emptyText: {
      type: String,
      default: () => ('没有更多'),
    },
  }),
  { immediate, hasMore, distance, delay, load, loadingText, emptyText } = toRefs(props);

const loading = ref(false), scrollbar = ref(null), content = ref(null);
async function onLoad() {
  if (hasMore.value && load.value) {
    loading.value = true;
    await load.value();
    loading.value = false;
  }
}
function update() {
  setTimeout(async() => {
    const height = scrollbar.value.$el.clientHeight,
      scrollHeight = content.value.clientHeight;

    if (hasMore.value && scrollHeight <= height) {
      await onLoad();
      update();
    }
  });
}
if (immediate.value) {
  update();
}
let timer = null;
function doScroll({ scrollTop }) {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const height = scrollbar.value.$el.clientHeight,
      scrollHeight = content.value.clientHeight;
    if (scrollHeight - height - scrollTop <= distance.value) {
      if (loading.value || !hasMore.value) {
        timer && clearTimeout(timer);
        return;
      }
      onLoad();
    }
  }, delay.value);
}

const $refs = reactive({});
setTimeout(() => {
  $refs.scrollbar = scrollbar.value;
});

defineExpose({
  update,
  $refs,
});
</script>

<template>
  <el-scrollbar ref="scrollbar" v-bind="$attrs" @scroll="doScroll">
    <div ref="content">
      <slot />
      <slot v-if="!loading && !hasMore" name="empty">
        <div class="bottom_text">{{ emptyText }}</div>
      </slot>
    </div>
  </el-scrollbar>
  <slot v-if="loading" name="loading">
    <div class="bottom_text">{{ loadingText }}</div>
  </slot>
</template>

<style lang="scss" scoped>
.bottom_text {
  padding: 10px;
  color: $textColorSecondary;
  text-align: center;
}
</style>
