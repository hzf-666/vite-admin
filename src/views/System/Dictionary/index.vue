<script>
const menuName = 'Dictionary';
export default {
  name: menuName
};
</script>

<script setup>
import DictionaryDialog from './dialog.vue';
import { getDictionaryTree, getDictionaryList, editDictionaryState, delDictionary } from '@/api/System/Dictionary.js';

const myTree = ref(null),
  showAll = ref(true),
  hasTreeAll = computed(() => treeList.value.length && showAll.value),
  {
    setValue, treeParams, searchKey,
    index, size, total, activeValue, inactiveValue,
    pagingList, getPagingList, changeState, del,
    showColumn, getWidth, columnWidth, initWidth,
    showDialog, dialogType, dialogTitle, dialogId,
    nodeId, nodeKey, defaultExpandedKeys, treeProps, treeList, getTreeList, isGroup,
  } = $useTreeList({
    treeFn: getDictionaryTree,
    listFn: getDictionaryList,
    stateFn: editDictionaryState,
    delFn: delDictionary,
    hasTreeAll,
  });
$useActivated(once => {
  if (once) {
    setValue('treeParams', {
      name: '',
    });
    setValue('searchKey', {
      id: null,
      name: '',
    });
    setValue('delMsg', { content: '确定删除该数据字典吗？' });
    initTreeList();
  }
});

async function initTreeList() {
  showAll.value = !treeParams.value.name;
  await getTreeList();
  if (hasTreeAll.value) nodeId.value = 0;
}
function clickNode(data, node) {
  if (isGroup(data)) {
    myTree.value.expandNode(node, data[nodeKey.value]);
  } else {
    nodeId.value = data[nodeKey.value];
  }
}

watch(nodeId, (newId) => {
  searchKey.value.id = newId;
  if (newId || newId === 0) {
    getPagingList({ index: 1 });
  }
}, {
  immediate: true,
});

function doShowDialog(type, id) {
  dialogType.value = type;
  dialogTitle.value = $useAuth(`${ menuName }${ type }`, ['title']);
  dialogId.value = id || nodeId.value;
  showDialog.value = true;
}
function onComplete({ id }) {
  if (nodeId.value == id) {
    getPagingList({ index: 1 });
  } else {
    nodeId.value = id || null;
  }
  if (id) {
    getTreeList({ expand: true });
  }
}
</script>

<template>
  <SubPage>
    <div class="page_tree_wrap">
      <div class="page_tree_left s_box">
        <div v-if="treeList.length" class="page_tree_search">
          <el-input
            v-model="treeParams.name"
            class="search_input"
            placeholder="请输入参数名称"
            clearable
            @clear="initTreeList()"
          >
            <template #prefix>
              <el-icon :size="16">
                <IconSearch2 />
              </el-icon>
            </template>
          </el-input>
          <span @click="initTreeList()">搜索</span>
        </div>
        <div
          v-if="hasTreeAll"
          tabindex="-1"
          class="page_tree_all"
          :style="{color: nodeId === 0 ? 'var(--el-color-primary)' : ''}"
          @click="nodeId = 0"
        >
          <span>全部</span>
        </div>
        <el-scrollbar class="s_area">
          <MyTree
            ref="myTree"
            :data="treeList"
            :node-key="nodeKey"
            :props="treeProps"
            :default-expanded-keys="defaultExpandedKeys"
            custom
          >
            <template #default="{data, node}">
              <div class="d_f">
                <span
                  class="f_11a"
                  :style="{
                    cursor: 'pointer',
                    color: data[nodeKey] == nodeId ? 'var(--el-color-primary)' : '',
                  }"
                  @click.stop="clickNode(data, node)"
                >{{ data[treeProps.label] }}</span>
              </div>
            </template>
          </MyTree>
        </el-scrollbar>
      </div>

      <div class="page_tree_right s_box">
        <SearchArea>
          <SearchRow>
            <SearchItem label="参数名称">
              <el-input v-model="searchKey.name" placeholder="请输入参数名称" clearable @clear="getPagingList({index: 1})" />
              <el-button type="primary" round @click="getPagingList({index: 1})">搜索</el-button>
            </SearchItem>
            <template #operation>
              <el-button
                v-auth="`${menuName}Add`"
                type="primary"
                round
                @click="doShowDialog('Add')"
              >
                {{ $useAuth(`${menuName}Add`, '新增') }}
              </el-button>
            </template>
          </SearchRow>
        </SearchArea>

        <AutoAffix :data="pagingList" table>
          <el-table-column label="参数编号" prop="systemCode" align="center" />
          <el-table-column label="参数名称" align="center">
            <template #default="{row}">
              <LineClamp :content="row.name" selector="td" autosize />
            </template>
          </el-table-column>
          <el-table-column label="参数类型" align="center">
            <template #default="{row}">
              <LineClamp :content="row.paramTypeName" selector="td" autosize />
            </template>
          </el-table-column>
          <el-table-column label="参数归属" align="center">
            <template #default="{row}">
              <LineClamp :content="row.parentName" selector="td" autosize />
            </template>
          </el-table-column>
          <el-table-column label="添加人员" prop="createBy" align="center" width="80px" />
          <el-table-column label="添加时间" prop="createTime" align="center" width="155px" />
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
                  v-auth="`${menuName}Detail`"
                  type="success"
                  round
                  @click="doShowDialog('Detail', row.id)"
                >
                  {{ $useAuth(`${menuName}Detail`, '详情') }}
                </el-button>
                <el-button
                  v-auth="`${menuName}Edit`"
                  type="warning"
                  round
                  @click="doShowDialog('Edit', row.id)"
                >
                  {{ $useAuth(`${menuName}Edit`, '修改') }}
                </el-button>
                <el-button
                  v-auth="`${menuName}Delete`"
                  type="danger"
                  round
                  @click="del({row, myTree})"
                >
                  {{ $useAuth(`${menuName}Delete`, '删除') }}
                </el-button>
              </AutoWidth>
            </template>
          </el-table-column>

          <template #down>
            <MyPagination
              v-model:current-page="index"
              v-model:page-size="size"
              :total="total"
              @change="type => getPagingList({index: type === 'index' ? index : 1})"
            />
          </template>
        </AutoAffix>
      </div>
    </div>

    <DictionaryDialog
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
