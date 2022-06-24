<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 10:54:57
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-06 11:29:35
-->
<script>
export default {
  name: 'SearchRow'
};
</script>

<script setup>

</script>

<template>
  <div class="search_row">
    <slot />
    <div class="search_operation">
      <slot name="operation" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
