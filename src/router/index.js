import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/home'
import LandTransferSystem from '@/pages/landTransferSystem'
import LandTransferSystem2 from '@/pages/landTransferSystem@2.0'
import BigData from '@/pages/bigData'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/bigData',
    name: 'BigData',
    component: BigData
  }, {
    path: '/case1',
    name: 'LandTransferSystem',
    component: LandTransferSystem,
    meta: {
      title: '土地供应审批和监管信息化系统',
      icon: 'dashboard'
    }
  }, {
    path: '/landTransferSystem@2.0',
    name: 'LandTransferSystem@2.0',
    component: LandTransferSystem2,
    meta: {
      title: '土地供应审批和监管信息化系统@2.0',
      icon: 'dashboard'
    }
  }]
})
