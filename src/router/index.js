import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
//引入子页面
import Welcome  from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import list from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/orders/Orders.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)
//home 里面配置子路由
const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component: Welcome},
      {path:'/users',component: Users},
      {path:'/rights',component: Rights},
      {path:'/roles',component: Roles},
      {path:'/categories',component: Cate},
      {path:'/params',component: Params},
      {path:'/goods',component: list},
      {path:'/goods/add',component: Add},
      {path:'/orders',component: Orders},
      {path:'/reports',component: Report}
      
    ]
  }
]

const router = new VueRouter({
  routes
})
//挂载路由守卫
router.beforeEach((to,from,next)=>{
  //to 要访问的路径
  //from从哪个路径跳来
  //next是一个函数，表示放行
  //next()放行 强制跳转next('/login')

  if(to.path ==='/login') return next()
  //获取token
   const tokenStr = window.sessionStorage.getItem('token')
   if(!tokenStr) return next('/login') 
   next()
})
export default router
