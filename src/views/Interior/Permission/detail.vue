<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:24:02
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 09:59:12
-->
<script>
const menuName = 'Permission';
export default {
  name: `${ menuName }Detail`
};
</script>

<script setup>
import hook from './js/hook.js';

const { formData, labelWidth, edit, back } = hook({
  menuName,
});
</script>

<template>
  <SubPage>
    <AutoAffix>
      <MyForm v-model="formData" :label-width="labelWidth" class="page_form" showonly>
        <template #icon="{model}">
          <el-icon v-if="model.icon" :size="24" color="var(--el-color-primary)">
            <component :is="model.icon" />
          </el-icon>
          <el-input v-else value="无" class="showonly" disabled />
        </template>
      </MyForm>

      <template #down>
        <div class="page_form_btns">
          <el-button v-auth="`${menuName}Edit`" type="primary" round @click="edit">
            {{ $useAuth(`${menuName}Edit`, '修改') }}
          </el-button>
          <el-button round @click="back">返回</el-button>
        </div>
      </template>
    </AutoAffix>
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
