<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-15 13:42:34
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 16:54:43
-->
<script>
export default {
  name: 'ChoosePerson'
};
</script>

<script setup>
import { getPersonList } from '@/api/Interior/Person.js';
import { getOrganizationTree } from '@/api/Interior/Organization.js';

const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { modelValue } = toRefs(props),
  emit = defineEmits(['update:modelValue', 'choose']);

const visible = ref(modelValue.value);
watch(modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    getPagingList();
    $store.dispatch('enums/getEnum', {
      fn: getOrganizationTree(),
      callback(list) {
        organizationTree.value = list;
      },
    });
  }
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

const searchKey = ref({
    state: 1,
    organizationId: null,
    name: '',
  }),
  organizationTree = ref([]),
  index = ref(1),
  size = ref(10),
  total = ref(0),
  pagingList = ref([]);
async function getPagingList({ index: _index } = {}) {
  index.value = _index || index.value;
  pagingList.value = [];
  await getPersonList({
    params: {
      index: index.value,
      size: size.value,
      ...searchKey.value,
    },
  }).then(res => {
    if (res.code == 200) {
      pagingList.value = res.data.list;
      total.value = res.data.totalSize;
    }
  });
}
function doChoose(row) {
  emit('choose', row);
  emit('update:modelValue', false);
}
</script>

<template>
  <MyDialog v-model="visible" title="" width="850px">
    <SearchArea>
      <SearchRow>
        <SearchItem label="所属机构">
          <el-cascader
            v-model="searchKey.organizationId"
            placeholder="请选择所属机构"
            :options="organizationTree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'name',
            }"
            clearable
            @change="getPagingList({index: 1})"
          />
        </SearchItem>
        <SearchItem label="人员名称">
          <el-input v-model="searchKey.name" placeholder="请输入人员名称" clearable @clear="getPagingList({index: 1})" />
          <el-button type="primary" round @click="getPagingList({index: 1})">搜索</el-button>
        </SearchItem>
      </SearchRow>
    </SearchArea>

    <AutoAffix
      :data="pagingList"
      :row-style="{cursor: 'pointer'}"
      table
      @row-click="doChoose"
    >
      <el-table-column label="人员工号" align="center">
        <template #default="{row}">
          <LineClamp :content="row.systemCode" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="人员账号" align="center">
        <template #default="{row}">
          <LineClamp :content="row.accountName" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="人员名称" align="center">
        <template #default="{row}">
          <LineClamp :content="row.name" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="人员角色" align="center">
        <template #default="{row}">
          <LineClamp :content="row.roleName" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="所属机构" align="center">
        <template #default="{row}">
          <LineClamp :content="row.organizationName" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template #default="{row}">
          <LineClamp :content="row.phone" selector="td" autosize />
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
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>
