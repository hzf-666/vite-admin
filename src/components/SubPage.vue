<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-01 12:03:36
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-16 09:04:50
-->
<script>
export default {
  name: 'SubPage'
};
</script>

<script setup>
const props = defineProps({
    full: {
      type: Boolean,
      default: () => (false),
    },
    header: {
      type: Boolean,
      default: () => (true),
    },
    scroll: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { full, header, scroll } = toRefs(props);

const currentRoute = useRoute(),
  title = currentRoute.meta.title,
  pageMainScrollRef = ref(null),
  paddingLeft = ref(0),
  paddingRight = ref(0),
  mainScrollRefBounding = useElementBounding(pageMainScrollRef);

provide('pageMainScroll', pageMainScrollRef);

setTimeout(() => {
  const el = pageMainScrollRef.value.$el,
    pLeft = $getStyle(el, 'padding-left', null),
    pRight = $getStyle(el, 'padding-right', null);
  pLeft && (paddingLeft.value = pLeft);
  pRight && (paddingRight.value = pRight);
});
let timer = null;
watch(mainScrollRefBounding.height, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    pageMainScrollRef.value && pageMainScrollRef.value.update();
  }, 50);
});
watch(currentRoute, (newRoute) => {
  setTimeout(() => {
    const scrollObj = $store.get('scrollbar/pageMain')[newRoute.name];
    if (pageMainScrollRef.value) {
      pageMainScrollRef.value.setScrollTop(1);
      pageMainScrollRef.value.setScrollLeft(1);
      pageMainScrollRef.value.setScrollTop(scrollObj ? scrollObj.scrollTop || 0 : 0);
      pageMainScrollRef.value.setScrollLeft(scrollObj ? scrollObj.scrollLeft || 0 : 0);
    }
  });
}, {
  immediate: true,
});
function onScroll(e) {
  $store.commit('scrollbar/addScroll', { key: currentRoute.name, value: e, type: 'pageMain' });
}
</script>

<template>
  <div class="page_wrap" :class="{has_bg: !full}">
    <div class="page_content s_box">
      <div v-if="header" class="page_header f_00a d_f jc_sb ai_c">
        <div class="page_header_title f_00a">
          <slot name="header-title" :title="title">{{ title }}</slot>
        </div>
        <div class="page_header_operation f_00a">
          <slot name="header-operation" />
        </div>
      </div>
      <el-scrollbar
        ref="pageMainScrollRef"
        class="page_main s_area"
        v-bind="$attrs"
        view-style="height: 100%;"
        @scroll="onScroll"
      >
        <slot v-if="scroll" />
        <div v-else class="s_main s_box">
          <slot />
        </div>
      </el-scrollbar>
    </div>
  </div>
  <template v-if="true" />
</template>

<style lang="scss" scoped>
.page_wrap {
  width: 100%;
  height: 100%;

  .page_content {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .page_header {
      min-height: 43px;
      padding-right: v-bind(paddingRight);
      padding-left: v-bind(paddingLeft);
      border-bottom: $border;

      .page_header_title {
        font-size: $fontSizeMedium;
        font-weight: bold;
        color: $textColorPrimary;
        letter-spacing: 2px;
      }

      .page_header_operation {
        > * {
          &:first-child {
            margin-left: v-bind(paddingRight);
          }

          + * {
            margin-left: 15px;
          }
        }
      }
    }

    .page_main {
      $padding: 20px;

      padding: math.div($padding, 2) $padding $padding;

      .s_main.s_box {
        :deep(> .s_area) {
          overflow: visible;
        }

        > :not(.s_area) {
          flex: 0 0 auto;
        }
      }

      :deep(> .el-scrollbar__bar) {
        &.is-horizontal {
          .el-scrollbar__thumb {
            margin-left: v-bind(paddingLeft);
          }
        }
      }
    }
  }

  &.has_bg {
    padding: 10px 15px 15px;
    background-color: #f4f4f4;

    .page_content {
      border-radius: 8px;
    }
  }
}
</style>
