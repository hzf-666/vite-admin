/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:26:52
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 17:28:53
 */
export default {
  name: 'Permission',
  component: () => import('@v/Interior/Permission/index.vue'),
  meta: {
    title: '权限管理',
    type: 3,
    icon: 'IconLockOff',
  },
  children: [
    {
      name: 'PermissionAdd',
      path: 'add',
      component: () => import('@v/Interior/Permission/add.vue'),
      meta: {
        title: '权限管理-新增',
        type: 5,
      },
    },
    {
      name: 'PermissionEdit',
      path: 'edit/:id',
      component: () => import('@v/Interior/Permission/edit.vue'),
      meta: {
        title: '权限管理-修改',
        type: 5,
      },
    },
    {
      name: 'PermissionDetail',
      path: 'detail/:id',
      component: () => import('@v/Interior/Permission/detail.vue'),
      meta: {
        title: '权限管理-详情',
        type: 5,
      },
    },
  ],
};
