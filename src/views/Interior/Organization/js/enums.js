/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-20 11:22:54
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-20 12:21:10
 */
import { getOrganizationTree } from '@/api/Interior/Organization.js';

export default async function({
  formData, type, id,
} = {}) {
  const isEdit = type === 'Edit';
  $store.dispatch('enums/getEnum', {
    fn: getOrganizationTree({
      params: {
        id: isEdit ? id : null,
      },
    }),
    value: formData.value.parentId.value,
    callback(list, val) {
      formData.value.parentId.value = val || null;
      formData.value.parentId.options = list;
    },
  });
}
