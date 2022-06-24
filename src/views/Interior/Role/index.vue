<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 14:01:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-21 14:02:09
-->
<script>
const menuName = 'Role';
export default {
  name: menuName
};
</script>

<script setup>
import RoleDialog from './dialog.vue';
import { getRoleTree, getRoleAuth, editRoleAuth, delRole } from '@/api/Interior/Role.js';

const roleTreeRef = ref(null), permissionTreeRef = ref(null),
  roleId = ref(null),
  treeParams = ref({
    name: '',
  }),
  defaultExpandedKeys = ref([]),
  defaultCheckedKeys = ref([]),
  roleTree = ref([]),
  permissionTree = ref([]),
  showDialog = ref(false),
  dialogType = ref(''),
  dialogTitle = ref(''),
  dialogId = ref(0);

function isAuth(type, id) {
  if (id === undefined) id = roleId.value;
  return $useAuth(`${ menuName }${ type }`) && id != 1;
}
function doShowDialog(type, id) {
  dialogType.value = type;
  dialogTitle.value = $useAuth(`${ menuName }${ type }`, ['title']);
  dialogId.value = id || roleId.value;
  showDialog.value = true;
}
async function doGetRoleTree(initId = true) {
  defaultExpandedKeys.value = [];
  roleTree.value = [];
  roleId.value = null;
  await getRoleTree({
    params: treeParams.value,
  }).then(res => {
    if (res.code == 200) {
      if (initId) {
        $recurseInto(res.data, (item, { parent }) => {
          if (!item.isOrg) {
            if (parent) defaultExpandedKeys.value = [parent.id];
            roleId.value = item.id;
            return 'break';
          }
        });
      }
      roleTree.value = res.data;
    }
  });
}
function doGetRoleAuth(id) {
  defaultCheckedKeys.value = [];
  permissionTree.value = [];
  if (!id) return;
  getRoleAuth(id).then(res => {
    if (res.code == 200) {
      const arr = [];
      permissionTree.value = res.data;
      $recurseInto(res.data, item => {
        if (item.isChecked) arr.push(item.id);
        item.disabled = !isAuth('Auth');
      });
      defaultCheckedKeys.value = arr;
    }
  });
}
function clickRole(data, node) {
  if (data.isOrg) {
    roleTreeRef.value.expandNode(node, data.id);
  } else {
    roleId.value = data.id;
  }
}
function doDelRole(data) {
  $confirm('确定删除该角色吗？', '删除确认', {
    type: 'warning',
  }).then(() => {
    delRole(data.id).then(res => {
      if (res.code == 200) {
        if (data.id == roleId.value) {
          let activeId = null;
          const getActiveId = (list, parent) => {
            if (list.length == 1) {
              return parent ? parent.id : null;
            } else {
              const targetIndex = list.findIndex(item => item.id == data.id);
              return list[targetIndex + (targetIndex > 0 ? -1 : 1)].id;
            }
          };
          $recurseInto(roleTree.value, (item, { parent }) => {
            if (item.id == data.id) {
              activeId = getActiveId(parent ? parent.children : roleTree.value, parent);
            }
          });
          roleTreeRef.value.remove(data);
          roleId.value = activeId;
        } else {
          roleTreeRef.value.remove(data);
        }
      }
    });
  }).catch(() => {});
}
function saveAuth() {
  const id = roleId.value,
    functionsIds = permissionTreeRef.value.getCheckedNodes(false, true).map(item => item.id);
  editRoleAuth(id, {
    data: { functionsIds },
  });
}
async function onComplete({ id, parentId }) {
  await doGetRoleTree(false);
  roleId.value = id;
  defaultExpandedKeys.value = parentId ? [parentId] : [];
}
watch(roleId, (newId) => {
  doGetRoleAuth(newId);
}, {
  immediate: true,
});

$useActivated(once => {
  if (once) {
    doGetRoleTree();
  }
});
</script>

<template>
  <SubPage>
    <div class="page_tree_wrap">
      <div class="page_tree_left s_box">
        <div v-if="roleTree.length" class="page_tree_search">
          <el-input
            v-model="treeParams.name"
            class="search_input"
            placeholder="请输入角色名称"
            clearable
            @clear="doGetRoleTree()"
          >
            <template #prefix>
              <el-icon :size="16">
                <IconSearch2 />
              </el-icon>
            </template>
          </el-input>
          <span @click="doGetRoleTree()">搜索</span>
        </div>
        <el-scrollbar class="s_area">
          <MyTree
            ref="roleTreeRef"
            :data="roleTree"
            :default-expanded-keys="defaultExpandedKeys"
            custom
          >
            <template #default="{data, node}">
              <div class="d_f">
                <span
                  class="f_11a"
                  :style="{
                    cursor: 'pointer',
                    color: data.id == roleId ? 'var(--el-color-primary)' : '',
                  }"
                  @click.stop="clickRole(data, node)"
                >{{ data.name }}</span>
                <div v-if="!data.isOrg" class="page_tree_icons f_00a" style="margin-left: 10px;" @click.stop="">
                  <el-icon v-auth="`${menuName}Detail`" color="var(--el-color-primary)" @click="doShowDialog('Detail', data.id)">
                    <IconFileExpansion />
                  </el-icon>
                  <el-icon v-if="isAuth('Edit', data.id)" color="var(--el-color-warning)" @click="doShowDialog('Edit', data.id)">
                    <IconEdit />
                  </el-icon>
                  <el-icon v-if="isAuth('Delete', data.id)" color="var(--el-color-danger)" @click="doDelRole(data)">
                    <IconDelete />
                  </el-icon>
                </div>
              </div>
            </template>
          </MyTree>
        </el-scrollbar>
      </div>

      <div class="page_tree_right s_box">
        <SearchArea>
          <SearchRow>
            <template #operation>
              <el-button
                v-auth="`${menuName}Add`"
                type="primary"
                round
                @click="doShowDialog('Add')"
              >
                {{ $useAuth(`${menuName}Add`, '添加角色') }}
              </el-button>
            </template>
          </SearchRow>
        </SearchArea>
        <AutoAffix>
          <MyTree
            ref="permissionTreeRef"
            :data="permissionTree"
            :props="{
              label: 'title',
              class: 'showonly',
            }"
            :default-checked-keys="defaultCheckedKeys"
            :check-strictly="false"
            :check-on-click-node="isAuth('Auth')"
            :expand-on-click-node="!isAuth('Auth')"
            show-checkbox
          />
          <template v-if="isAuth('Auth')" #down>
            <div style="padding-top: 12px; text-align: center;">
              <el-button type="primary" round @click="saveAuth">保存</el-button>
            </div>
          </template>
        </AutoAffix>
      </div>
    </div>

    <RoleDialog
      v-model="showDialog"
      :title="dialogTitle"
      :dialog-type="dialogType"
      :dialog-id="dialogId"
      @complete="onComplete"
    />
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
