/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-13 13:57:25
 */
import * as global from './index.js';
import * as vue from 'vue';

export default function(app) {
  [global, vue].forEach((m, i) => {
    Object.keys(m).forEach(k => {
      app.config.globalProperties[(i ? '' : '$') + k] = m[k];
    });
  });
}
