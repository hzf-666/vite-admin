/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-18 15:30:23
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-18 17:41:17
 */
import { getRoleTree } from '@/api/Interior/Role.js';
import { getOrganizationTree } from '@/api/Interior/Organization.js';

export async function doGetRoleTree(formData, isEdit, id, oId) {
  if (oId && !formData.value.organizationId.options.length) await doGetOrganizationTree(formData, false);
  $store.dispatch('enums/getEnum', {
    fn: getRoleTree({
      params: {
        id: isEdit ? id : null,
        organizationId: oId || null,
      },
    }),
    value: formData.value.parentId.value,
    callback(list, val) {
      formData.value.parentId.value = val || null;
      formData.value.parentId.options = list;
    },
  });
}

export async function doGetOrganizationTree(formData, isEdit) {
  await $store.dispatch('enums/getEnum', {
    fn: getOrganizationTree(),
    value: isEdit ? formData.value.organizationId.value : undefined,
    callback(list, val) {
      if (isEdit) {
        formData.value.organizationId.value = val;
      }
      formData.value.organizationId.options = list;
    },
  });
}

export default async function({
  formData, type, accountTypeId, id, isOrg,
} = {}) {
  const isEdit = type === 'Edit';
  if (accountTypeId.value == 2 && !isOrg) {
    doGetOrganizationTree(formData, isEdit);
  } else {
    doGetRoleTree(formData, isEdit, id);
  }
}
