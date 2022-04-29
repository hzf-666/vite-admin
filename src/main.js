/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-04-26 11:23:44
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'normalize.css';
import './scss/index.scss';
import sassExport from './scss/export.module.scss';
import setGlobal from './global/vueSet.js';

function setDomStyle() {
  const standardWidth = 750,
    maxMobileWidth = 960,
    scale = Number(sassExport.scale),
    width = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = width > maxMobileWidth ? `${ scale / 2 }px` : (width * scale / standardWidth + 'px');
}
setDomStyle();
window.addEventListener('resize', setDomStyle);

const app = createApp(App);

setGlobal(app);

app.use(router).mount('#app');
