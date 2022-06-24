<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-02 17:45:33
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 10:33:31
-->
<script>
export default {
  name: 'AutoAffix'
};
</script>

<script setup>
const props = defineProps({
    maxHeight: {
      type: [Number, String],
      default: () => (0),
    },
    table: {
      type: Boolean,
      default: () => (false),
    },
    dialog: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { maxHeight, table, dialog } = toRefs(props);

const currentRoute = useRoute(),
  wrapRef = ref(null), upRef = ref(null), downRef = ref(null),
  autoAffixTableRef = ref(null),
  autoAffixScrollRef = ref(null),
  wrapRefBounding = useElementBounding(wrapRef),
  upRefBounding = useElementBounding(upRef),
  downRefBounding = useElementBounding(downRef),
  mainScroll = dialog.value ? null : inject('mainScroll'),
  pageMainScroll = dialog.value ? null : inject('pageMainScroll'),
  minHeight = 210,
  _maxHeight = ref(0);
let maxHeightTimer = null;
function setMaxHeight() {
  maxHeightTimer && clearTimeout(maxHeightTimer);
  maxHeightTimer = setTimeout(() => {
    const affixHeight = (upRef.value ? upRef.value.clientHeight : 0) + (downRef.value ? downRef.value.clientHeight : 0);
    if (maxHeight.value) {
      if ($typeOf(maxHeight.value) === 'number') {
        _maxHeight.value = maxHeight.value - affixHeight;
      } else {
        if (maxHeight.value.startsWith('calc')) {
          _maxHeight.value = maxHeight.value.replace(/( )*\)$/, ` - ${ affixHeight }px)`);
        } else {
          _maxHeight.value = `calc(${ maxHeight.value } - ${ affixHeight }px)`;
        }
      }
    } else {
      const max = wrapRef.value.clientHeight - affixHeight;
      _maxHeight.value = max > minHeight ? max : minHeight;
    }
    if (!dialog.value) {
      mainScroll.value && mainScroll.value.update();
      pageMainScroll.value && pageMainScroll.value.update();
    }
  });
}
watch(maxHeight, () => {
  setMaxHeight();
}, {
  immediate: true,
});
watch([wrapRefBounding.height, upRefBounding.height, downRefBounding.height], () => {
  setMaxHeight();
});
watch(currentRoute, (newRoute) => {
  setTimeout(() => {
    if (autoAffixScrollRef.value) {
      const scrollObj = $store.get('scrollbar/autoAffix')[newRoute.name];
      if (autoAffixScrollRef.value) {
        autoAffixScrollRef.value.setScrollTop(1);
        autoAffixScrollRef.value.setScrollLeft(1);
        autoAffixScrollRef.value.setScrollTop(scrollObj ? scrollObj.scrollTop || 0 : 0);
        autoAffixScrollRef.value.setScrollLeft(scrollObj ? scrollObj.scrollLeft || 0 : 0);
      }
    }
  });
}, {
  immediate: true,
});
function onScroll(e) {
  $store.commit('scrollbar/addScroll', { key: currentRoute.name, value: e, type: 'autoAffix' });
}

const $refs = reactive({});
setTimeout(() => {
  $refs.el = wrapRef.value;
  $refs.table = autoAffixTableRef.value;
  $refs.scrollbar = autoAffixScrollRef.value;
});

defineExpose({
  $refs,
});
</script>

<template>
  <div
    ref="wrapRef"
    class="s_area"
    :style="{
      height: '100%',
    }"
  >
    <div ref="upRef">
      <slot name="up" />
    </div>

    <el-table
      v-if="table"
      ref="autoAffixTableRef"
      :max-height="_maxHeight"
      border
      v-bind="$attrs"
    >
      <slot />
    </el-table>
    <el-scrollbar
      v-else
      ref="autoAffixScrollRef"
      :max-height="_maxHeight"
      v-bind="$attrs"
      @scroll="onScroll"
    >
      <slot />
    </el-scrollbar>

    <div ref="downRef">
      <slot name="down" />
    </div>
  </div>
  <template v-if="true" />
</template>

<style lang="scss" scoped>

</style>
