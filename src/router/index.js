import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/home'
import LandTransferSystem from "@/pages/landTransferSystem"

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    }, {
        path: '/case1',
        name: 'LandTransferSystem',
        component: LandTransferSystem,
        meta: {
            title: '土地供应审批和监管信息化系统',
            icon: 'dashboard'
        }
    }]
})