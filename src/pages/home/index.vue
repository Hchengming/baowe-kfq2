<template>
  <div style="height:100%"
       id="charts-system-0a1a33">
    <!-- slot-name   嵌入模块slot字段名集合 -->
    <bao-wei-charts :setting-config="settingConfig"
                    :slot-name="['slot']"
                    ref="baoweiCharts"
                    @elementMethods="elementMethods">
      <div slot="slot"
           style="width:100%;height:100%">
        哈哈哈哈
      </div>
    </bao-wei-charts>

  </div>
</template>
<script>
import Vue from 'vue'
import BaoWeiCharts from '@/components/BaoWeiCharts/main'
Vue.component('BaoWeiCharts', BaoWeiCharts)
// import './system.scss'
import { elementMethodsMixins } from "./mixins.js"
/**
 * settingConfig
 * commonUrl String 配置数据接口公共部分
 * dataUrl String  图表、组件数据公共接口(一般用于未注册应用接口的接口)
 * systemPermissions String  权限管理 admin/user
 * answerId String  数据视图获取编码/id  当前项目唯一编码
 * serviceId String  应用接口获取id (getInterfaceUrl、serviceId二选一配置)
 * getInterfaceUrl String  应用接口获取路径(getInterfaceUrl、serviceId二选一配置)
 * itemTitle String  项目标题
 * isProducrTestData Boolean 未开发接口是否直接生成测试数据
 * systomMenuApi String  菜单配置模块公共路径(本地)
 * isCustomMenu Boolean 是否启用菜单配置模块(本地)
 * theme String 当前已配置主题选择 0：白色背景 1：深色背景
 * isTestEnvironment Boolean 后台版本是否为node测试环境
*/
export default {
  mixins: [elementMethodsMixins],
  data () {
    return {
      settingConfig: {
        commonUrl: 'http://localhost:4000', // 配置数据接口公共部分
        dataUrl: 'http://23.36.123.85:8882/api/v1', // 图表、组件数据公共接口
        dataIviewCode: 'e6f5f802-3919-4df3-a491-cfdaadc567a8', //数据视图获取编码/id
        systemPermissions: 'admin', // 权限管理  admin/user
        isProducrTestData: true,//未开发接口是否直接生成测试数据
        isCustomMenu: true,//是否启用菜单配置模块
        systomMenuApi: 'http://localhost:4000',//菜单配置模块公共路径
        //获取当前项目菜单接口
        // getMenuUrl: "http://23.36.123.128/api/applicationcenter/function/findAll?key=0a3724b5-74cf-4ef1-b7b2-93d2619d6270&type=1",
        //获取项目所有接口的接口路径
        getInterfaceUrl: "http://localhost:4000/application/insert",
        itemTitle: "测试系统",//项目标题
        theme: "2",//当前已配置主题选择 0:老实蓝色背景 1：大屏展示类背景风格 2：深蓝色主题风格(默认为2)
        answerId:"001",//项目编码   
        isTestEnvironment:true // 后台版本是否为node测试环境
      }
    }
  },
  // components:{BaoWeiCharts},
  mounted () {
    //组件开始渲染加载数据事件
    // setTimeout(() => {
    this.$refs['baoweiCharts'].startRender()
    // }, 1000)
  },
  methods: {
    dtcs () {
      document.getElementById('ifrmmap').contentWindow.postMessage(`LocalQxbyname|梁平区`, '*')
    },
    elementMethods (obj) {
      switch (obj.methodsName) {
        case 'menuClick'://菜单点击事件
          this.menuClick(obj);
          break
        case 'getchartsList'://模块获取数据格式化处理
          this.getchartsList(obj);
          break
        case 'getTopBarData'://顶部栏数据查询事件格式化处理
          this.getTopBarData(obj);
          break
        case 'rowClick'://行点击事件
          this.rowClick(obj);
          break
        case 'operateButtonClick'://表格右侧按钮点击事件
          console.log('表格右侧按钮点击事件', obj)
          break
        // case 'cellClick'://单元格点击事件
        //   this.cellClick(obj);
        //   break
      }
      // console.log(obj, 'elementMethods')
    }
  }
}
</script>
<style lang="scss">
body {
  margin: 0;
}
// @import '@/styles/element-variables.scss';
// @import "./system.scss";
// $--color-primary: #4e6ef2;
// .theme-color {
//   color: $--color-primary !important;
// }
// .theme-bg-color {
//   background: $--color-primary !important;
// }
// .theme-box-shadow {
//   box-shadow: 0 0 5px $--color-primary;
// }
// .theme-border-color {
//   border-color: $--color-primary !important;
// }
// .menu-bg-color {
//   background: $--color-primary !important;
// }

// .system-cs {
//   position: absolute;
//   right: 10px;
//   bottom: 10px;
//   z-index: 999;
// }
// .bao-wei-charts-slot {
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
// }
// .el-button--primary{
//  background-color: #{$--color-primary};
//   border-color: #{$--color-primary};
// }
// .el-button--primary:focus,.el-button--primary:hover{
//   background-color: #{$--color-primary}bd;
//   border-color: #{$--color-primary}bd;
// }
// .el-radio__input.is-checked .el-radio__inner{
//   border-color: $--color-primary;
//   background: $--color-primary;
// }
// .el-radio__input.is-checked+.el-radio__label{
//   color: $--color-primary;
// }
// .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
//   background-color:$--color-primary;
//     border-color:$--color-primary;
// }
// .el-dropdown .el-dropdown__caret-button.el-button--default::before {
//   background: rgba(220, 223, 230, .5)
// }
// .el-radio-button__orig-radio:checked+.el-radio-button__inner{
//   background-color:$--color-primary;
//     border-color:$--color-primary;
// }
// .el-radio-group.country-2  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
//     color: $--color-primary;
// }
</style>
