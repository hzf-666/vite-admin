<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-11 20:14:49
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 16:55:31
-->
<script>
const menuName = 'Person';
export default {
  name: `${ menuName }Add`
};
</script>

<script setup>
import hook from './js/hook.js';

const myForm = ref(null),
  { formData, labelWidth, doConfirm, cancel } = hook({
    menuName, myForm, type: 'Add',
  });
</script>

<template>
  <SubPage>
    <AutoAffix>
      <MyForm ref="myForm" v-model="formData" :label-width="labelWidth" class="page_form">
        <template #names="{separate, model, tab, clearValidate}">
          <el-form-item v-bind="separate.name.formItem" prop="name">
            <el-input
              v-model="model.name"
              v-tab="tab.name"
              v-bind="separate.name.attrs"
              @focus="clearValidate('name')"
            />
          </el-form-item>
          <el-form-item v-bind="separate.accountName.formItem" prop="accountName">
            <el-input
              v-model="model.accountName"
              v-tab="tab.name"
              v-limit.input="limit => model.accountName = limit({
                value: model.accountName,
                input: /\w+/,
              })"
              v-bind="separate.accountName.attrs"
              @focus="clearValidate('accountName')"
            />
          </el-form-item>
        </template>
        <template #fileObj="{model, tab}">
          <MyUpload v-tab="tab.name" photo @change="files => model.fileObj = files[0]" />
        </template>
      </MyForm>

      <template #down>
        <div class="page_form_btns">
          <el-button type="primary" round @click="doConfirm">确认</el-button>
          <el-button round @click="cancel">取消</el-button>
        </div>
      </template>
    </AutoAffix>
  </SubPage>
</template>

<style lang="scss" scoped>

</style>
