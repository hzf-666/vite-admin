<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 15:45:53
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-20 17:20:55
-->
<script>
export default {
  name: 'AutoWidth'
};
</script>

<script setup>
const emit = defineEmits(['complete']);

const slotRef = ref(null);
setTimeout(() => {
  emit('complete', slotRef.value.scrollWidth);
}, 80);
</script>

<template>
  <div ref="slotRef" style="display: inline-block; white-space: nowrap;">
    <slot />
  </div>
</template>

<style lang="scss" scoped>

</style>
