/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-07 11:24:53
 */
import { addRoutes } from '@/router/routes';

const whiteList = ['Login'];

export default function(router) {
  router.beforeEach(async(to) => { // 全局前置守卫
    document.title = to.meta.title || ''; // 设置页面标题

    if (to.query.token) { // 通过路径 token 登录
      $caches('session').set('token', to.query.token);
    }

    if (!whiteList.includes(to.fullPath) && !whiteList.includes(to.name)) { // 不在白名单之内
      const token = $caches('session').get('token'), routes = $store.get('routes');
      if (token) {
        if (!routes.length) {
          await addRoutes();
          return { ...to, replace: true };
        }
      } else {
        const login = { name: 'Login', replace: true };
        return router.hasRoute(login.name) ? login : false;
      }
    }
  });

  router.afterEach(() => { // 全局后置钩子

  });
}
