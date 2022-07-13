import Vue from 'vue'
import App from './App.vue'

//引入router插件，支持SAP单页面应用
import VueRouter from 'vue-router'

//引入路由配置文件
import routerOptions from './router/index'

// import '@/styles/index.scss' // global css
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/icons' // icon

//引入store
import Store from './store/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

// 引入并使用自定义的全局变量
import globalVar from './common/global/global'
Vue.prototype.GLOBALVAR=globalVar

//引入导出excel组件方法
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// 导入批量注册需要使用的xlsx文件格式
import XLSX from 'xlsx'
Vue.use(XLSX)

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })

Vue.use(VueRouter)
// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

new Vue({
  render: h => h(App),
  //传入vuex所需的store
  store:Store,    
  // 安装全局总线
  beforeCreate () {
    Vue.prototype.$bus=this
  },
  // 配置router
  router:routerOptions
}).$mount('#app')
