import Vue from 'vue'
import Vuex from './yvuex'

// ? use -> install
Vue.use(Vuex)

// ? new constructor
export default new Vuex.Store({
  // ? options
  state: {
    counter: 0,
  },
  mutations: {
    // state如何获取？
    add(state, num = 1) {
      state.counter += num
      console.log(state.counter)
    },
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('add')
      }, 1000)
    },
  },
  getters: {
    doubleCounter(state) {
      return state.counter * 2
    },
  },
})
