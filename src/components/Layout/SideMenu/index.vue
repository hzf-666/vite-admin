<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-26 17:24:17
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 15:45:43
-->
<script>
export default {
  name: 'SideMenu'
};
</script>

<script setup>
const isFold = computed(() => $store.get('layout/leftSideFold')),
  sideMenu = computed(() => $store.get('sideMenu')),
  sideMenuRef = ref(null),
  defaultActive = ref('');

const currentRoute = useRoute();
watch(currentRoute, (newRoute) => {
  defaultActive.value = newRoute.name;
}, {
  immediate: true,
});
</script>

<template>
  <el-menu
    ref="sideMenuRef"
    class="side_menu animate__animated animate__fadeIn"
    :collapse="isFold"
    :collapse-transition="false"
    :default-active="defaultActive"
    text-color="rgba(255, 255, 255, 0.5)"
    active-text-color="#fff"
    background-color="transparent"
    unique-opened
  >
    <SideMenuItem :data="sideMenu" :is-fold="isFold" :level="1" />
  </el-menu>
</template>

<style lang="scss" scoped>
.side_menu {
  $paddingRight: 45px;

  margin-left: $sideMenuLeft;
  user-select: none;
  border-right: none;

  :deep() {
    .el-sub-menu {
      .el-sub-menu__title {
        height: $sideMenuItemHeight;
        padding-right: $paddingRight;
        line-height: $sideMenuItemHeight;

        .el-sub-menu__icon-arrow {
          $iconSize: 21px;

          top: 50%;
          right: 12px;
          margin-top: 0;
          transform: translateY(-50%) rotate(-90deg);

          > svg {
            width: $iconSize;
            height: $iconSize;
          }
        }
      }

      &.is-opened {
        .el-sub-menu__title .el-sub-menu__icon-arrow {
          transform: translateY(-50%);
        }
      }

      .el-menu-item {
        height: $sideMenuItemHeight;
        line-height: $sideMenuItemHeight;
      }
    }

    .el-menu-item {
      height: $sideMenuItemHeight;
      padding-right: $paddingRight;
      line-height: $sideMenuItemHeight;
    }

    .el-icon {
      width: auto !important;
    }
  }

  &.el-menu--collapse {
    width: $lefSideFoldWidth;
    margin-left: 0;
  }
}
</style>
