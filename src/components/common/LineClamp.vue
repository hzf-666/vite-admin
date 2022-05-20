<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-17 16:31:49
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-19 10:50:51
-->
<script>
export default {
  name: 'LineClamp'
};
</script>

<script setup>
import sassExport from '@/scss/export.module.scss';
import { findParentNode } from '@u';

const props = defineProps({
    clamp: {
      type: Number,
      default: () => (1),
    },
    autosize: {
      type: Boolean,
      default: () => (false),
    },
    selector: {
      type: String,
      default: () => (''),
    },
  }),
  { clamp, autosize, selector } = toRefs(props);

const slotRef = ref(null), slotRefBounding = useElementBounding(slotRef), disabled = ref(true), className = ref(''),
  slotWrap = ref(null), parent = ref(null), autoLine = ref(0), calcEnd = ref(false);
function getStyle(el, attr, remove = 'px') {
  const result = window.getComputedStyle(el)[attr].replace(remove, '');
  return Number(result) || result;
}
let timer = null;
function initRef() {
  disabled.value = true;
  className.value = '';
  calcEnd.value = false;
}
function calcOver() {
  initRef();
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    let isOver = false;
    const height = getStyle(slotRef.value, 'height'), lineHeight = getStyle(slotRef.value, 'lineHeight');
    if (autosize.value) {
      parent.value = slotWrap.value.parentNode;
      if (selector.value) {
        parent.value = findParentNode(parent.value, selector.value);
      }
      if (parent.value) {
        let parentHeight = getStyle(parent.value, 'height');
        ['Top', 'Bottom'].forEach(p => {
          parentHeight -= getStyle(parent.value, `padding${ p }`);
          parentHeight -= getStyle(parent.value, `border${ p }Width`);
        });
        isOver = height > parentHeight;
        autoLine.value = isOver ? Math.floor(parentHeight / lineHeight) : 0;
        className.value = isOver ? 'text_els_1' : '';
      }
    } else {
      isOver = height > lineHeight * clamp.value;
      className.value = isOver ? 'text_els_' + clamp.value : '';
    }
    disabled.value = !isOver;
    calcEnd.value = true;
  });
}
if (autosize.value) {
  watch(slotRefBounding.width, () => {
    calcOver();
  });
} else {
  if (clamp.value > Number(sassExport.maxClamp)) {
    console.error(`clamp can not be greater than ${ sassExport.maxClamp }`);
  } else if (clamp.value < 1) {
    initRef();
  } else {
    watch(clamp, (newClamp) => {
      if (newClamp < 1) {
        initRef();
      } else {
        calcOver();
      }
    });
    watch(slotRefBounding.width, () => {
      calcOver();
    });
  }
}
</script>

<template>
  <el-tooltip
    placement="top"
    effect="light"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$attrs"
  >
    <template #content>
      <slot name="content" />
    </template>
    <div ref="slotWrap" style="position: relative;">
      <div
        ref="slotRef"
        :class="className"
        :style="{
          width: '100%',
          visibility: calcEnd ? 'visible' : 'hidden',
          position: autosize && !calcEnd ? 'absolute' : 'static',
          '-webkit-line-clamp': autosize && !disabled && calcEnd ? (autoLine || '') : '',
        }"
      >
        <slot>{{ $attrs.content }}</slot>
      </div>
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>

</style>
