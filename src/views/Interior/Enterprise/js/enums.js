/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-10 19:50:24
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 14:27:13
 */
import { getRoleTree } from '@/api/Interior/Role.js';

export default async function({
  formData, type,
} = {}) {
  const isEdit = type === 'Edit';
  $store.dispatch('enums/getEnum', {
    fn: getRoleTree(),
    value: isEdit ? formData.value.roleId.value : undefined,
    callback(list, val) {
      if (isEdit) formData.value.roleId.value = val;
      formData.value.roleId.options = list;
    },
  });
}
