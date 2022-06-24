<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-18 11:59:02
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 17:08:25
-->
<script>
export default {
  name: 'OrganizationDialog'
};
</script>

<script setup>
import { addOrganization, editOrganization, getOrganizationDetail } from '@/api/Interior/Organization.js';
import enums from './js/enums.js';

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
  showChoosePerson = ref(false),
  liablePersonName = ref(''),
  userInfo = computed(() => $store.get('userInfo')),
  accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id);

function initFormData() {
  formData.value = {
    name: {
      value: '',
      formItem: {
        label: '机构名称',
        rules: [
          { required: true, message: '请填写机构名称', trigger: 'blur' },
        ],
      },
      position: [1, 1],
    },
    parentId: {
      tag: 'cascader',
      value: null,
      from: `parentObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '上级机构',
        rules: accountTypeId.value == 1 ? [
          { required: true, message: '请选择上级机构', trigger: 'change' },
        ] : [],
      },
      options: [],
      attrs: {
        clearable: accountTypeId.value != 1,
      },
      position: [2, 1],
    },
    liablePersonId: {
      tag: 'slot',
      value: isDetail.value ? '' : 0,
      from: `liablePersonObj.${ isDetail.value ? 'name' : 'id' }`,
      formItem: {
        label: '负责人',
      },
      position: accountTypeId.value == 1 ? [] : [3, 1],
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
    await getOrganizationDetail(dialogId.value, { loading: isEdit.value }).then(res => {
      if (res.code == 200) {
        res.data.parentObj.id = res.data.parentObj.id || null;
        res.data.orderBy = res.data.orderBy || null;
        $form.set(formData.value, res.data);
      }
    });
  } else {
    parentKey && (formData.value[parentKey].value = dialogId.value || null);
  }
  if (!isDetail.value) {
    enums({ formData, type: dialogType.value, id: dialogId.value });
  }
}

function doChoosePerson(row) {
  formData.value.liablePersonId.value = row.id;
  liablePersonName.value = row.name;
}

async function confirm() {
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    parentKey && (data[parentKey] = data[parentKey] || 0);
    data.orderBy = data.orderBy || 0;
    const res = isAdd.value ? await addOrganization({ data }) : await editOrganization(dialogId.value, { data });
    if (res.code == 200) {
      cancel();
      emit('complete', { id: isAdd.value ? res.data.id : dialogId.value });
    }
  }
}
function cancel() {
  $form.set(formData.value, {
    name: '',
    parentObj: { id: null, name: '' },
    liablePersonObj: { id: null, name: '' },
    orderBy: null,
  });
  JSON.stringify(formData.value) !== '{}' && myForm.value.clearValidate();
  visible.value = false;
}
</script>

<template>
  <MyDialog v-model="visible" title="" :before-close="cancel">
    <MyForm ref="myForm" v-model="formData" width="78%" :showonly="isDetail">
      <template #liablePersonId="{model, tab}">
        <div v-if="isDetail" class="dialog_trigger showonly">{{ model.liablePersonId }}</div>
        <div
          v-else
          v-tab="{name: tab.name, current: true}"
          class="dialog_trigger"
          :class="{is_clearable: liablePersonName}"
          tabindex="-1"
          @click="showChoosePerson = true"
          @keydown.enter="showChoosePerson = true"
        >
          <span>{{ liablePersonName }}</span>
          <span class="is_placeholder">请选择负责人</span>
          <el-icon>
            <IconEpCaretBottom />
          </el-icon>
          <el-icon class="icon_close" @click.stop="liablePersonName = ''; model.liablePersonId = 0;">
            <IconEpCircleClose />
          </el-icon>
        </div>
      </template>
    </MyForm>

    <template v-if="!isDetail" #down>
      <div class="dialog_form_btns">
        <el-button type="primary" round @click="confirm">确认</el-button>
        <el-button round @click="cancel">取消</el-button>
      </div>
    </template>

    <ChoosePerson v-model="showChoosePerson" @choose="doChoosePerson" />
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>
