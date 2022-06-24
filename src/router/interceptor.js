/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 11:20:53
 */
import { addRoutes } from '@/router/handle';

const whiteList = ['Login'],
  login = { name: 'Login', replace: true };


export function setTitle(route) { // 设置页面标题
  const appName = $store.get('settings/appName');
  document.title = route.meta.fullTitle ? (route.meta.title || appName || '')
    : route.meta.title ? `${ route.meta.title }${ appName ? ' | ' + appName : '' }`
      : (appName || '');
}
function getMatchedPath(fullPath, name) { // 获取相同路由中匹配度更高的一个
  if ($store.get('skipRepeatedRoute')) {
    $store.set('skipRepeatedRoute', false);
    return;
  }
  if (!fullPath || !name) return;
  let maxCount = 0, result = null;
  const routes = $store.get('repeatedRoutes')[name];
  if (routes && routes.length) {
    const arr = fullPath.slice(1).split('/');
    routes.forEach(route => {
      let count = 0;
      const pathArr = route.path.slice(1).split('/');
      for (let i = 0; i < arr.length; i++) {
        if (pathArr[i] && pathArr[i] === arr[i] && count === i) count++;
      }
      if (count > maxCount) {
        maxCount = count;
        result = route;
      }
    });
  }
  return result;
}
function setSideMenu(route) { // 设置侧边栏菜单
  if (route.meta && route.meta.matched) {
    const target = $store.get('routeTree').find(item => item.name === route.meta.matched[0].name);
    target && $store.set('sideMenu', target.children);
  }
}
function doPushScrollTags(route) {
  if (route.meta.type && !route.meta.affix) {
    $store.commit('layout/pushScrollTags', route);
  }
}

export default function(router) {
  router.beforeEach(async(to, from) => { // 全局前置守卫
    setTitle(to);

    if (to.query.token) { // 通过路径 token 登录
      $store.commit('setToken', to.query.token);
    }

    let layoutRoute, layoutRouteParams;
    if (to.name === 'Layout' && to.params.route) {
      layoutRoute = JSON.parse(to.params.route);
      layoutRouteParams = $deepCopy(layoutRoute.params);
      layoutRoute.params = {};
    }
    for (const k in from.params) { // 将 chains 继承
      const isEqual = from.name.replace(/\d/g, '') === k.replace(/(\d)|(Chains)/g, '');
      if (to.name !== 'Layout' && /Chains$/.test(k) && !isEqual) to.params[k] = from.params[k];
      if (layoutRoute && !isEqual) layoutRoute.params[k] = layoutRouteParams[k];
    }
    if (layoutRoute) {
      to.params.route = JSON.stringify(layoutRoute);
    }

    if (!whiteList.includes(to.fullPath) && !whiteList.includes(to.name)) { // 不在白名单之内
      const token = $caches('session').get('token'), currentRouteTree = $store.get('routeTree');
      if (token) {
        if (!currentRouteTree.length) {
          await addRoutes();
          if ($store.get('routeTree').length) {
            const route = getMatchedPath(from.fullPath, to.name);
            setSideMenu(route || to);
            if (route && route.name !== to.name) {
              doPushScrollTags(route);
              return { ...route, replace: true };
            }
            doPushScrollTags(to);
            return { ...to, replace: true };
          } else {
            console.warn('routeTree is an empty array');
            setTitle(from);
            return from.name === login.name ? false : login;
          }
        } else {
          const route = getMatchedPath(from.fullPath, to.name);
          setSideMenu(route || to);
          if (route && route.name !== to.name) {
            doPushScrollTags(route);
            return { ...route, replace: true };
          }
          doPushScrollTags(to);
        }
      } else {
        if (router.hasRoute(login.name)) {
          return login;
        } else {
          setTitle(from);
          return false;
        }
      }
    }
  });

  router.afterEach(() => { // 全局后置钩子
    //
  });
}
