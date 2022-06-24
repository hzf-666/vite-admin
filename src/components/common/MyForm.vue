<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-14 16:15:15
 * @LastEditors: hzf
 * @LastEditTime: 2022-06-22 16:49:38
-->
<script>
export default {
  name: 'MyForm'
};
</script>

<script setup>
const props = defineProps({
    name: {
      type: String,
      default: () => (''),
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: String,
      default: () => ('94%'),
    },
    labelWidth: {
      type: String,
      default: () => (''),
    },
    rowGap: {
      type: String,
      default: () => ('20px'),
    },
    columnGap: {
      type: String,
      default: () => ('100px'),
    },
    showonly: {
      type: Boolean,
      default: () => (false),
    },
    border: {
      type: Boolean,
      default: () => (false),
    },
    align: {
      type: String,
      default: () => ('center'),
    },
  }),
  { name, modelValue, width, labelWidth: _labelWidth, rowGap, columnGap, showonly, border, align } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

const labelWidth = ref('');
labelWidth.value = _labelWidth.value || '95px';
function judgePosition(position, k) {
  if (position !== undefined) {
    if ($typeOf(position) === 'array') {
      if (position.length) {
        if ($typeOf(position[0]) !== 'number') {
          console.error(`${ k }.position[0] is not a number`);
          return false;
        }
        if ($typeOf(position[1]) !== 'number') {
          console.error(`${ k }.position[1] is not a number`);
          return false;
        }
      } else {
        return false;
      }
    } else {
      console.error(`${ k }.position is not an array`);
      return false;
    }
  } else {
    return false;
  }
  return true;
}
const myForm = ref(null), rows = ref(0), cols = ref(0), gridItems = ref([]), model = ref({}), isModelChange = ref(false),
  _rowGap = ref(rowGap.value), _columnGap = ref(columnGap.value);
watch(border, newVal => {
  _rowGap.value = newVal ? '0px' : rowGap.value;
  _columnGap.value = newVal ? '0px' : columnGap.value;
}, {
  immediate: true,
});
watch(modelValue, (newValue, oldValue) => {
  function getSortColumn(column) {
    column.sort((current, prev) => current.position[0] - prev.position[0]);
  }

  if (isModelChange.value) {
    isModelChange.value = false;
    return;
  }
  rows.value = 0;
  cols.value = 0;
  gridItems.value = [];
  model.value = {};
  const colData = [];
  Object.keys(newValue).forEach(k => {
    const item = newValue[k], isPass = judgePosition(item.position, k);
    if (isPass) {
      const r = item.position[0], c = item.position[1],
        obj = { ...$deepCopy(item), rowspan: item.rowspan || 1, colspan: item.colspan || 1, _key: k },
        targetCol = colData.find(colItem => colItem.order == c);

      if (item.tag === 'slot' && $typeOf(item.separate) === 'object') {
        for (const mKey in item.separate) {
          model.value[mKey] = item.separate[mKey].value === undefined ? null : $deepCopy(item.separate[mKey].value);
          if (obj.separate[mKey].formItem) {
            obj.separate[mKey].formItem.labelWidth = obj.separate[mKey].formItem.label ? labelWidth.value || obj.separate[mKey].formItem.labelWidth : '0px';
          }
        }
      } else {
        model.value[k] = item.value === undefined ? null : $deepCopy(item.value);
      }
      if (targetCol) {
        if (targetCol.column.find(d => d.position[0] == r)) {
          console.warn(`${ k }.position ${ JSON.stringify(item.position) } is repeated`);
        } else {
          targetCol.column.push(obj);
        }
      } else {
        colData.push({
          order: c,
          column: [obj],
        });
      }
    }
  });
  colData.sort((current, prev) => {
    if (prev.order == colData[0].order) {
      getSortColumn(prev.column);
    }
    getSortColumn(current.column);
    return current.order - prev.order;
  });
  if (colData.length) {
    cols.value = colData.length;
    const addCols = [];
    colData.forEach((colItem, col) => {
      const addRows = [];
      colItem.column.forEach((cell, i) => {
        const addRow = cell.rowspan - 1, addCol = cell.colspan - 1;
        if (addRow > 0) {
          addRows.push([addRow, i + 1]);
        }
        if (addCol > 0) {
          for (let j = 0; j < addCol; j++) {
            addCols.push([col + j + 1, i, cell.colspan]);
          }
        }
      });
      addRows.forEach(arr => {
        for (let j = 0; j < arr[0]; j++) {
          colItem.column.splice(arr[1], 0, null);
        }
      });
    });
    addCols.forEach(arr => {
      for (let i = 0; i < arr[2]; i++) {
        if (colData[arr[0]]) colData[arr[0]].column.splice(arr[1], 0, null);
      }
    });
    colData.forEach(colItem => {
      if (colItem.column.length > rows.value) rows.value = colItem.column.length;
    });
    for (let i = 0; i < rows.value; i++) {
      colData.forEach(colItem => {
        if (colItem.column[i] === undefined) {
          gridItems.value.push(null);
        }
        if (colItem.column[i]) {
          gridItems.value.push(colItem.column[i]);
        }
      });
    }
  }
}, {
  immediate: true,
  deep: true,
});
watch(model, (newModel) => {
  setTimeout(() => {
    isModelChange.value = true;
    const _modelValue = $deepCopy(modelValue.value);
    Object.keys(_modelValue).forEach(k => {
      const item = _modelValue[k];
      if (item.tag === 'slot' && $typeOf(item.separate) === 'object') {
        for (const mKey in item.separate) {
          _modelValue[k].separate[mKey].value = newModel[mKey];
        }
      } else {
        _modelValue[k].value = newModel[k];
      }
    });
    emit('update:modelValue', _modelValue);
  });
}, {
  deep: true,
});
function validate(...args) {
  setTimeout(() => {
    myForm.value.validate(...args);
  });
}
function validateField(...args) {
  setTimeout(() => {
    myForm.value.validateField(...args);
  });
}
function resetFields(...args) {
  return myForm.value.resetFields(...args);
}
function scrollToField(...args) {
  return myForm.value.scrollToField(...args);
}
function clearValidate(...args) {
  setTimeout(() => {
    myForm.value.clearValidate(...args);
  });
}
async function submit() {
  let msg = '';
  const data = {};
  for (let i = 0; i < gridItems.value.length; i++) {
    const item = gridItems.value[i];
    if (item) {
      const doValidateField = key => {
        return new Promise(resolve => {
          validateField(key, (isValid, invalidFields) => {
            if (!isValid) {
              resolve(invalidFields[key][0].message);
            } else {
              resolve('');
            }
          });
        });
      };
      if (item.tag === 'slot' && item.separate) {
        for (const k in item.separate) {
          msg = await doValidateField(k);
          if (msg) break;
        }
      } else {
        msg = await doValidateField(item._key);
      }
    }
    if (msg) break;
  }

  if (msg) {
    $message.warning(msg);
  } else {
    $form.get(modelValue.value, data);
  }

  return {
    isValid: !msg,
    data,
  };
}

const $refs = reactive({});
setTimeout(() => {
  $refs.form = myForm.value;
});

defineExpose({
  submit,
  validate, validateField, resetFields, scrollToField, clearValidate,
  $refs,
});
</script>

<template>
  <el-form
    v-if="cols > 0"
    ref="myForm"
    class="my_form"
    :class="{
      is_border: border,
    }"
    :style="{
      width,
      display: 'grid',
      'row-gap': _rowGap,
      'column-gap': _columnGap,
      'grid-template-columns': `repeat(${cols}, 1fr)`,
      'margin-left': align === 'center' ? 'auto' : align === 'right' ? `calc(100% - ${width})` : 0,
      'margin-right': align === 'center' ? 'auto' : 0,
    }"
    label-suffix="："
    :model="model"
  >
    <el-form-item
      v-for="(item, i) in gridItems"
      :key="i"
      v-tab="item && item.tag !== 'slot' ? {name, ...item.tab} : null"
      class="my_form_item ai_fs"
      :class="{
        showonly: showonly || (item && item.showonly),
        slot_wrap: item && item.tag === 'slot',
        multiple_slot: item && item.tag === 'slot' && item.separate,
      }"
      :style="{
        'grid-row-start': `span ${item ? item.rowspan : 1}`,
        'grid-column-start': `span ${item ? item.colspan : 1}`,
        'margin-bottom': 0,
      }"
      v-bind="item && item.formItem || {}"
      :label-width="item && item.formItem && item.formItem.label ? item.formItem.labelWidth || labelWidth : '0px'"
      :prop="item ? item._key : null"
    >
      <template v-if="item">
        <slot
          v-if="item.tag === 'slot'"
          :name="item._key"
          :tab="{name, ...item.tab}"
          :model="model"
          :item="item"
          :separate="item.separate"
          :validate="validate"
          :validate-field="validateField"
          :reset-fields="resetFields"
          :scroll-to-field="scrollToField"
          :clear-validate="clearValidate"
        />

        <template v-if="!item.tag || item.tag === 'input'">
          <div v-if="border && showonly" style="padding: 6px 0;line-height: 20px; text-align: justify;">{{ model[item._key] }}</div>
          <el-input
            v-else
            v-model="model[item._key]"
            v-limit.input.blur="limit => model[item._key] = limit({ value: model[item._key], input: /.*/, blur: /.*/, ...item.limit })"
            :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请输入' + (item.formItem && item.formItem.label || '')"
            resize="none"
            :autosize="{minRows: 3}"
            v-bind="item.attrs || {}"
            :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
            @focus="clearValidate(item._key)"
          >
            <template v-if="item.slot && item.slot['prefix']" #prefix>
              <div v-if="$typeOf(item.slot['prefix']) === 'string'" v-html="item.slot['prefix']" />
              <template v-if="$typeOf(item.slot['prefix']) === 'object'">
                <el-icon :size="20" v-bind="item.slot['prefix']" icon>
                  <component :is="item.slot['prefix'].icon" />
                </el-icon>
              </template>
            </template>
            <template v-if="item.slot && item.slot['suffix']" #suffix>
              <div v-if="$typeOf(item.slot['suffix']) === 'string'" v-html="item.slot['suffix']" />
              <template v-if="$typeOf(item.slot['suffix']) === 'object'">
                <el-icon :size="20" v-bind="item.slot['suffix']" icon>
                  <component :is="item.slot['suffix'].icon" />
                </el-icon>
              </template>
            </template>
            <template v-if="item.slot && item.slot['prepend']" #prepend>
              <div v-if="$typeOf(item.slot['prepend']) === 'string'" v-html="item.slot['prepend']" />
              <template v-if="$typeOf(item.slot['prepend']) === 'object'">
                <el-icon :size="20" v-bind="item.slot['prepend']" icon>
                  <component :is="item.slot['prepend'].icon" />
                </el-icon>
              </template>
            </template>
            <template v-if="item.slot && item.slot['append']" #append>
              <div v-if="$typeOf(item.slot['append']) === 'string'" v-html="item.slot['append']" />
              <template v-if="$typeOf(item.slot['append']) === 'object'">
                <el-icon :size="20" v-bind="item.slot['append']" icon>
                  <component :is="item.slot['append'].icon" />
                </el-icon>
              </template>
            </template>
          </el-input>
        </template>

        <el-input-number
          v-if="item.tag === 'inputNumber'"
          v-model="model[item._key]"
          v-limit.input.blur="limit => model[item._key] = limit({ value: model[item._key], input: /.*/, blur: /.*/, ...item.limit })"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请输入' + (item.formItem && item.formItem.label || '')"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
          @focus="clearValidate(item._key)"
          @change="clearValidate(item._key)"
        />

        <el-autocomplete
          v-if="item.tag === 'autocomplete'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请输入' + (item.formItem && item.formItem.label || '')"
          :fetch-suggestions="() => {}"
          v-bind="item.attrs || {}"
          :value-key="item.valueKey || 'name'"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
          @focus="clearValidate(item._key)"
          @select="validateField(item._key)"
        >
          <template v-if="item.slot && item.slot['prefix']" #prefix>
            <div v-if=" $typeOf(item.slot['prefix']) === 'string'" v-html="item.slot['prefix']" />
            <template v-if="$typeOf(item.slot['prefix']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['prefix']" icon>
                <component :is="item.slot['prefix'].icon" />
              </el-icon>
            </template>
          </template>
          <template v-if="item.slot && item.slot['suffix']" #suffix>
            <div v-if="$typeOf(item.slot['suffix']) === 'string'" v-html="item.slot['suffix']" />
            <template v-if="$typeOf(item.slot['suffix']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['suffix']" icon>
                <component :is="item.slot['suffix'].icon" />
              </el-icon>
            </template>
          </template>
          <template v-if="item.slot && item.slot['prepend']" #prepend>
            <div v-if="$typeOf(item.slot['prepend']) === 'string'" v-html="item.slot['prepend']" />
            <template v-if="$typeOf(item.slot['prepend']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['prepend']" icon>
                <component :is="item.slot['prepend'].icon" />
              </el-icon>
            </template>
          </template>
          <template v-if="item.slot && item.slot['append']" #append>
            <div v-if="$typeOf(item.slot['append']) === 'string'" v-html="item.slot['append']" />
            <template v-if="$typeOf(item.slot['append']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['append']" icon>
                <component :is="item.slot['append'].icon" />
              </el-icon>
            </template>
          </template>
        </el-autocomplete>

        <el-select
          v-if="item.tag === 'select' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        >
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :value="$typeOf(opt) === 'object' ? (opt[item.valueKey] || opt['id']) : opt"
            :label="$typeOf(opt) === 'object' ? (opt[item.labelKey] || opt['name']) : opt"
            :disabled="$typeOf(opt) === 'object' ? ((item.disabledKey && !!opt[item.disabledKey]) || !!opt['disabled']) : false"
          />
          <template v-if="item.slot && item.slot['prefix']" #prefix>
            <div v-if="$typeOf(item.slot['prefix']) === 'string'" v-html="item.slot['prefix']" />
            <template v-if="$typeOf(item.slot['prefix']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['prefix']" icon>
                <component :is="item.slot['prefix'].icon" />
              </el-icon>
            </template>
          </template>
          <template v-if="item.slot && item.slot['empty']" #empty>
            <div v-if="$typeOf(item.slot['empty']) === 'string'" v-html="item.slot['empty']" />
            <template v-if="$typeOf(item.slot['empty']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['empty']" icon>
                <component :is="item.slot['empty'].icon" />
              </el-icon>
            </template>
          </template>
        </el-select>

        <el-cascader
          v-if="item.tag === 'cascader' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          v-bind="item.attrs || {}"
          :options="item.options"
          :props="{
            checkStrictly: true,
            emitPath: false,
            ...(item.attrs && item.attrs.props),
            value: item.valueKey || 'id',
            label: item.labelKey || 'name',
          }"
          :custom="false"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        >
          <template v-if="item.slot && item.slot['empty']" #empty>
            <div v-if="$typeOf(item.slot['empty']) === 'string'" v-html="item.slot['empty']" />
            <template v-if="$typeOf(item.slot['empty']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['empty']" icon>
                <component :is="item.slot['empty'].icon" />
              </el-icon>
            </template>
          </template>
        </el-cascader>

        <el-date-picker
          v-if="item.tag === 'datePicker'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          :format="item.attrs && item.attrs.type ? item.attrs.type === 'datetime' ? 'YYYY-MM-DD HH:mm' : item.attrs.type === 'date' ? 'YYYY-MM-DD' : '' : 'YYYY-MM-DD'"
          :value-format="item.attrs && item.attrs.type ? item.attrs.type === 'datetime' ? 'YYYY-MM-DD HH:mm' : item.attrs.type === 'date' ? 'YYYY-MM-DD' : '' : 'YYYY-MM-DD'"
          range-separator="—"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        >
          <template v-if="item.slot && item.slot['default']" #default>
            <div v-if="$typeOf(item.slot['default']) === 'string'" v-html="item.slot['default']" />
            <template v-if="$typeOf(item.slot['default']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['default']" icon>
                <component :is="item.slot['default'].icon" />
              </el-icon>
            </template>
          </template>
          <template v-if="item.slot && item.slot['range-separator']" #range-separator>
            <div v-if="$typeOf(item.slot['range-separator']) === 'string'" v-html="item.slot['range-separator']" />
            <template v-if="$typeOf(item.slot['range-separator']) === 'object'">
              <el-icon :size="20" v-bind="item.slot['range-separator']" icon>
                <component :is="item.slot['range-separator'].icon" />
              </el-icon>
            </template>
          </template>
        </el-date-picker>

        <el-time-picker
          v-if="item.tag === 'timePicker'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          format="HH:mm"
          value-format="HH:mm"
          range-separator="—"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        />

        <el-time-select
          v-if="item.tag === 'timeSelect'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          format="HH:mm"
          start="00:00"
          step="00:15"
          end="23:59"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        />

        <el-radio-group
          v-if="item.tag === 'radio' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        >
          <el-radio
            v-for="(opt, index) in item.options"
            :key="index"
            :label="$typeOf(opt) === 'object' ? (opt[item.valueKey] || opt['id']) : opt"
            :disabled="$typeOf(opt) === 'object' ? ((item.disabledKey && !!opt[item.disabledKey]) || !!opt['disabled']) : false"
          >
            {{ $typeOf(opt) === 'object' ? (opt[item.labelKey] || opt['name']) : opt }}
          </el-radio>
        </el-radio-group>

        <el-checkbox-group
          v-if="item.tag === 'checkbox' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
        >
          <el-checkbox
            v-for="(opt, index) in item.options"
            :key="index"
            :label="$typeOf(opt) === 'object' ? (opt[item.valueKey] || opt['id']) : opt"
            :disabled="$typeOf(opt) === 'object' ? ((item.disabledKey && !!opt[item.disabledKey]) || !!opt['disabled']) : false"
          >
            {{ $typeOf(opt) === 'object' ? (opt[item.labelKey] || opt['name']) : opt }}
          </el-checkbox>
        </el-checkbox-group>

        <div v-if="item.tag === 'switch'">
          <el-switch
            v-model="model[item._key]"
            v-bind="item.attrs || {}"
            :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
          />
        </div>
      </template>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.my_form {
  margin-bottom: v-bind(rowGap);

  :deep() {
    .el-form-item {
      .el-form-item__label {
        padding-right: 8px;
        font-weight: bold;
        color: $textColorPrimary;
      }

      .el-form-item__error {
        z-index: 9;
        padding-top: 3px;
        white-space: nowrap;
      }

      .el-select,
      .el-input-number,
      .el-date-editor,
      .el-autocomplete,
      .cascader_wrap,
      .el-cascader {
        width: 100%;
      }

      .el-checkbox-group {
        line-height: inherit;

        > * {
          vertical-align: middle;
        }
      }
    }

    .slot_wrap {
      > .el-form-item__content {
        > .el-form-item {
          width: 100%;

          + .el-form-item {
            margin-top: v-bind(_rowGap);
          }
        }
      }
    }
  }

  &.is_border {
    $border: 1px solid var(--el-border-color);
    $space: 6px;

    border-right: $border;
    border-bottom: $border;

    :deep(.my_form_item) {
      border-top: $border;
      border-left: $border;

      .el-form-item__label {
        align-self: stretch;
        height: auto;
        padding: $space;
        background-color: var(--el-fill-color);
        border-right: $border;
      }

      &:not(.multiple_slot) > .el-form-item__content {
        padding: $space;

        .el-form-item + .el-form-item {
          position: relative;
          padding-top: 1px;

          &::after {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: #{calc(100% + $space * 2)};
            content: "";
            border-top: $border;
          }
        }
      }

      &.multiple_slot > .el-form-item__content {
        .el-form-item__content {
          padding: $space;
        }

        .el-form-item + .el-form-item {
          position: relative;
          padding-top: 1px;

          &::after {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            content: "";
            border-top: $border;
          }
        }
      }
    }

    :deep() {
      .slot_wrap {
        align-items: stretch;

        > .el-form-item__content {
          align-items: stretch;

          .el-form-item__content {
            align-items: flex-start;
          }
        }
      }

      .showonly {
        .el-input__wrapper,
        .el-textarea__inner {
          padding-right: 0;
          padding-left: 0;
          box-shadow: none;
        }

        .el-input-number__decrease,
        .el-input-number__increase {
          border: 0;
        }
      }
    }
  }
}
</style>
