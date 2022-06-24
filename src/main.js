/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-30 09:03:40
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'normalize.css'; // css 样式重置
import 'animate.css'; // css 动画样式
import 'virtual:svg-icons-register'; // 注册 svg 图标
import './scss/index.scss';
import sassExport from './scss/export.module.scss';
import setGlobal from './global/vueSet.js';
import plugins from './plugins';
import directives from './directives';

function setDomStyle() {
  const standardWidth = 750,
    maxMobileWidth = $store.get('settings/maxMobileWidth'),
    scale = Number(sassExport.scale),
    width = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = width > maxMobileWidth ? `${ scale / 2 }px` : (width * scale / standardWidth + 'px');
}
setDomStyle();
window.addEventListener('resize', setDomStyle);

const app = createApp(App);

plugins(app);
directives(app);
setGlobal(app);

app.use(router).mount('#app');
