/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-13 10:51:03
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-19 12:00:28
 */
function limitInput(setValue) {
  setValue(({ value, input }) => {
    if ($typeOf(input) !== 'regExp') {
      throw TypeError('input is not a regExp');
    }
    if (value) {
      const matchArr = String(value).match(input);
      if ($typeOf(value) === 'number') {
        return matchArr ? Number(matchArr[0]) : 0;
      }
      return matchArr && matchArr[0];
    }
    return value;
  });
}

export default {
  mounted(el, bindings) {
    const { modifiers, value: setValue } = bindings,
      element = el.querySelector('input');

    if (element) {
      if (modifiers.input) {
        element.addEventListener('compositionstart', e => { // 开始输入中文
          if (element === e.target) {
            e.target.composing = true;
          }
        });
        element.addEventListener('compositionend', e => { // 结束输入中文
          if (element === e.target) {
            e.target.composing = false;
            limitInput(setValue);
          }
        });
        element.oninput = e => {
          if (!e.target.composing) { // 不是输入中文时
            limitInput(setValue);
          }
        };
      }

      modifiers.blur && (element.onblur = () => {
        setValue(({ value, blur }) => {
          if ($typeOf(blur) !== 'regExp') {
            throw TypeError('blur is not a regExp');
          }
          if (value && !blur.test(String(value))) {
            $message.warning('输入不符合规范，请重新输入！');
            element.focus();
            return null;
          }
          return value;
        });
      });
    }
  },
};
