// 实现一个插件
// 返回一个函数
// 或者返回一个对象，他有一个install方法
let _Vue

class VueRouter {
  static install(Vue) {
    // ? 绑定 this.$router
    // ? 注册两个组件：router-view, router-link

    // 保存对 Vue 的引用
    _Vue = Vue

    // * step 1: 挂载 router
    Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
        }
      },
    })

    // * step 2: 注册组件 router-link，用于路由跳转
    // 回忆一下 router-link 的使用：
    // * <router-link to="/login">login</router-link>
    Vue.component('router-link', {
      // 必要参数 to
      props: {
        to: {
          type: String,
          require: true,
        },
      },
      // 模板，可以使用 template，也可以使用 render。
      // * render 更加灵活，并且在 vue 中会把 template 编译成 render 函数。
      render() {
        // 这里可以写 jsx，也可以使用 h 函数
        // 这里我们使用 jsx，在 view-router 中使用 h，都尝试一下
        // * h 函数类似于 react 中的 createElement
        return <a href={`#${this.to}`}>{this.$slots.default}</a>
      },
    })

    // * step 3: 注册组件 router-view，用于显示组件
    // 回忆一下 router-link 的使用：
    // <router-view />
    Vue.component('router-view', {
      // 没有参数，直接 template
      render(h) {
        // 这里使用 h
        // view-router 的功能是渲染组件，那么组件从哪里获取呢？
        // 回忆 router.js 的路由表，其中有映射 url 地址和组件，所以组件显然是从这里获取
        // 而当前路由我们可以在构造函数中定义一个 current 来表示
        // 所以可以通过以下代码找到当前 current 对应的组件
        const { routeMap, current } = this.$router
        const component = routeMap[current] ? routeMap[current].component : null
        return h(component)
      },
    })
  }
  // 选项：routes - 路由表
  constructor(options) {
    this.$options = options

    // 缓存path和route映射关系
    this.routeMap = {}
    this.$options.routes.forEach((route) => {
      this.routeMap[route.path] = route
    })
    // console.log(route);

    // 需要定义一个响应式的current属性
    const initial = window.location.hash.slice(1) || '/'
    _Vue.util.defineReactive(this, 'current', initial)

    // 监控url变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }

  onHashChange() {
    // 只要#后面部分
    this.current = window.location.hash.slice(1)
    console.log(this.current)
  }
}

export default VueRouter
