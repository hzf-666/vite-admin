/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-26 16:20:42
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 18:01:35
 */
const modules = import.meta.globEager('./modules/*.js'),
  reg = /^\.\/modules\/(.*)\.js$/,
  space = {};

Object.keys(modules).forEach(k => {
  space[k.replace(reg, '$1')] = modules[k].default;
});

import { getUserInfo } from '@/api';
const token = $caches('session').get('token'),
  userInfo = $caches('session').get('userInfo');


const state = reactive({
    routeTree: [],
    repeatedRoutes: {},
    skipRepeatedRoute: false,
    sideMenu: [],
    searchMenu: [],
    token: token || '',
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  }),
  spacedState = reactive({
    ...space,
  }),
  mutations = {
    setToken({ state }, value) {
      $caches('session').set('token', value);
      state.token = value;
    },
    pushRepeatedRoute({ state }, { key, value }) {
      if (!state.repeatedRoutes[key]) state.repeatedRoutes[key] = [];
      state.repeatedRoutes[key].push(value);
    },
    pushSearchMenu({ state }, value) {
      state.searchMenu.push(value);
    },
  },
  actions = {
    async setUserInfo({ state }) {
      return await getUserInfo().then(res => {
        if (res.code == 200) {
          $caches('session').set('userInfo', JSON.stringify(res.data));
          state.userInfo = res.data;
        }
      });
    },
  };

function get(key) {
  const arr = key.split('/');
  if (arr.length == 1) {
    return $deepCopy(state[key]);
  } else {
    return $deepCopy(spacedState[arr[0]].state[arr[1]]);
  }
}
function set(key, value) {
  const arr = key.split('/'), _value = $deepCopy(value);
  if (arr.length == 1) {
    state[key] = _value;
  } else {
    spacedState[arr[0]].state[arr[1]] = _value;
  }
}
function commit(name, value) {
  const arr = name.split('/'), _value = $deepCopy(value),
    namespace = spacedState[arr[0]],
    result = arr.length == 1 ? mutations[name]({ state, commit }, _value)
      : namespace.mutations[arr[1]]({
        state: namespace.state,
        commit: (_name, _value) => commit(`${ arr[0] }/${ _name }`, _value),
      }, _value);
  return $deepCopy(result);
}
async function dispatch(name, value) {
  const arr = name.split('/'), _value = $deepCopy(value),
    namespace = spacedState[arr[0]],
    result = arr.length == 1 ? await actions[name]({ state, commit }, _value)
      : await namespace.actions[arr[1]]({
        state: namespace.state,
        commit: (_name, _value) => commit(`${ arr[0] }/${ _name }`, _value),
        dispatch: async(_name, _value) => await dispatch(`${ arr[0] }/${ _name }`, _value),
      }, _value);
  return $deepCopy(result);
}

export default {
  get,
  set,
  commit,
  dispatch,
};
