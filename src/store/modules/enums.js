/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-10 09:28:25
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-10 15:49:19
 */
import { getEnums } from '@/api';

const startList = {},
  startTree = {};

export default {
  state: {
    list: {},
    tree: {},
  },
  mutations: {},
  actions: {
    async setEnum({ state }, {
      name, params = {}, tree = 'isTree',
    } = {}) {
      let list = [];
      const res = await getEnums(name, { params });
      if (res.code == 200) list = res.data;
      if (params[tree]) {
        state.tree[name] = list;
      } else {
        state.list[name] = list;
      }
    },
    async getEnum({ state, dispatch }, {
      name, fn, params = {},
      value, valueKey = 'id',
      tree = 'isTree', id = 'id',
      callback, fnCallback,
    } = {}) {
      let list = [];
      if (fn) {
        const res = await fn;
        if (res.code == 200) {
          list = fnCallback ? fnCallback(res.data) : res.data;
        }
      } else {
        if (params[id]) {
          const res = await getEnums(name, { params });
          if (res.code == 200) list = res.data;
        } else {
          if (params[tree]) {
            if (state.tree[name] && state.tree[name].length) {
              list = state.tree[name];
            } else {
              if (startTree[name]) {
                let flag = startTree[name];
                while (flag) {
                  const p = new Promise((resovle) => {
                    setTimeout(() => {
                      resovle(startTree[name]);
                    }, 50);
                  });
                  flag = await p;
                }
              } else {
                startTree[name] = true;
                await dispatch('setEnum', { name, params, tree }).then(() => {
                  startTree[name] = false;
                });
              }
              list = state.tree[name];
            }
          } else {
            if (state.list[name] && state.list[name].length) {
              list = state.list[name];
            } else {
              if (startList[name]) {
                let flag = startList[name];
                while (flag) {
                  const p = new Promise((resovle) => {
                    setTimeout(() => {
                      resovle(startList[name]);
                    }, 50);
                  });
                  flag = await p;
                }
              } else {
                startList[name] = true;
                await dispatch('setEnum', { name, params, tree }).then(() => {
                  startList[name] = false;
                });
              }
              list = state.list[name];
            }
          }
        }
      }
      callback && callback($deepCopy(list), $useFilterValue(value, list, { valueKey }));
    }
  },
};
