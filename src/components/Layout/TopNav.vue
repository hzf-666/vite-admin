<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-25 14:45:26
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-24 09:23:40
-->
<script>
export default {
  name: 'TopNav'
};
</script>

<script setup>
import { toDuration } from '@u';
import { logout, handleExternalLink } from '@u/user.js';
import { getMessageList, getMessageCount, eidtMessageState } from '@/api';
import { getRelatedOrganizationList, changeOrganization } from '@/api/Interior/Organization.js';
import { updateRoutes } from '@/router/handle.js';

const emit = defineEmits(['reload']);

const currentRoute = useRoute(),
  isFold = computed(() => $store.get('layout/leftSideFold')),
  routeTree = computed(() => $store.get('routeTree')),
  userInfo = computed(() => $store.get('userInfo')),
  accountTypeId = computed(() => userInfo.value.accountTypeObj && userInfo.value.accountTypeObj.id),
  isSkip = computed(() => $store.get('settings/skipLogin')),
  infiniteScrollRef = ref(null),
  navGap = '12px',
  showMsg = ref(false),
  msgCount = ref(0),
  msgIndex = ref(0),
  msgSize = ref(10),
  msgList = ref([]),
  unReadList = computed(() => msgList.value.filter(item => item.readStateObj.id == 1)),
  activeNames = ref(''),
  isDropdown = ref(false),
  showDialog = reactive({
    info: false,
    password: false,
  }),
  hasMore = ref(true);
function isActive(route) {
  if (currentRoute.meta.matched && currentRoute.meta.matched[0]) {
    return currentRoute.meta.matched[0].name === route.name;
  }
  return false;
}
function clickNavItem(route) {
  $store.set('skipRepeatedRoute', true);
  const meta = route.meta;
  if (meta.isClassify) {
    let path = '/404';
    $recurseInto(route.children, item => {
      if (!item.meta.isClassify) {
        path = item.path;
        return 'break';
      }
    });
    $router.push(path);
  } else {
    if (meta.redirect) {
      if ($regs.link.test(meta.redirect)) {
        $open(handleExternalLink(meta.redirect), route.name);
      } else {
        $router.push(meta.redirect);
      }
    } else {
      $open(route.path, route.name);
    }
  }
}
function load() {
  msgIndex.value += 1;
  return doGetMessageList();
}
function doLogout() {
  $confirm('确定退出登录吗？', '退出登录确认', {
    type: 'warning'
  }).then(() => {
    logout({ message: true });
  }).catch(() => {});
}
function openUserDialog(name) {
  if (isSkip.value) return $message.warning('未登录账号！');
  showDialog[name] = true;
}
function doGetMessageCount() {
  getMessageCount().then(res => {
    if (res.code == 200) {
      msgCount.value = res.data.count;
    }
  });
}
function doGetMessageList() {
  return toDuration(getMessageList({
    params: {
      index: msgIndex.value,
      size: msgSize.value,
    },
  }), 1000).then(res => {
    if (res.code == 200) {
      msgList.value = msgList.value.concat(res.data.list);
      hasMore.value = msgIndex.value < res.data.totalPage;
    }
  });
}
function doEidtMessageState(ids = []) {
  return eidtMessageState({
    data: { ids },
  }).then(res => {
    if (res.code == 200) {
      doGetMessageCount();
      return;
    }
  });
}
function clickCollapseItem(item) {
  if (item.readStateObj.id == 1) {
    doEidtMessageState([item.id]).then(() => {
      item.readStateObj = { id: 0, name: '' };
    });
  }
}
function readAllMsg() {
  if (!unReadList.value.length) return;
  doEidtMessageState(unReadList.value.map(item => item.id)).then(() => {
    unReadList.value.forEach(item => {
      item.readStateObj = { id: 0, name: '' };
    });
  });
}
doGetMessageCount();

const organizationId = ref(null), organizationList = ref([]),
  organizationName = computed(() => {
    const target = organizationList.value.find(item => item.id == organizationId.value);
    return target && target.name || '';
  });
if (accountTypeId.value == 2) {
  getRelatedOrganizationList().then(res => {
    if (res.code == 200) {
      organizationList.value = res.data.list;
      organizationId.value = res.data.list[0] ? res.data.list[0].id : null;
    }
  });
}
function doChangeOrganization(oId) {
  changeOrganization(oId).then(async res => {
    if (res.code == 200) {
      await updateRoutes(currentRoute);
      await $store.dispatch('setUserInfo');
      emit('reload', currentRoute);
    }
  });
}

const infiniteScrollTop = ref(0);
watch(showMsg, (newShow) => {
  if (newShow) {
    setTimeout(() => {
      const scrollbarRef = infiniteScrollRef.value.$refs.scrollbar;
      if (scrollbarRef) scrollbarRef.setScrollTop(infiniteScrollTop.value);
    }, 100);
  }
});

const notification = inject('notification');
watch(() => notification.notice, (newData) => {
  if (newData.refresh) {
    doGetMessageCount();
    msgIndex.value = 0;
    hasMore.value = true;
    msgList.value = [];
    infiniteScrollTop.value = 0;
    setTimeout(() => {
      infiniteScrollRef.value.update();
    });
  }
});
</script>

<template>
  <div id="navTop" class="d_f fw_w">
    <div class="f_11a d_f" style="max-width: 100%;">
      <div class="toggle_side_icon f_00a d_f ai_c" @click="$store.commit('layout/toggleLeftSideFold', !isFold)">
        <el-icon :size="26" color="#fff">
          <IconExpand v-show="isFold" />
          <IconFold v-show="!isFold" />
        </el-icon>
      </div>
      <div :style="{width: navGap}" class="f_00a" />
      <el-scrollbar view-style="height: 100%;">
        <div class="routes_wrap d_f ai_c">
          <template v-for="(route, i) in routeTree" :key="i">
            <div
              v-if="!route.meta.hidden"
              class="f_00a d_f ai_c"
              :class="{active: isActive(route)}"
              @click="clickNavItem(route)"
            >
              <el-icon v-if="route.meta.icon" :size="18" style="margin-right: 5px;">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta.title }}</span>
            </div>
          </template>
        </div>
      </el-scrollbar>
      <div :style="{width: navGap}" class="f_00a" />
    </div>
    <div class="f_11a d_f" style="max-width: 100%;">
      <div :style="{width: '8px', 'margin-left': 'auto'}" class="f_00a" />
      <el-scrollbar view-style="height: 100%;">
        <div class="tool_wrap d_f ai_c">
          <el-select
            v-if="accountTypeId == 2"
            v-model="organizationId"
            :style="{
              'min-width': '140px',
              width: organizationName.length * 15 + 46 + 'px',
              'margin-right': '20px',
            }"
            @change="doChangeOrganization"
          >
            <el-option v-for="(item, i) in organizationList" :key="i" :value="item.id" :label="item.name" />
          </el-select>
          <el-popover
            placement="bottom"
            :width="300"
            :offset="14"
            trigger="click"
            popper-class="msg_popper"
            @show="showMsg = true"
            @hide="showMsg = false"
          >
            <template #reference>
              <el-badge
                :value="msgCount"
                :hidden="!msgCount"
                :max="99"
                style="margin-right: 12px; cursor: pointer;"
              >
                <el-icon :size="22">
                  <IconNotice1 />
                </el-icon>
              </el-badge>
            </template>
            <div class="msg_popper_title d_f jc_sb ai_c">
              <span>消息通知</span>
              <el-button
                size="small"
                type="primary"
                round
                :disabled="!unReadList.length"
                @click="readAllMsg"
              >
                全部已读
              </el-button>
            </div>
            <InfiniteScroll
              v-if="showMsg"
              ref="infiniteScrollRef"
              :max-height="500"
              :has-more="hasMore"
              :load="load"
              @scroll="({ scrollTop }) => infiniteScrollTop = scrollTop"
            >
              <el-collapse v-if="msgList.length" v-model="activeNames" class="msg_collapse" accordion>
                <el-collapse-item v-for="(item, i) in msgList" :key="i" :name="'item' + (i + 1)" @click="clickCollapseItem(item)">
                  <template #title>
                    <el-icon
                      :size="16"
                      color="var(--el-color-danger)"
                      :style="{
                        visibility: item.readStateObj.id == 1 ? 'visible' : 'hidden',
                      }"
                    >
                      <IconDot />
                    </el-icon>
                    <div class="msg_title text_els">{{ item.description }}</div>
                  </template>
                  <div class="msg_item">
                    <div class="msg_item_content">{{ item.description }}</div>
                    <div class="msg_item_create">
                      <span v-if="item.createBy">{{ item.createBy }}</span>
                      <span v-if="item.createTime">{{ item.createTime }}</span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </InfiniteScroll>
          </el-popover>
          <span style="margin-right: 10px;">{{ isSkip ? '未登录' : (userInfo.name || '未知') }}</span>
          <el-dropdown trigger="click" style="cursor: pointer;" @visible-change="e => isDropdown = e">
            <div>
              <el-image :src="userInfo.fileObj && userInfo.fileObj.url" class="avatar">
                <template #error>
                  <img v-if="userInfo.typeObj && userInfo.typeObj.id == 2" src="@a/images/company_avatar.png" class="avatar">
                  <img v-else src="@a/images/person_avatar.png" class="avatar">
                </template>
              </el-image>
              <el-icon :size="14" color="#fff" class="avatar_icon" :class="{is_dropdown: isDropdown}">
                <IconEpCaretTop />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openUserDialog('info')">用户中心</el-dropdown-item>
                <el-dropdown-item @click="openUserDialog('password')">修改密码</el-dropdown-item>
                <el-dropdown-item @click="doLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <MoreSettings style="margin-left: 8px;" />
        </div>
      </el-scrollbar>
      <div :style="{width: '8px'}" class="f_00a" />
    </div>

    <UserInfo v-model="showDialog.info" />
    <UserPassword v-model="showDialog.password" />
  </div>
</template>

<style lang="scss">
.msg_popper {
  .msg_popper_title {
    margin-bottom: 12px;

    > span {
      font-size: $fontSizeMedium;
      font-weight: bold;
      color: $textColorPrimary;
    }
  }
}

.msg_collapse {
  .el-collapse-item__content {
    padding-bottom: 15px;
  }

  .msg_title {
    padding: 0 8px;
    font-size: $fontSizeBase;
    font-weight: bold;
  }

  .msg_item {
    padding: 0 24px;
    color: $textColorRegular;

    .msg_item_content {
      text-align: justify;
    }

    .msg_item_create {
      margin-top: 10px;
      font-size: $fontSizeExtraSmall;
      color: var(--el-text-color-placeholder);
      text-align: right;

      > span + span {
        margin-left: 15px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#navTop {
  background-color: $colorPrimary;

  > * {
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      display: block;
      width: 100%;
      height: 1px;
      content: "";
      background-color: $colorPrimaryLight5;
    }
  }

  .toggle_side_icon {
    padding: 10px;
    cursor: pointer;
    border-right: 1px solid $colorPrimaryLight3;

    &:hover {
      background-color: $colorPrimaryLight3;
    }
  }

  .routes_wrap {
    height: 100%;
    line-height: 1;

    > div {
      $height: 32px;

      height: $height;
      padding: 0 15px;
      font-size: 15px;
      color: #fff;
      cursor: pointer;
      user-select: none;
      border-radius: math.div($height, 2);

      + div {
        margin-left: v-bind(navGap);
      }

      &:hover,
      &.active {
        color: $colorPrimary;
        background-color: #fff;
      }

      &.active {
        font-weight: bold;
      }
    }
  }

  .tool_wrap {
    height: 100%;
    padding: 7px 0;
    color: #fff;

    > * {
      flex: 0 0 auto;
    }

    .avatar {
      $size: 30px;

      width: $size;
      height: $size;
      border-radius: math.div($size, 2);
    }

    .avatar_icon {
      transition: transform 0.3s;

      &.is_dropdown {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
