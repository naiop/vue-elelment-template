import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control

import global from './utils/global.js' // global variable
import * as filters from './filters' // global filters

// 如果您不想使用模拟服务器  您想将MockJs用于模拟api您可以执行：mockXHR() (请在联机前将其删除！)
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 全局变量赋值
Vue.prototype.global = global

// 注册全局filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// chrome
Vue.config.productionTip = false
Vue.config.devtools = true // chrome debug

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
