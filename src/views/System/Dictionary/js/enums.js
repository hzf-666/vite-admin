/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-21 09:21:40
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-21 18:19:27
 */
import { getDictionaryTree, getDictionaryTypeList } from '@/api/System/Dictionary.js';

export async function doGetDictionaryTree(formData, isEdit, id, assign = false) {
  await $store.dispatch('enums/getEnum', {
    fn: getDictionaryTree({
      params: {
        id: isEdit ? id : null,
      },
    }),
    value: formData.value.parentId.value,
    callback(list, val) {
      assign && (formData.value.parentId.value = val || null);
      formData.value.parentId.options = list;
    },
  });
}

export default async function({
  formData, type, id, paramTypeList,
} = {}) {
  const isEdit = type === 'Edit';
  $store.dispatch('enums/getEnum', {
    name: 'State',
    value: isEdit ? formData.value.state.value : undefined,
    callback(list, val) {
      formData.value.state.value = isEdit ? val : list[0] ? list[0].id : true;
      formData.value.state.attrs = {
        ...formData.value.state.attrs,
        activeValue: list[0] ? list[0].id : true,
        inactiveValue: list[1].id ? list[1].id : false,
      };
    },
  });
  await $store.dispatch('enums/getEnum', {
    fn: getDictionaryTypeList(),
    callback(list) {
      paramTypeList.value = list;
    },
  });
  doGetDictionaryTree(formData, isEdit, id, true);
}
