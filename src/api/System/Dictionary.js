/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-21 11:29:07
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-21 18:09:10
 */
const baseUrl = '/api/userSystem/category';

export async function getDictionaryList(options = {}) { // 数据字典 — 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(baseUrl, options);
}

export async function getDictionaryTree(options = {}) { // 数据字典 — 树形
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/tree`, options);
}

export async function addDictionary(options = {}) { // 数据字典 — 新增
  options = {
    successMsg: '新增成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.post(baseUrl, options);
}

export async function editDictionary(id, options = {}) { // 数据字典 — 修改
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/${ id }`, options);
}

export async function getDictionaryDetail(id, options = {}) { // 数据字典 — 详情
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ baseUrl }/${ id }`, options);
}

export async function editDictionaryState(id, options = {}) { // 数据字典 — 修改状态
  options = {
    successMsg: '修改成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ baseUrl }/state/${ id }`, options);

}

export async function delDictionary(id, options = {}) { // 数据字典 — 删除
  options = {
    successMsg: '删除成功',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.delete(`${ baseUrl }/${ id }`, options);
}

export async function getDictionaryTypeList(options = {}) { // 数据字典 — 参数类型
  options = {
    successMsg: '',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.get(`${ baseUrl }/type`, options);
}
