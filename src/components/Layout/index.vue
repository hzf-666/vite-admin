<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-06 10:49:39
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-18 17:44:24
-->
<script>
export default {
  name: 'Layout'
};
</script>

<script setup>
import logoImg from '@a/images/logo.png';
import { exitFullscreen, judgeFullScreen } from '@u';

const currentRoute = useRoute(),
  appName = computed(() => $store.get('settings/appName')),
  isFold = computed(() => $store.get('layout/leftSideFold')),
  isLogo = computed(() => $store.get('layout/leftSideLogo')),
  areaMax = computed(() => $store.get('layout/areaMax')),
  layoutRef = ref(null),
  layoutRefBounding = useElementBounding(layoutRef),
  topTool = ref(null),
  rightContentRef = ref(null),
  rightContentRefBounding = useElementBounding(rightContentRef),
  mainScrollRef = ref(null),
  isMobilePhone = ref(false),
  logoError = ref(false),
  includeKeepAlive = computed(() => {
    const arr = [];
    $store.get('layout/affixTags').concat($store.get('layout/scrollTags')).map(item => {
      const name = item.meta.realName || item.name;
      if (!arr.includes(name)) arr.push(name);
    });
    return arr;
  }),
  excludeKeepAlive = computed(() => $store.get('layout/excludeKeepAlive')),
  loadingCount = computed(() => $store.get('layout/loadingCount')),
  svg = `
    <path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path>
  `;

provide('mainScroll', mainScrollRef);
function setFold(val) {
  $store.commit('layout/toggleLeftSideFold', val);
}
watch(layoutRefBounding.width, (newWidth, oldWidth) => {
  if (!oldWidth) return;
  isMobilePhone.value = newWidth <= 540;
  if (newWidth > oldWidth) {
    if (newWidth > $store.get('settings/maxMobileWidth')) {
      setFold(false);
    }
  } else {
    if (newWidth <= $store.get('settings/maxMobileWidth')) {
      setFold(true);
    }
  }
});
watch(layoutRefBounding.height, (newHeight) => {
  topTool.value && topTool.value.setFullScreen(judgeFullScreen());
});
watch(rightContentRefBounding.height, (newHeight) => {
  if (newHeight < document.body.clientHeight) {
    $store.set('layout/areaMax', false);
  }
});
watch(currentRoute, (newRoute) => {
  if (newRoute.name) {
    const targetIndex = excludeKeepAlive.value.findIndex(name => name === (newRoute.meta.realName || newRoute.name));
    if (targetIndex != -1) $store.commit('layout/removeExcludeKeepAlive', targetIndex);
    if (newRoute.name === 'Layout') {
      const route = newRoute.params.route;
      $router.replace(route ? JSON.parse(route) : '/');
    }
  }
  setTimeout(() => {
    const scrollObj = $store.get('scrollbar/main')[newRoute.name];
    if (mainScrollRef.value) {
      mainScrollRef.value.setScrollTop(1);
      mainScrollRef.value.setScrollLeft(1);
      mainScrollRef.value.setScrollTop(scrollObj ? scrollObj.scrollTop || 0 : 0);
      mainScrollRef.value.setScrollLeft(scrollObj ? scrollObj.scrollLeft || 0 : 0);
    }
  });
}, {
  immediate: true,
});
function reloadRoute(route) {
  $store.commit('layout/pushExcludeKeepAlive', [route.meta.realName || route.name]);
  if (route.name === currentRoute.name) {
    $router.replace({ name: 'Layout', params: { route: JSON.stringify(route) }});
  } else {
    $router.push(route);
  }
}
function onScroll(e) {
  $store.commit('scrollbar/addScroll', { key: currentRoute.name, value: e, type: 'main' });
}
</script>

<template>
  <div
    id="layout"
    ref="layoutRef"
    v-loading="loadingCount > 0"
    :class="{is_mobile_phone: isMobilePhone}"
    element-loading-custom-class="layout_loading_wrap"
    element-loading-text="请求数据中，请稍等..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="0, 0, 1024, 1024"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div id="leftSide" class="s_box" :class="{is_fold: isFold, logo_error: logoError}">
      <div v-if="isLogo" class="side_logo f_00a d_f fw_w jc_c">
        <el-image
          :src="logoImg"
          fit="contain"
          class="logo_img"
          @error="logoError = true"
        >
          <template #error>
            <div />
          </template>
        </el-image>
        <div v-if="appName" class="app_name animate__animated animate__flipInX">{{ appName }}</div>
      </div>
      <el-scrollbar class="s_area">
        <SideMenu />
      </el-scrollbar>
    </div>
    <div id="rightMain" class="s_box" :class="{side_fold: isFold}">
      <div v-show="isMobilePhone && !isFold" class="mask" @click="$store.commit('layout/toggleLeftSideFold', true)" />
      <div id="rightTop" class="f_00a">
        <TopNav @reload="reloadRoute" />
        <MyPick style="border-bottom: 0;" placement="right-bottom" icon-margin-bottom="7px">
          <TopTool ref="topTool" />
          <template #down>
            <TopTag @reload="reloadRoute" />
          </template>
        </MyPick>
      </div>
      <div id="rightContent" ref="rightContentRef" class="s_area">
        <el-icon v-if="areaMax" :size="16" class="exit_max" @click="exitFullscreen()">
          <IconEpCloseBold />
        </el-icon>
        <el-scrollbar
          ref="mainScrollRef"
          class="main_scrollbar"
          height="100%"
          view-style="height: 100%;"
          @scroll="onScroll"
        >
          <router-view v-slot="{Component}">
            <!-- <transition
              class="animate__animated"
              mode="out-in"
              :duration="300"
              enter-active-class="animate__slideInLeft"
              leave-active-class="animate__slideOutRight"
            > -->
            <keep-alive :include="includeKeepAlive" :exclude="excludeKeepAlive">
              <component :is="Component" />
            </keep-alive>
            <!-- </transition> -->
          </router-view>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>

<style lang="scss" scoped>
:deep(.layout_loading_wrap) {
  z-index: 9000;

  .el-loading-spinner {
    svg,
    .el-loading-text {
      color: #fff;
    }

    svg {
      width: 40px;
      height: 40px;
    }

    .el-loading-text {
      margin-top: 10px;
      font-size: $fontSizeMedium;
      letter-spacing: 1px;
    }
  }
}

#layout {
  $duration: 0.3s;

  height: 100%;
  overflow: hidden;

  #leftSide,
  #rightMain {
    display: inline-flex !important;
    vertical-align: top;
    transition: width $duration;
  }

  #leftSide {
    width: $lefSideWidth;
    background-color: $colorPrimary;
    border-right: 1px solid $colorPrimaryLight3;

    .side_logo {
      padding: 10px;

      .logo_img {
        width: 35%;
        transition: all $duration;

        + .app_name {
          margin-top: 5px;
        }
      }

      .app_name {
        width: 100%;
        margin-bottom: 5px;
        font-size: $fontSizeMedium;
        font-weight: bold;
        line-height: 22px;
        color: #fff;
        text-align: center;
        letter-spacing: 1px;
        word-break: break-all;
      }
    }

    &.is_fold {
      width: $lefSideFoldWidth;

      .logo_img {
        width: 100%;

        + .app_name {
          display: none;
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    }

    &.logo_error {
      .app_name {
        display: block !important;
        margin-top: 0 !important;
      }
    }
  }

  #rightMain {
    position: relative;
    width: calc(100% - $lefSideWidth);

    &.side_fold {
      width: calc(100% - $lefSideFoldWidth);
    }
  }

  &.is_mobile_phone {
    #leftSide.is_fold {
      width: 0;
      border: none;
    }

    #rightMain.side_fold {
      width: 100%;
    }
  }

  #rightTop {
    > * + * {
      border-bottom: $border;
    }
  }

  #rightContent {
    position: relative;
    overflow: hidden;
    background-color: #fff;

    .exit_max {
      $size: 38px;

      position: absolute;
      top: math.div(-$size, 4);
      right: math.div(-$size, 4);
      z-index: 20;
      width: $size;
      height: $size;
      color: #fff;
      cursor: pointer;
      background-color: rgb(0 0 0 / 30%);
      border-bottom-left-radius: #{$size * 0.75};

      > svg {
        position: relative;
        top: 1px;
        left: -1px;
      }
    }

    .main_scrollbar {
      $size: 13px;

      :deep(.el-scrollbar__bar) {
        &.is-horizontal {
          height: $size;

          &:hover,
          &:active {
            height: $size;
          }
        }
      }
    }
  }
}
</style>
