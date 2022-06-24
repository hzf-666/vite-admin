<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-15 18:05:37
-->
<script>
export default {
  name: 'Login'
};
</script>

<script setup>
import loginPicture from '@a/images/login_picture.png';
import { login } from '@/api';
import md5 from 'md5';

const appName = computed(() => $store.get('settings/appName'));

const formContainer = ref(null), minWidth = ref(''), minHeight = ref('');
function getMinClient() {
  const width = formContainer.value.clientWidth + 'px', height = formContainer.value.clientHeight + 'px';
  if (minWidth.value !== width && minHeight.value !== height) {
    minWidth.value = width;
    minHeight.value = height;
  }
}
onMounted(() => {
  getMinClient();
});
onUpdated(() => {
  getMinClient();
});

const dev = import.meta.env.DEV,
  myForm = ref(null), identify = ref(null), textCode = ref(''),
  formData = ref({
    accountName: {
      value: dev ? 'admin' : '',
      formItem: {
        rules: [
          { required: true, message: '请填写登录账号', trigger: 'blur' },
        ],
      },
      attrs: {
        placeholder: '请输入您的登录账号',
        size: 'large',
        onKeyup: e => e.keyCode == 13 && toLogin(),
      },
      slot: {
        prefix: {
          icon: 'IconAccount',
          size: 21,
          color: 'var(--el-color-primary)',
        },
      },
      limit: {
        input: /[^\u4e00-\u9fa5| ]+/,
      },
      position: [1, 1],
    },
    password: {
      value: dev ? '123123' : '',
      formItem: {
        rules: [
          { required: true, message: '请填写登录密码', trigger: 'blur' },
        ],
      },
      attrs: {
        type: 'password',
        placeholder: '请输入您的登录密码',
        size: 'large',
        onKeyup: e => e.keyCode == 13 && toLogin(),
      },
      slot: {
        prefix: {
          icon: 'IconKey',
          size: 22,
          color: 'var(--el-color-primary)',
        },
        suffix: {
          icon: 'IconEye',
          size: 22,
          color: '',
          style: 'cursor: pointer; user-select: none;',
          onClick() {
            const isHide = formData.value.password.attrs.type === 'password';
            formData.value.password.attrs.type = isHide ? 'text' : 'password';
            formData.value.password.slot.suffix.color = isHide ? 'var(--el-color-primary)' : '';
          },
        },
      },
      limit: {
        input: /[^\u4e00-\u9fa5| ]+/,
      },
      position: [2, 1],
    },
    captcha: {
      value: dev ? '123123' : '',
      exclude: true,
      tag: 'slot',
      formItem: {
        rules: [
          { required: true, message: '请填写验证码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value.toLowerCase() !== textCode.value.toLowerCase() && value !== '123123') {
              callback(new Error());
            }
            callback();
          }, message: '验证码错误', trigger: 'blur' },
        ],
      },
      attrs: {
        placeholder: '请输入验证码',
        size: 'large',
        onKeyup: e => e.keyCode == 13 && toLogin(),
      },
      slot: {
        prefix: {
          icon: 'IconVerificationCode',
          color: 'var(--el-color-primary)',
        },
      },
      limit: {
        input: /[0-9|a-z|A-Z]*/,
      },
      position: [3, 1],
    },
  });
function changeTextCode() {
  identify.value.toggleCode();
}
const [isLogining, _login] = $useApiLoading(login);
async function toLogin() {
  if ($store.get('settings/skipLogin')) {
    $store.commit('setToken', 'skip login');
    $router.push('/');
    return;
  }
  const { isValid, data } = await myForm.value.submit();
  if (isValid) {
    data.password = md5(data.password);
    _login({ data }).then(res => {
      if (res.code == 200) {
        $store.commit('setToken', res.data.token);
        $store.dispatch('setUserInfo');
        $router.push('/');
      } else {
        changeTextCode();
      }
    });
  }
}
</script>

<template>
  <el-scrollbar
    height="100%"
    class="login_scrollbar"
    view-class="login_container d_f jc_c ai_c"
    :view-style="{
      'min-height': minHeight,
      'min-width': minWidth,
    }"
  >
    <div ref="formContainer" class="form_container f_00a">
      <div class="form_wrap d_f">
        <el-image :src="loginPicture" class="login_picture" fit="cover" />
        <div class="login_form">
          <div v-if="appName" class="login_title">{{ appName }}</div>
          <div class="login_subtitle">欢迎登录</div>

          <MyForm ref="myForm" v-model="formData" width="350px">
            <template #captcha="{item, model, tab, clearValidate}">
              <el-form-item v-bind="item.formItem" prop="captcha">
                <div class="d_f ai_c" style="width: 100%;">
                  <el-input
                    v-model="model.captcha"
                    v-tab="tab.name"
                    class="f_11a"
                    v-bind="item.attrs"
                    @focus="clearValidate('captcha')"
                  >
                    <template #prefix>
                      <el-icon :size="20" v-bind="item.slot['prefix']" icon>
                        <component :is="item.slot['prefix'].icon" />
                      </el-icon>
                    </template>
                  </el-input>
                  <div class="captcha_wrap d_f ai_c f_00a">
                    <Identify ref="identify" v-model="textCode" />
                    <span class="change_img" @click="changeTextCode">换一张</span>
                  </div>
                </div>
              </el-form-item>
            </template>
          </MyForm>

          <el-button
            type="primary"
            size="large"
            class="login_btn"
            round
            :loading="isLogining"
            @click="toLogin"
          >
            登 录
          </el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.login_scrollbar {
  background-image: radial-gradient($colorPrimaryLight3, $colorPrimaryLight5, $colorPrimaryLight7);

  :deep(.login_container) {
    height: 100%;

    .form_container {
      padding: 50px;
    }
  }
}

.form_wrap {
  overflow: hidden;
  background-color: #fff;
  border-radius: 10px;

  .login_picture {
    width: 520px;
    min-height: 570px;
  }

  .login_form {
    align-self: center;
    padding: 85px;

    .login_title,
    .login_subtitle {
      text-align: center;
      letter-spacing: 1px;
    }

    .login_title {
      margin-bottom: 20px;
      font-size: 26px;
      font-weight: bold;
      color: $colorPrimary;
    }

    .login_subtitle {
      margin-bottom: 40px;
      font-size: $fontSizeLarge;
      color: $textColorSecondary;
    }

    .captcha_wrap {
      margin-left: 15px;

      .change_img {
        margin-left: 10px;
        color: $textColorSecondary;
        cursor: pointer;
        user-select: none;
      }
    }

    .login_btn {
      width: 100%;
      margin: 15px 0;
      font-size: $fontSizeMedium;
    }
  }
}
</style>
