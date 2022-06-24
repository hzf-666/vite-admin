<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-31 10:37:06
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 11:36:17
-->
<script>
export default {
  name: 'TopTag'
};
</script>

<script setup>
const emit = defineEmits(['reload']);

const currentRoute = useRoute(),
  scrollbar = ref(null),
  moveX = ref(0),
  currentTag = ref(null),
  scrollTagIndex = ref(-1),
  affixTags = computed(() => $store.get('layout/affixTags')),
  scrollTags = computed(() => $store.get('layout/scrollTags')),
  scrollTagRefs = ref({}),
  contextmenuItems = ref([
    { name: '重新加载', icon: 'IconEpRefresh', disabled: false },
    { name: '关闭标签页', icon: 'IconEpClose', disabled: false },
    { name: '固定标签页', icon: 'IconAffix', disabled: false },
    { name: '最大化', icon: 'IconEpFullScreen', disabled: false },
    { name: '关闭其它标签页', icon: '', disabled: false },
    { name: '关闭左侧标签页', icon: '', disabled: false },
    { name: '关闭右侧标签页', icon: '', disabled: false },
  ]);
onBeforeUpdate(() => {
  scrollTagRefs.value = {};
});
function getClosable() {
  return !!(affixTags.value.length || (!affixTags.value.length && scrollTags.value.length > 1));
}
function doContextmenu(tag, i, affix = false) {
  currentTag.value = tag;
  contextmenuItems.value[4].disabled = true;
  contextmenuItems.value[5].disabled = true;
  contextmenuItems.value[6].disabled = true;
  if (!affix) {
    scrollTagIndex.value = i;
    const target = contextmenuItems.value.find(item => item.id == 3);
    if (tag.fixed) {
      contextmenuItems.value[1].disabled = true;
      contextmenuItems.value[2].name = '取消固定';
    } else {
      contextmenuItems.value[1].disabled = !getClosable();
      contextmenuItems.value[2].name = '固定标签页';
    }
    scrollTags.value.forEach((item, i) => {
      if (!item.fixed) {
        if (contextmenuItems.value[4].disabled && i != scrollTagIndex.value) {
          contextmenuItems.value[4].disabled = false;
        }
        if (contextmenuItems.value[5].disabled && i < scrollTagIndex.value) {
          contextmenuItems.value[5].disabled = false;
        }
        if (contextmenuItems.value[6].disabled && i > scrollTagIndex.value) {
          contextmenuItems.value[6].disabled = false;
        }
      }
    });
  } else {
    contextmenuItems.value[1].disabled = true;
    contextmenuItems.value[2].disabled = true;
  }
}
function closeTag(tag, i) {
  $store.commit('layout/removeScrollTag', { index: i, isPush: tag.name === currentRoute.name });
}
function clickContextmenuItem(item, i) {
  if (i == 0) {
    emit('reload', currentTag.value);
  }
  if (i == 1) {
    closeTag(currentTag.value, scrollTagIndex.value);
  }
  if (i == 2) {
    const obj = $store.commit('layout/getScrollTag', scrollTagIndex.value);
    obj.fixed = !obj.fixed;
    $store.commit('layout/setScrollTag', { index: scrollTagIndex.value, value: obj });
  }
  if (i == 3) {
    const name = currentTag.value.name;
    if (name !== currentRoute.name);
    $router.push(currentTag.value);
    $store.commit('layout/toggleAreaMax');
  }
  if (i == 4) {
    $store.commit('layout/closeScrollTag', { index: scrollTagIndex.value, type: 'other', isPush: currentTag.value.name !== currentRoute.name });
  }
  if (i == 5) {
    const currentIndex = scrollTags.value.findIndex(item => item.name === currentRoute.name);
    $store.commit('layout/closeScrollTag', { index: scrollTagIndex.value, type: 'left', isPush: currentIndex < scrollTagIndex.value });
  }
  if (i == 6) {
    const currentIndex = scrollTags.value.findIndex(item => item.name === currentRoute.name);
    $store.commit('layout/closeScrollTag', { index: scrollTagIndex.value, type: 'right', isPush: currentIndex > scrollTagIndex.value });
  }
}
watch(currentRoute, (newRoute) => {
  setTimeout(() => {
    const tagRef = scrollTagRefs.value[newRoute.name];
    if (tagRef) {
      const scrollWrap = scrollbar.value.$el.querySelector('.el-scrollbar__wrap'),
        scrollLeftMax = scrollWrap.scrollWidth - scrollWrap.clientWidth;
      if (scrollLeftMax) {
        const offsetLeft = tagRef.$el.offsetLeft,
          visualLeftMin = moveX.value, visualLeftMax = scrollWrap.clientWidth + moveX.value - tagRef.$el.clientWidth;
        if (!(offsetLeft >= visualLeftMin && offsetLeft <= visualLeftMax)) {
          scrollbar.value.setScrollLeft(offsetLeft < scrollLeftMax ? offsetLeft : scrollLeftMax);
        }
      }
    }
  });
}, {
  immediate: true,
});
function clickTag(tag) {
  $store.set('skipRepeatedRoute', true);
  $router.push(tag);
}
const startClientX = ref(0), startX = ref(0), startMoveX = ref(0), dragElIndex = ref(-1), dragToIndex = ref(-1), insertLast = ref(false);
function onDragstart(e, i) {
  dragElIndex.value = i;
  startClientX.value = e.clientX;
  startX.value = e.target.offsetLeft;
  startMoveX.value = moveX.value;
}
function onDrap(e) {
  const endX = startX.value + (e.clientX - startClientX.value) + (moveX.value - startMoveX.value);
  let arr = [];
  Object.values(scrollTagRefs.value).forEach(item => {
    if (item && item.$el) arr.push(item.$el.offsetLeft);
  });
  arr = arr.sort((a, b) => a - b);
  if (e.clientX) {
    let targetIndex = arr.findIndex(offsetLeft => offsetLeft > endX);
    if (targetIndex == -1) targetIndex = arr.length - 1;
    dragToIndex.value = targetIndex;
  } else {
    dragToIndex.value = -1;
  }
  insertLast.value = dragToIndex.value == arr.length - 1 && endX > arr[arr.length - 1];
}
function onDrop(e) {
  if (dragElIndex.value >= 0 && dragToIndex.value >= 0) {
    $store.commit('layout/insertScrollTag', {
      index: dragToIndex.value + (insertLast.value ? 1 : 0),
      value: scrollTags.value[dragElIndex.value],
      removeIndex: dragToIndex.value <= dragElIndex.value ? dragElIndex.value + 1 : dragElIndex.value,
    });
  }
}
function onDragend() {
  dragToIndex.value = -1;
}
</script>

<template>
  <div id="topTag" class="d_f">
    <div v-if="affixTags.length" class="affix_tag_wrap f_00a">
      <el-tag
        v-for="(tag) in affixTags"
        :key="tag.name"
        v-contextmenu:contextmenu
        class="view_tag"
        :class="{is_active: tag.name === currentRoute.name}"
        :effect="tag.name === currentRoute.name ? 'dark' : 'light'"
        @click="clickTag(tag)"
        @contextmenu="doContextmenu(tag, i, true)"
      >
        <span>{{ tag.meta.title }}</span>
      </el-tag>
    </div>
    <el-scrollbar ref="scrollbar" class="f_11a" @scroll="({scrollLeft}) => moveX = scrollLeft">
      <div class="scroll_tag_wrap d_if" @drop="onDrop" @dragover="$preventDefault">
        <el-tag
          v-for="(tag, i) in scrollTags"
          :ref="el => scrollTagRefs[tag.name] = el"
          :key="tag.name"
          v-contextmenu:contextmenu
          class="view_tag"
          :class="{
            is_active: tag.name === currentRoute.name,
            drag_to: i == dragToIndex,
            insert_last: insertLast,
          }"
          :effect="tag.name === currentRoute.name ? 'dark' : 'light'"
          :closable="!tag.fixed && getClosable(tag)"
          draggable="true"
          @drag="onDrap"
          @dragstart="onDragstart($event, i)"
          @dragend="onDragend"
          @close="closeTag(tag, i)"
          @click="clickTag(tag)"
          @contextmenu="doContextmenu(tag, i)"
        >
          <span class="d_if ai_c">
            <span>{{ tag.meta.title }}</span>
            <el-icon v-if="!!tag.fixed" :size="14" style="margin-left: 6px;">
              <IconAffix />
            </el-icon>
          </span>
        </el-tag>
      </div>
    </el-scrollbar>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item
        v-for="(item, i) in contextmenuItems"
        :key="i"
        :disabled="item.disabled"
        @click="clickContextmenuItem(item, i)"
      >
        <el-icon :size="16" style="margin-right: 8px;">
          <component :is="item.icon" v-if="!!item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<style lang="scss" scoped>
#topTag {
  padding-right: 26px;
  padding-left: 8px;
  border-bottom: $border;

  .affix_tag_wrap,
  .scroll_tag_wrap {
    padding: 6px 0;
  }

  .affix_tag_wrap {
    margin-right: 6px;
  }

  .scroll_tag_wrap {
    > .view_tag {
      flex: 0 0 auto;

      &.drag_to {
        position: relative;
        overflow: visible;

        &::after {
          position: absolute;
          top: -6px;
          display: block;
          height: calc(100% + 12px);
          content: "";
          border-left: 2px dashed $colorPrimaryLight7;
        }

        &:not(.insert_last)::after {
          left: -5px;
        }

        &.insert_last {
          margin-right: 4px;

          &::after {
            right: -5px;
          }
        }

        &:first-child {
          margin-left: 4px;
        }
      }
    }
  }

  .view_tag {
    cursor: pointer;
    user-select: none;

    + .view_tag {
      margin-left: 6px;
    }

    &.is_active::before {
      display: block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      content: "";
      background-color: #fff;
      border-radius: 50%;
    }
  }
}
</style>
