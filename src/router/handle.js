/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 13:40:00
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 11:19:02
 */
import routes from './routes';
import Layout from '@c/Layout/index.vue';
import SubPage from '@c/SubPage.vue';
import { sortLikeWin } from '@u';
import { getUserAuth } from '@/api';

const allRoutes = {};
$recurseOrder(routes, item => {
  if (!allRoutes[item.name]) {
    allRoutes[item.name] = $deepCopy(item);
  }
});

let realRoutes = [], // 将多级路由转换成二级路由存放于此
  routeTree = [];

export async function addRoutes(clear = true) {
  removeRoutes(clear);

  let indexPage, _routeTree = [];
  const isDynamic = !$store.get('settings/skipLogin') && $store.get('settings/dynamicAuth'),
    alreadyAdds = {};

  if (isDynamic) {
    await getUserAuth().then(res => {
      if (res.code == 200) {
        _routeTree = $deepCopy(res.data);
      } else {
        _routeTree = [];
      }
    });
  } else {
    _routeTree = $deepCopy(routes);
  }

  $recurseInto(_routeTree, (item, { parent }) => {
    const children = [];
    item.meta = item.meta || {};
    if (item.children && item.children.length) {
      item.children.forEach(child => {
        if (child.meta && child.meta.type == 1) {
          _routeTree.push(child);
        } else {
          children.push(child);
        }
      });
    }
    item.children = children;
    delete item.component;

    const realRoute = allRoutes[item.name] || {};
    item.path = '/' + (realRoute.path || item.name.replace(/^./, (...arg) => arg[0].toLowerCase()));
    ['fullTitle', 'icon'].forEach(k => {
      if (realRoute.meta && realRoute.meta[k] !== undefined && (item.meta[k] === undefined || item.meta[k] === '')) item.meta[k] = realRoute.meta[k];
    });
    const matchedItem = {
        name: item.name,
        path: item.path,
        title: item.meta.title,
        type: item.meta.type,
        redirect: item.meta.redirect,
      },
      route = {
        name: item.name,
        path: item.path,
        component: realRoute.component,
        meta: {
          title: item.meta.title,
          fullTitle: !!item.meta.fullTitle,
          type: item.meta.type,
          affix: !!item.meta.affix,
          isClassify: !realRoute.component && !item.meta.redirect,
        },
        children: [],
      };
    item.meta.isClassify = route.meta.isClassify;
    matchedItem.isClassify = route.meta.isClassify;

    const isAddRepeated = !!alreadyAdds[route.name];
    if (item.meta.type == 1) {
      item.meta.matched = [matchedItem];
      route.component = route.component || Layout;
      route.meta.matched = item.meta.matched;
      if (isAddRepeated) {
        console.error(`module route [${ item.name }] already exist`);
      } else {
        alreadyAdds[route.name] = route;
        realRoutes.push(route);
      }
    } else {
      if (item.meta.type == 2) {
        route.component = route.component || SubPage;
      }
      item.path = (parent ? parent.path : '') + item.path;
      matchedItem.path = item.path;
      route.path = item.path;
      item.meta.matched = parent ? [...parent.meta.matched, matchedItem] : [matchedItem];
      route.meta.matched = item.meta.matched;
      const moduleRoute = realRoutes.find(r => r.name === (item.meta.matched[0] && item.meta.matched[0].name));
      if (moduleRoute) {
        if (moduleRoute.meta.isClassify) {
          if (isAddRepeated) {
            if (!$store.get('repeatedRoutes')[route.name]) {
              $store.commit('pushRepeatedRoute', { key: route.name, value: alreadyAdds[route.name] });
            }
            if ($store.get('repeatedRoutes')[route.name].find(r => r.path === route.path)) {
              console.warn(`route [${ route.name }] already exist`);
            } else {
              const name = route.name;
              route.name = route.name + $store.get('repeatedRoutes')[route.name].length;
              route.meta.realName = name;
              item.name = route.name;
              item.meta.realName = name;
              matchedItem.name = route.name;
              matchedItem.realName = name;
              moduleRoute.children.push(route);
              $store.commit('pushRepeatedRoute', { key: name, value: route });
            }
          } else {
            alreadyAdds[route.name] = route;
            moduleRoute.children.push(route);
          }
        } else {
          if (isAddRepeated) {
            console.error(`route [${ route.name }] already exist`);
          } else {
            alreadyAdds[route.name] = route;
            moduleRoute.children.push(route);
          }
        }
      } else {
        console.error(`module route [${ item.name }] not exist`);
      }
    }
    if (!indexPage && !item.meta.isClassify) {
      if (item.meta.redirect) {
        if (!$regs.link.test(item.meta.redirect)) indexPage = item.meta.redirect;
      } else {
        indexPage = item.path;
      }
    }
    if (item.meta.affix) {
      $store.commit('layout/pushAffixTags', item);
    }
    $store.commit('pushSearchMenu', item);
  });
  _routeTree.forEach(item => {
    if (!routeTree.find(route => route.name === item.name)) {
      routeTree.push(item);
    }
  });

  realRoutes = realRoutes.concat([
    { path: '/', name: 'ToIndex', redirect: indexPage || '404' },
    { path: '/:catchAll(.*)', name: 'To404', redirect: '/404' },
  ]);
  realRoutes.forEach(route => {
    $router.addRoute(route);
    route.children && $recurseInto(route.children, item => {
      if (!item.component) $router.removeRoute(item.name);
    });
  });
  $store.set('routeTree', routeTree);
}

export async function updateRoutes(currentRoute, { excludes = [], clear = true } = {}) {
  let mName;
  const allNames = [];
  await addRoutes(false);
  $recurseInto(routeTree, item => {
    allNames.push(item.name);
    if (item.name === currentRoute.name) {
      const matched = item.meta.matched;
      if (!mName && matched && matched[0]) mName = matched[0].name;
    }
  });
  if (mName) {
    $store.set('sideMenu', routeTree.find(r => r.name === mName).children);
  } else {
    $router.push('/');
  }
  if (clear) {
    ['AffixTags', 'ScrollTags'].forEach(str => {
      $store.get(`layout/${ str.replace(/^./, (...arg) => arg[0].toLowerCase()) }`).forEach(tag => {
        if (allNames.includes(tag.name)) {
          if (str === 'ScrollTags' && !excludes.includes(tag.name)) $store.commit('layout/pushExcludeKeepAlive', [tag.name]);
        } else {
          $store.commit(`layout/remove${ str }`, [tag.name]);
        }
      });
    });
  }
}

export function removeRoutes(clear = true) {
  realRoutes.forEach(route => {
    if ($router.hasRoute(route.name)) {
      $router.removeRoute(route.name);
    }
  });
  realRoutes = [];
  routeTree = [];
  $store.set('routeTree', []);
  $store.set('repeatedRoutes', {});
  $store.set('sideMenu', []);
  $store.set('searchMenu', []);
  if (clear) {
    $store.set('layout/affixTags', []);
    $store.set('layout/scrollTags', []);
  }
}

export function importRoutes(files = {}, dirFiles = {}, whiteList = []) {
  const allFiles = { ...files, ...dirFiles },
    reg = /^\.\/([^/]*)\.js$/,
    reg1 = /^\.\/(.*)\.js$/,
    reg2 = /^\.\/(.*)\/(.*)\.js$/;

  let result = [];
  Object.keys(allFiles).forEach(k => {
    if (reg.test(k)) {
      const fileName = k.replace(reg1, '$1');
      if (!whiteList.includes(fileName)) {
        result.push({ name: fileName, default: allFiles[k].default });
      }
    } else {
      const dirFileName = k.replace(reg2, '$2');
      if (dirFileName === 'index') {
        result.push({ name: k.replace(reg2, '$1'), default: allFiles[k].default });
      }
    }
  });
  result = result.sort(sortLikeWin).map(item => item.default);
  return result;
}
