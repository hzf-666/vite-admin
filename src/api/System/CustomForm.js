/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-24 10:49:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 10:50:46
 */
const baseUrl = '/api/userSystem/form';

export async function getCustomFormList(options = {}) { // 自定义表单 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getCustomFormTree(options = {}) { // 自定义表单 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addCustomForm(options = {}) { // 自定义表单 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editCustomForm(id, options = {}) { // 自定义表单 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getCustomFormDetail(id, options = {}) { // 自定义表单 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editCustomFormState(id, options = {}) { // 自定义表单 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);

}

export async function delCustomForm(id, options = {}) { // 自定义表单 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}
