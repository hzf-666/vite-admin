<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-06 18:04:19
-->
<script>
export default {
  name: 'Home'
};
</script>

<script setup>
import { removeRoutes } from '@/router/routes';
const aaa = () => {
  removeRoutes();
  console.log($router.getRoutes());
};
</script>

<template>
  <div>首页</div>
  <button @click="aaa">添加路由</button>
</template>

<style lang="scss" scoped>

</style>
