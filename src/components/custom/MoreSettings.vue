<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-30 17:30:27
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-30 19:12:03
-->
<script>
export default {
  name: 'MoreSettings'
};
</script>

<script setup>
import { setTitle } from '@/router/interceptor.js';
import colors from '@u/colors.js';

const dev = import.meta.env.DEV,
  currentRoute = useRoute(),
  showDrawer = ref(false),
  appName = ref($store.get('settings/appName')),
  themeColor = ref(null),
  predefineList = ['#626aef'],
  isDev = ref($store.get('settings/skipLogin')),
  isAuth = ref($store.get('settings/dynamicAuth')),
  isLogo = ref($store.get('layout/leftSideLogo'));

function changeAppName(e) {
  $store.commit('settings/setAppName', e);
  setTitle(currentRoute);
}
function changeThemeColor(e) {
  if (e) {
    $store.commit('layout/setColor', { type: 'Primary', value: e });
    colors();
  }
}
</script>

<template>
  <template v-if="dev">
    <el-icon
      :size="20"
      class="more_settings"
      v-bind="$attrs"
      @click="showDrawer = true"
    >
      <IconMore />
    </el-icon>
    <el-drawer
      v-model="showDrawer"
      title="更多配置"
      modal-class="more_settings_drawer"
      :size="325"
      direction="rtl"
      :show-close="false"
    >
      <div class="setting_item">
        <span class="f_00a" style="margin-right: 20px;">项目名称</span>
        <el-input
          v-model="appName"
          class="f_11a"
          placeholder="请输入项目名称"
          @change="changeAppName"
        />
      </div>
      <div class="setting_item">
        <span>主题色</span>
        <el-color-picker v-model="themeColor" :predefine="predefineList" @change="changeThemeColor" />
      </div>
      <div class="setting_item">
        <span>开发模式</span>
        <el-switch v-model="isDev" @change="e => $store.commit('settings/setSkipLogin', e)" />
      </div>
      <div class="setting_item">
        <span>菜单栏Logo</span>
        <el-switch v-model="isLogo" @change="e => $store.commit('layout/setLeftSideLogo', e)" />
      </div>
      <div class="setting_item">
        <span>动态权限</span>
        <el-switch v-model="isAuth" @change="e => $store.commit('settings/setDynamicAuth', e)" />
      </div>
    </el-drawer>
  </template>
</template>


<style lang="scss">
.more_settings_drawer {
  user-select: none;

  .el-drawer__header {
    margin-bottom: 0;
    font-weight: bold;
    color: $textColorPrimary;
    letter-spacing: 1px;
  }

  .el-drawer__body {
    padding-top: 12px;
  }
}
</style>

<style lang="scss" scoped>
.more_settings {
  cursor: pointer;
}

.setting_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  color: $textColorRegular;
}
</style>
