<script>
const menuName = 'Permission';
export default {
  name: menuName
};
</script>

<script setup>
import { getPermissionList, editPermissionState, delPermission } from '@/api/Interior/Permission.js';
import { updateRoutes } from '@/router/handle.js';

const currentRoute = useRoute(),
  title = ref(''),
  treeList = ref([]),
  isSearch = ref(false),
  treeTable = ref(null),
  rowKey = ref('id'),
  rowClassPrefix = 'tree_row_',
  activeValue = ref(true), inactiveValue = ref(false), stateList = ref([]),
  { maxWidth, showColumn, getWidth, initWidth } = $useAutoWidth(computed(() => treeList.value.length)),
  columnWidth = computed(() => maxWidth.value + (maxWidth.value == 1 ? 0 : 21));

function doGetPermissionList(fId = null) {
  return getPermissionList({
    params: {
      title: title.value,
      fId: title.value ? null : fId,
    },
  }).then(res => {
    if (res.code == 200) {
      initWidth();
      return res.data;
    } else {
      return [];
    }
  });
}
async function getTreeList() {
  await doGetPermissionList().then(data => {
    treeList.value = data;
    isSearch.value = !!title.value;
  });
}
function loadNode(row, treeNode, resolve) {
  doGetPermissionList(row.id).then(data => {
    resolve(data);
  });
}
function doUpdateRoutes(row, isInit = true) {
  updateRoutes(currentRoute, { excludes: [menuName] });
  if (!isInit) return;
  const arr = [`${ menuName }Detail`, `${ menuName }Edit`, `${ menuName }Delete`];
  if (arr.includes(row.name)) {
    setTimeout(() => {
      initWidth();
    }, 50);
  }
}
function changeState({ row }) {
  const stateId = row.stateObj.id;
  editPermissionState(row.id, {
    data: {
      state: stateId,
    },
  }).then(res => {
    if (res.code != 200) {
      row.stateObj.id = stateId == activeValue.value ? inactiveValue.value : activeValue.value;
    } else {
      doUpdateRoutes(row);
    }
  });
}
function del({ row }) {
  $confirm('确定删除该权限吗？', '删除确认', {
    type: 'warning',
  }).then(() => {
    delPermission(row.id).then(res => {
      if (res.code == 200) {
        if (!isSearch.value && row.parentId) {
          const lazyTreeNodeMap = treeTable.value.$refs.table.store.states.lazyTreeNodeMap.value;
          lazyTreeNodeMap[row.parentId] = lazyTreeNodeMap[row.parentId].filter(item => item.id != row.id);
          setTimeout(() => {
            doUpdateRoutes(row);
          }, 50);
        } else {
          getTreeList();
          doUpdateRoutes(row, false);
        }
      }
    });
  }).catch(() => {});
}

$useActivated(async once => {
  await $store.dispatch('enums/getEnum', {
    name: 'State',
    callback(list) {
      activeValue.value = list[0] ? list[0].id : true;
      inactiveValue.value = list[1] ? list[1].id : false;
      stateList.value = list;
    },
  });
  if (once) {
    await getTreeList();
    setTimeout(() => {
      const el = treeTable.value.$refs.el,
        chains = currentRoute.params[`${ menuName }Chains`],
        getExpandIcon = rowKey => {
          const rowEl = el.querySelector('.' + rowClassPrefix + rowKey);
          return rowEl && rowEl.querySelector('.el-table__expand-icon');
        };
      if (chains) {
        chains.split(',').forEach(async id => {
          let target = getExpandIcon(id);
          while (!target) {
            const p = new Promise((resovle) => {
              setTimeout(() => {
                resovle(getExpandIcon(id));
              }, 50);
            });
            await p.then(icon => {
              target = icon;
            });
          }
          const _p = new Promise(() => {
            setTimeout(() => {
              target.click();
            }, 250);
          });
          await _p;
        });
      }
    });
  }
});
</script>

<template>
  <SubPage>
    <SearchArea>
      <SearchRow>
        <SearchItem label="标题">
          <el-input v-model="title" placeholder="请输入标题" clearable @clear="getTreeList" />
          <el-button type="primary" round @click="getTreeList">搜索</el-button>
        </SearchItem>
        <template #operation>
          <el-button
            v-if="$useAuth(`${menuName}Add`)"
            type="primary"
            round
            @click="$router.push({name: `${menuName}Add`})"
          >
            {{ $useAuth(`${menuName}Add`, '新增') }}
          </el-button>
        </template>
      </SearchRow>
    </SearchArea>

    <AutoAffix
      ref="treeTable"
      :data="treeList"
      :row-key="rowKey"
      :load="loadNode"
      :row-class-name="({row}) => rowClassPrefix + row.id"
      lazy
      table
    >
      <el-table-column width="300px">
        <template #header>
          <div style="text-align: center;">标题</div>
        </template>
        <template #default="{row}">
          <div v-if="isSearch" style="text-align: center;">{{ row.meta.title }}</div>
          <span
            v-else
            :style="{
              'padding-left': !isSearch && !row.hasChildren ? `${row.parentId ? 6 : 25}px` : 0,
            }"
          >{{ row.meta.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标识" prop="name" align="center" />
      <el-table-column label="类型" prop="functionTypeName" align="center" width="70px" />
      <el-table-column label="层级" prop="level" align="center" width="70" />
      <el-table-column label="排序" align="center" width="70">
        <template #default="{row}">
          {{ row.orderby || null }}
        </template>
      </el-table-column>
      <el-table-column label="重定向" align="center">
        <template #default="{row}">
          <LineClamp :content="row.meta.redirect" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="{row}">
          <LineClamp :content="row.remark" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="state" align="center" width="70px">
        <template #default="{row}">
          <el-switch
            v-model="row.stateObj.id"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
            :disabled="!$useAuth(`${menuName}State`)"
            @change="changeState({row})"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn" :width="columnWidth" fixed="right">
        <template #header>
          <div style="text-align: center;">操作</div>
        </template>
        <template #default="{row}">
          <AutoWidth @complete="getWidth">
            <el-button
              v-if="$useAuth(`${menuName}Detail`)"
              type="success"
              round
              @click="$router.push({
                name: `${menuName}Detail`,
                params: {
                  id: row.id,
                },
              })"
            >
              {{ $useAuth(`${menuName}Detail`, '详情') }}
            </el-button>
            <el-button
              v-auth="`${menuName}Edit`"
              type="warning"
              round
              @click="$router.push({
                name: `${menuName}Edit`,
                params: {
                  id: row.id,
                },
              })"
            >
              {{ $useAuth(`${menuName}Edit`, '修改') }}
            </el-button>
            <el-button
              v-auth="`${menuName}Delete`"
              type="danger"
              round
              @click="del({row})"
            >
              {{ $useAuth(`${menuName}Delete`, '删除') }}
            </el-button>
          </AutoWidth>
        </template>
      </el-table-column>
    </AutoAffix>
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
