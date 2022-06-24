/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-23 11:25:13
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-28 17:51:59
 */
import * as Icons from '@element-plus/icons-vue';

export default function(app) {
  const arr = [];
  for (const iconName in Icons) {
    const name = `IconEp${ iconName }`;
    arr.push(name);
    app.component(name, Icons[iconName]);
  }
  $store.set('icons/elementPlus', arr);
}
