/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-20 09:17:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-20 10:21:48
 */
export default {
  get(formData, result, { value = 'value', to = 'to', exclude = 'exclude' } = {}) {
    function handleChains(chains, target, value) {
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        if (i == chains.length - 1) {
          target[chain] = value;
        } else {
          if (target[chain] !== undefined) {
            if ($typeOf(target[chain]) !== 'object') {
              return console.error(`${ target }.${ chain } is not an object`);
            }
          } else {
            target[chain] = {};
          }
          chains.shift();
          handleChains(chains, target[chain], value);
        }
      }
    }
    function setValue(item, key) {
      if (!item[exclude]) {
        if (item[to]) {
          const chains = item[to].split('.');
          handleChains(chains, result, item[value]);
        } else {
          result[key] = item[value];
        }
      }
    }
    for (const _key in formData) {
      const item = formData[_key];
      if (item.tag === 'slot' && $typeOf(item.separate) === 'object') {
        for (const k in item.separate) {
          const _item = item.separate[k];
          setValue(_item, k);
        }
      } else {
        setValue(item, _key);
      }
    }
  },
  set(formData, source, { value = 'value', from = 'from' } = {}) {
    function handleChains(chains, target, _source) {
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        if (i == chains.length - 1) {
          target[value] = _source[chain];
        } else {
          if (_source[chain] !== undefined) {
            chains.shift();
            handleChains(chains, target, _source[chain]);
          } else {
            return console.error(`${ _source }.${ chain } is undefined`);
          }
        }
      }
    }
    function setValue(item, key) {
      if (item[from]) {
        const chains = item[from].split('.');
        handleChains(chains, item, source);
      } else {
        item[value] = source[key];
      }
    }
    for (const _key in formData) {
      const item = formData[_key];
      if (item.tag === 'slot' && $typeOf(item.separate) === 'object') {
        for (const k in item.separate) {
          const _item = item.separate[k];
          setValue(_item, k);
        }
      } else {
        setValue(item, _key);
      }
    }
  },
};
