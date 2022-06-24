/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-26 17:08:16
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 23:23:36
 */
import { requestFullscreen, exitFullscreen } from '@u';

const env = import.meta.env.DEV,
  isFold = $caches('session').get('leftSideFold'),
  isLogo = $caches('session').get('leftSideLogo');

function updateScroll() {
  $store.set('skipRepeatedRoute', true);
  ['main', 'pageMain', 'autoAffix'].forEach(type => {
    $store.commit('scrollbar/updateScroll', type);
  });
}

export default {
  state: {
    leftSideFold: isFold ? JSON.parse(isFold) : false,
    leftSideLogo: (env && isLogo) ? JSON.parse(isLogo) : true,
    colorPrimary: $caches('session').get('colorPrimary') || '#409eff',
    colorSuccess: $caches('session').get('colorSuccess') || '#67c23a',
    colorWarning: $caches('session').get('colorWarning') || '#e6a23c',
    colorDanger: $caches('session').get('colorDanger') || '#f56c6c',
    colorInfo: $caches('session').get('colorInfo') || '#909399',
    areaMax: false,
    affixTags: [],
    scrollTags: [],
    excludeKeepAlive: [],
    loadingCount: 0,
  },
  mutations: {
    toggleLeftSideFold({ state }, value) {
      $caches('session').set('leftSideFold', value);
      state.leftSideFold = value;
    },
    setLeftSideLogo({ state }, value) {
      $caches('session').set('leftSideLogo', value);
      state.leftSideLogo = value;
    },
    getColor({ state }, type) {
      return state[`color${ type }`];
    },
    setColor({ state }, { type, value } = {}) {
      $caches('session').set(`color${ type }`, value);
      state[`color${ type }`] = value;
    },
    toggleAreaMax({ state }) {
      const el = document.getElementById('rightContent');
      if (state.areaMax) {
        exitFullscreen();
      } else {
        requestFullscreen(el);
      }
      if (el) {
        state.areaMax = !state.areaMax;
      }
    },
    pushAffixTags({ state }, value) {
      if (!state.affixTags.find(item => item.name === value.name)) {
        state.affixTags.push(value);
      }
    },
    removeAffixTags({ state }, names = []) {
      names.forEach(name => {
        const targetIndex = state.affixTags.findIndex(item => item.name === name);
        if (targetIndex != -1) state.affixTags.splice(targetIndex, 1);
      });
      updateScroll();
    },
    pushScrollTags({ state, commit }, value) {
      const targetIndex = state.scrollTags.findIndex(item => item.name === value.name);
      if (targetIndex == -1) {
        state.scrollTags.push(value);
      } else {
        const target = state.scrollTags[targetIndex];
        if ($typeOf(value.params) === 'object' && JSON.stringify(value.params) !== '{}') {
          if (!$isObjEqual(value.params, target.params)) {
            commit('pushExcludeKeepAlive', [value.name]);
            state.scrollTags[targetIndex] = value;
            return;
          }
        }
        if ($typeOf(value.query) === 'object' && JSON.stringify(value.query) !== '{}') {
          if (!$isObjEqual(value.query, target.query)) {
            commit('pushExcludeKeepAlive', [value.name]);
            state.scrollTags[targetIndex] = value;
            return;
          }
        }
      }
    },
    getScrollTag({ state }, index = -1) {
      if (index < 0) return;
      return state.scrollTags[index];
    },
    setScrollTag({ state }, { index, value } = {}) {
      state.scrollTags[index] = value;
    },
    insertScrollTag({ state }, { index = -1, value = {}, removeIndex = -1 } = {}) {
      if (index < 0) return;
      state.scrollTags.splice(index, 0, value);
      if (removeIndex != -1) {
        state.scrollTags.splice(removeIndex, 1);
      }
    },
    removeScrollTag({ state }, { index = -1, isPush = false } = {}) {
      if (index < 0) return;
      if (isPush) {
        const target = state.scrollTags[index + 1] || state.scrollTags[index - 1];
        if (target) $router.push(target);
      }
      state.scrollTags.splice(index, 1);
      updateScroll();
    },
    removeScrollTags({ state }, names = []) {
      names.forEach(name => {
        const targetIndex = state.scrollTags.findIndex(item => item.name === name);
        if (targetIndex != -1) state.scrollTags.splice(targetIndex, 1);
      });
      updateScroll();
    },
    closeScrollTag({ state }, { index = -1, type, isPush = false }) {
      if (index < 0) return;
      function filterByType(i) {
        if (type === 'other') {
          return i == index;
        }
        if (type === 'left') {
          return i >= index;
        }
        if (type === 'right') {
          return i <= index;
        }
      }
      if (isPush) {
        const target = state.scrollTags[index];
        if (target) $router.push(target);
      }
      state.scrollTags = state.scrollTags.filter((item, i) => item.fixed || filterByType(i));
      updateScroll();
    },
    pushExcludeKeepAlive({ state }, names = []) {
      const result = [];
      names.forEach(name => {
        if (!state.excludeKeepAlive.includes(name)) {
          result.push(name);
        }
      });
      state.excludeKeepAlive = state.excludeKeepAlive.concat(result);
    },
    removeExcludeKeepAlive({ state }, index = -1) {
      if (index < 0) return;
      state.excludeKeepAlive.splice(index, 1);
    },
    handleLoadingCount({ state }, isAdd) {
      if (isAdd) {
        state.loadingCount += 1;
      } else {
        if (state.loadingCount) state.loadingCount -= 1;
      }
    },
  },
  actions: {},
};
