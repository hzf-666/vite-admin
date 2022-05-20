<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-18 17:39:41
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-20 16:08:48
-->
<script>
export default {
  name: 'Login'
};
</script>

<script setup>
import loginPicture from '@a/images/login_picture.png';

const appName = computed(() => $store.get('settings/appName'));

const formContainer = ref(null), minWidth = ref(''), minHeight = ref(''),
  getMinClient = () => {
    const width = formContainer.value.clientWidth + 'px', height = formContainer.value.clientHeight + 'px';
    if (minWidth.value !== width && minHeight.value !== height) {
      minWidth.value = width;
      minHeight.value = height;
    }
  };
onMounted(() => {
  getMinClient();
});
onUpdated(() => {
  getMinClient();
});

const myForm = ref(null),
  formData = ref({
    name: {
      tag: 'input',
      value: '',
      formItem: {
        label: '姓名',
      },
      limit: {
        input: /(0|[1-9]\d*)(\.\d{0,2})?/,
        blur: /(^[1-9]\d*$)|(^(0|[1-9]\d*)\.\d{1,2}$)/,
      },
      position: [1, 1],
    },
    age: {
      tag: 'inputNumber',
      value: 0,
      formItem: {
        label: '年龄',
      },
      position: [1, 2],
    },
    hobby: {
      tag: 'autocomplete',
      value: '',
      formItem: {
        label: '爱好',
        rules: [
          { required: true, message: '请填写爱好', trigger: 'blur' },
        ],
      },
      attrs: {
        'fetch-suggestions': qs => {
          return [
            { name: '游泳' },
            { name: '跑步' },
            { name: '打球' },
          ];
        },
      },
      position: [2, 1],
    },
    nation: {
      tag: 'select',
      value: null,
      formItem: {
        label: '国籍',
        rules: [
          { required: true, message: '请选择国籍', trigger: 'change' },
        ],
      },
      options: [
        { id: 1, name: '中国' },
        { id: 2, name: '俄罗斯' },
        { id: 3, name: '朝鲜' },
        { id: 4, name: '巴基斯坦' },
      ],
      attrs: {
        filterable: true,
        clearable: true,
      },
      position: [2, 2],
    },
    hometown: {
      tag: 'cascader',
      value: null,
      formItem: {
        label: '籍贯',
      },
      options: [
        { id: 1, name: '广东省', children: [{ id: 11, name: '广州市' }, { id: 12, name: '深圳市' }, { id: 13, name: '佛山市' }] },
        { id: 2, name: '湖南省', children: [{ id: 21, name: '长沙市' }, { id: 22, name: '株洲市' }, { id: 23, name: '衡阳市' }] },
        { id: 3, name: '江苏省', children: [{ id: 31, name: '苏州市' }, { id: 32, name: '南京市' }] },
      ],
      attrs: {
        props: {
          checkStrictly: false,
        },
        clearable: true,
      },
      position: [3, 1],
    },
    birthday: {
      tag: 'datePicker',
      value: '',
      formItem: {
        label: '出生日期',
      },
      position: [3, 2],
    },
    signin: {
      tag: 'timePicker',
      value: '',
      formItem: {
        label: '签到时间',
      },
      position: [4, 1],
    },
    leave: {
      tag: 'timeSelect',
      value: '',
      formItem: {
        label: '离开时间',
      },
      position: [4, 2],
    },

    // resource: {
    //   tag: 'radio',
    //   value: null,
    //   formItem: {
    //     label: '资源',
    //   },
    //   options: [
    //     { id: 1, name: '赞助' },
    //     { id: 2, name: '场地' },
    //   ],
    //   position: [5, 1],
    // },
    // activity: {
    //   tag: 'checkbox',
    //   value: [],
    //   formItem: {
    //     label: '活动类型',
    //   },
    //   options: [
    //     { id: 1, name: '线上活动' },
    //     { id: 2, name: '推广活动' },
    //     { id: 3, name: '线下活动' },
    //     { id: 4, name: '简单的品牌曝光' },
    //   ],
    //   rowspan: 2,
    //   position: [5, 2],
    // },
    // state: {
    //   tag: 'switch',
    //   value: false,
    //   formItem: {
    //     label: '状态',
    //   },
    //   position: [6, 1],
    // },

    resource_state: {
      tag: 'slot',
      separate: {
        resource: {
          value: null,
          formItem: {
            label: '资源',
          },
          options: [
            { id: 1, name: '赞助' },
            { id: 2, name: '场地' },
          ],
        },
        state: {
          value: false,
          formItem: {
            label: '状态',
          },
        },
      },
      position: [5, 1],
    },
    activity: {
      tag: 'checkbox',
      value: [],
      formItem: {
        label: '活动类型',
      },
      options: [
        { id: 1, name: '线上活动' },
        { id: 2, name: '推广活动' },
        { id: 3, name: '线下活动' },
        { id: 4, name: '简单的品牌曝光' },
      ],
      position: [5, 2],
    },
  }),
  border = ref(false), showonly = ref(false);
async function doSubmit(type) {
  if (type == 1) {
    border.value = !border.value;
  }
  if (type == 2) {
    myForm.value.clearValidate();
    const res = {
      name: '123456',
      age: 99,
      hobby: '听歌',
      nation: 1,
      hometown: 11,
      birthday: '1999-05-20',
      signin: '15:05',
      leave: '00:15',
      resource: 2,
      state: true,
      activity: [1, 2],
    };
    $form.set(formData.value, res);
    console.log(formData.value);
  }
  if (type == 3) {
    showonly.value = !showonly.value;
  }
  if (type == 5) {
    if (formData.value.resource_state) {
      delete formData.value.resource_state;
      formData.value.activity.rowspan = 2;
      formData.value.resource = {
        tag: 'radio',
        value: null,
        formItem: {
          label: '资源',
        },
        options: [
          { id: 1, name: '赞助' },
          { id: 2, name: '场地' },
        ],
        position: [5, 1],
      };
      formData.value.state = {
        tag: 'switch',
        value: false,
        formItem: {
          label: '状态',
        },
        position: [6, 1],
      };
    } else {
      delete formData.value.resource;
      delete formData.value.state;
      delete formData.value.activity.rowspan;
      formData.value.resource_state = {
        tag: 'slot',
        separate: {
          resource: {
            value: null,
            formItem: {
              label: '资源',
            },
            options: [
              { id: 1, name: '赞助' },
              { id: 2, name: '场地' },
            ],
          },
          state: {
            value: false,
            formItem: {
              label: '状态',
            },
          },
        },
        position: [5, 1],
      };
    }
  }
  if (type == 4) {
    const { isValid, data } = await myForm.value.submit();
    if (isValid) {
      console.log(data);
    }
    // const data = {};
    // $form.get(formData.value, data);
    // console.log(data);
  }
}

const clamp = ref(1), pagingList = ref([]);
for (let i = 0; i < 1; i++) {
  pagingList.value.push({ content: '123456阿瓦打我阿瓦打我打阿瓦达阿我安慰啊', address: '阿达瓦ad按时阿达瓦我阿萨德' });
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
          <div class="login_title">{{ appName }}</div>
          <div class="login_subtitle">欢迎登录</div>

          <MyForm
            ref="myForm"
            v-model="formData"
            width="600px"
            :border="border"
            :showonly="showonly"
          >
            <template #resource_state="{tab, separate, model}">
              <el-form-item v-bind="separate.resource.formItem" prop="resource">
                <el-radio-group v-model="model.resource" v-tab="tab.name">
                  <el-radio v-for="(item, i) in separate.resource.options" :key="i" :label="item.id">{{ item.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-bind="separate.state.formItem" prop="state">
                <div>
                  <el-switch v-model="model.state" v-tab="tab.name" />
                </div>
              </el-form-item>
            </template>
          </MyForm>

          <div style="margin-top: 15px; text-align: center;">
            <el-button type="warning" @click="doSubmit(1)">切换边框样式</el-button>
            <el-button type="primary" @click="doSubmit(2)">赋值</el-button>
            <el-button type="warning" @click="doSubmit(3)">切换编辑状态</el-button>
            <el-button type="primary" @click="doSubmit(4)">提交</el-button>
            <el-button type="danger" @click="doSubmit(5)">切换合并/插槽</el-button>
          </div>

          <!-- <el-table :data="pagingList" border>
            <el-table-column label="地址" prop="address" align="center" />
            <el-table-column label="内容" align="center">
              <template #default="{row}">
                <LineClamp :clamp="clamp" :content="row.content" selector="td" autosize>
                  <span style="color: red;">666</span>{{ row.content }}
                </LineClamp>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="clamp++">++</el-button>
          <el-button @click="clamp--">--</el-button> -->
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
  }
}
</style>
