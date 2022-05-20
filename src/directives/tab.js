/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-13 15:22:54
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-19 17:14:47
 */
import { findParentNode } from '@u';

const areaNodes = {};

export default {
  async updated(el, bindings) {
    const { value } = bindings;
    if (value === null) return;
    let name = 'default', trigger, current;
    if (value) {
      if ($typeOf(value) === 'string') {
        name = value;
      } else if ($typeOf(value) === 'object') {
        if (value.name) name = value.name;
        trigger = value.trigger;
        current = value.current;
      } else {
        throw TypeError('directive v-tab binding value is not a string or object');
      }
    }
    name = 'tab-' + name;

    function handleKeydown(e) {
      if (e.keyCode == 9) {
        trigger && trigger(e.shiftKey);

        let index = -1;
        const findAnother = anotherIndex => {
          const another = areaNodes[name][anotherIndex];
          if (another.target) {
            if (another.inputs[0].getAttribute('type') === 'radio') {
              const anotherRadio = another.target.querySelector('.el-radio.is-checked');
              if (anotherRadio) {
                anotherRadio.querySelector('input').focus();
              } else {
                another.inputs[0].click();
                another.inputs[0].focus();
              }
            } else {
              if (another.inputs[0].getAttribute('type') === 'text') {
                another.inputs[0].click();
              }
              another.inputs[0].focus();
            }
          } else {
            another.focus();
          }
        };
        for (let i = 0; i < areaNodes[name].length; i++) {
          const node = areaNodes[name][i];
          if (node.target) {
            const dateEditorWrap = node.target.querySelector('.date_editor_wrap'), cascaderWrap = node.target.querySelector('.cascader_wrap');
            if (dateEditorWrap && dateEditorWrap === document.activeElement) {
              index = i;
              break;
            }
            if (cascaderWrap && cascaderWrap === document.activeElement) {
              index = i;
              break;
            }
            if ($typeOf(node.target.className) === 'string' && (node.target.className.includes('date_editor_wrap') || node.target.className.includes('cascader_wrap'))) {
              if (node.target === document.activeElement) {
                index = i;
                break;
              }
            }
            if (node.inputs.find(input => input === document.activeElement || input.querySelector('input') === document.activeElement)) {
              index = i;
              break;
            }
          } else {
            if (node === document.activeElement) {
              index = i;
              break;
            }
          }
        }
        if (index >= 0) {
          if (e.shiftKey) {
            if (index == 0) {
              $message.warning('没有上一个了');
            } else {
              findAnother(index - 1);
            }
          } else {
            if (index == areaNodes[name].length - 1) {
              $message.warning('没有下一个了');
            } else {
              findAnother(index + 1);
            }
          }
        }
      }
    }

    el.setAttribute(name, '');
    if (current) {
      el.setAttribute('current-tab', '');
    } else {
      el.removeAttribute('current-tab');
    }

    if (el.querySelector('.el-date-editor')) {
      el.querySelector('input').onkeydown = e => { // 日期选择器、时间选择器禁用原生 tab
        if (e.keyCode == 9) {
          const pNode = findParentNode(e.target, '.date_editor_wrap');
          e.preventDefault();
          e.returnValue = false;
          if (pNode) pNode.focus();
        }
        handleKeydown(e);
      };
    }
    el.onkeydown = handleKeydown;
    await nextTick();
    const nodes = document.querySelectorAll(`[${ name }]`);
    areaNodes[name] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute('current-tab') !== null) {
        const disabled = String(nodes[i].getAttribute('disabled'));
        if (disabled === 'null' || disabled === 'false') {
          areaNodes[name].push(nodes[i]);
        }
      } else {
        const nodeInputs = nodes[i].querySelectorAll('input'), inputs = [];
        nodeInputs.forEach(input => {
          const disabled = String(input.getAttribute('disabled'));
          if (disabled === 'null' || disabled === 'false') {
            inputs.push(input);
          }
        });
        if (!nodeInputs.length) {
          const nodeTextarea = nodes[i].querySelector('textarea');
          if (nodeTextarea) {
            const disabled = String(nodeTextarea.getAttribute('disabled'));
            if (disabled === 'null' || disabled === 'false') {
              inputs.push(nodeTextarea);
            }
          }
        }
        if (inputs.length) {
          areaNodes[name].push({ target: nodes[i], inputs });
        }
      }
    }
  },
};
