/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-06 10:55:05
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-27 18:22:55
 */
import { importRoutes } from '@/router/handle.js';

const routes = importRoutes(import.meta.globEager('./*.js'), import.meta.globEager('./*/*.js'));

export default routes;
