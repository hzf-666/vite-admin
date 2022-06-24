/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:23:37
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-17 09:17:23
 */
import { getPermissionTree } from '@/api/Interior/Permission.js';

export default async function({
  formData, type, id,
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
  $store.dispatch('enums/getEnum', {
    name: 'FunctionType',
    value: isEdit ? formData.value.type.value : undefined,
    callback(list, val) {
      formData.value.type.value = isEdit ? val : list[2] ? list[2].id : null;
      formData.value.type.options = list;
    },
  });
  await $store.dispatch('enums/getEnum', {
    fn: getPermissionTree({
      params: {
        id,
      },
    }),
    callback(list) {
      formData.value.parentId.options = list;
    },
  });
}
