<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 14:19:08
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 20:07:10
-->
<script>
const menuName = 'Enterprise';
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
        <template #names="{separate, model}">
          <el-form-item v-bind="separate.name.formItem" prop="name">
            <el-input v-model="model.name" class="showonly" disabled />
          </el-form-item>
          <el-form-item v-bind="separate.accountName.formItem" prop="accountName">
            <el-input v-model="model.accountName" class="showonly" disabled />
          </el-form-item>
        </template>
        <template #fileObj="{model}">
          <el-image
            class="form_avatar"
            :src="model.fileObj.url"
            :preview-src-list="[model.fileObj.url]"
          >
            <template #error>
              <div class="el-image__error">
                {{ model.fileObj.url ? '加载失败' : '暂无图片' }}
              </div>
            </template>
          </el-image>
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
