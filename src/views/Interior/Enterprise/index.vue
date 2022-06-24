<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 14:01:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-18 19:05:32
-->
<script>
const menuName = 'Enterprise';
export default {
  name: menuName
};
</script>

<script setup>
import { getEnterpriseList, editEnterpriseState, delEnterprise } from '@/api/Interior/Enterprise.js';

const {
  setValue, searchKey,
  index, size, total, activeValue, inactiveValue,
  pagingList, getPagingList, changeState, del,
  showColumn, getWidth, columnWidth, initWidth,
} = $usePagingList({
  listFn: getEnterpriseList,
  stateFn: editEnterpriseState,
  delFn: delEnterprise,
});
$useActivated(once => {
  if (once) {
    setValue('searchKey', {
      name: '',
    });
    setValue('delMsg', { content: '确定删除该企业吗？' });
    getPagingList();
  }
});
</script>

<template>
  <SubPage>
    <SearchArea>
      <SearchRow>
        <SearchItem label="企业名称">
          <el-input v-model="searchKey.name" placeholder="请输入企业名称" clearable @clear="getPagingList({index: 1})" />
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
      <el-table-column label="Logo" class-name="lh_1" align="center" width="91px">
        <template #default="{row}">
          <el-image
            :src="row.fileObj.url"
            :preview-src-list="[row.fileObj.url]"
            style="width: 70px; height: 70px;"
            class="form_avatar"
            preview-teleported
          >
            <template #error>
              <div class="el-image__error">
                {{ row.fileObj.url ? '加载失败' : '暂无图片' }}
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center">
        <template #default="{row}">
          <LineClamp :content="row.name" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="企业账号" align="center">
        <template #default="{row}">
          <LineClamp :content="row.accountName" selector="td" autosize />
        </template>
      </el-table-column>
      <el-table-column label="机构数量" prop="organizationNum" align="center" width="80px" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="155px" />
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
