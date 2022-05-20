/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-16 09:05:00
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueComponents from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
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
        '@h': resolve('src/hooks'),
        '@p': resolve('src/plugins'),
        '@u': resolve('src/utils'),
        '@v': resolve('src/views'),
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', '@vueuse/core', {
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
          },
          ElementPlusResolver(),
        ],
      }),
      VueComponents({
        resolvers: [
          ElementPlusResolver()
        ],
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
          additionalData: '@import "src/scss/variate.scss";',
        },
      },
    },
  });
};
