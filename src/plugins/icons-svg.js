/*
 * @Descripttion:
 * @version:
 * @Author: hzf
 * @Date: 2022-05-24 10:41:51
 * @LastEditors: hzf
 * @LastEditTime: 2022-05-28 18:30:51
 */
const files = import.meta.globEager('@a/icons/svg/*.svg'),
  whiteList = [],
  reg = /^(.*)\/(.*)\.svg$/,
  icons = [];

Object.keys(files).forEach(k => {
  const fileName = k.replace(reg, '$2');
  if (!whiteList.includes(fileName)) {
    icons.push(fileName);
  }
});

export default function(app) {
  const arr = [];
  icons.forEach(iconName => {
    let name = iconName;
    name = name.replace(/^./, (...arg) => arg[0].toUpperCase());
    name = 'Icon' + name.replace(/(-.)/g, (...arg) => arg[0][1].toUpperCase());
    arr.push(name);
    const SvgIcon = () => {
      return h('svg', {
        'aria-hidden': true,
      }, [
        h('use', {
          'xlink:href': `#iconsvg-${ iconName }`,
        }),
      ]);
    };
    app.component(name, SvgIcon);
  });
  $store.set('icons/alibaba', arr);
}
