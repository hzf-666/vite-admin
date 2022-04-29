/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-04-19 17:36:26
 */
export default function(router) {
  const token = $caches('session').get('token'),
    hasToken = !!token;

  router.beforeEach((to, from) => { // 全局前置守卫
    document.title = to.meta.title || '';
    if (to.fullPath === '/') {
      return hasToken ? '/home' : '/login';
    }
  });

  // router.beforeResolve(async to => { // 全局解析守卫
  //   if (to.meta.requiresCamera) {
  //     try {
  //       await askForCameraPermission()
  //     } catch (error) {
  //       if (error instanceof NotAllowedError) {
  //         // ... 处理错误，然后取消导航
  //         return false
  //       } else {
  //         // 意料之外的错误，取消导航并把错误传给全局处理器
  //         throw error
  //       }
  //     }
  //   }
  // });

  router.afterEach((to, from) => { // 全局后置钩子

  });
}
