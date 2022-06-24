/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-09 11:14:43
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-30 11:41:10
 */
import tinycolor from '@ctrl/tinycolor';

function darken(color, amount = 20) {
  return color.mix('#000', amount).toString();
}

export default function() {
  const lights = [3, 5, 7, 8, 9], darks = [2];
  ['Primary', 'Success', 'Warning', 'Danger', 'Info'].forEach(type => {
    const color = tinycolor($store.commit('layout/getColor', type));
    document.documentElement.style.setProperty(`--el-color-${ type.toLowerCase() }`, color.tint(0).toString());
    lights.forEach(l => {
      document.documentElement.style.setProperty(`--el-color-${ type.toLowerCase() }-light-${ l }`, color.tint(l * 10).toString());
    });
    darks.forEach(d => {
      document.documentElement.style.setProperty(`--el-color-${ type.toLowerCase() }-dark-${ d }`, darken(color, d * 10));
    });
  });
}
