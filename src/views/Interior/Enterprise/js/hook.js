/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-10 19:55:29
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 16:05:51
 */
import { addEnterprise, editEnterprise, getEnterpriseDetail } from '@/api/Interior/Enterprise.js';
import enums from './enums.js';
import md5 from 'md5';

export default function({
  menuName, myForm, type,
  isReset, fileList,
} = {}) {
  const confirmExcludes = [menuName],
    isAdd = type === 'Add',
    isEdit = type === 'Edit',
    isDetail = !type || type === 'Detail',
    labelWidth = '95px';

  if (isEdit) confirmExcludes.push(`${ menuName }Detail`);

  const { currentRoute, formData, confirm, cancel, edit, back } = $usePageForm({
      menuName,
      myForm,
      confirmOpts: {
        to: { name: `${ menuName }${ isEdit ? 'Detail' : '' }` },
        closes: [`${ menuName }${ type }`],
        excludes: confirmExcludes,
      },
      cancelOpts: {
        to: { name: menuName },
        closes: [`${ menuName }${ type }`],
        excludes: [],
        msg: { content: `确定取消${ isEdit ? '修改' : '新增' }企业吗？` },
      },
    }),
    id = currentRoute.params.id,
    userInfo = computed(() => $store.get('userInfo')),
    accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id);

  if (accountTypeId.value == 1) {
    confirmExcludes.push('Organization');
  }

  formData.value = {
    names: {
      tag: 'slot',
      separate: {
        name: {
          value: '',
          formItem: {
            label: '企业名称',
            rules: [
              { required: true, message: '请填写企业名称', trigger: 'blur' },
            ],
          },
          attrs: {
            placeholder: '请输入企业名称',
          },
        },
        accountName: {
          value: '',
          formItem: {
            label: '企业账号',
            rules: [
              { required: true, message: '请填写企业账号', trigger: 'blur' },
            ],
          },
          attrs: {
            placeholder: '请输入企业账号',
          },
        },
      },
      position: [1, 1],
    },
    fileObj: {
      tag: 'slot',
      value: { name: '', url: '' },
      formItem: {
        label: 'Logo',
      },
      position: [1, 2],
    },
    password: {
      value: '',
      formItem: {
        label: '账号密码',
        rules: [
          { required: true, message: '请填写账号密码', trigger: 'blur' },
        ],
      },
      attrs: {
        type: 'password',
        showPassword: true,
      },
      position: [2, 1],
    },
    organizationNum: {
      tag: 'inputNumber',
      value: null,
      formItem: {
        label: '机构数量',
        rules: [
          { required: true, message: '请填写机构数量', trigger: 'blur' },
        ],
      },
      attrs: {
        min: 1,
        max: 99,
      },
      position: [2, 2],
    },
    roleId: {
      tag: 'cascader',
      value: null,
      from: `roleObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '角色',
        rules: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
      },
      options: [],
      attrs: {
        showAllLevels: false,
      },
      position: [3, 1],
    },
    email: {
      value: '',
      formItem: {
        label: '联系邮箱',
        rules: [
          { validator(rule, value, callback) {
            if (value && !$regs.email.test(value)) {
              callback(new Error());
            }
            callback();
          }, message: '请填写正确的联系邮箱', trigger: 'blur' },
        ],
      },
      limit: {
        input: /[^\u4e00-\u9fa5| ]+/,
      },
      position: [3, 2],
    },
    contactName: {
      value: '',
      formItem: {
        label: '联系人',
      },
      position: [4, 1],
    },
    phone: {
      value: '',
      formItem: {
        label: '联系电话',
        rules: [
          { validator(rule, value, callback) {
            if (value && !$regs.phone.test(value) && !$regs.telephone.test(value)) {
              callback(new Error());
            }
            callback();
          }, message: '请填写正确的联系电话', trigger: 'blur' },
        ],
      },
      limit: {
        input: /(\d+-?)*\d*/,
        blur: /^(\d+-?)*\d+$/,
      },
      position: [4, 2],
    },
  };

  if (isEdit) {
    formData.value.password.tag = 'slot';
  }
  if (isDetail) {
    for (const k in formData.value) {
      const item = formData.value[k];
      item.formItem && (item.formItem.rules = []);
      if (item.tag === 'slot') {
        if (item.separate) {
          Object.values(item.separate).forEach(s => s.formItem && (s.formItem.rules = []));
        }
      } else {
        item.tag = 'input';
      }
    }
  }

  function doConfirm() {
    confirm(data => {
      data.password = isEdit && !isReset.value ? '' : md5(data.password);
      return isEdit ? editEnterprise(id, { data }) : addEnterprise({ data });
    });
  }

  $useActivated(async once => {
    if (once) {
      if (!isAdd) {
        await getEnterpriseDetail(id, { loading: isEdit }).then(res => {
          if (res.code == 200) {
            res.data.password = '******';
            if (isEdit) fileList.value = [res.data.fileObj];
            $form.set(formData.value, res.data);
          }
        });
      }
    }
    if (!isDetail) enums({ formData, type });
  });

  return { formData, labelWidth, doConfirm, cancel, edit, back };
}
