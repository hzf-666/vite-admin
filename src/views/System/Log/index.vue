<script>
const menuName = 'Log';
export default {
  name: menuName,
  components: { ElDatePicker }
};
</script>

<script setup>
import { getLogList, editLogState, delLog } from '@/api/System/Log.js';
import ElDatePicker from '../../../components/element-plus/ElDatePicker.vue';

const {
  setValue, searchKey,
  index, size, total, activeValue, inactiveValue,
  pagingList, getPagingList, changeState, del,
  showColumn, getWidth, columnWidth, initWidth,
} = $usePagingList({
  listFn: getLogList,
  stateFn: editLogState,
  delFn: delLog,
});
$useActivated(once => {
  if (once) {
    setValue('searchKey', {
      startTime: '',
      endTime: '',
      keywords: '',
    });
    setValue('delMsg', { content: '确定删除该数据吗？' });
    getPagingList();
  }
});
</script>

<template>
  <SubPage>
    <SearchArea>
      <SearchRow>
        <SearchItem label="开始时间">
          <el-date-picker
            v-model="searchKey.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 185px;"
            @change="getPagingList({index: 1})"
          />
        </SearchItem>
        <SearchItem label="结束时间">
          <el-date-picker
            v-model="searchKey.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            style="width: 185px;"
            @change="getPagingList({index: 1})"
          />
        </SearchItem>
        <SearchItem label="">
          <el-input v-model="searchKey.keywords" placeholder="输入操作人/操作内容/IP搜索" clearable @clear="getPagingList({index: 1})" />
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
      <el-table-column label="IP地址" prop="ip" align="center" />
      <el-table-column label="操作模块" prop="functionName" align="center" />
      <el-table-column label="操作类型" prop="actionType" align="center" width="80px" />
      <el-table-column label="操作内容" align="center">
        <template #default="{row}">
          <LineClamp :content="row.remark" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="createBy" align="center" width="70px" />
      <el-table-column label="操作时间" prop="createTime" align="center" width="155px" />
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
      <!-- <el-table-column v-if="showColumn" :width="columnWidth" fixed="right">
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
      </el-table-column> -->

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
