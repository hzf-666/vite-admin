<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-04-29 19:27:56
-->
<script>
export default {
  name: 'Login'
};
</script>

<script setup>
const tEditor = ref(null), aaa = ref(''), bbb = () => {
  tEditor.value.setContent('阿瓦打我打安慰安慰');
  tEditor.value.focus();
  console.log(aaa.value);
};
</script>

<template>
  <div @click="$router.push({name: 'Home'})">登录</div>
  <button @click="bbb">test</button>
  <TEditor ref="tEditor" v-model="aaa" e-id="tinymce" />
</template>

<style lang="scss" scoped>

</style>
