/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-06 13:45:21
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-07 10:58:34
 */
export default {
  mounted(el, bindings) {
    const { value } = bindings;
    if (!$useAuth(value)) {
      el.remove();
    }
  }
};
