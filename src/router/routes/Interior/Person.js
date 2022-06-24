/*
 * @Descripttion:
 * @v/Interiorersion:
 * @Author: hzf
 * @Date: 2022-05-24 14:12:00
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-11 20:17:35
 */
export default {
  name: 'Person',
  component: () => import('@v/Interior/Person/index.vue'),
  meta: {
    title: '人员管理',
    type: 3,
    icon: 'IconPerson',
  },
  children: [
    {
      name: 'PersonAdd',
      path: 'add',
      component: () => import('@v/Interior/Person/add.vue'),
      meta: {
        title: '人员管理-新增',
        type: 5,
      },
    },
    {
      name: 'PersonEdit',
      path: 'edit/:id',
      component: () => import('@v/Interior/Person/edit.vue'),
      meta: {
        title: '人员管理-修改',
        type: 5,
      },
    },
    {
      name: 'PersonDetail',
      path: 'detail/:id',
      component: () => import('@v/Interior/Person/detail.vue'),
      meta: {
        title: '人员管理-详情',
        type: 5,
      },
    },
  ],
};

