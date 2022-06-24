<script>
export default {
  name: 'UserInfo'
};
</script>

<script setup>
import { editUserInfo } from '@/api';

const props = defineProps({
    modelValue: {
      type: Boolean,
      default: () => (false),
    },
  }),
  { modelValue } = toRefs(props),
  emit = defineEmits(['update:modelValue', 'choose']);

const visible = ref(modelValue.value);
watch(modelValue, (newVal) => {
  visible.value = newVal;
});
watch(visible, (newVal) => {
  if (newVal !== modelValue.value) {
    emit('update:modelValue', newVal);
  }
});

const myForm = ref(null),
  userInfo = computed(() => $store.get('userInfo')),
  accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id),
  fileList = ref([]),
  formData = ref({
    fileObj: {
      tag: 'slot',
      formItem: {
        label: accountTypeId.value == 2 ? 'Logo' : '头像',
      },
      value: { name: '', url: '' },
      position: [1, 1],
    },
    names: {
      tag: 'slot',
      separate: {
        name: {
          value: '',
          formItem: {
            label: '名称',
            rules: [
              { required: true, message: '请填写名称', trigger: 'blur' },
            ],
          },
          attrs: {
            placeholder: '请输入名称',
          },
        },
        accountName: {
          value: '',
          exclude: true,
          formItem: {
            label: '账号',
          },
        },
      },
      position: [1, 2],
    },
    sexType: {
      tag: 'radio',
      value: null,
      from: 'sexTypeObj.id',
      formItem: {
        label: '性别',
        rules: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
      },
      options: [],
      position: accountTypeId.value == 2 ? [] : [2, 1],
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
      position: [2, 2],
    },
    organizationName: {
      value: '',
      from: 'organizationObj.name',
      exclude: true,
      formItem: {
        label: accountTypeId.value == 2 ? '当前机构' : '所属机构',
      },
      showonly: true,
      position: accountTypeId.value == 1 ? [] : [3, 1],
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
    roleName: {
      value: '',
      from: 'roleObj.name',
      exclude: true,
      formItem: {
        label: '角色',
      },
      showonly: true,
      position: [4, 1],
    },
  });
resetUserInfo();
if (accountTypeId.value != 2) {
  $store.dispatch('enums/getEnum', {
    name: 'SexType',
    value: formData.value.sexType.value,
    callback(list, val) {
      formData.value.sexType.value = val;
      formData.value.sexType.options = list;
    },
  });
}
function resetUserInfo() {
  $form.set(formData.value, {
    ...userInfo.value,
    sexTypeObj: userInfo.value.sexTypeObj || {},
    organizationObj: userInfo.value.organizationObj || {},
    roleObj: userInfo.value.roleObj || {},
  });
  fileList.value = [userInfo.value.fileObj];
}
async function confirm() {
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    editUserInfo({ data }).then(async res => {
      if (res.code == 200) {
        await $store.dispatch('setUserInfo');
        cancel();
      }
    });
  }
}
function cancel() {
  resetUserInfo();
  myForm.value.clearValidate();
  visible.value = false;
}
</script>

<template>
  <MyDialog v-model="visible" title="修改用户信息" width="850px" :before-close="cancel">
    <MyForm ref="myForm" v-model="formData" name="userInfo" column-gap="60px">
      <template #names="{separate, model, tab, clearValidate}">
        <el-form-item v-bind="separate.name.formItem" prop="name">
          <el-input
            v-model="model.name"
            v-tab="tab.name"
            v-bind="separate.name.attrs"
            @focus="clearValidate('name')"
          />
        </el-form-item>
        <el-form-item v-bind="separate.accountName.formItem" prop="accountName">
          <el-input v-model="model.accountName" v-bind="separate.accountName.attrs" class="showonly" disabled />
        </el-form-item>
      </template>
      <template #fileObj="{model, tab}">
        <MyUpload v-tab="tab.name" :file-list="fileList" photo @change="files => model.fileObj = files[0]" />
      </template>
    </MyForm>

    <template #down>
      <div class="dialog_form_btns">
        <el-button type="primary" round @click="confirm">确认</el-button>
        <el-button round @click="cancel">取消</el-button>
      </div>
    </template>
  </MyDialog>
</template>

<style lang="scss" scoped>

</style>

