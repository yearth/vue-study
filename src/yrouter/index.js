import Vue from 'vue'
import VueRouter from './yvue-router'
import Home from '../views/Home.vue'

// 1.use一下，VueRouter是一个插件
// 做了什么？
// 声明两个全局组件
// use会调用VueRouter.install(Vue)
Vue.use(VueRouter)

// 2.声明一个路由表
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

// 3.创建一个Router实例
const router = new VueRouter({
  routes,
})

export default router
