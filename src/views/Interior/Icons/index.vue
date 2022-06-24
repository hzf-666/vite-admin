<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-28 17:26:40
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 11:57:29
-->
<script>
export default {
  name: 'Icons'
};
</script>

<script setup>
function copyIconName(name) {
  const copyInput = document.getElementById('copyInput');
  if (copyInput) {
    copyInput.value = name;
    copyInput.select();
  } else {
    const input = document.createElement('input');
    input.setAttribute('id', 'copyInput');
    input.style.position = 'fixed';
    input.style.zIndex = -9999;
    document.body.appendChild(input);
    input.value = name;
    input.select();
  }
  document.execCommand('Copy');
  $message({
    type: 'success',
    message: `已复制  ${ name }`,
    showClose: true,
  });
}
$useActivated(once => {
  if (once) {
    //
  }
});
</script>

<template>
  <SubPage scroll>
    <IconList @select="copyIconName" />
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
