/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 13:57:57
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-01 10:52:37
 */
import { importRoutes } from '@/router/handle.js';

const children = importRoutes(import.meta.globEager('./*.js'), import.meta.globEager('./*/*.js'));

export default {
  name: 'Interior',
  meta: {
    title: '内部管理',
    fullTitle: false,
    type: 1,
    affix: false,
    hidden: false,
    rename: '',
    redirect: '',
    icon: 'IconAccount',
  },
  children,
};
