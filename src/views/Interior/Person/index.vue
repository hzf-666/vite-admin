<script>
const menuName = 'Person';
export default {
  name: menuName
};
</script>

<script setup>
import { getPersonList, editPersonState, delPerson } from '@/api/Interior/Person.js';
import { getOrganizationTree } from '@/api/Interior/Organization.js';

const {
  setValue, searchKey,
  index, size, total, activeValue, inactiveValue,
  pagingList, getPagingList, changeState, del,
  showColumn, getWidth, columnWidth, initWidth,
} = $usePagingList({
  listFn: getPersonList,
  stateFn: editPersonState,
  delFn: delPerson,
});
const organizationTree = ref([]),
  userInfo = computed(() => $store.get('userInfo')),
  accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id);
$useActivated(once => {
  if (once) {
    setValue('searchKey', {
      organizationId: null,
      name: '',
    });
    setValue('delMsg', { content: '确定注销该人员吗？' });
    getPagingList();
    $store.dispatch('enums/getEnum', {
      fn: getOrganizationTree(),
      callback(list) {
        organizationTree.value = list;
      },
    });
  }
});
</script>

<template>
  <SubPage>
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
        <template #operation>
          <el-button
            v-auth="`${menuName}Add`"
            type="primary"
            round
            @click="$router.push({name: `${menuName}Add`})"
          >
            {{ $useAuth(`${menuName}Add`, '新增') }}
          </el-button>
        </template>
      </SearchRow>
    </SearchArea>

    <AutoAffix :data="pagingList" table>
      <el-table-column v-if="accountTypeId != 1" label="人员工号" align="center">
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
              {{ $useAuth(`${menuName}Delete`, '注销') }}
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
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
