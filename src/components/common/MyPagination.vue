<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-07 15:48:43
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 14:29:04
-->
<script>
export default {
  name: 'MyPagination'
};
</script>

<script setup>
const props = defineProps({
    placement: {
      type: String,
      default: () => ('center'),
    },
    currentPage: {
      type: Number,
      default: () => (1),
    },
    pageSize: {
      type: Number,
      default: () => (5),
    },
    total: {
      type: Number,
      default: () => (0),
    },
  }),
  { placement, currentPage, pageSize, total } = toRefs(props),
  emit = defineEmits(['update:currentPage', 'update:pageSize', 'change']);

const _currentPage = ref(currentPage.value), _pageSize = ref(pageSize.value);
watch(currentPage, (newVal) => {
  if (newVal !== _currentPage.value) {
    _currentPage.value = newVal;
  }
});
watch(pageSize, (newVal) => {
  if (newVal !== _pageSize.value) {
    _pageSize.value = newVal;
  }
});
function handleCurrentChange(val) {
  emit('update:currentPage', val);
  emit('change', 'index');
}
function handleSizeChange(val) {
  emit('update:pageSize', val);
  emit('change', 'size');
}
</script>

<template>
  <el-pagination
    v-model:current-page="_currentPage"
    v-model:page-size="_pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[5, 10, 15, 20]"
    :total="total"
    :hide-on-single-page="total == 0"
    background
    :style="{
      'padding-top': '12px',
      'justify-content': placement,
    }"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<style lang="scss" scoped>

</style>
