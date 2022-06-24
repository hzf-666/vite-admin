/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-26 17:08:16
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 13:33:51
 */
const env = import.meta.env.DEV,
  appName = $caches('session').get('appName'),
  skipLogin = $caches('session').get('skipLogin'),
  dynamicAuth = $caches('session').get('dynamicAuth');

export default {
  state: {
    appName: (env && appName !== null) ? appName : '后台管理系统',
    skipLogin: (env && skipLogin) ? JSON.parse(skipLogin) : false,
    dynamicAuth: (env && dynamicAuth) ? JSON.parse(dynamicAuth) : true,
    maxMobileWidth: 960,
  },
  mutations: {
    setAppName({ state }, value) {
      $caches('session').set('appName', value);
      state.appName = value;
    },
    setSkipLogin({ state }, value) {
      $caches('session').set('skipLogin', value);
      state.skipLogin = value;
    },
    setDynamicAuth({ state }, value) {
      $caches('session').set('dynamicAuth', value);
      state.dynamicAuth = value;
    },
  },
  actions: {},
};
