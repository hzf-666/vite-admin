<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 19:30:35
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 19:36:37
-->
<script>
export default {
  name: 'IconList'
};
</script>

<script setup>
const emit = defineEmits(['select']);

const elementPlusIcons = computed(() => $store.get('icons/elementPlus')),
  alibabaIcons = computed(() => $store.get('icons/alibaba'));

function doSelect(iconName) {
  emit('select', iconName);
}
</script>

<template>
  <div class="subtitle is_first">阿里巴巴图标库</div>
  <div class="icons_wrap">
    <div v-for="(iconName, i) in alibabaIcons" :key="i" class="icon_item" @click="doSelect(iconName)">
      <el-icon :size="24">
        <component :is="iconName" />
      </el-icon>
    </div>
  </div>

  <div class="subtitle">Element Plus</div>
  <div class="icons_wrap">
    <div v-for="(iconName, i) in elementPlusIcons" :key="i" class="icon_item" @click="doSelect(iconName)">
      <el-icon :size="24">
        <component :is="iconName" />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icons_wrap {
  $size: 50px;

  display: grid;
  grid-template-columns: repeat(auto-fill, $size);
  grid-auto-rows: $size;
  gap: 3px;
  justify-content: center;

  .icon_item {
    width: 100%;
    height: 100%;
    cursor: pointer;

    :deep(.el-icon) {
      width: 100%;
      height: 100%;
      border: $border;
      border-radius: 4px;
    }
  }
}
</style>
