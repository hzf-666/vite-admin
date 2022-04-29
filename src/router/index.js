/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-04-19 17:35:40
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
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/Home/index.vue'),
  },
  { path: '/' }, // 添加 / 路由以解决控制台警告信息
  { path: '/:catchAll(.*)', redirect: '/404' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

interceptor(router);

export default router;
