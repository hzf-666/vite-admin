<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 14:19:08
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 11:48:14
-->
<script>
const menuName = 'Enterprise';
export default {
  name: `${ menuName }Edit`
};
</script>

<script setup>
import hook from './js/hook.js';

const isReset = ref(false), passWordRef = ref(null), fileList = ref([]);
function resetPassWord() {
  isReset.value = true;
  formData.value.password.value = '';
  passWordRef.value.focus();
}

const myForm = ref(null),
  { formData, labelWidth, doConfirm, cancel } = hook({
    menuName, myForm, type: 'Edit',
    isReset, fileList,
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
          <MyUpload v-tab="tab.name" :file-list="fileList" photo @change="files => model.fileObj = files[0]" />
        </template>
        <template #password="{item, model, tab}">
          <div class="d_f ai_c" style="width: 100%;">
            <el-input
              ref="passWordRef"
              v-model="model.password"
              v-bind="item.attrs"
              v-tab="tab.name"
              :disabled="!isReset"
              class="f_11a showonly"
            />
            <el-button type="primary" class="f_00a" style="margin-left: 10px;" @click="resetPassWord">重置密码</el-button>
          </div>
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
