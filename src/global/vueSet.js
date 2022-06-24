/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-07 14:59:30
 */
import * as vue from 'vue';
import * as hooks from '@/hooks';
import * as global from './index.js';

export default function(app) {
  [vue, hooks, global].forEach((m, i) => {
    Object.keys(m).forEach(k => {
      app.config.globalProperties[(i ? '$' : '') + k] = m[k];
    });
  });
}
