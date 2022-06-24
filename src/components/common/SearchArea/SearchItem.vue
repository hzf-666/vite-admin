<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 11:21:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-06 11:22:22
-->
<script>
export default {
  name: 'SearchItem'
};
</script>

<script setup>

</script>

<template>
  <div class="search_item">
    <span v-if="$attrs.label">{{ $attrs.label }}：</span>
    <slot />
  </div>
</template>

<style lang="scss" scoped>

</style>
