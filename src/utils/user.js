/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-26 09:06:04
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 18:02:37
 */
import { removeRoutes } from '@/router/handle.js';

export function logout({ message = false } = {}) { // 退出登录调用这个函数
  $router.push('/login');
  removeRoutes();
  $caches('session').remove('token'); // 清除 token 本地缓存
  $caches('session').remove('leftSideFold'); // 清除 leftSideFold 本地缓存
  $caches('session').remove('userInfo'); // 清除 userInfo 本地缓存
  $store.set('token', '');
  $store.set('layout/leftSideFold', false);
  $store.set('userInfo', {});
  message && $message.success('退出成功！');
}

export function handleExternalLink(link, { // 为外部链接带上系统参数
  keys = ['token'],
  params = {
    token: $caches('session').get('token'),
  },
} = {}) {
  let redirect = link;
  keys.forEach(str => {
    const regs = [new RegExp(`(\\?${ str })$`), new RegExp(`(&${ str })$`), new RegExp(`(\\?${ str })(&)`), new RegExp(`(&${ str })(&)`)];
    regs.forEach((reg, i) => {
      redirect = redirect.replace(reg, (...arg) => arg[1] + `=${ params[str] }` + (i > 1 ? arg[2] : ''));
    });
  });
  return redirect;
}
