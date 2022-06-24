/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-08 10:26:46
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 11:09:43
 */
const baseUrl = '/api/userSystem/role';

export async function getRoleList(options = {}) { // 角色管理 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getRoleTree(options = {}) { // 角色管理 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addRole(options = {}) { // 角色管理 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editRole(id, options = {}) { // 角色管理 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getRoleDetail(id, options = {}) { // 角色管理 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editRoleState(id, options = {}) { // 角色管理 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);
}

export async function delRole(id, options = {}) { // 角色管理 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}

export async function getRoleAuth(id, options = {}) { // 角色权限
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/functions/${ id }`, options);
}

export async function editRoleAuth(id, options = {}) { // 修改角色权限
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/functions/${ id }`, options);
}
