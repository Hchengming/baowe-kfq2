import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    customComponentsParam: localStorage.getItem('customComponentsParam')

    // {
    //   type:'0',//0 交互
    //   interactiveModuleId:'',//交互组件id
    //   param:{//交互传入参数

    //   }
    // }
  },
  mutations: {
    setCustomComponentsParam(state, item) {
      state.customComponentsParam = item
    }
  }
})

export default store
