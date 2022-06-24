<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-06-08 18:51:11
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-14 15:44:49
-->
<script>
export default {
  name: 'MyUpload'
};
</script>

<script setup>
import { genFileId } from 'element-plus';

const props = defineProps({
    photo: {
      type: Boolean,
      default: () => (false),
    },
    single: {
      type: Boolean,
      default: () => (true),
    },
    width: {
      type: String,
      default: () => ('84px'),
    },
    height: {
      type: String,
      default: () => ('84px'),
    },
    size: {
      type: Number,
      default: () => (0),
    },
    tip: {
      type: String,
      default: () => (''),
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
    limit: {
      type: Number,
      default: () => (9),
    },
    listType: {
      type: String,
      default: () => ('text'),
    },
    multiple: {
      type: Boolean,
      default: () => (true),
    },
    accept: {
      type: String,
      default: () => (''),
    },
    fileList: {
      type: Array,
      default: () => ([]),
    },
  }),
  { photo, single, width, height, size: _size, tip: _tip, headers, limit, listType, multiple, accept: _accept, fileList: _fileList } = toRefs(props),
  emit = defineEmits(['change']);

const myUpload = ref(null), isPass = ref(true), accept = ref(''), size = ref(0), tip = ref(''), fileList = ref([]), fileObj = ref({}),
  showPreview = ref(false), previewIndex = ref(-1), previewList = computed(() => {
    if (single.value) {
      if (photo.value) {
        if (fileObj.value.url) return [fileObj.value.url];
      } else {
        if (fileList.value.length) return [fileList.value[0]];
      }
    } else {
      let arr = fileList.value.map(item => item.url);
      if (previewIndex.value != -1) {
        const startArr = arr.slice(previewIndex.value, arr.length),
          endArr = arr.slice(0, previewIndex.value);
        arr = startArr.concat(endArr);
      }
      return arr;
    }
    return [];
  });
if (!_accept.value) {
  accept.value = photo.value ? '.jpg, .jpeg, .png' : '*';
} else {
  accept.value = _accept.value;
}
if (!_size.value) {
  size.value = photo.value ? 2 : 10;
} else {
  size.value = _size.value;
}
if (!_tip.value) {
  let str = '';
  if (accept.value === '*') {
    str = '支持扩展名：.rar .zip .doc .docx .jpg...';
  } else if (accept.value.includes('*')) {
    str = `支持文件类型：${ accept.value }`;
  } else {
    str = '支持扩展名：' + accept.value.replace(/,( )*/g, ' ');
  }
  tip.value = (size.value > 0 ? `请上传小于等于 ${ size.value }M 的${ photo.value ? '图片' : '文件' }\n` : '') + str;
} else {
  tip.value = _tip.value;
}
watch(_fileList, (newList) => {
  if (single.value) {
    if (newList.length && newList[0].url) {
      if (photo.value) {
        fileObj.value = newList[0];
      } else {
        fileList.value = [newList[0]];
      }
    }
  } else {
    fileList.value = newList.slice(0, limit.value);
  }
}, {
  deep: true,
  immediate: true,
});
function handleSuccess(res, uploadFile, uploadFiles) {
  if (res.code == 200) {
    $message.success('上传成功');
    handleChange(uploadFile, uploadFiles);
    if (photo.value && single.value) {
      fileObj.value = res.data;
    }
  } else {
    isPass.value = false;
    myUpload.value.handleRemove(uploadFile);
    res.message && $message.error(res.message);
  }
}
function handleChange(uploadFile, uploadFiles) {
  if (isPass.value) {
    const fileList = [];
    uploadFiles.forEach(item => {
      if (item.response) {
        fileList.push(item.response.data);
      } else {
        fileList.push({
          name: item.name,
          url: item.url,
        });
      }
    });
    if (!(photo.value && single.value)) {
      fileList.value = fileList;
    }
    emit('change', single.value && !fileList.length ? [{ name: '', url: '' }] : fileList);
  }
}
function selectSinglePhoto() {
  myUpload.value.$el.querySelector('input').click();
}
function removeSinglePhoto() {
  $confirm(`确定移除 ${ fileObj.value.name } 吗？`, '移除确认', {
    type: 'warning',
  }).then(() => {
    handleChange(fileObj.value, []);
    fileObj.value = { name: '', url: '' };
  }).catch(() => {});
}
function handleExceed(files, uploadFiles) {
  function startFile(i) {
    const file = files[i];
    file.uid = genFileId();
    myUpload.value.handleStart(file);
  }
  if (single.value) {
    myUpload.value.clearFiles();
    startFile(0);
  } else {
    const sum = limit.value - uploadFiles.length;
    if (sum > 0) {
      for (let i = 0; i < sum; i++) {
        startFile(i);
      }
    }
  }
  myUpload.value.submit();
}
function handlePreview(uploadFile) {
  if (previewList.value.length > 1) {
    const url = uploadFile.response ? uploadFile.response.data.url : uploadFile.url;
    previewIndex.value = fileList.value.findIndex(item => item.url === url);
  }
  showPreview.value = true;
}
function beforeUpload(rawFile) {
  const flieType = rawFile.name.replace(/^(.*)(\..*)$/, '$2'), sizePass = size.value > 0 ? rawFile.size / 1024 / 1024 <= size.value : true,
    acceptStr = accept.value.replace(/,( )*/g, ' / ');
  let typePass = false;
  if (accept.value === '*') {
    typePass = true;
  } else {
    const arr = acceptStr.split(' / ');
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].includes('*')) {
        if (rawFile.type.startsWith(arr[i].replace('*', ''))) {
          typePass = true;
          break;
        }
      } else {
        if (flieType === arr[i]) {
          typePass = true;
          break;
        }
      }
    }
  }
  if (!sizePass) {
    $message.error(`上传${ photo.value ? '图片' : '文件' }大小不能超过 ${ size.value }M ！`);
  }
  if (!typePass) {
    $message.error(`上传${ photo.value ? '图片' : '文件' }只能是 ${ acceptStr } 格式！`);
  }
  isPass.value = sizePass && typePass;
  return isPass.value;
}
async function beforeRemove(file) {
  if (!isPass.value) return true;
  let isRemove = false;
  await $confirm(`确定移除 ${ file.name } 吗？`, '移除确认', {
    type: 'warning',
  }).then(() => (isRemove = true)).catch(() => (isRemove = false));
  return isRemove;
}
</script>

<template>
  <el-upload
    ref="myUpload"
    action="/api/userSystem/common/file"
    :accept="accept"
    :headers="{
      'Authorization': $caches('session').get('token'),
      ...headers,
    }"
    :limit="single ? 1 : limit"
    :multiple="single ? false : multiple"
    :list-type="photo && !single ? 'picture-card' : listType"
    :file-list="fileList"
    :show-file-list="!(photo && single)"
    :on-success="handleSuccess"
    :on-remove="handleChange"
    :on-exceed="handleExceed"
    :on-preview="handlePreview"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :class="{
      avatar_uploader: photo,
      file_uploader: !photo,
      is_single: single,
    }"
    style="width: 100%;"
  >
    <template v-if="photo">
      <template v-if="single && fileObj.url">
        <img class="avatar_uploader_img" :src="fileObj.url">
        <div class="avatar_actions" @click.stop="">
          <el-icon @click="showPreview = true"><IconEpZoomIn /></el-icon>
          <el-icon @click="selectSinglePhoto()"><IconEpRefresh /></el-icon>
          <el-icon @click="removeSinglePhoto()"><IconEpDelete /></el-icon>
        </div>
      </template>
      <el-icon v-if="(single && !fileObj.url) || !single " :size="20" class="avatar_uploader_icon">
        <IconEpPlus />
      </el-icon>
    </template>
    <slot v-else>
      <el-button type="primary">点击上传</el-button>
    </slot>

    <template #tip>
      <div class="uploader_tip">
        {{ tip }}
      </div>
    </template>

    <div @click.stop="">
      <el-image-viewer v-if="showPreview" :url-list="previewList" @close="showPreview = false" />
    </div>
  </el-upload>
</template>

<style lang="scss" scoped>
.avatar_uploader {
  :deep() {
    .el-upload {
      position: relative;
      flex: 0 0 auto;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      cursor: pointer;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      transition: var(--el-transition-duration-fast);

      .avatar_uploader_img,
      .avatar_uploader_icon,
      .avatar_actions {
        width: 100%;
        height: 100%;
      }

      .avatar_actions {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        cursor: default;
        background-color: var(--el-overlay-color-lighter);
        opacity: 0;
        transition: opacity var(--el-transition-duration);

        .el-icon {
          cursor: pointer;

          + .el-icon {
            margin-left: 5%;
          }
        }
      }

      &:hover,
      &:focus {
        border-color: var(--el-color-primary);

        .avatar_uploader_icon {
          color: var(--el-color-primary);
        }
      }

      &:hover {
        .avatar_actions {
          opacity: 1;
        }
      }
    }

    .el-upload-list--picture-card {
      .el-upload-list__item-thumbnail {
        object-fit: fill;
      }

      .el-upload-list__item {
        width: v-bind(width);
        height: v-bind(height);

        .el-icon--close-tip {
          margin-left: 8px;
          line-height: 16px;
        }
      }

      .el-upload-list__item-actions {
        > span + span {
          margin-left: 20%;
        }
      }
    }
  }

  &.is_single {
    display: flex;
    align-items: center;

    .uploader_tip {
      margin-left: 15px;
    }
  }

  .uploader_tip {
    margin-top: 0;
  }
}

.file_uploader {
  :deep(.el-upload) {
    &:focus {
      .el-button {
        color: var(--el-button-hover-text-color);
        background-color: var(--el-button-hover-bg-color);
        border-color: var(--el-button-hover-border-color);
        outline: 0;
      }
    }
  }
}

.uploader_tip {
  margin-top: 5px;
  font-size: 12px;
  line-height: 16px;
  color: var(--el-text-color-regular);
  white-space: pre-line;
}

:deep(.el-upload-list) {
  line-height: normal;
}
</style>
