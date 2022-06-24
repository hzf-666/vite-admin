/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-01 14:54:00
 */
import { createRouter, createWebHistory } from 'vue-router';
import interceptor from './interceptor.js';

const routes = [
  {
    path: '/404',
    name: 'Error',
    meta: {
      title: '404 not found',
      fullTitle: true,
    },
    component: () => import('@v/Error/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      fullTitle: true,
    },
    component: () => import('@v/Login/index.vue'),
  },
  /* 用来重新加载二级页面时临时跳转以清除页面缓存 */
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@c/Layout/index.vue'),
  },
];

var router = createRouter({ // 使用 var 使得打包后变量提升
  history: createWebHistory(),
  routes,
});

interceptor(router);

export default router;
