let _Vue

// ? export default Vuex
// ! 暗号：天王盖地虎
export default {
  install(Vue) {
    _Vue = Vue
    Vue.mixin({
      beforeCreate() {
        if (this.$options.store) {
          Vue.prototype.$store = this.$options.store
        }
      },
    })
  },
  Store: class Store {
    constructor(options) {
      this._mutations = options.mutations
      this._actions = options.actions
      this._getters = options.getters
      // ? 用于存储 getter
      this._wrappedGetters = Object.create(null)
      // ? 遍历 getter
      this.forEachGetter(this, this._getters)
      // ? 实现响应式数据
      this.resetStoreVm(this, options.state)
      this.commit = this.commit.bind(this)
      this.dispatch = this.dispatch.bind(this)
    }
    get state() {
      return this._vm._data.$$state
    }
    set state(val) {
      console.error('please use replaceState to reset state')
    }
    commit(type, payload) {
      const mutation = this._mutations[type]
      return mutation(this.state, payload)
    }
    dispatch(type, payload) {
      const action = this._actions[type]
      return action(this, payload)
    }
    forEachGetter(store, getters) {
      Object.keys(getters).forEach((key) => {
        const getter = getters[key]
        // ? 将 getter 注册到 store 中
        this.registerGetter(store, getter, key)
      })
    }
    registerGetter(store, getter, type) {
      store._wrappedGetters[type] = function wrappedGetter(store) {
        return getter(store.state)
      }
    }
    resetStoreVm(store, state) {
      store.getters = {}
      const computed = {}
      const wrappedGetters = store._wrappedGetters
      Object.keys(wrappedGetters).forEach((key) => {
        computed[key] = this.partial(wrappedGetters[key], store)
        Object.defineProperty(store.getters, key, {
          get: () => store._vm[key],
        })
      })
      this._vm = new _Vue({
        data() {
          return {
            $$state: state,
          }
        },
        // ! 计算属性，用于实现 getter
        computed: computed,
      })
    }
    partial = (fn, arg) => () => fn(arg)
  },
}
