/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-07 11:44:34
 */
import { createRouter, createWebHistory } from 'vue-router';
import interceptor from './interceptor.js';

const routes = [
  {
    path: '/404',
    name: 'Error',
    meta: {
      title: '404 not found',
    },
    component: () => import('@/views/Error/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/Login/index.vue'),
  },
];

var router = createRouter({ // 使用 var 使得打包后变量提升
  history: createWebHistory(),
  routes,
});

interceptor(router);

export default router;
