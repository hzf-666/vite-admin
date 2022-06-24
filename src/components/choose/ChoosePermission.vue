<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-16 16:06:05
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-16 18:35:44
-->
<script>
export default {
  name: 'ChoosePermission'
};
</script>

<script setup>
const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
    treeProps: {
      type: Object,
      default: () => ({}),
    },
  }),
  { modelValue, treeProps } = toRefs(props),
  emit = defineEmits(['update:modelValue', 'choose']);

const visible = ref(modelValue.value), _expandedKeys = ref([]);
watch(modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    const defaultExpandedKeys = treeProps.value.defaultExpandedKeys,
      defaultCheckedKeys = treeProps.value.defaultCheckedKeys;
    _expandedKeys.value = [];
    setTimeout(() => {
      if (defaultExpandedKeys) _expandedKeys.value = defaultExpandedKeys;
      if (defaultCheckedKeys) myTree.value.setCheckedKeys(defaultCheckedKeys);
    });
  }
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

const myTree = ref(null);
function doCheck(data, { checkedKeys }) {
  checkedKeys.forEach(id => {
    if (id != data.id) {
      myTree.value.setChecked(id, false);
    }
  });
}
function confirm() {
  let checkedKeys, expandedKeys, target = null;
  const list = treeProps.value.data, checkeds = myTree.value.getCheckedKeys();
  if (checkeds.length) {
    checkedKeys = checkeds;
    if (list && list.length) {
      $recurseInto(list, (item, { parent }) => {
        if (item.id == checkeds[0]) {
          target = $deepCopy(item);
          if (parent) expandedKeys = [parent.id];
          return 'break';
        }
      });
    }
  } else {
    checkedKeys = [];
    expandedKeys = [];
  }
  emit('choose', { checkedKeys, expandedKeys, target });
  cancel();
}
function cancel() {
  visible.value = false;
  myTree.value.setCheckedKeys([]);
}
</script>

<template>
  <MyDialog v-model="visible" title="" :before-close="cancel">
    <MyTree
      ref="myTree"
      :props="{
        label: 'title',
      }"
      check-on-click-node
      show-checkbox
      style="margin: 15px 0;"
      v-bind="treeProps"
      :default-expanded-keys="_expandedKeys"
      @check="doCheck"
    />
    <template #down>
      <div v-if="treeProps.data && treeProps.data.length" class="dialog_form_btns">
        <el-button type="primary" round @click="confirm">确认</el-button>
        <el-button round @click="cancel">取消</el-button>
      </div>
    </template>
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>
