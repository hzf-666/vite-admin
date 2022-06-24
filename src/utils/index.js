/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-02 17:18:09
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 15:50:29
 */
export function typeOf(target) { // 判断数据类型
  const getProtoStr = Object.prototype.toString,
    map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
  return map[getProtoStr.call(target)];
}

export function deepCopy(target) { // 数据深拷贝
  let result;
  switch (typeOf(target)) {
    case 'array':
      result = [];
      break;
    case 'object':
      result = {};
      break;
    default:
      result = target;
      return result;
  }
  for (const i in target) {
    result[i] = typeOf(target[i]) === 'object' ? deepCopy(target[i]) : target[i];
  }
  return result;
}

export function recurseOrder(list, callback, options = {}) { // 遍历递归
  options = {
    children: 'children',
    ...options,
  };

  if (!list || !list.length || typeOf(callback) !== 'function') return;

  let stack = [];
  for (let i = 0; i < list.length; i++) {
    stack.push(list[i]);
  }
  while (stack.length) { // 逐层遍历
    const item = stack.shift(),
      val = callback(item);
    if (val === 'break') return;
    const _list = item[options.children];
    if (_list && _list.length) {
      stack = stack.concat(_list);
    }
  }
}

export function recurseInto(list, callback, options = {}, parent = null, level = 1) { // 嵌套递归
  options = {
    children: 'children',
    ...options,
  };

  if (!list || !list.length || typeOf(callback) !== 'function') return;

  for (let i = 0; i < list.length; i++) { // 遍历第一层，每层向里递归
    const next = () => {
        const _list = list[i][options.children];
        if (_list && _list.length) {
          return !!recurseInto(_list, callback, options, list[i], level + 1);
        }
      },
      val = callback(list[i], { list, index: i, parent, level });
    if (val === 'break') return true;
    if (val === 'continue') continue;
    if (next()) return true;
  }
}

export function dateFormat(fmt, d) { // 日期格式化
  const date = d ? new Date(d) : new Date(),
    o = {
      'M+': date.getMonth() + 1, // 月份
      'D+': date.getDate(), // 日
      'H+': date.getHours(), // 小时，24小时制
      'h+': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), // 小时，12小时制
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    },
    Y = /(Y+)/g,
    w = ['日', '一', '二', '三', '四', '五', '六'],
    W = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (Y.test(fmt)) {
    fmt.match(Y).forEach(item => {
      fmt = fmt.replace(item, (date.getFullYear() + '').substring(4 - item.length));
    });
  }
  for (const k in o) {
    const reg = new RegExp('(' + k + ')', 'g');
    if (reg.test(fmt)) {
      fmt.match(reg).forEach(item => {
        fmt = fmt.replace(item, item.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
      });
    }
  }
  fmt = fmt.replace('{w}', w[date.getDay()]);
  fmt = fmt.replace('{W}', W[date.getDay()]);
  return fmt;
}

export function isObjEqual(source, comparison) { // 判断两个 对象/数组 是否相等
  const iterable = (data) => ['object', 'array'].includes(typeOf(data));
  if (!iterable(source)) {
    throw new Error(`source should be an Object or Array , but got ${ typeOf(source) }`);
  }
  if (typeOf(source) !== typeOf(comparison)) {
    return false;
  }
  const sourceKeys = Object.keys(source),
    comparisonKeys = Object.keys({ ...source, ...comparison });
  if (sourceKeys.length !== comparisonKeys.length) {
    return false;
  }
  return comparisonKeys.some(key => {
    if (iterable(source[key])) {
      return isObjEqual(source[key], comparison[key]);
    } else {
      return source[key] === comparison[key];
    }
  });
}

/**
 * 以下函数未注册为全局函数
*/
export async function toDuration(p, delay = 0) {
  const results = await Promise.all([p,
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay);
    }),
  ]);
  return results[0];
}

export function dataURL2File(dataurl, filename = 'file') {
  const arr = dataurl.split(','),
    type = arr[0].match(/:(.*?);/)[1],
    bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type });

  return new File([blob], filename, { lastModified: Date.now(), type });
}

export function isPC() {
  const userAgent = navigator.userAgent.toLowerCase();
  return !(/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent));
}

export function findParentNode(el, selector) {
  if (!selector) return null;
  while (el.tagName.toLowerCase() !== 'html') {
    const parent = el.parentNode;
    if (!parent) return null;
    const id = parent.getAttribute('id'), className = parent.className, tagName = parent.tagName.toLowerCase();
    if (selector.startsWith('#')) {
      if (id && selector.replace('#', '') === id) {
        return parent;
      }
    } else if (selector.startsWith('.')) {
      if ($typeOf(className) === 'string' && className && className.split(' ').includes(selector.replace('.', ''))) {
        return parent;
      }
    } else {
      if (selector === tagName) {
        return parent;
      }
    }
    el = parent;
  }
  return null;
}

export function sortLikeWin(v1, v2) {
  let a = v1.name, b = v2.name;
  const reg = /[0-9]+/g,
    lista = a.match(reg),
    listb = b.match(reg);
  if (!lista || !listb) {
    return a.localeCompare(b);
  }
  for (let i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
  // 数字所在位置序号
    const indexa = a.indexOf(lista[i]),
      indexb = b.indexOf(listb[i]),
      // 数字前面的前缀
      prefixa = a.substring(0, indexa),
      prefixb = a.substring(0, indexb),
      // 数字的string
      stra = lista[i],
      strb = listb[i],
      // 数字的值
      numa = parseInt(stra),
      numb = parseInt(strb);
    if (indexa != indexb || prefixa != prefixb) { // 如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
      return a.localeCompare(b);
    } else { // 数字的string全等
      if (stra === strb) { // 如果是最后一个数字，比较数字的后缀
        if (i == minLen - 1) {
          return a.substring(indexa).localeCompare(b.substring(indexb));
        } else { // 如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
          a = a.substring(indexa + stra.length);
          b = b.substring(indexa + stra.length);
        }
      } else if (numa == numb) { // 如果数字的string不全等，但值相等 // 直接比较数字前缀0的个数，多的更小
        return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
      } else { // 如果数字不等，直接比较数字大小
        return numa - numb;
      }
    }
  }
}

export function requestFullscreen(el) {
  if (!el) return;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullScreen();
  }
}

export function exitFullscreen(callback) {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {
      callback && callback();
    });
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen().catch(() => {
      callback && callback();
    });
  } else if (document.msExitFullscreen) {
    document.msExiFullscreen().catch(() => {
      callback && callback();
    });
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen().catch(() => {
      callback && callback();
    });
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen().catch(() => {
      callback && callback();
    });
  }
}

export function judgeFullScreen() {
  return outerHeight > screen.availHeight || document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
}
