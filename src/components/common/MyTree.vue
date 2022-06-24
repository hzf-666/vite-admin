<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-14 15:15:45
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-18 14:12:04
-->
<script>
export default {
  name: 'MyTree'
};
</script>

<script setup>
const props = defineProps({
    data: {
      type: Array,
      default: () => ([]),
    },
    nodeKey: {
      type: String,
      default: () => ('id'),
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    showCheckbox: {
      type: Boolean,
      default: () => (false),
    },
    expandOnClickNode: {
      type: Boolean,
      default: () => (false),
    },
    checkOnClickNode: {
      type: Boolean,
      default: () => (false),
    },
    indent: {
      type: Number,
      default: () => (0),
    },
    stripe: {
      type: Boolean,
      default: () => (false),
    },
    custom: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { data, nodeKey, showCheckbox, expandOnClickNode, checkOnClickNode, stripe, custom } = toRefs(props);

const myTree = ref(null),
  _props = ref({
    label: 'name',
    children: 'children',
    disabled: 'disabled',
    isLeaf: 'isLeaf',
    ...props.props,
  }),
  _indent = showCheckbox.value ? 0 : 34;
function hasChildren(data) {
  const children = data[_props.value['children']];
  return children && children.length;
}
function setClass(data) {
  let className = _props.value.class || '';
  className += (className ? ' ' : '') + (hasChildren(data) ? 'has_children' : '');
  className += (className ? ' ' : '') + (!expandOnClickNode.value && !checkOnClickNode.value ? 'default_node' : '');
  return className;
}
function expandNode(node, key, expanded) {
  const nodeMap = node.store.nodesMap[key];
  nodeMap.expanded = expanded === undefined ? !nodeMap.expanded : expanded;
}
function doPreventDefault(e) {
  if ($typeOf(e.target.className) === 'string' && e.target.className.includes('el-tree-node__children')) $preventDefault(e);
}
window.addEventListener('click', doPreventDefault, true);
onBeforeUnmount(() => {
  window.removeEventListener('click', doPreventDefault, true);
});

function filter(...args) {
  return myTree.value.filter(...args);
}
function updateKeyChildren(...args) {
  return myTree.value.updateKeyChildren(...args);
}
function getCheckedNodes(...args) {
  return myTree.value.getCheckedNodes(...args);
}
function setCheckedNodes(...args) {
  return myTree.value.setCheckedNodes(...args);
}
function getCheckedKeys(...args) {
  return myTree.value.getCheckedKeys(...args);
}
function setCheckedKeys(...args) {
  return myTree.value.setCheckedKeys(...args);
}
function setChecked(...args) {
  return myTree.value.setChecked(...args);
}
function getHalfCheckedNodes(...args) {
  return myTree.value.getHalfCheckedNodes(...args);
}
function getHalfCheckedKeys(...args) {
  return myTree.value.getHalfCheckedKeys(...args);
}
function getCurrentKey(...args) {
  return myTree.value.getCurrentKey(...args);
}
function getCurrentNode(...args) {
  return myTree.value.getCurrentNode(...args);
}
function setCurrentKey(...args) {
  return myTree.value.setCurrentKey(...args);
}
function setCurrentNode(...args) {
  return myTree.value.setCurrentNode(...args);
}
function getNode(...args) {
  return myTree.value.getNode(...args);
}
function remove(...args) {
  return myTree.value.remove(...args);
}
function append(...args) {
  return myTree.value.append(...args);
}
function insertBefore(...args) {
  return myTree.value.insertBefore(...args);
}
function insertAfter(...args) {
  return myTree.value.insertAfter(...args);
}

const $refs = reactive({});
setTimeout(() => {
  $refs.tree = myTree.value;
});

defineExpose({
  expandNode,
  filter, updateKeyChildren, getCheckedNodes, setCheckedNodes, getCheckedKeys, setCheckedKeys, setChecked, getHalfCheckedNodes, getHalfCheckedKeys, getCurrentKey, getCurrentNode, setCurrentKey, setCurrentNode, getNode, remove, append, insertBefore, insertAfter,
  $refs,
});
</script>

<template>
  <el-tree
    ref="myTree"
    class="my_tree"
    :class="{
      check_tree: showCheckbox,
      stripe_tree: stripe,
    }"
    :data="data"
    :node-key="nodeKey"
    :props="{
      ..._props,
      class: setClass,
    }"
    :indent="_indent"
    :check-strictly="true"
    :show-checkbox="showCheckbox"
    :expand-on-click-node="expandOnClickNode"
    :check-on-click-node="checkOnClickNode"
  >
    <template #default="scope">
      <template v-if="hasChildren(scope.data)">
        <el-icon
          :size="22"
          class="expand_icon"
          @click.stop="expandNode(scope.node, scope.data[nodeKey], true)"
        >
          <IconEpCirclePlus />
        </el-icon>
        <el-icon
          :size="22"
          class="fold_icon"
          @click.stop="expandNode(scope.node, scope.data[nodeKey], false)"
        >
          <IconEpRemove />
        </el-icon>
      </template>
      <span v-if="!custom" class="el-tree-node__label">{{ scope.data[_props['label']] }}</span>
      <template v-else>
        <div class="el-tree-node__label" style="width: 100%;">
          <slot v-bind="scope" />
        </div>
      </template>
    </template>
  </el-tree>
</template>

<style lang="scss" scoped>
.my_tree {
  --el-tree-node-hover-bg-color: var(--el-fill-color-light);

  $indent: 34px;

  width: 100%;

  &.check_tree,
  &.stripe_tree {
    :deep(> .el-tree-node) {
      + .el-tree-node {
        margin-top: 6px;
      }

      > .el-tree-node__content {
        background-color: var(--el-tree-node-hover-bg-color);
        border-top-width: 1px !important;
      }
    }
  }

  .expand_icon,
  .fold_icon {
    position: relative;
    top: 6px;
    left: 0;
    display: none;
    color: $colorPrimary;
    cursor: pointer;
    user-select: none;
  }

  &:not(.check_tree) {
    :deep(.el-tree-node):not(.has_children) {
      > .el-tree-node__content {
        > .el-tree-node__label {
          margin-left: 10px;
        }
      }
    }

    .expand_icon,
    .fold_icon {
      margin: 0 6px;
    }
  }

  &.check_tree {
    .expand_icon,
    .fold_icon {
      left: -54px;
    }

    :deep() {
      > .el-tree-node {
        > .el-tree-node__children {
          padding-left: $indent !important;
          border: $border;
          border-top: none;
        }

        &:not(.has_children) > .el-tree-node__content {
          > .el-checkbox {
            margin-left: $indent;
          }
        }
      }

      .el-tree-node {
        > .el-tree-node__children {
          white-space: pre-line;

          > .el-tree-node {
            display: inline-block;

            > .el-tree-node__content {
              padding: 0 10px !important;
              border: none;
            }

            &.has_children {
              display: block;

              > .el-tree-node__content {
                padding-left: 0 !important;
              }

              > .el-tree-node__children {
                margin-left: $indent;
              }
            }
          }
        }

        &.has_children > .el-tree-node__content {
          > .el-checkbox {
            margin-left: $indent;
          }

          > .el-tree-node__label {
            margin-left: -22px;
          }
        }
      }
    }
  }

  &.el-tree--highlight-current :deep(.el-tree-node.is-current) > .el-tree-node__content {
    font-weight: bold;
    color: $colorPrimary;
    background-color: transparent;
  }

  :deep() {
    .el-tree__empty-block,
    .el-tree-node__content {
      border: $border;
    }

    .el-tree-node {
      .el-tree-node .el-tree-node__content:first-child,
      + .el-tree-node .el-tree-node__content {
        border-top-width: 0;
      }

      &:not(.is-expanded) > .el-tree-node__content > .expand_icon {
        display: block;
      }

      &.is-expanded > .el-tree-node__content > .fold_icon {
        display: block;
      }

      &.default_node > .el-tree-node__content {
        cursor: default;
      }
    }

    > .el-tree-node .el-tree-node {
      &:focus > .el-tree-node__content:not(:hover) {
        background-color: transparent;
      }
    }

    .el-tree-node__content {
      align-items: flex-start;
      height: auto;
      -webkit-box-align: start;
      -ms-flex-align: start;
      padding-right: 10px;
      text-align: justify;

      .el-tree-node__label {
        padding: 9px 0;
        white-space: pre-wrap;
      }

      .el-checkbox {
        padding: 8px 0;

        .el-checkbox__input {
          line-height: 0;
        }
      }
    }

    .el-tree-node__expand-icon {
      display: none;
    }
  }
}

</style>
