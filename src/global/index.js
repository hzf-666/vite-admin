/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-19 13:34:02
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 23:22:04
 */
import router from '@/router';
import store from '@/store';
import http from '@/http';
import caches from '@u/caches.js';
import { typeOf, deepCopy, recurseOrder, recurseInto, dateFormat, isObjEqual } from '@u';
import { ElMessage, ElMessageBox, ElLoading, ElNotification } from 'element-plus';
import form from '@u/form.js';

const regs = {
    phone: /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[1|3|5|6|8|9]))\d{8}$/,
    idCard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
    telephone: /(^((0\d{2,3}))?-?(\d{7,8})$)|(^(4|8)00\d-?\d{3}-?\d{3}$)/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
    link: /^(https?:|mailto:|tel:)/,
  },
  setProxy = (prefix, url) => {
    url = prefix + url.replace(/https?:\/\/[^/]*/, '');
    return url;
  },
  message = (options = {}, context) => {
    ElMessage({ grouping: true, showClose: true, ...options }, context);
  },
  msgbox = ElMessageBox,
  alert = ElMessageBox.alert,
  confirm = ElMessageBox.confirm,
  prompt = ElMessageBox.prompt,
  loading = ElLoading.service,
  notify = ElNotification,
  open = (...arg) => {
    if (!arg[0]) return $message.warning('未检测到链接！');
    window.open(...arg);
  },
  close = (...arg) => {
    window.close(...arg);
  },
  preventDefault = e => {
    e.preventDefault();
    e.stopPropagation();
    e.returnValue = false;
  },
  getStyle = (el, attr, remove = 'px') => {
    if (!el) return;
    let result = window.getComputedStyle(el)[attr];
    if (remove) {
      result = result.replace(remove, '');
    }
    return Number(result) || result;
  },
  navBack = ({ to, from } = {}) => {
    const route = from ? JSON.parse(from) : to;
    $router.push(route);
  };

['success', 'warning', 'info', 'error'].forEach(type => {
  message[type] = (msg, context) => {
    if (typeOf(msg) === 'string') {
      message({ type, message: msg }, context);
    }
  };
});

export {
  router,
  store,
  http,
  caches,
  typeOf, deepCopy, recurseOrder, recurseInto, dateFormat, isObjEqual,
  regs,
  setProxy,
  message, msgbox, alert, confirm, prompt, loading, notify,
  form,
  open, close,
  preventDefault,
  getStyle,
  navBack,
};
