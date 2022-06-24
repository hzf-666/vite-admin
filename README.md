<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzf
 * @Date: 2022-04-27 11:56:52
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 15:14:24
-->
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## v-limit 自定义指令常用正则表达式

1. 两位小数
  - 1.1 正数
    - input: /(0|[1-9]\d*)(\.\d{0,2})?/,
    - blur: /(^[1-9]\d*$)|(^(0|[1-9]\d*)\.\d{1,2}$)/,
  - 1.2 正数和零
    - blur: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  - 1.3 负数
    - input: /-((0|[1-9]\d*)(\.\d{0,2})?)?/,
    - blur: /(^-[1-9]\d*$)|(^-(0|[1-9]\d*)\.\d{1,2}$)/,
  - 1.4 负数和零
    - input: /0|(-((0|[1-9]\d*)(\.\d{0,2})?)?)/,
    - blur: /(^0$)|(^-0\.\d{1,2}$)|(^-[1-9]\d*(\.\d{1,2})?$)/,
  - 1.5 正数或负数
    - input: /-?((0|[1-9]\d*)(\.\d{0,2})?)?/,
    - blur: /(^-?[1-9]\d*$)|(^-?(0|[1-9]\d*)\.\d{1,2}$)/,
  - 1.6 正数或负数和零
    - input: /0|(-?((0|[1-9]\d*)(\.\d{0,2})?)?)/,
    - blur: /(^0$)|(^-?[1-9]\d*$)|(^-?(0|[1-9]\d*)\.\d{1,2}$)/,

2. 联系方式（使用 - 连接）
    - input: /(\d+-?)*\d*/,
    - blur: /^(\d+-?)*\d+$/,

3. 非中文和空格（联系邮箱、账号密码）
    - input: /[^\u4e00-\u9fa5| ]+/,

4. 字母、数字和下划线
    - input: /\w+/,

5. 整数
  - 5.1 正整数
    - input: /[1-9]\d*/,
  - 5.2 零和正整数
    - input: /0|[1-9]\d*/,
  - 5.3 负整数
    - input: /-([1-9]\d*)?/,
    - blur: /^-[1-9]\d*$/,
  - 5.4 零和负整数
    - input: /0|(-([1-9]\d*)?)/,
    - blur: /(^0$)|(^-[1-9]\d*$)/,

## el-table 列宽度

1. 状态 / 三字
    - 70px
2. 四字
    - 80px
3. YYYY-MM-DD
    - 100px
4. YYYY-MM-DD HH:mm
    - 155px

## el-input 宽度
1. YYYY-MM-DD
    - 146px
2. YYYY-MM-DD HH:mm
    - 185px

## 用户片段

1. vue
  - 1.1 vue3
    - 自定义vue3快捷模板
  - 1.2 vue3-page-list
    - vue3页面列表
  - 1.3 vue3-page-tree
    - vue3页面树形
  - 1.4 vue3-page-add
    - vue3页面新增
  - 1.5 vue3-page-edit
    - vue3页面修改
  - 1.6 vue3-page-detail
    - vue3页面详情
  - 1.7 vue3-dialog-list
    - vue3弹窗列表
  - 1.8 vue3-dialog-tree
    - vue3弹窗树形
  - 1.9 vue3-dialog-form
    - vue3弹窗表单
  - 1.10 vue3-dialog
    - vue3弹窗组件
2. js
  - 1.1 vue3-api
    - vue3基本接口文件
  - 1.2 vue3-route-index
    - vue3路由index文件
  - 1.3 vue3-route-menu
    - vue3路由菜单文件
  - 1.4 vue3-enums
    - vue3获取枚举js文件
  - 1.5 vue3-page-hook
    - vue3页面hook文件
