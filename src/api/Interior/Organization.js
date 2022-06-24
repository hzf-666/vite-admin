/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 10:27:04
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 11:04:56
 */
const baseUrl = '/api/userSystem/organization';

export async function getOrganizationList(options = {}) { // 机构管理 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getOrganizationTree(options = {}) { // 机构管理 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addOrganization(options = {}) { // 机构管理 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editOrganization(id, options = {}) { // 机构管理 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getOrganizationDetail(id, options = {}) { // 机构管理 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editOrganizationState(id, options = {}) { // 机构管理 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);

}

export async function delOrganization(id, options = {}) { // 机构管理 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}

export async function getRelatedOrganizationList(options = {}) { // 获取当前账号关联的机构列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/list`, options);
}

export async function changeOrganization(id, options = {}) { // 切换当前账号所选的机构
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.put(`${ baseUrl }/change/${ id }`, options);
}
