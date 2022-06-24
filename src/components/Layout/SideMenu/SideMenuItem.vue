<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-26 17:33:58
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 15:56:47
-->
<script>
export default {
  name: 'SideMenuItem'
};
</script>

<script setup>
import { findParentNode } from '@u';
import { handleExternalLink } from '@u/user.js';
import sassExport from '@/scss/export.module.scss';

const props = defineProps({
    data: {
      type: Array,
      default: () => ([]),
    },
    isFold: Boolean,
    level: {
      type: Number,
      default: () => (0),
    },
  }),
  { data, isFold, level } = toRefs(props);

const currentRoute = useRoute(), foldPadding = '8px', sideMenuLeft = Number(sassExport.sideMenuLeft.replace('px', '')),
  firstFold = computed(() => isFold.value && level.value == 1),
  fontSize = computed(() => `${ 15 - level.value }px`), iconSize = computed(() => 18 - level.value);
function isActive(route) {
  const matched = currentRoute.meta.matched;
  return matched && !!matched.find(item => item.name === route.name);
}
function subMenuDisabled(item) {
  if (!item.meta.isClassify && !item.meta.redirect) {
    return !currentRoute.meta.matched.find(m => m.name === item.name);
  }
  return false;
}
function toLink(redirect, name) {
  if ($regs.link.test(redirect)) {
    $open(handleExternalLink(redirect), name);
  } else {
    $router.push(redirect);
  }
}
function clickSubMenu(e, item) {
  const className = e.target.className;
  if (($typeOf(className) === 'string' && className.includes('el-sub-menu__title')) || findParentNode(e.target, '.el-sub-menu__title')) {
    if (!item.meta.isClassify) {
      const redirect = item.meta.redirect;
      if (redirect) {
        toLink(redirect, item.name);
      } else {
        if (item.name !== currentRoute.name) {
          $router.push(item);
        }
      }
    }
  }
}
function clickMenuItem(item) {
  $store.set('skipRepeatedRoute', true);
  const redirect = item.meta.redirect;
  if (redirect) {
    toLink(redirect, item.name);
  } else {
    $router.push({ name: item.name });
  }
}
</script>

<template>
  <template v-for="(item, i) in data" :key="i">
    <template v-if="item.meta && !item.meta.hidden">
      <el-sub-menu
        v-if="item.meta.type == 2"
        :index="item.name"
        class="side_sub_menu"
        popper-class="side_sub_menu_popper"
        :class="{
          clickable: subMenuDisabled(item),
          'is-active': isActive(item),
          first_fold: firstFold,
          is_first: level == 1,
          is_left: sideMenuLeft > 0,
        }"
        :disabled="subMenuDisabled(item)"
        @click="clickSubMenu($event, item)"
      >
        <template #title>
          <el-icon
            v-if="item.meta.icon"
            :size="firstFold ? 22 : iconSize"
            :style="{
              'margin': firstFold ? 'auto' : '0 8px 0 0',
            }"
          >
            <component :is="item.meta.icon" />
          </el-icon>
          <div v-if="isFold" class="text_els">{{ item.meta.title }}</div>
          <LineClamp v-else :content="item.meta.title" placement="right" />
        </template>
        <SideMenuItem :data="item.children" :is-fold="isFold" :level="level + 1" />
      </el-sub-menu>
      <el-menu-item
        v-if="item.meta.type == 3"
        :index="item.name"
        class="side_menu_item"
        :class="{
          'is-active': isActive(item),
          first_fold: firstFold,
          is_first: level == 1,
          is_left: sideMenuLeft > 0,
        }"
        @click="clickMenuItem(item)"
      >
        <el-tooltip
          v-if="firstFold"
          :content="item.meta.title"
          placement="right"
          :offset="Number(foldPadding.replace('px', '')) + 6"
          :show-arrow="false"
          effect="light"
          :popper-class="'side_menu_item_popper' + (isActive(item) ? ' is-active' : '')"
        >
          <div class="first_fold_item_wrap">
            <el-icon
              v-if="item.meta.icon"
              :size="22"
            >
              <component :is="item.meta.icon" />
            </el-icon>
            <div class="text_els" style="width: 100%;">{{ item.meta.title }}</div>
          </div>
        </el-tooltip>

        <template v-else>
          <el-icon
            v-if="item.meta.icon"
            :size="firstFold ? 22 : iconSize"
            :style="{
              'margin-right': '8px',
            }"
          >
            <component :is="item.meta.icon" />
          </el-icon>
          <LineClamp :content="item.meta.title" placement="right" />
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<style lang="scss">
.side_sub_menu_popper {
  overflow: hidden;
  user-select: none;
  background-color: $colorPrimaryLight3;
  border: none !important;

  .el-sub-menu {
    > .el-sub-menu__title {
      height: $sideMenuItemHeight;
      line-height: $sideMenuItemHeight;
    }

    .el-menu-item {
      height: $sideMenuItemHeight;
      line-height: $sideMenuItemHeight;
    }
  }

  .el-menu-item {
    height: $sideMenuItemHeight;
    line-height: $sideMenuItemHeight;
  }
}

.side_menu_item_popper {
  height: $sideMenuItemHeight;
  padding: 0 20px !important;
  line-height: $sideMenuItemHeight !important;
  color: rgb(255 255 255 / 50%);
  cursor: default;
  user-select: none;
  background: var(--el-bg-color-overlay);
  background-color: $colorPrimaryLight3 !important;
  border: none !important;
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  &.is-active {
    font-weight: bold;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$collapsePadding: 0 v-bind(foldPadding);

.side_sub_menu {
  :deep(> .el-sub-menu__title) {
    font-size: v-bind(fontSize);

    &:hover {
      background-color: $colorPrimaryLight5 !important;
    }
  }

  &.is-active {
    :deep(> .el-sub-menu__title) {
      font-weight: bold;
      color: var(--el-menu-active-color) !important;
    }
  }

  &.clickable.is-disabled {
    :deep(> .el-sub-menu__title) {
      cursor: pointer;
      opacity: 1;

      &:hover {
        background-color: var(--el-menu-hover-bg-color) !important;
      }
    }
  }

  &.first_fold {
    :deep(> .el-sub-menu__title) {
      padding: $collapsePadding !important;
      text-align: center;

      > .el-icon + .text_els {
        display: none;
      }
    }
  }

  &.is_first {
    margin-top: $sideMenuFirstGap;
    overflow: hidden;

    &:first-child {
      margin-top: 0;
    }

    &:not(.first_fold) {
      border-radius: math.div($sideMenuItemHeight, 2);

      :deep(> .el-sub-menu__title) {
        border-radius: math.div($sideMenuItemHeight, 2);
      }

      &.is_left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        :deep(> .el-sub-menu__title) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }

    :deep(> .el-sub-menu__title) {
      color: #fff !important;

      &:hover {
        color: $colorPrimary !important;
        background-color: #fff !important;
      }
    }

    &.is-active {
      :deep(> .el-sub-menu__title) {
        font-weight: bold;
        color: $colorPrimary !important;
        background-color: #fff !important;
      }
    }
  }

  &.is-opened {
    background-color: $colorPrimaryLight3;

    &.is_first:not(.is-active):not(:hover) {
      :deep(> .el-sub-menu__title) {
        background-color: $colorPrimaryLight5 !important;
      }

      &.first_fold {
        :deep(> .el-sub-menu__title) {
          color: $colorPrimary !important;
          background-color: #fff !important;
        }
      }
    }
  }
}

.side_menu_item {
  font-size: v-bind(fontSize);

  &:hover {
    background-color: $colorPrimaryLight5;
  }

  &.first_fold {
    padding: $collapsePadding !important;
    text-align: center;

    .first_fold_item_wrap {
      width: 100%;

      > .el-icon + .text_els {
        display: none;
      }
    }
  }

  &.is_first {
    margin-top: $sideMenuFirstGap;
    color: #fff !important;

    &:first-child {
      margin-top: 0;
    }

    &:not(.first_fold) {
      border-radius: math.div($sideMenuItemHeight, 2);

      &.is_left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    &:hover,
    &.is-active {
      color: $colorPrimary !important;
      background-color: #fff !important;
    }

    &.is-active {
      font-weight: bold;
    }
  }
}
</style>
