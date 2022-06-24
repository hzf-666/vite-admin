/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 17:29:59
 */
import { defineConfig, loadEnv } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueComponents from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import globalData from './src/global/data.js';

const path = require('path'), resolve = dir => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default ({ mode }) => {
  const dev = mode === 'development',
    env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          secure: false, // 是否验证htpps的安全证书，如果域名是https需要配置此项
          changeOrigin: true, // 必须设置为true
          // rewrite: path => path.replace(/^\/api/, '')
        },
        '/msg': {
          target: env.VITE_API_URL,
        },
      },
    },
    base: dev ? '/' : '/web/',
    build: {
      outDir: 'web',
      assetsDir: 'static',
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@a': resolve('src/assets'),
        '@c': resolve('src/components'),
        '@p': resolve('src/plugins'),
        '@u': resolve('src/utils'),
        '@v': resolve('src/views'),
      }
    },
    plugins: [
      Vue(),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', {
          vue: ['defineEmits', 'defineExpose', 'defineProps', 'defineCustomElement'],
        }],
        resolvers: [
          name => {
            for (const _name of globalData) {
              if (name === '$' + _name) {
                return {
                  from: '@/global',
                  name: _name,
                };
              }
            }
            if (name.startsWith('$use')) {
              return {
                from: '@/hooks',
                name: name.replace('$', ''),
              };
            }
          },
          ElementPlusResolver(),
        ],
      }),
      VueComponents({
        resolvers: [
          ElementPlusResolver(),
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [ // 指定需要缓存的图标文件夹
          resolve('src/assets/icons/svg'),
        ],
        // symbolId: 'icon-[dir]-[name]', // 指定symbolId格式
        symbolId: 'iconsvg-[name]',
      }),
    ],
    css: {
      postcss: {
        plugins: [
          require('autoprefixer')({ // 前缀追加
            grid: true,
          }),
          require('postcss-flexbugs-fixes'), // flexbug修复
        ],
      },
      preprocessorOptions: { // css预处理器
        scss: {
          charset: false,
          additionalData: '@use "sass:math"; @import "src/scss/variate.scss";',
        },
      },
    },
  });
};
