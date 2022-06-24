<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-18 11:59:02
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 16:49:45
-->
<script>
export default {
  name: 'RoleDialog'
};
</script>

<script setup>
import { addRole, editRole, getRoleDetail } from '@/api/Interior/Role.js';
import enums, { doGetRoleTree } from './js/enums.js';

const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
    dialogType: {
      type: String,
      default: () => (''),
    },
    dialogId: {
      type: [Number, String],
      default: () => (0),
    },
  }),
  { modelValue, dialogType, dialogId } = toRefs(props),
  emit = defineEmits(['update:modelValue', 'complete']);

const visible = ref(modelValue.value);
watch(modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) init();
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

const isAdd = computed(() => dialogType.value === 'Add'),
  isEdit = computed(() => dialogType.value === 'Edit'),
  isDetail = computed(() => !dialogType.value || dialogType.value === 'Detail'),
  userInfo = computed(() => $store.get('userInfo')),
  accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id),
  isOrg = computed(() => userInfo.value.organizationObj && userInfo.value.organizationObj.isOrg),
  myForm = ref(null),
  formData = ref({}),
  oId = ref(null);

function initFormData() {
  formData.value = {
    name: {
      value: '',
      formItem: {
        label: '角色名称',
        rules: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
        ],
      },
      position: [1, 1],
    },
    organizationId: {
      tag: 'select',
      value: null,
      from: `organizationObj.${ isDetail.value ? 'name' : 'id' }`,
      exclude: !(accountTypeId.value == 2 && !isOrg.value),
      formItem: {
        label: '所属机构',
        rules: [
          { required: true, message: '请选择所属机构', trigger: 'change' },
        ],
      },
      options: [],
      position: accountTypeId.value == 2 && !isOrg.value ? [2, 1] : [],
    },
    parentId: {
      tag: 'cascader',
      value: null,
      from: `parentObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '上级角色',
      },
      options: [],
      attrs: {
        placeholder: accountTypeId.value == 2 && !isOrg.value ? '请先选择所属机构' : '请选择人员角色',
        disabled: accountTypeId.value == 2 && !isOrg.value,
        clearable: true,
        showAllLevels: false,
      },
      position: [3, 1],
    },
    orderBy: {
      tag: 'inputNumber',
      value: null,
      formItem: {
        label: '排序',
      },
      attrs: {
        min: 1,
      },
      position: [4, 1],
    },
  };

  watch(() => formData.value.organizationId.value, (newVal) => {
    let _oId = null;
    $recurseInto(formData.value.organizationId.options, item => {
      if (item.id == newVal) {
        _oId = item.organizationId;
        return 'break';
      }
    });
    if (_oId && oId.value != _oId) {
      formData.value.parentId.options = [];
      formData.value.parentId.attrs = {
        ...formData.value.parentId.attrs,
        placeholder: newVal ? '请选择上级角色' : '请先选择所属机构',
        disabled: !newVal,
      };
      doGetRoleTree(formData, isEdit.value, dialogId.value, _oId);
      oId.value = _oId;
    }
  });
}

async function init() {
  initFormData();
  if (isDetail.value) {
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
  if (!isAdd.value) {
    await getRoleDetail(dialogId.value, { loading: isEdit.value }).then(res => {
      if (res.code == 200) {
        res.data.parentObj.id = res.data.parentObj.id || null;
        res.data.orderBy = res.data.orderBy || null;
        $form.set(formData.value, res.data);
      }
    });
  } else {
    formData.value.parentId.value = dialogId.value || null;
  }
  if (!isDetail.value) {
    enums({
      formData, accountTypeId,
      type: dialogType.value, id: dialogId.value, isOrg: isOrg.value,
    });
  }
}

async function confirm() {
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    data.parentId = data.parentId || 0;
    data.orderBy = data.orderBy || 0;
    const res = isAdd.value ? await addRole({ data }) : await editRole(dialogId.value, { data });
    if (res.code == 200) {
      cancel();
      emit('complete', { id: isAdd.value ? res.data.id : dialogId.value, parentId: data.parentId });
    }
  }
}
function cancel() {
  $form.set(formData.value, {
    name: '',
    organizationObj: { id: null, name: '' },
    parentObj: { id: null, name: '' },
    orderBy: null,
  });
  myForm.value.clearValidate();
  visible.value = false;
}
</script>

<template>
  <MyDialog v-model="visible" title="" :before-close="cancel">
    <MyForm ref="myForm" v-model="formData" width="78%" :showonly="isDetail" />

    <template v-if="!isDetail" #down>
      <div class="dialog_form_btns">
        <el-button type="primary" round @click="confirm">确认</el-button>
        <el-button round @click="cancel">取消</el-button>
      </div>
    </template>
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>
