/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-08 11:17:53
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 15:19:20
 */
import { logout } from '@u/user.js';

let isAlert = false;
const whiteList = [];

export default function(axios) {
  axios.interceptors.request.use(req => {
    const token = $caches('session').get('token');
    if (token && !whiteList.includes(req.url)) { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      req.headers.Authorization = token;
    }
    req.headers['Cache-Control'] = 'no-cache';
    req.headers.Pragma = 'no-cache';
    return req;
  }, err => {
    return Promise.reject(err);
  });

  axios.interceptors.response.use(res => {
    if (res.data.code == 403 && !isAlert) {
      isAlert = true;
      $alert('登录已失效，请重新登录！', '重新登录', {
        type: 'warning',
        showClose: false,
        callback: action => {
          if (action == 'confirm') {
            isAlert = false;
            logout();
          }
        }
      });
    }
    return res;
  }, err => {
    return Promise.reject(err);
  });
}
