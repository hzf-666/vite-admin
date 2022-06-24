<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 17:42:01
-->
<script>
export default {
  name: 'App'
};
</script>

<script setup>
import * as signalR from '@microsoft/signalr';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import colors from '@u/colors.js';
import { verifyToken } from '@/api';

const locale = zhCn, size = 'default', zIndex = 3000;
colors();

function doPreventDefault(e) { // 阻止 keydown 默认事件
  if (e.keyCode == 9) { // tab 切换
    $preventDefault(e);
  }
}
window.addEventListener('keydown', doPreventDefault);
onBeforeUnmount(() => {
  window.removeEventListener('keydown', doPreventDefault);
});

const isSkip = computed(() => $store.get('settings/skipLogin')),
  token = computed(() => $store.get('token'));

watch(token, (newToken) => {
  if (newToken) {
    createSignalR(newToken);
  }
}, {
  immediate: true,
});

const notification = reactive({});
provide('notification', notification);
function createSignalR(token) { // 创建推送
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/msg', {
      accessTokenFactory: () => token.replace('bearer ', ''),
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.serverTimeoutInMilliseconds = 120000;
  connection.keepAliveIntervalInMilliseconds = 60000;

  function startConnection() {
    try {
      connection.start();
      console.log('连接成功');
    } catch (err) {
      console.log('连接失败' + err);
      setTimeout(() => startConnection(), 5000);
    }
  }

  startConnection();

  connection.on('notice', data => {
    console.log(data);
    notification.notice = data;
    if (!data.hidden) {
      $notify({
        ...data,
        position: 'bottom-right',
        duration: 5000,
      });
    }
  });
  connection.on('loginout', flag => {
    if (flag && !isSkip.value) {
      verifyToken();
    }
  });

  connection.onclose(() => startConnection());
}
</script>

<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <el-tooltip
      v-if="isSkip"
      placement="right"
      :offset="5"
      content="已跳过登录，没有登录账号"
    >
      <div class="skip_tips">
        <span>未</span>
      </div>
    </el-tooltip>
    <router-view v-slot="{ Component, route }">
      <MoreSettings
        v-if="!route.meta.type || (route.meta.type == 1 && !route.meta.isClassify && !route.meta.redirect)"
        :size="26"
        color="var(--el-color-primary)"
        class="app_more_settings"
      />
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<style lang="scss">
.app_more_settings {
  position: absolute !important;
  top: 5px;
  right: 5px;
  z-index: 9;
  padding: 3px;
  background-color: rgb(255 255 255 / 80%);
  border-radius: 4px;
}
</style>

<style lang="scss" scoped>
.skip_tips {
  position: absolute;
  top: -25px;
  left: -25px;
  z-index: 20;
  width: 50px;
  height: 50px;
  color: #fff;
  background-color: var(--el-overlay-color-light);
  transform: rotate(-45deg);

  > span {
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
