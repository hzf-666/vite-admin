/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-14 11:17:44
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 14:57:42
 */
export default {
  state: {
    main: {},
    pageMain: {},
    autoAffix: {},
  },
  mutations: {
    addScroll({ state }, { key, value, type } = {}) {
      if ($typeOf(key) === 'string') state[type][key] = value;
    },
    updateScroll({ state }, type) {
      const tagNames = $store.get('layout/scrollTags').map(item => item.name);
      for (const k in state[type]) {
        if (!tagNames.includes(k)) delete state[type][k];
      }
    },
  },
  actions: {},
};
