/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-11 20:08:39
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 10:20:46
 */
import { getOrganizationTree } from '@/api/Interior/Organization.js';
import { getRoleTree } from '@/api/Interior/role.js';

export async function doGetRoleTree(formData, isEdit, oId) {
  if (oId && !formData.value.organizationId.options.length) await doGetOrganizationTree(formData, false);
  $store.dispatch('enums/getEnum', {
    fn: getRoleTree({ params: { organizationId: oId || null }}),
    value: isEdit ? formData.value.roleId.value : undefined,
    callback(list, val) {
      if (isEdit) formData.value.roleId.value = val;
      formData.value.roleId.options = list;
    },
  });
}

export async function doGetOrganizationTree(formData, isEdit, accountTypeId) {
  await $store.dispatch('enums/getEnum', {
    fn: getOrganizationTree(),
    value: isEdit ? formData.value.organizationId.value : undefined,
    callback(list, val) {
      if (isEdit) {
        formData.value.organizationId.value = val;
      } else {
        if (accountTypeId && accountTypeId.value != 2) formData.value.organizationId.value = list[0] && list[0].id;
      }
      formData.value.organizationId.options = list;
    },
  });
}

export default async function({
  formData, type, accountTypeId, isOrg,
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
    name: 'SexType',
    value: isEdit ? formData.value.sexType.value : undefined,
    callback(list, val) {
      formData.value.sexType.value = isEdit ? val : list[0] && list[0].id;
      formData.value.sexType.options = list;
    },
  });
  if (!(accountTypeId.value == 2 && !isOrg.value)) {
    doGetRoleTree(formData, isEdit);
  } else {
    doGetOrganizationTree(formData, isEdit, accountTypeId);
  }
}
