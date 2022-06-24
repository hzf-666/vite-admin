/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-11 20:08:44
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 10:09:20
 */
import { addPerson, editPerson, getPersonDetail } from '@/api/Interior/Person.js';
import enums, { doGetRoleTree } from './enums.js';
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
        msg: { content: `确定取消${ isEdit ? '修改' : '新增' }吗？` },
      },
    }),
    id = currentRoute.params.id,
    userInfo = computed(() => $store.get('userInfo')),
    accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id),
    isOrg = computed(() => userInfo.value.organizationObj && userInfo.value.organizationObj.isOrg),
    oId = ref(null);

  formData.value = {
    names: {
      tag: 'slot',
      separate: {
        name: {
          value: '',
          formItem: {
            label: '人员名称',
            rules: [
              { required: true, message: '请填写人员名称', trigger: 'blur' },
            ],
          },
          attrs: {
            placeholder: '请输入人员名称',
          },
        },
        accountName: {
          value: '',
          formItem: {
            label: '人员账号',
            rules: [
              { required: true, message: '请填写人员账号', trigger: 'blur' },
            ],
          },
          attrs: {
            placeholder: '请输入人员账号',
          },
        },
      },
      position: [1, 1],
    },
    fileObj: {
      tag: 'slot',
      value: { name: '', url: '' },
      formItem: {
        label: '人员头像',
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
    sexType: {
      tag: 'radio',
      value: null,
      from: `sexTypeObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '人员性别',
        rules: [
          { required: true, message: '请选择人员性别', trigger: 'change' },
        ],
      },
      options: [],
      position: [2, 2],
    },
    organizationId: {
      tag: 'cascader',
      value: null,
      from: `organizationObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '所属机构',
        rules: (accountTypeId.value == 2 && isOrg.value) || accountTypeId.value == 3 ? [] : [
          { required: true, message: '请选择所属机构', trigger: 'change' },
        ],
      },
      options: [],
      attrs: {
        clearable: !(accountTypeId.value == 2 && !isOrg.value),
      },
      position: accountTypeId.value == 1 ? [] : [3, 1],
    },
    roleId: {
      tag: 'cascader',
      value: null,
      from: `roleObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '人员角色',
        rules: [
          { required: true, message: '请选择人员角色', trigger: 'change' },
        ],
      },
      options: [],
      attrs: {
        placeholder: accountTypeId.value == 2 && !isOrg.value ? '请先选择所属机构' : '请选择人员角色',
        disabled: accountTypeId.value == 2 && !isOrg.value,
        showAllLevels: false,
      },
      position: [3, 2],
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
      position: [4, 1],
    },
    idCard: {
      value: '',
      formItem: {
        label: '身份证号码',
        rules: [
          { validator(rule, value, callback) {
            if (value && !$regs.idCard.test(value)) {
              callback(new Error());
            }
            callback();
          }, message: '请填写正确的身份证号码', trigger: 'blur' },
        ],
      },
      limit: {
        input: /[^\u4e00-\u9fa5| ]+/,
      },
      position: [4, 2],
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
      position: [5, 1],
    },
    state: {
      tag: 'switch',
      value: null,
      from: `stateObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '状态',
      },
      position: [5, 2],
    },
    remark: {
      value: '',
      formItem: {
        label: '备注',
      },
      attrs: {
        type: 'textarea',
      },
      position: [6, 1],
    },
  };

  watch(() => formData.value.organizationId.value, (newVal) => {
    if (accountTypeId.value == 2 && !isOrg.value) {
      let _oId = null;
      $recurseInto(formData.value.organizationId.options, item => {
        if (item.id == newVal) {
          _oId = item.organizationId;
          return 'break';
        }
      });
      if (_oId && oId.value != _oId) {
        formData.value.roleId.options = [];
        formData.value.roleId.attrs = {
          ...formData.value.roleId.attrs,
          placeholder: newVal ? '请选择人员角色' : '请先选择所属机构',
          disabled: !newVal,
        };
        doGetRoleTree(formData, isEdit, _oId);
        oId.value = _oId;
      }
    }
  });

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
      return isEdit ? editPerson(id, { data }) : addPerson({ data });
    });
  }

  $useActivated(async once => {
    if (once) {
      if (!isAdd) {
        await getPersonDetail(id, { loading: isEdit }).then(res => {
          if (res.code == 200) {
            res.data.password = '******';
            if (isEdit) fileList.value = [res.data.fileObj];
            $form.set(formData.value, res.data);
          }
        });
      }
    }
    if (!isDetail) enums({ formData, type, accountTypeId, isOrg });
  });

  return { formData, labelWidth, doConfirm, cancel, edit, back };
}
