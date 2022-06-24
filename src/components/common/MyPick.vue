<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-02 10:47:48
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-08 15:54:39
-->
<script>
export default {
  name: 'MyPick'
};
</script>

<script setup>
const props = defineProps({
    fold: {
      type: Boolean,
      default: () => (true),
    },
    placement: {
      type: String,
      default: () => ('bottom'),
    },
    iconSize: {
      type: Number,
      default: () => (24),
    },
    iconColor: {
      type: String,
      default: () => ('var(--el-color-primary)'),
    },
    iconMargin: {
      type: String,
      default: () => (''),
    },
    iconMarginTop: {
      type: String,
      default: () => (''),
    },
    iconMarginBottom: {
      type: String,
      default: () => (''),
    },
    iconMarginLeft: {
      type: String,
      default: () => (''),
    },
    iconMarginRight: {
      type: String,
      default: () => (''),
    },
  }),
  { fold, placement, iconSize, iconColor } = toRefs(props);

const isPick = ref(fold.value), style = ref({});
switch (placement.value) {
  case 'left-top':
    style.value = { ...style.value, left: 0, top: 0 };
    break;
  case 'top':
    style.value = { ...style.value, left: '50%', top: 0, transform: 'translateX(-50%)' };
    break;
  case 'right-top':
    style.value = { ...style.value, right: 0, top: 0 };
    break;
  case 'left':
    style.value = { ...style.value, left: 0, top: '50%', transform: 'translateY(-50%)' };
    break;
  case 'right':
    style.value = { ...style.value, right: 0, top: '50%', transform: 'translateY(-50%)' };
    break;
  case 'left-bottom':
    style.value = { ...style.value, left: 0, bottom: 0 };
    break;
  case 'bottom':
    style.value = { ...style.value, left: '50%', bottom: 0, transform: 'translateX(-50%)' };
    break;
  case 'right-bottom':
    style.value = { ...style.value, right: 0, bottom: 0 };
    break;
}
['', 'Top', 'Bottom', 'Left', 'Right'].forEach(str => {
  const val = props[`iconMargin${ str }`];
  if (val) {
    style.value = { ...style.value, ['margin-' + str.toLowerCase()]: val };
  }
});
</script>

<template>
  <div class="pick_wrap">
    <slot name="up" />
    <transition class="animate__animated" enter-active-class="animate__flipInX" leave-active-class="animate__flipOutX">
      <slot v-if="!isPick" />
    </transition>
    <slot name="down" />
    <el-icon
      class="pick_icon"
      :style="{
        ...style,
      }"
      :size="iconSize"
      :color="iconColor"
      @click="isPick = !isPick"
    >
      <IconPickDown v-show="isPick" />
      <IconPickUp v-show="!isPick" />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.pick_wrap {
  position: relative;

  > .pick_icon {
    position: absolute;
    z-index: 9;
    cursor: pointer;
  }
}
</style>
