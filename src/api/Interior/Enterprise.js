/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-08 10:26:46
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 11:03:24
 */
const baseUrl = '/api/userSystem/enterprise';

export async function getEnterpriseList(options = {}) { // 企业管理 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getEnterpriseTree(options = {}) { // 企业管理 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addEnterprise(options = {}) { // 企业管理 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editEnterprise(id, options = {}) { // 企业管理 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getEnterpriseDetail(id, options = {}) { // 企业管理 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editEnterpriseState(id, options = {}) { // 企业管理 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);
}

export async function delEnterprise(id, options = {}) { // 企业管理 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}
