import BaoWeiCharts from './index.vue'

// BaoWeiCharts.install = Vue => Vue.component("BaoWeiCharts", BaoWeiCharts);//.name就是开始说的vue文件暴露出来的name名，BaoWeiCharts整个组件
// export default BaoWeiCharts

const ChartsTable = {
  // 组件注册 install
  install (Vue) {
    Vue.component('BaoWeiCharts', BaoWeiCharts)
  }
}

export default ChartsTable
