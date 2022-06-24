<script>
export default {
  name: 'SearchArea'
};
</script>

<script setup>
</script>

<template>
  <div class="search_area">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.search_area {
  padding: 0 0 4px;

  :deep(.search_row) {
    display: flex;
    flex-wrap: wrap;

    .search_item,
    .search_operation {
      min-height: 32px;
      margin-bottom: 8px;
    }

    .search_item {
      display: flex;
      align-items: center;
      margin-right: 18px;

      > * {
        flex: 0 0 auto;

        &.el-input {
          width: 250px;
        }

        &.el-button {
          margin-left: 10px;
        }
      }
    }

    .search_operation {
      display: flex;
      align-items: center;
      align-self: flex-end;
      margin-left: auto;
    }
  }
}
</style>
