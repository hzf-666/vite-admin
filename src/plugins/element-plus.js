/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-12 09:36:01
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-30 12:05:06
 */
import 'element-plus/dist/index.css';
import { ElRadioGroup } from 'element-plus';
import { findParentNode } from '@u';

export default function() {
  const _render = $deepCopy(ElRadioGroup.render);
  ElRadioGroup.render = function(...arg) {
    arg[0].handleKeydown = () => {};
    return _render(...arg);
  };

  function findAnother(current, type, event) {
    let index = -1;
    const nodes = current.parentNode.querySelectorAll('.' + type), list = [];
    for (let i = 0; i < nodes.length; i++) {
      const radio = nodes[i];
      list.push({
        index: i,
        disabled: radio.className && radio.className.split(' ').includes('is-disabled'),
      });
      if (radio === document.activeElement || radio.querySelector('input') === document.activeElement) {
        index = i;
      }
    }
    if (index >= 0) {
      let arr = [];
      const prevList = list.slice(0, index), nextList = list.slice(-(list.length - (index + 1)));
      if (event.keyCode == 37 || event.keyCode == 38) {
        arr = prevList.reverse().concat(nextList.reverse());
      }
      if (event.keyCode == 39 || event.keyCode == 40) {
        arr = nextList.concat(prevList);
      }
      const another = arr.find(item => !item.disabled);
      return another && nodes[another.index];
    }
  }

  function handleKeydown(e) {
    const classNames = e.target.className ? e.target.className.split(' ') : [];

    const radios = ['el-radio', 'el-radio-button'];
    let currentRadio, radioType;

    for (const type of radios) {
      let radioClass = type + '__original';
      if (type === 'el-radio-button') radioClass += '-radio';
      if (classNames.includes(radioClass)) {
        currentRadio = findParentNode(e.target, '.' + type);
      }
      if (e.target.querySelector('.' + radioClass)) {
        currentRadio = e.target;
      }
      if (currentRadio) {
        radioType = type;
        break;
      }
    }

    if (currentRadio) {
      if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        $preventDefault(e);
      }
      const another = findAnother(currentRadio, radioType, e);
      another && another.click();
    }

    const checkboxs = ['el-checkbox', 'el-checkbox-button'];
    let currentCheckbox, checkboxType;
    for (const type of checkboxs) {
      const checkboxClass = type + '__original';
      if (classNames.includes(checkboxClass)) {
        currentCheckbox = findParentNode(e.target, '.' + type);
      }
      if (e.target.querySelector('.' + checkboxClass)) {
        currentCheckbox = e.target;
      }
      if (currentCheckbox) {
        checkboxType = type;
        break;
      }
    }

    if (currentCheckbox) {
      if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        $preventDefault(e);
      }
      if (e.keyCode == 13) {
        currentCheckbox.click();
      }
      const another = findAnother(currentCheckbox, checkboxType, e);
      another && another.focus();
    }

    if (e.target.className.includes('date_editor_wrap') || e.target.className.includes('cascader_wrap')) {
      if (e.keyCode == 13) {
        e.target.querySelector('.el-input').click();
      }
    }
  }

  function handleClick(e) {
    const elSwitch = findParentNode(e.target, '.el-switch');
    if (elSwitch) {
      elSwitch.querySelector('.el-switch__input').focus();
    }
  }

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('click', handleClick);
}
