/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-11 20:07:16
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-13 11:01:21
 */
const baseUrl = '/api/userSystem/personInfo';

export async function getPersonList(options = {}) { // 人员管理 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getPersonTree(options = {}) { // 人员管理 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addPerson(options = {}) { // 人员管理 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editPerson(id, options = {}) { // 人员管理 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getPersonDetail(id, options = {}) { // 人员管理 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editPersonState(id, options = {}) { // 人员管理 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);

}

export async function delPerson(id, options = {}) { // 人员管理 — 删除
  options = {
    successMsg: '注销成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}
