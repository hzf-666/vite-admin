<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-27 12:03:47
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-26 09:50:30
-->
<script>
// 引入node_modules里的tinymce相关文件文件
import tinymce from 'tinymce/tinymce'; // tinymce默认hidden，不引入则不显示编辑器
tinymce.baseURL = '/tinymce';
import 'tinymce/themes/silver'; // 编辑器主题，不引入则报错
import 'tinymce/icons/default'; // 引入编辑器图标icon，不引入则不显示对应图标

// 引入编辑器插件（基本免费插件都在这儿了）
import 'tinymce/plugins/advlist'; // 高级列表
import 'tinymce/plugins/anchor'; // 锚点
import 'tinymce/plugins/autolink'; // 自动链接
import 'tinymce/plugins/autoresize'; // 编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave'; // 自动存稿
import 'tinymce/plugins/charmap'; // 特殊字符
import 'tinymce/plugins/code'; // 编辑源码
import 'tinymce/plugins/codesample'; // 代码示例
import 'tinymce/plugins/directionality'; // 文字方向
import 'tinymce/plugins/emoticons'; // 表情
import 'tinymce/plugins/fullpage'; // 文档属性
import 'tinymce/plugins/fullscreen'; // 全屏
import 'tinymce/plugins/help'; // 帮助
import 'tinymce/plugins/hr'; // 水平分割线
import 'tinymce/plugins/image'; // 插入编辑图片
import 'tinymce/plugins/importcss'; // 引入css
import 'tinymce/plugins/insertdatetime'; // 插入日期时间
import 'tinymce/plugins/link'; // 超链接
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/media'; // 插入编辑媒体
import 'tinymce/plugins/nonbreaking'; // 插入不间断空格
import 'tinymce/plugins/pagebreak'; // 插入分页符
import 'tinymce/plugins/paste'; // 粘贴插件
import 'tinymce/plugins/preview';// 预览
import 'tinymce/plugins/print';// 打印
import 'tinymce/plugins/quickbars'; // 快速工具栏
import 'tinymce/plugins/save'; // 保存
import 'tinymce/plugins/searchreplace'; // 查找替换
// import 'tinymce/plugins/spellchecker'; // 拼写检查，暂未加入汉化，不建议使用
import 'tinymce/plugins/tabfocus'; // 切入切出，按tab键切出编辑器，切入页面其他输入框中
import 'tinymce/plugins/table'; // 表格
import 'tinymce/plugins/template'; // 内容模板
import 'tinymce/plugins/textcolor'; // 文字颜色
import 'tinymce/plugins/textpattern'; // 快速排版
import 'tinymce/plugins/toc'; // 目录生成器
import 'tinymce/plugins/visualblocks'; // 显示元素范围
import 'tinymce/plugins/visualchars'; // 显示不可见字符
import 'tinymce/plugins/wordcount'; // 字数统计

import { uploadFile } from '@/api';

export default {
  name: 'TEditor'
};
</script>

<script setup>
// 引入tinymce编辑器
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
    init: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: String,
      default: () => (''),
    },
    eId: {
      type: String,
      default: () => (''),
    },
    disabled: {
      type: Boolean,
      default: () => (false),
    },
    plugins: {
      type: [String, Array],
      default: () => ('autoresize print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons indent2em axupimgs'),
    },
    toolbar: {
      type: [String, Array],
      default: () => ('fullscreen undo redo restoredraft | cut copy paste | forecolor backcolor bold italic underline strikethrough link anchor emoticons | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap hr pagebreak insertdatetime print preview | code selectall searchreplace visualblocks | indent2em lineheight formatpainter axupimgs'),
    },
    width: {
      type: String,
      default: () => ('100%'),
    },
    height: {
      type: String,
      default: () => ('auto'),
    },
  }),
  { init: _init, modelValue, disabled, plugins, toolbar, eId, width, height } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const id = eId.value || `editor_${ Date.now() }`,
  init = reactive({
    selector: `#${ id }`,
    language_url: '/tinymce/langs/zh_CN.js', // 引入语言包文件
    language: 'zh_CN', // 语言类型

    skin_url: '/tinymce/skins/ui/oxide', // 皮肤：浅色
    // skin_url: '/tinymce/skins/ui/oxide-dark', // 皮肤：暗色

    emoticons_database_url: '/tinymce/emoticons/js/emojis.js',

    plugins: plugins, // 插件配置
    toolbar: toolbar, // 工具栏配置，设为false则隐藏
    // menubar: 'file edit', // 菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', // 字体大小
    font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', // 字体样式
    lineheight_formats: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5', // 行高配置，也可配置成"12px 14px 16px 20px"这种形式
    indent2em_val: '2em', // 首行缩进设置
    axupimgs_filetype: 'image/*', // 多图上传设置

    height: 400, // 注：引入autoresize插件时，此属性失效
    min_height: 400, // 注：引入autoresize插件时，此属性生效
    max_height: 0, // 注：引入autoresize插件时，此属性生效
    autoresize_bottom_margin: 0, // 注：引入autoresize插件时，此属性生效
    placeholder: '请输入内容...',
    branding: false, // tiny技术支持信息是否显示
    resize: false, // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    // statusbar: false, // 最下方的元素路径和字数统计那一栏是否显示
    elementpath: false, // 元素路径是否显示
    auto_focus: true, // 自动获取焦点

    content_style: 'img {max-width:100%;}', // 直接自定义可编辑区域的css样式
    // content_css: '/tinycontent.css', // 以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入

    // images_upload_url: '', // 后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
    // images_upload_base_path: '', // 相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
    paste_data_images: true, // 图片是否可粘贴
    images_upload_handler: (blobInfo, success, failure) => {
      const file = blobInfo.blob();
      if (file.size / 1024 / 1024 > 2) {
        return failure('上传失败，图片大小请控制在 2M 以内');
      }
      uploadFile({
        message: false,
        data: { file },
      }).then(res => {
        if (res.code == 200) {
          success(res.data.url); // 上传成功，在成功函数里填入图片路径
        } else {
          failure('上传失败');
        }
      });
    },

    file_picker_types: 'file image media', // 分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
    file_picker_callback: (callback, value, meta) => {
      const types = {
          image: 'image/*',
          media: 'video/*',
          file: '*',
        },
        metaType = meta.filetype;
      let type = '';

      if ($typeOf(types[metaType]) === 'string') {
        type = types[metaType];
      } else {
        type = types[metaType].join(',');
      }

      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', type);
      input.click();
      input.onchange = () => {
        const file = input.files[0],
          fileValidate = {
            image: { size: 2, msg: '上传失败，图片大小请控制在 2M 以内' },
            media: { size: 100, msg: '上传失败，视频大小请控制在 100M 以内' },
            file: { size: 10, msg: '上传失败，文件大小请控制在 10M 以内' },
          },
          typeArr = type.split('/');

        if (typeArr[1]) {
          if (!file.type.startsWith(typeArr[0])) {
            return;
          }
        } else {
          if (!type.split(',').find(t => t === '.' + file.type.split('/')[1])) {
            return;
          }
        }

        if (file.size / 1024 / 1024 > fileValidate[metaType].size) {
          return tinymce.activeEditor.windowManager.alert(fileValidate[metaType].msg);
        }
        uploadFile({
          message: false,
          data: { file },
        }).then(res => {
          if (res.code == 200) {
            let opt = {};
            switch (metaType) {
              case 'image':
                opt = { alt: '' };
                break;
              case 'media':
                opt = { poster: '' };
                break;
              case 'file':
                opt = { text: '' };
                break;
            }
            callback(res.data.url, opt); // 上传成功，在成功函数里填入图片路径
          } else {
            tinymce.activeEditor.windowManager.alert('上传失败');
          }
        });
      };
    },
    ..._init.value,
  }),
  contentValue = ref(modelValue.value),
  editor = ref(null);
function setModelValue() {
  emit('update:modelValue', contentValue.value);
}
function getEditor() {
  if (!editor.value && tinymce.editors[id]) {
    editor.value = tinymce.editors[id];
  }
  return editor.value;
}
function getContent() {
  return contentValue.value;
}
function getText() {
  const ed = getEditor();
  return getEditor().getContent({ format: 'text' });
}
function setContent(content) {
  contentValue.value = content;
  setModelValue();
}
function clear() {
  setContent('');
}
function insertContent(content) {
  const ed = getEditor();
  ed.insertContent(content);
  setModelValue();
}
function save() {
  const ed = getEditor();
  ed.save();
}
function show() {
  const ed = getEditor();
  ed.show();
}
function hide() {
  const ed = getEditor();
  ed.hide();
}
function goEnd() {
  const ed = getEditor();
  ed.execCommand('selectAll');
  ed.selection.getRng().collapse(false);
  ed.focus();
}
function focus() {
  const ed = getEditor();
  ed.focus();
}
function destroy() {
  const ed = getEditor();
  ed.destroy();
}
watch(modelValue, (newVal) => {
  contentValue.value = newVal;
});
watch(contentValue, (newVal) => {
  if (newVal !== modelValue.value) {
    setModelValue();
  }
});
onBeforeUnmount(() => {
  destroy();
});

const visible = ref(true), editorWrap = ref(null), editorWrapBounding = useElementBounding(editorWrap);
watch(editorWrapBounding.height, async(newHeight) => {
  if (height.value && height.value !== 'auto') {
    init.min_height = 400;
    init.max_height = newHeight < 400 ? 400 : newHeight;
    visible.value = false;
    await nextTick();
    visible.value = true;
  }
});

defineExpose({
  clear, getContent, getText, setContent, insertContent, save,
  show, hide, goEnd, focus, destroy, id,
});
</script>

<template>
  <div ref="editorWrap" :style="{width, height}">
    <div v-if="visible">
      <Editor :id="id" v-model="contentValue" :init="init" :disabled="disabled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
