<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-23 14:47:24
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 09:39:02
-->
<script>
export default {
  name: 'Identify'
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: String,
      default: () => (''),
    },
    ignoreChars: {
      type: String,
      default: () => ('0o1lI'),
    },
    numberMin: {
      type: Number,
      default: () => (4),
    },
    numberMax: {
      type: Number,
      default: () => (5),
    },
    fontSizeMin: {
      type: Number,
      default: () => (28),
    },
    fontSizeMax: {
      type: Number,
      default: () => (40),
    },
    backgroundColorMin: {
      type: Number,
      default: () => (180),
    },
    backgroundColorMax: {
      type: Number,
      default: () => (240),
    },
    colorMin: {
      type: Number,
      default: () => (50),
    },
    colorMax: {
      type: Number,
      default: () => (160),
    },
    lineCount: {
      type: Number,
      default: () => (8),
    },
    lineColorMin: {
      type: Number,
      default: () => (40),
    },
    lineColorMax: {
      type: Number,
      default: () => (180),
    },
    dotCount: {
      type: Number,
      default: () => (80),
    },
    dotColorMin: {
      type: Number,
      default: () => (0),
    },
    dotColorMax: {
      type: Number,
      default: () => (255),
    },
    contentWidth: {
      type: Number,
      default: () => (110),
    },
    contentHeight: {
      type: Number,
      default: () => (40),
    },
  }),
  {
    modelValue, ignoreChars, numberMin, numberMax, fontSizeMin, fontSizeMax, backgroundColorMin, backgroundColorMax,
    colorMin, colorMax, lineCount, lineColorMin, lineColorMax, dotCount, dotColorMin, dotColorMax, contentWidth, contentHeight,
  } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const text = ref(modelValue.value), identify = ref(null);
function randomNum(min, max) { // 生成一个随机数
  return Math.round(Math.random() * (max - min) + min);
}
function randomColor(min, max) { // 生成一个随机的颜色
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
function drawPic() {
  const canvas = identify.value;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'bottom';
  // 绘制背景
  ctx.fillStyle = randomColor(backgroundColorMin.value, backgroundColorMax.value);
  ctx.fillRect(0, 0, contentWidth.value, contentHeight.value);
  // 绘制文字
  for (let i = 0; i < text.value.length; i++) {
    drawText(ctx, text.value[i], i);
  }
  drawLine(ctx);
  drawDot(ctx);
}
function drawText(ctx, txt, i) {
  const fontSize = randomNum(fontSizeMin.value, fontSizeMax.value),
    averageWidth = (contentWidth.value - 10) / text.value.length;
  ctx.fillStyle = randomColor(colorMin.value, colorMax.value);
  ctx.font = fontSize + 'px SimHei';
  const x = i * averageWidth + 5;
  const y = randomNum(fontSizeMax.value, contentHeight.value - 5);
  var deg = randomNum(-15, 15);
  // 修改坐标原点和旋转角度
  ctx.translate(x, y);
  ctx.rotate(deg * Math.PI / 180);
  ctx.fillText(txt, 0, 0);
  // 恢复坐标原点和旋转角度
  ctx.rotate(-deg * Math.PI / 180);
  ctx.translate(-x, -y);
}
function drawLine(ctx) {
  // 绘制干扰线
  for (let i = 0; i < lineCount.value; i++) {
    ctx.strokeStyle = randomColor(lineColorMin.value, lineColorMax.value);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value));
    ctx.lineTo(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value));
    ctx.stroke();
  }
}
function drawDot(ctx) {
  // 绘制干扰点
  for (let i = 0; i < dotCount.value; i++) {
    ctx.fillStyle = randomColor(dotColorMin.value, dotColorMax.value);
    ctx.beginPath();
    ctx.arc(randomNum(0, contentWidth.value), randomNum(0, contentHeight.value), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}
function toggleCode() {
  let result = '';
  const number = randomNum(numberMin.value, numberMax.value),
    arr = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ],
    strList = arr.filter(str => !ignoreChars.value.includes(str));
  for (let i = 0; i < number; i++) {
    result += strList[randomNum(0, strList.length - 1)];
  }
  text.value = result;
  emit('update:modelValue', result);
}
onMounted(() => {
  if (text.value) {
    drawPic();
  } else {
    toggleCode();
  }
});
watch(modelValue, (newCode) => {
  text.value = newCode;
  drawPic();
});

defineExpose({
  toggleCode,
});
</script>

<template>
  <canvas ref="identify" :width="contentWidth" :height="contentHeight" style="user-select: none;" />
</template>

<style lang="scss" scoped>

</style>
