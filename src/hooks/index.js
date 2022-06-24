/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-04-02 16:12:40
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 17:17:32
 */
const needAuth = computed(() => !$store.get('settings/skipLogin') && $store.get('settings/dynamicAuth')),
  searchMenuObj = computed(() => {
    const obj = {};
    $store.get('searchMenu').forEach(item => {
      obj[item.name] = item;
    });
    return obj;
  });

export function useApiLoading(api) {
  const loading = ref(false);
  return [loading, (...args) => {
    let index = 0;
    if (args.length > 1) {
      index = args[args.length - 1];
    }
    args[index] = {
      setLoading(val) {
        loading.value = val;
      },
      ...args[index],
    };
    return api(...args);
  }];
}

export function useActivated(callback) {
  const once = ref(true);
  onActivated(() => {
    callback && callback(once.value);
    once.value = false;
  });
}

export function useFilterValue(value, list = [], {
  children = 'children', valueKey = 'id'
} = {}) {
  if (value === undefined) return null;
  const isArr = $typeOf(value) === 'array';
  let result = isArr ? [] : null;
  $recurseInto(list, item => {
    if (isArr) {
      if (value.includes(item[valueKey])) {
        result.push(item[valueKey]);
      }
    } else {
      if (item[valueKey] === value) {
        result = item[valueKey];
        return 'break';
      }
    }
  }, { children });
  return result;
}

export function useAuth(str, opt) {
  let result;
  if (str && $typeOf(str) === 'string') {
    const target = searchMenuObj.value[str];
    if ($typeOf(opt) === 'array') {
      if (opt.length == 1) {
        result = target && target.meta[opt[0]];
      } else {
        result = $deepCopy(target);
      }
    } else {
      if (opt === undefined) {
        result = needAuth.value ? !!searchMenuObj.value[str] : true;
      } else {
        result = needAuth.value && target ? (target.meta.rename || opt) : opt;
      }
    }
  } else {
    result = opt === undefined ? true : $typeOf(opt) === 'array' ? undefined : opt;
  }
  return result;
}

export function useAutoWidth(count) {
  const columnCount = ref(0),
    maxWidth = ref(1),
    showColumn = computed(() => !(!columnCount.value && maxWidth.value == 1));
  function getWidth(width) {
    if (width > maxWidth.value) maxWidth.value = width;
    if (columnCount.value) columnCount.value -= 1;
  }
  function initWidth() {
    columnCount.value = 0;
    maxWidth.value = 1;
    setTimeout(() => {
      columnCount.value = count.value;
    });
  }
  return { maxWidth, showColumn, getWidth, initWidth };
}

export function usePagingList({ listFn, stateFn, delFn } = {}) {
  const index = ref(1),
    size = ref(10),
    total = ref(0),
    value = reactive({
      treeParams: {},
      searchKey: {},
      delMsg: {
        title: '删除确认',
        content: '确定删除吗？',
        options: {},
      },
    }),
    stateList = ref([]),
    activeValue = ref(true),
    inactiveValue = ref(false),
    treeParams = computed(() => value.treeParams),
    searchKey = computed(() => value.searchKey),
    delMsg = computed(() => value.delMsg),
    pagingList = ref([]),
    { maxWidth, showColumn, getWidth, initWidth } = useAutoWidth(computed(() => pagingList.value.length)),
    columnWidth = computed(() => maxWidth.value + (maxWidth.value == 1 ? 0 : 21)),
    showDialog = ref(false),
    dialogType = ref(''),
    dialogTitle = ref(''),
    dialogId = ref(0);

  useActivated(async once => {
    await $store.dispatch('enums/getEnum', {
      name: 'State',
      callback(list) {
        activeValue.value = list[0] ? list[0].id : true;
        inactiveValue.value = list[1] ? list[1].id : false;
        stateList.value = list;
      },
    });
    if (once) {
      //
    }
  });

  watch(pagingList, () => {
    initWidth();
  }, {
    immediate: true,
  });
  function setValue(key, val, merge = true) {
    if (key) {
      if ($typeOf(value[key]) === 'object') {
        value[key] = $typeOf(val) === 'object' && merge ? { ...value[key], ...val } : val;
      } else if ($typeOf(value[key]) === 'array') {
        value[key] = $typeOf(val) === 'array' && merge ? value[key].concat(val) : val;
      } else {
        value[key] = val;
      }
    }
  }
  async function getPagingList({ index: _index, params, callback } = {}) {
    index.value = _index || index.value;
    pagingList.value = [];
    const _searchKey = {};
    for (const k in searchKey.value) {
      const item = searchKey.value[k];
      _searchKey[k] = item === '' ? null : item;
    }
    listFn && await listFn({
      params: params || {
        index: index.value,
        size: size.value,
        ..._searchKey,
      },
    }).then(res => {
      if (callback) {
        callback(res);
      } else {
        if (res.code == 200) {
          pagingList.value = res.data.list;
          total.value = res.data.totalSize;
        }
      }
    });
  }
  async function changeState({
    row, params = {}, data, callback,
    id = 'id', state = 'stateObj.id',
    active, inactive,
  } = {}) {
    let stateObj, stateKey;
    if (active === undefined) active = activeValue.value;
    if (inactive === undefined) inactive = inactiveValue.value;
    const arr = state.split('.'),
      getStateId = obj => {
        if (arr.length == 1) {
          if (!stateObj && !stateKey) {
            stateObj = row;
            stateKey = arr[0];
          }
          return obj[arr[0]];
        } else {
          const k = arr.shift();
          if (arr.length == 1) {
            if (!stateObj && !stateKey) {
              stateObj = obj[k];
              stateKey = arr[0];
            }
          }
          return getStateId(obj[k], arr);
        }
      },
      stateId = getStateId(row);
    stateFn && stateFn(row[id], {
      params,
      data: data || {
        state: stateId,
      },
    }).then(res => {
      if (res.code != 200) {
        stateObj[stateKey] = stateId == active ? inactive : active;
      }
      callback && callback(res);
    });
  }
  function del({ row, id = 'id', params = {}, data = {}, callback } = {}) {
    $confirm(delMsg.value.content, delMsg.value.title, {
      type: 'warning',
      ...delMsg.value.options,
    }).then(() => {
      delFn && delFn(row[id], {
        params,
        data,
      }).then(res => {
        if (res.code == 200) {
          getPagingList({ index: pagingList.value.length == 1 ? index.value - 1 : null });
        }
        callback && callback(res);
      });
    }).catch(() => {});
  }
  return {
    value, setValue, treeParams, searchKey, delMsg,
    index, size, total, activeValue, inactiveValue, stateList,
    pagingList, getPagingList, changeState, del,
    showColumn, getWidth, initWidth, columnWidth,
    showDialog, dialogType, dialogTitle, dialogId,
  };
}

export function useTreeList({
  listFn, treeFn, stateFn, delFn,
  hasTreeAll, group = '', groupReversed = false,
} = {}) {
  const {
    value, setValue, treeParams, searchKey, delMsg,
    index, size, total, activeValue, inactiveValue, stateList,
    pagingList, getPagingList, changeState, del: _del,
    showColumn, getWidth, initWidth, columnWidth,
    showDialog, dialogType, dialogTitle, dialogId,
  } = usePagingList({ listFn, stateFn, delFn });

  const nodeId = ref(null), nodeKey = ref('id'),
    treeList = ref([]),
    defaultExpandedKeys = ref([]),
    treeProps = ref({
      label: 'name',
    });

  function isGroup(obj) {
    if (group) {
      const arr = group.split('.');
      let result = obj;
      while ($typeOf(result) === 'object' && arr.length) {
        result = result[arr[0]];
        arr.shift();
      }
      return groupReversed ? !result : !!result;
    }
    return false;
  }
  async function getTreeList({
    expand = false,
    callback,
  } = {}) {
    defaultExpandedKeys.value = [];
    treeList.value = [];
    !expand && (nodeId.value = null);
    pagingList.value = [];
    treeFn && await treeFn({
      params: treeParams.value,
    }).then(res => {
      if (res.code == 200) {
        let list;
        if (callback) {
          list = callback(res.data);
        }
        treeList.value = list || res.data;
        if (expand && nodeId.value) {
          $recurseInto(treeList.value, (item, { parent }) => {
            if (!isGroup(item)) {
              if (item.id == nodeId.value) {
                parent && (defaultExpandedKeys.value = [parent[nodeKey.value]]);
                return 'break';
              }
            }
          });
        }
        if (!expand && !(hasTreeAll && hasTreeAll.value)) {
          nodeId.value = treeList.value[0] && treeList.value[0][nodeKey.value] || null;
        }
      }
    });
  }

  function del({ row, id = 'id', params = {}, data = {}, callback, myTree } = {}) {
    const _callback = res => {
      if (res.code == 200) {
        let activeId = null, nodeData = null;
        const getActiveId = (list, parent) => {
          if (list.length == 1) {
            return parent ? parent[nodeKey.value] : null;
          } else {
            const targetIndex = list.findIndex(item => item[nodeKey.value] == row[id]);
            return list[targetIndex + (targetIndex > 0 ? -1 : 1)][nodeKey.value];
          }
        };
        $recurseInto(treeList.value, (item, { parent }) => {
          if (item[nodeKey.value] == row[id]) {
            nodeData = item;
            activeId = getActiveId(parent ? parent.children : treeList.value, parent);
          }
        });
        if (row[id] == nodeId.value) {
          $recurseInto(treeList.value, (item, { parent }) => {
            if (item[nodeKey.value] == activeId) {
              if (parent) defaultExpandedKeys.value = [parent[nodeKey.value]];
              return 'break';
            }
          });
          myTree && myTree.remove(nodeData);
          nodeId.value = activeId;
        } else {
          myTree && myTree.remove(nodeData);
        }
      }
      callback && callback(res);
    };
    _del({ row, id, params, data, callback: _callback });
  }

  return {
    value, setValue, treeParams, searchKey, delMsg,
    index, size, total, activeValue, inactiveValue, stateList,
    pagingList, getPagingList, changeState, del,
    showColumn, getWidth, initWidth, columnWidth,
    showDialog, dialogType, dialogTitle, dialogId,
    nodeId, nodeKey, defaultExpandedKeys, treeProps, treeList, getTreeList, isGroup,
  };
}

export function usePageForm({
  menuName,
  myForm,
  confirmOpts = {},
  cancelOpts = {},
} = {}) {
  cancelOpts.msg = {
    title: '取消确认',
    content: '确定取消吗？',
    options: {},
    ...cancelOpts.msg,
  };

  const currentRoute = useRoute(), formData = ref({}), from = currentRoute.params.from;
  if (cancelOpts.from === undefined) cancelOpts.from = from;
  return {
    currentRoute,
    formData,
    async confirm(request, response) {
      const { isValid, data } = await myForm.value.submit();
      if (isValid) {
        if ($typeOf(request) !== 'function') return;
        const res = await request(data);
        if (res === undefined) return;
        response && response(res, confirmOpts);
        if (res.code == 200) {
          confirmOpts.closes && $store.commit('layout/removeScrollTags', confirmOpts.closes);
          confirmOpts.excludes && $store.commit('layout/pushExcludeKeepAlive', confirmOpts.excludes);
          confirmOpts.to && $router.push(confirmOpts.to);
        }
      }
    },
    cancel() {
      $confirm(cancelOpts.msg.content, cancelOpts.msg.title, {
        type: 'warning',
        ...cancelOpts.msg.options,
      }).then(() => {
        cancelOpts.closes && $store.commit('layout/removeScrollTags', cancelOpts.closes);
        cancelOpts.excludes && $store.commit('layout/pushExcludeKeepAlive', cancelOpts.excludes);
        cancelOpts.to && $navBack(cancelOpts);
      }).catch(() => {});
    },
    edit() {
      $router.push({
        name: `${ menuName }Edit`,
        params: {
          from: JSON.stringify(currentRoute),
        },
      });
    },
    back() {
      $navBack({ to: { name: menuName }, from });
      $store.commit('layout/removeScrollTags', [`${ menuName }Detail`]);
    },
  };
}
