<script>
export default {
  name: 'UserPassword'
};
</script>

<script setup>
import { editUserPassword } from '@/api';
import { logout } from '@u/user.js';
import md5 from 'md5';

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
  formData = ref({
    oldPassword: {
      value: '',
      formItem: {
        label: '原密码',
        rules: [
          { required: true, message: '请填写原密码', trigger: 'blur' },
        ],
      },
      attrs: {
        type: 'password',
        showPassword: true,
      },
      position: [1, 1],
    },
    newPassword: {
      value: '',
      formItem: {
        label: '新密码',
        rules: [
          { required: true, message: '请填写新密码', trigger: 'blur' },
        ],
      },
      attrs: {
        type: 'password',
        showPassword: true,
        onBlur() {
          if (formData.value.confirmPassword.value) myForm.value.validateField('confirmPassword');
        },
      },
      position: [2, 1],
    },
    confirmPassword: {
      value: '',
      exclude: true,
      formItem: {
        label: '确认密码',
        rules: [
          { required: true, message: '请填写确认密码', trigger: 'blur' },
          { validator(rule, value, callback) {
            if (value !== formData.value.newPassword.value) {
              callback(new Error());
            }
            callback();
          }, message: '两次密码不一致', trigger: 'blur' },
        ],
      },
      attrs: {
        type: 'password',
        showPassword: true,
      },
      position: [3, 1],
    },
  });
async function confirm() {
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    data.oldPassword = md5(data.oldPassword);
    data.newPassword = md5(data.newPassword);
    editUserPassword({ data }).then(res => {
      if (res.code == 200) {
        cancel();
        setTimeout(() => {
          $alert('账号密码已修改，请重新登录！', '登录确认', {
            type: 'success',
            showClose: false,
            callback: action => {
              if (action == 'confirm') {
                logout();
              }
            }
          });
        }, 200);
      }
    });
  }
}
function cancel() {
  $form.set(formData.value, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  myForm.value.clearValidate();
  visible.value = false;
}
</script>

<template>
  <MyDialog v-model="visible" title="修改密码" width="550px" :before-close="cancel">
    <MyForm ref="myForm" v-model="formData" name="userPassword" />

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
