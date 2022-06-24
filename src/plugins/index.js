/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-27 11:56:52
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-27 17:31:17
 */
const files = import.meta.globEager('./*.js'),
  whiteList = [],
  reg = /^\.\/(.*)\.js$/,
  plugins = [];

Object.keys(files).forEach(k => {
  const fileName = k.replace(reg, '$1');
  if (!whiteList.includes(fileName)) {
    plugins.push(files[k].default);
  }
});

export default function(app) {
  plugins.forEach(fn => {
    fn && fn(app);
  });
}
