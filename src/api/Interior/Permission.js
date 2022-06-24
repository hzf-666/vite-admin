/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:16:33
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 17:18:00
 */
const baseUrl = '/api/userSystem/functions';

export async function getPermissionList(options = {}) { // 权限管理 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/treeList`, options);
}

export async function getPermissionTree(options = {}) { // 权限管理 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addPermission(options = {}) { // 权限管理 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editPermission(id, options = {}) { // 权限管理 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getPermissionDetail(id, options = {}) { // 权限管理 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editPermissionState(id, options = {}) { // 权限管理 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);

}

export async function delPermission(id, options = {}) { // 权限管理 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}
