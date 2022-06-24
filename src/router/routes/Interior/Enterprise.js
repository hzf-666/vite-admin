/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 14:12:00
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-07 14:12:51
 */
export default {
  name: 'Enterprise',
  component: () => import('@v/Interior/Enterprise/index.vue'),
  meta: {
    title: '企业管理',
    type: 3,
    icon: 'IconCompany',
  },
  children: [
    {
      name: 'EnterpriseAdd',
      path: 'add',
      component: () => import('@v/Interior/Enterprise/add.vue'),
      meta: {
        title: '企业管理-新增',
        type: 5,
      },
    },
    {
      name: 'EnterpriseEdit',
      path: 'edit/:id',
      component: () => import('@v/Interior/Enterprise/edit.vue'),
      meta: {
        title: '企业管理-修改',
        type: 5,
      },
    },
    {
      name: 'EnterpriseDetail',
      path: 'detail/:id',
      component: () => import('@v/Interior/Enterprise/detail.vue'),
      meta: {
        title: '企业管理-详情',
        type: 5,
      },
    },
  ],
};
