/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 13:57:57
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-01 10:53:09
 */
import { importRoutes } from '@/router/handle.js';

const children = importRoutes(import.meta.globEager('./*.js'), import.meta.globEager('./*/*.js'));

export default {
  name: 'System',
  meta: {
    title: '系统配置',
    fullTitle: false,
    type: 1,
    affix: false,
    hidden: false,
    rename: '',
    redirect: '',
    icon: 'IconSetting',
  },
  children,
};
