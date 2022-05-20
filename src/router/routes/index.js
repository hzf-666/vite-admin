/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-06 10:55:05
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-07 11:40:06
 */
import Layout from '@c/Layout/index.vue';

const routes = [
  {
    name: 'Interior',
    path: '/interior',
    component: Layout,
    meta: {
      title: '内部管理'
    },
  },
];

export async function addRoutes() {
  removeRoutes();
  $store.set('routes', [
    {
      path: '/home',
      name: 'Home',
      meta: {
        title: '首页',
      },
      component: () => import('@/views/Home/index.vue'),
      children: [{
        path: '/home11',
        name: 'Home11',
        meta: {
          title: '首页11',
        },
        component: () => import('@/views/Home/index.vue'),
      }],
    },
    { path: '/', name: 'ToIndex', redirect: '/home' },
    { path: '/:catchAll(.*)', name: 'To404', redirect: '/404' },
  ]);
  $store.get('routes').forEach(route => {
    $router.addRoute(route);
  });
}

export function removeRoutes() {
  $store.get('routes').forEach(route => {
    if ($router.hasRoute(route.name)) {
      $router.removeRoute(route.name);
    }
  });
  $store.set('routes', []);
}
