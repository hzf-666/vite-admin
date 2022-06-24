<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-28 11:23:40
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-11 20:42:17
-->
<script>
export default {
  name: 'TopTool'
};
</script>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { requestFullscreen, exitFullscreen, judgeFullScreen } from '@u';
import { handleExternalLink } from '@u/user.js';

const currentRoute = useRoute(), list = computed(() => currentRoute.meta.matched), isFullScreen = ref(judgeFullScreen()),
  searchRoute = ref(null),
  showSearchRoute = ref(false),
  routeTarget = ref(''),
  searchQuery = ref(''),
  routeList = computed(() => {
    const list = [];
    $store.get('searchMenu').forEach(item => {
      const meta = item.meta, obj = { id: item.name, name: meta.title };
      if (!meta.isClassify) {
        if (meta.redirect) {
          if ($regs.link.test(meta.redirect)) {
            const redirect = handleExternalLink(meta.redirect);
            obj.redirect = redirect;
          } else {
            if (meta.type == 1) {
              obj.redirect = meta.redirect;
            } else {
              obj.path = meta.redirect;
            }
          }
        } else {
          obj.path = item.path;
        }
        if (!(searchQuery.value && !(obj.id.startsWith(searchQuery.value) || obj.name.includes(searchQuery.value)))) list.push(obj);
      }
    });
    return list;
  });

function toggleFullScreen() {
  if (!isFullScreen.value) {
    requestFullscreen(document.documentElement);
  } else {
    exitFullscreen(() => {
      $message.warning('请按 F11 退出全屏模式');
    });
  }
}
function setFullScreen(val) {
  isFullScreen.value = val;
}
function doShowSearchRoute() {
  showSearchRoute.value = !showSearchRoute.value;
  setTimeout(() => {
    if (showSearchRoute.value) searchRoute.value.focus();
  });
}
function getRouteList(query) {
  searchQuery.value = query;
}
function toSearchRoute(e) {
  searchQuery.value = '';
  if (e) {
    const target = routeList.value.find(item => item.id === e);
    if (target.redirect) {
      $open(target.redirect, target.id);
    } else {
      $router.push(target.path);
    }
  }
}

defineExpose({
  setFullScreen,
});
</script>

<template>
  <div id="topTool" class="d_f fw_w ai_c">
    <div class="breadcrumb_wrap f_11a d_f">
      <span class="f_00a">当前位置：</span>
      <el-breadcrumb :separator-icon="ArrowRight" class="f_11a">
        <template v-for="(item, i) in list" :key="i">
          <el-breadcrumb-item v-if="item.isClassify">{{ item.title }}</el-breadcrumb-item>
          <template v-else-if="item.redirect">
            <el-breadcrumb-item v-if="$regs.link.test(item.redirect)">
              <a :href="handleExternalLink(item.redirect)" :target="item.name">{{ item.title }}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else :to="{path: item.redirect}">{{ item.title }}</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item v-else :to="{ path: item.path }">{{ item.title }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="f_11a d_f" style="max-width: 100%;">
      <div :style="{width: '8px', 'margin-left': 'auto'}" class="f_00a" />
      <el-scrollbar>
        <div class="tool_wrap d_f ai_c">
          <el-icon :size="20" @click="doShowSearchRoute">
            <IconSearch2 />
          </el-icon>
          <el-select
            v-if="showSearchRoute"
            ref="searchRoute"
            v-model="routeTarget"
            class="animate__animated animate__fadeIn"
            placeholder="输入关键词搜索页面"
            :filter-method="getRouteList"
            filterable
            clearable
            style="width: 200px; margin-right: 15px;margin-left: 6px;"
            @change="toSearchRoute"
          >
            <el-option
              v-for="item in routeList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
          <el-icon :size="20" @click="toggleFullScreen">
            <IconNarrow v-show="isFullScreen" />
            <IconEnlarge v-show="!isFullScreen" />
          </el-icon>
        </div>
      </el-scrollbar>
      <div :style="{width: '8px'}" class="f_00a" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#topTool {
  border-bottom: $border;

  .breadcrumb_wrap {
    padding: 0 8px;
    line-height: 18px;

    :deep(.el-breadcrumb) {
      line-height: inherit;
    }
  }

  .tool_wrap {
    min-height: 43px;
    padding: 5px 0 6px;

    > * {
      flex: 0 0 auto;
    }

    .el-icon {
      cursor: pointer;

      + .el-icon {
        margin-left: 10px;
      }
    }
  }
}
</style>
