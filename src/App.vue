<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-12 16:35:10
-->
<script>
export default {
  name: 'App'
};
</script>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import colors from '@u/colors.js';

const locale = zhCn, size = 'default', zIndex = 3000;

colors();

function doPreventDefault(e) { // 阻止 tab 默认事件。阻止 enter 默认事件，以解决 form 表单在只有一项的时候自动提交并刷新浏览器
  if (e.keyCode == 9 || (e.keyCode == 13 && e.target.tagName.toLowerCase() === 'input')) {
    e.preventDefault();
    e.returnValue = false;
    return false;
  }
}
window.addEventListener('keydown', doPreventDefault);
onBeforeUnmount(() => {
  window.removeEventListener('keydown', doPreventDefault);
});
</script>

<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <router-view />
  </el-config-provider>
</template>

<style lang="scss" scoped>

</style>
