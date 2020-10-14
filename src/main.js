import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css' 

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
