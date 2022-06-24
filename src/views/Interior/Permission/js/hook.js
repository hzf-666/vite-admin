/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-13 17:23:39
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-18 15:19:10
 */
import { addPermission, editPermission, getPermissionDetail } from '@/api/Interior/Permission.js';
import enums from './enums.js';
import { updateRoutes } from '@/router/handle.js';

export default function({ menuName, myForm, type } = {}) {
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
    level = ref(1),
    defaultParentName = '配置上级权限',
    parentName = ref(defaultParentName),
    showChoosePermission = ref(false),
    defaultExpandedKeys = ref([]),
    defaultCheckedKeys = ref([]),
    showChooseIcon = ref(false);
  function doChoosePermission({ checkedKeys, expandedKeys, target }) {
    defaultCheckedKeys.value = checkedKeys;
    defaultExpandedKeys.value = expandedKeys;
    formData.value.parentId.value = target ? target.id : 0;
    level.value = target ? target.level + 1 : 1;
    parentName.value = target ? target.title : defaultParentName;
  }
  function doChooseIcon(iconName) {
    formData.value.icon.value = iconName;
    showChooseIcon.value = false;
  }

  formData.value = {
    title: {
      value: '',
      from: 'meta.title',
      to: 'meta.title',
      formItem: {
        label: '标题',
        rules: [
          { required: true, message: '请填写标题', trigger: 'blur' },
        ],
      },
      position: [1, 1],
    },
    name: {
      value: '',
      formItem: {
        label: '标识',
        rules: [
          { required: true, message: '请填写标识', trigger: 'blur' },
        ],
      },
      attrs: {
        placeholder: '请输入标识（字母、数字或下划线）',
      },
      limit: {
        input: /\w+/,
      },
      position: [1, 2],
    },
    type: {
      tag: 'radio',
      value: null,
      from: `functionTypeObj.${ isDetail ? 'name' : 'id' }`,
      to: 'meta.type',
      formItem: {
        label: '权限类别',
        rules: [
          { required: true, message: '请选择权限类别', trigger: 'change' },
        ],
      },
      options: [],
      position: [2, 1],
    },
    parentId: {
      tag: isDetail ? 'input' : 'slot',
      value: isDetail ? '' : 0,
      from: `parentObj.${ isDetail ? 'title' : 'id' }`,
      formItem: {
        label: '上级权限',
      },
      options: [],
      position: [2, 2],
    },
    hidden: {
      tag: 'switch',
      value: isDetail ? '' : false,
      from: 'meta.hidden',
      to: 'meta.hidden',
      formItem: {
        label: '是否隐藏',
      },
      position: [3, 1],
    },
    orderby: {
      tag: 'inputNumber',
      value: null,
      formItem: {
        label: '排序',
      },
      attrs: {
        min: 1,
      },
      position: [3, 2],
    },
    state: {
      tag: 'switch',
      value: null,
      from: `stateObj.${ isDetail ? 'name' : 'id' }`,
      formItem: {
        label: '状态',
      },
      position: [4, 1],
    },
    rename: {
      value: '',
      from: 'meta.rename',
      to: 'meta.rename',
      formItem: {
        label: '别名',
      },
      position: [4, 2],
    },
    affix: {
      tag: 'switch',
      value: isDetail ? '' : false,
      from: 'meta.affix',
      to: 'meta.affix',
      formItem: {
        label: '是否固定',
      },
      position: [5, 1],
    },
    redirect: {
      value: '',
      from: 'meta.redirect',
      to: 'meta.redirect',
      formItem: {
        label: '重定向',
      },
      position: [5, 2],
    },
    apiUrl: {
      value: '',
      formItem: {
        label: '接口地址',
      },
      attrs: {
        type: 'textarea',
      },
      position: [6, 1],
    },
    icon: {
      tag: 'slot',
      value: '',
      from: 'meta.icon',
      to: 'meta.icon',
      formItem: {
        label: '图标',
      },
      position: [6, 2],
    },
    remark: {
      value: '',
      formItem: {
        label: '备注',
      },
      attrs: {
        type: 'textarea',
      },
      position: [7, 1],
    },
  };

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
      data.orderby = data.orderby || 0;
      data.level = level.value;
      return isEdit ? editPermission(id, { data }) : addPermission({ data });
    }, async(res, opts) => {
      const parentId = formData.value.parentId;
      if (parentId.value) {
        let chains;
        $recurseInto(parentId.options, (item, { parent }) => {
          item.chains = parent ? $deepCopy(parent.chains).concat(item.id) : [item.id];
          if (item.id == parentId.value) {
            chains = item.chains.join(',');
            return 'break';
          }
        });
        opts.to.params = {
          ...opts.to.params,
          [`${ menuName }Chains`]: chains,
        };
      }
      setTimeout(() => {
        updateRoutes(currentRoute, { clear: isEdit });
      }, 50);
    });
  }

  $useActivated(async once => {
    if (once) {
      if (!isAdd) {
        await getPermissionDetail(id, { loading: isEdit }).then(res => {
          if (res.code == 200) {
            const parentObj = res.data.parentObj;
            if (parentObj.id) {
              defaultCheckedKeys.value = [parentObj.id];
              parentName.value = parentObj.title;
            } else {
              parentName.value = defaultParentName;
            }
            res.data.orderby = res.data.orderby || null;
            level.value = res.data.level;
            if (isDetail) {
              res.data.meta.hidden = res.data.meta.hidden ? '是' : '否';
              res.data.meta.affix = res.data.meta.affix ? '是' : '否';
            }
            $form.set(formData.value, res.data);
          }
        });
      }
    }
    if (!isDetail) await enums({ formData, type, id });
    if (isEdit) {
      $recurseInto(formData.value.parentId.options, (item, { parent }) => {
        if (item.id == formData.value.parentId.value) {
          if (parent) defaultExpandedKeys.value = [parent.id];
          return 'break';
        }
      });
    }
  });

  return {
    formData, labelWidth, doConfirm, cancel, edit, back, parentName,
    showChoosePermission, doChoosePermission,
    defaultExpandedKeys, defaultCheckedKeys,
    showChooseIcon, doChooseIcon,
  };
}
