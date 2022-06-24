<script>
export default {
  name: 'DictionaryDialog'
};
</script>

<script setup>
import { addDictionary, editDictionary, getDictionaryDetail } from '@/api/System/Dictionary.js';
import enums, { doGetDictionaryTree } from './js/enums.js';

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
  myForm = ref(null),
  formData = ref({}),
  parentKey = 'parentId',
  paramTypeList = ref([]),
  paramTypeObj = ref({});

function initFormData() {
  formData.value = {
    systemCode: {
      value: '',
      formItem: {
        label: '参数编号',
      },
      showonly: true,
      exclude: true,
      position: isAdd.value ? [] : [1, 1],
    },
    name: {
      value: '',
      formItem: {
        label: '参数名称',
        rules: [
          { required: true, message: '请填写参数名称', trigger: 'blur' },
        ],
      },
      position: isDetail.value ? [1, 2] : [2, 1],
    },
    paramType: {
      tag: 'select',
      value: null,
      from: `paramTypeObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '参数类型',
      },
      options: [],
      attrs: {
        clearable: true,
      },
      position: isDetail.value ? [2, 1] : [3, 1],
    },
    parentId: {
      tag: 'cascader',
      value: null,
      from: `parentObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '参数归属',
      },
      options: [],
      attrs: {
        clearable: true,
        onChange: getParamType,
      },
      position: isDetail.value ? [2, 2] : [4, 1],
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
      position: isDetail.value ? [3, 1] : [5, 1],
    },
    state: {
      tag: 'switch',
      value: null,
      from: `stateObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '状态',
      },
      position: isDetail.value ? [3, 2] : [6, 1],
    },
    createBy: {
      value: '',
      formItem: {
        label: '添加人员',
      },
      showonly: true,
      exclude: true,
      position: isDetail.value ? [4, 1] : [],
    },
    createTime: {
      value: '',
      formItem: {
        label: '添加时间',
      },
      showonly: true,
      exclude: true,
      position: isDetail.value ? [4, 2] : [],
    },
    updateBy: {
      value: '',
      formItem: {
        label: '修改人员',
      },
      showonly: true,
      exclude: true,
      position: isDetail.value ? [5, 1] : [],
    },
    updateTime: {
      value: '',
      formItem: {
        label: '修改时间',
      },
      showonly: true,
      exclude: true,
      position: isDetail.value ? [5, 2] : [],
    },
  };
}

function getParamType(parentId) {
  let typeId, list = [];
  parentId && $recurseInto(formData.value.parentId.options, item => {
    if (item.id == parentId) {
      typeId = item.paramTypeObj.id;
      if (typeId) list = [$deepCopy(item.paramTypeObj)];
      return 'break';
    }
  });
  formData.value.paramType.attrs = {
    ...formData.value.paramType.attrs,
    disabled: !!typeId,
  };
  formData.value.paramType.options = (paramTypeObj.value.id ? [paramTypeObj.value] : []).concat(typeId ? list : paramTypeList.value);
  formData.value.paramType.value = typeId || (formData.value.paramType.options.find(item => item.id == formData.value.paramType.value) ? formData.value.paramType.value : null);
}

async function init() {
  initFormData();
  paramTypeObj.value = {};
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
  } else {
    await doGetDictionaryTree(formData, isEdit.value, dialogId.value);
  }
  if (!isAdd.value) {
    await getDictionaryDetail(dialogId.value, { loading: isEdit.value }).then(res => {
      if (res.code == 200) {
        paramTypeObj.value = res.data.paramTypeObj;
        res.data.paramTypeObj.id = res.data.paramTypeObj.id || null;
        res.data.parentObj.id = res.data.parentObj.id || null;
        res.data.orderBy = res.data.orderBy || null;
        if (!res.data.updateTime) {
          formData.value.updateBy.position = [];
          formData.value.updateTime.position = [];
        }
        $form.set(formData.value, res.data);
      }
    });
  } else {
    parentKey && (formData.value[parentKey].value = dialogId.value || null);
  }
  if (!isDetail.value) {
    await enums({ formData, type: dialogType.value, id: dialogId.value, paramTypeList });
    getParamType(formData.value.parentId.value);
  }
}

async function confirm() {
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    parentKey && (data[parentKey] = data[parentKey] || 0);
    data.paramType = data.paramType || 0;
    data.orderBy = data.orderBy || 0;
    const res = isAdd.value ? await addDictionary({ data }) : await editDictionary(dialogId.value, { data });
    if (res.code == 200) {
      cancel();
      emit('complete', { id: isAdd.value ? res.data.id : dialogId.value });
    }
  }
}
function cancel() {
  $form.set(formData.value, {
    name: '',
    orderBy: null,
    paramTypeObj: { id: null, name: '' },
    parentObj: { id: null, name: '' },
    stateObj: { id: null, name: '' },
  });
  JSON.stringify(formData.value) !== '{}' && myForm.value.clearValidate();
  visible.value = false;
}
</script>

<template>
  <MyDialog v-model="visible" title="" :before-close="cancel" :width="isDetail ? '850px' : '750px'">
    <MyForm ref="myForm" v-model="formData" :width="isDetail ? '90%' : '78%'" :showonly="isDetail" />

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
