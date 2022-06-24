/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-13 10:50:52
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-27 17:30:29
 */
const files = import.meta.globEager('./*.js'),
  whiteList = [],
  reg = /^\.\/(.*)\.js$/,
  directives = {};

Object.keys(files).forEach(k => {
  const fileName = k.replace(reg, '$1');
  if (!whiteList.includes(fileName)) {
    directives[fileName] = files[k].default;
  }
});

export default function(app) {
  Object.keys(directives).forEach(name => {
    app.directive(name, directives[name]);
  });
}
