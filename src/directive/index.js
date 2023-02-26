// 注册一个全局自定义指令
import permission from './permission/index.js' // 权限判断指令
import waves from './waves/index.js' // 指令waves 水波纹效果

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('waves', waves)
}

if (window.Vue) {
  window['permission'] = permission
  window['waves'] = waves
  Vue.use(install); // eslint-disable-line
}

export default install
