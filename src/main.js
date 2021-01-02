import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' 
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'


import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//配置请求路径的根路径  
import axios from 'axios'
///配置根路径 
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'

//axios请求拦截
axios.interceptors.request.use(config =>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  //在最后必须return config  
  return config
});
Vue.prototype.$http = axios

Vue.config.productionTip = false
///注册为全局插件
Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

///创建过滤器
Vue.filter('dateForam',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear() 
  const m = (dt.getMonth()+1+ '').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh =(dt.getHours()+'').padStart(2,'0')
  const mm =(dt.getMinutes()+'').padStart(2,'0')
  const ss =(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
