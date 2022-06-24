<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:23:56
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-16 17:48:55
-->
<script>
const menuName = 'Permission';
export default {
  name: `${ menuName }Add`
};
</script>

<script setup>
import hook from './js/hook.js';

const myForm = ref(null),
  {
    formData, labelWidth, doConfirm, cancel, parentName,
    showChoosePermission, doChoosePermission,
    defaultExpandedKeys, defaultCheckedKeys,
    showChooseIcon, doChooseIcon,
  } = hook({
    menuName, myForm, type: 'Add',
  });
</script>

<template>
  <SubPage>
    <AutoAffix>
      <MyForm ref="myForm" v-model="formData" :label-width="labelWidth" class="page_form">
        <template #parentId="{tab}">
          <el-button v-tab="{name: tab.name, current: true}" type="primary" @click="showChoosePermission = true">
            {{ parentName }}
          </el-button>
        </template>
        <template #icon="{model, tab}">
          <el-button v-tab="{name: tab.name, current: true}" type="primary" class="icon_choose_btn" @click="showChooseIcon = true">
            <template v-if="model.icon">
              <el-icon :size="24">
                <component :is="model.icon" />
              </el-icon>
              <el-icon :size="20" class="icon_clear" @click.stop="model.icon = ''">
                <IconEpCircleCloseFilled />
              </el-icon>
            </template>
            <span v-else>选择图标</span>
          </el-button>
        </template>
      </MyForm>

      <template #down>
        <div class="page_form_btns">
          <el-button type="primary" round @click="doConfirm">确认</el-button>
          <el-button round @click="cancel">取消</el-button>
        </div>
      </template>
    </AutoAffix>

    <ChooseIcon v-model="showChooseIcon" @choose="doChooseIcon" />
    <ChoosePermission
      v-model="showChoosePermission"
      :tree-props="{
        data: formData.parentId.options,
        defaultExpandedKeys,
        defaultCheckedKeys,
      }"
      @choose="doChoosePermission"
    />
  </SubPage>
</template>

<style lang="scss" scoped>
@import "./scss/index.scss";
</style>
