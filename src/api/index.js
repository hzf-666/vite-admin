/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-08 12:07:28
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 15:03:10
 */
const commonUrl = '/api/userSystem/common',
  userUrl = '/api/userSystem/userInfo',
  messageUrl = '/api/userSystem/message';

export async function login(options = {}) { // 用户登录
  options = {
    successMsg: '登录成功',
    failMsg: '',
    ...options,
  };
  return await $http.post(`${ commonUrl }/login`, options);
}

export async function uploadFile(options = {}) { // 上传文件
  const formData = new FormData();
  options.data && Object.keys(options.data).forEach(k => {
    formData.append(k, options.data[k]);
  });
  options = {
    successMsg: '',
    failMsg: '',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options,
    data: formData,
  };
  return await $http.post(`${ commonUrl }/file`, options);
}

export async function getEnums(name, options = {}) { // 获取 枚举/数据字典 列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ commonUrl }/enums/${ name }`, options);
}

export async function verifyToken(options = {}) { // 验证Token是否登录超时
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ commonUrl }/checkLogin`, options);
}


export async function getUserInfo(options = {}) { // 用户信息
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(userUrl, options);
}

export async function editUserInfo(options = {}) { // 修改用户信息
  options = {
    successMsg: '',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(userUrl, options);
}

export async function getUserAuth(options = {}) { // 用户权限
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ userUrl }/functions`, options);
}

export async function editUserPassword(options = {}) { // 修改密码
  options = {
    successMsg: '',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ userUrl }/password`, options);
}


export async function getMessageList(options = {}) { // 消息列表
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(messageUrl, options);
}

export async function getMessageCount(options = {}) { // 消息数量（未读）
  options = {
    successMsg: '',
    failMsg: '',
    ...options,
  };
  return await $http.get(`${ messageUrl }/count`, options);
}

export async function eidtMessageState(options = {}) { // 消息修改（已读状态）
  options = {
    successMsg: '消息已读',
    failMsg: '',
    loading: true,
    ...options,
  };
  return await $http.put(`${ messageUrl }/state`, options);
}
