<script>
const menuName = 'CustomForm';
export default {
  name: menuName
};
</script>

<script setup>
import { getCustomFormList, editCustomFormState, delCustomForm } from '@/api/System/CustomForm.js';

const {
  setValue, searchKey,
  index, size, total, activeValue, inactiveValue,
  pagingList, getPagingList, changeState, del,
  showColumn, getWidth, columnWidth, initWidth,
} = $usePagingList({
  listFn: getCustomFormList,
  stateFn: editCustomFormState,
  delFn: delCustomForm,
});
$useActivated(once => {
  if (once) {
    setValue('searchKey', {
      title: '',
    });
    setValue('delMsg', { content: '确定删除该自定义表单吗？' });
    getPagingList();
  }
});
</script>

<template>
  <SubPage>
    <SearchArea>
      <SearchRow>
        <SearchItem label="标题">
          <el-input v-model="searchKey.title" placeholder="请输入标题" clearable @clear="getPagingList({index: 1})" />
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
      <el-table-column label="标题" align="center">
        <template #default="{row}">
          <LineClamp :content="row.title" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="行数" prop="row" align="center" width="70px" />
      <el-table-column label="列数" prop="col" align="center" width="70px" />
      <el-table-column label="添加人员" prop="createBy" align="center" width="80px" />
      <el-table-column label="添加时间" prop="createTime" align="center" width="155px" />
      <!-- <el-table-column label="状态" class-name="state" align="center" width="70px">
        <template #default="{row}">
          <el-switch
            v-model="row.stateObj.id"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
            :disabled="!$useAuth(`${menuName}State`)"
            @change="changeState({row})"
          />
        </template>
      </el-table-column> -->
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
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
