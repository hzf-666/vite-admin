<!--
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-14 16:15:15
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-20 16:26:54
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
      default: () => ('100%'),
    },
    labelWidth: {
      type: String,
      default: () => ('90px'),
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
  }),
  { name, modelValue, width, labelWidth, rowGap, columnGap, showonly, border } = toRefs(props),
  emit = defineEmits(['update:modelValue']);

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
const myForm = ref(null), rows = ref(0), cols = ref(0), gridItems = ref([]), model = reactive({}), isModelChange = ref(false),
  _rowGap = ref(rowGap.value), _columnGap = ref(columnGap.value);
watch(border, newVal => {
  _rowGap.value = newVal ? '0px' : rowGap.value;
  _columnGap.value = newVal ? '0px' : columnGap.value;
}, {
  immediate: true,
});
watch(modelValue, newValue => {
  if (isModelChange.value) {
    isModelChange.value = false;
    return;
  }
  gridItems.value = [];
  const colData = [];
  Object.keys(newValue).forEach(k => {
    const item = newValue[k], isPass = judgePosition(item.position, k);
    if (isPass) {
      const r = item.position[0], c = item.position[1],
        obj = { ...$deepCopy(item), rowspan: item.rowspan || 1, colspan: item.colspan || 1, _key: k },
        targetCol = colData.find(colItem => colItem.order == c);

      if (item.tag === 'slot' && $typeOf(item.separate) === 'object') {
        for (const mKey in item.separate) {
          model[mKey] = item.separate[mKey].value === undefined ? null : item.separate[mKey].value;
          if (obj.separate[mKey].formItem) {
            obj.separate[mKey].formItem.labelWidth = obj.separate[mKey].formItem.label ? labelWidth.value || obj.separate[mKey].formItem.labelWidth : '0px';
          }
        }
      } else {
        model[k] = item.value === undefined ? null : item.value;
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
  function getSortColumn(column) {
    column.sort((current, prev) => current.position[0] - prev.position[0]);
  }
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
}, {
  deep: true,
});
function validate(callback) {
  myForm.value.validate(callback);
}
function validateField(props, callback) {
  myForm.value.validateField(props, callback);
}
function resetFields(props) {
  myForm.value.resetFields(props);
}
function scrollToField(prop) {
  myForm.value.scrollToField(prop);
}
function clearValidate(props) {
  myForm.value.clearValidate(props);
}
async function submit() {
  let msg = '';
  const data = {};
  for (let i = 0; i < gridItems.value.length; i++) {
    const item = gridItems.value[i];
    if (item) {
      const p = new Promise(resolve => {
        validateField(item._key, (isValid, invalidFields) => {
          if (!isValid) {
            resolve(invalidFields[item._key][0].message);
          } else {
            resolve('');
          }
        });
      });
      msg = await p;
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

defineExpose({
  validate, validateField, resetFields, scrollToField, clearValidate,
  submit,
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
    }"
    label-suffix="："
    :model="model"
    v-bind="$attrs"
    v-on="$attrs"
  >
    <el-form-item
      v-for="(item, i) in gridItems"
      :key="i"
      v-tab="item && item.tag !== 'slot' ? {name, ...item.tab} : null"
      class="my_form_item ai_fs"
      :class="{
        showonly: showonly || (item && item.showonly),
        slot_wrap: item && item.tag === 'slot',
      }"
      :style="{
        'grid-row-start': `span ${item ? item.rowspan : 1}`,
        'grid-column-start': `span ${item ? item.colspan : 1}`,
        'margin-bottom': 0,
      }"
      v-bind="item && item.formItem || {}"
      :label-width="item && item.formItem && item.formItem.label ? item.formItem.labelWidth || labelWidth : '0px'"
      :prop="item ? item._key : null"
      v-on="item && item.formItem || {}"
    >
      <template v-if="item">
        <slot
          v-if="item.tag === 'slot'"
          :name="item._key"
          :tab="{name, ...item.tab}"
          :model="model"
          :separate="item.separate"
          :validate="validate"
          :validate-field="validateField"
          :reset-fields="resetFields"
          :scroll-to-field="scrollToField"
          :clear-validate="clearValidate"
        />

        <template v-if="!item.tag || item.tag === 'input'">
          <div v-if="border && showonly" style="line-height: 20px; text-align: justify;">{{ model[item._key] }}</div>
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
            v-on="item.events || {}"
          >
            <template v-if="item.slot && $typeOf(item.slot['prefix']) === 'string'" #prefix>
              <div v-html="item.slot['prefix']" />
            </template>
            <template v-if="item.slot && $typeOf(item.slot['suffix']) === 'string'" #suffix>
              <div v-html="item.slot['suffix']" />
            </template>
            <template v-if="item.slot && $typeOf(item.slot['prepend']) === 'string'" #prepend>
              <div v-html="item.slot['prepend']" />
            </template>
            <template v-if="item.slot && $typeOf(item.slot['append']) === 'string'" #append>
              <div v-html="item.slot['append']" />
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
          v-on="item.events || {}"
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
          v-on="item.events || {}"
        >
          <template v-if="item.slot && $typeOf(item.slot['prefix']) === 'string'" #prefix>
            <div v-html="item.slot['prefix']" />
          </template>
          <template v-if="item.slot && $typeOf(item.slot['suffix']) === 'string'" #suffix>
            <div v-html="item.slot['suffix']" />
          </template>
          <template v-if="item.slot && $typeOf(item.slot['prepend']) === 'string'" #prepend>
            <div v-html="item.slot['prepend']" />
          </template>
          <template v-if="item.slot && $typeOf(item.slot['append']) === 'string'" #append>
            <div v-html="item.slot['append']" />
          </template>
        </el-autocomplete>

        <el-select
          v-if="item.tag === 'select' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          :placeholder="(showonly || item.showonly || (item.attrs && item.attrs.readonly)) ? '' : '请选择' + (item.formItem && item.formItem.label || '')"
          :clearable="false"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
          v-on="item.events || {}"
        >
          <el-option
            v-for="(opt, index) in item.options"
            :key="index"
            :value="$typeOf(opt) === 'object' ? (opt[item.valueKey] || opt['id']) : opt"
            :label="$typeOf(opt) === 'object' ? (opt[item.labelKey] || opt['name']) : opt"
            :disabled="$typeOf(opt) === 'object' ? ((item.disabledKey && !!opt[item.disabledKey]) || !!opt['disabled']) : false"
          />
          <template v-if="item.slot && $typeOf(item.slot['prefix']) === 'string'" #prefix>
            <div v-html="item.slot['prefix']" />
          </template>
          <template v-if="item.slot && $typeOf(item.slot['empty']) === 'string'" #empty>
            <div v-html="item.slot['empty']" />
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
          v-on="item.events || {}"
        >
          <template v-if="item.slot && $typeOf(item.slot['empty']) === 'string'" #empty>
            <div v-html="item.slot['empty']" />
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
          v-on="item.events || {}"
        >
          <template v-if="item.slot && $typeOf(item.slot['default']) === 'string'" #default>
            <div v-html="item.slot['default']" />
          </template>
          <template v-if="item.slot && $typeOf(item.slot['range-separator']) === 'string'" #range-separator>
            <div v-html="item.slot['range-separator']" />
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
          v-on="item.events || {}"
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
          v-on="item.events || {}"
        />

        <el-radio-group
          v-if="item.tag === 'radio' && $typeOf(item.options) === 'array'"
          v-model="model[item._key]"
          v-bind="item.attrs || {}"
          :disabled="showonly || item.showonly || (item.attrs && item.attrs.disabled)"
          v-on="item.events || {}"
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
          v-on="item.events || {}"
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
            v-on="item.events || {}"
          />
        </div>
      </template>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.my_form {
  :deep(.el-form-item) {
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

    .el-input-number,
    .el-date-editor,
    .el-autocomplete {
      width: 100%;
    }

    .el-checkbox-group {
      line-height: inherit;

      > * {
        vertical-align: middle;
      }
    }
  }

  :deep(.slot_wrap) {
    > .el-form-item__content {
      > .el-form-item {
        width: 100%;

        + .el-form-item {
          margin-top: v-bind(_rowGap);
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
        padding: $space;
        background-color: var(--el-fill-color);
        border-right: $border;
      }

      .el-form-item__content {
        padding: $space;

        .el-form-item {
          margin-right: -#{$space};
          margin-left: -#{$space};

          &:first-child {
            margin-top: -#{$space};
          }

          &:last-child {
            margin-bottom: -#{$space};
          }

          + .el-form-item {
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
      }
    }

    :deep(.slot_wrap) {
      align-items: stretch;

      > .el-form-item__content {
        align-items: stretch;

        .el-form-item__content {
          align-items: flex-start;
        }
      }
    }

    :deep(.showonly) {
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
</style>
