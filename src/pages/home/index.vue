<template>
  <div id="charts-system-0a1a33" style="height:100%">
    <!-- slot-name   嵌入模块slot字段名集合 -->
    <bao-wei-charts
      ref="baoweiCharts"
      :setting-config="settingConfig"
      :slot-name="['slot']"
      @elementMethods="elementMethods"
    >
      <div slot="slot" style="width:100%;height:100%">
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
import { elementMethodsMixins } from './mixins.js'
/**
 * settingConfig
 * commonUrl String 配置数据接口公共部分
 * dataUrl String  图表、组件数据公共接口(一般用于未注册应用接口的接口)
 * systemPermissions String  权限管理 admin/user
 * answerId String  数据视图获取编码/id  当前项目唯一编码
 * serviceId String  应用接口获取id (getInterfaceUrl、serviceId二选一配置)
 * getInterfaceUrl String  应用接口获取路径(getInterfaceUrl、serviceId二选一配置)用于本地测试环境
 * itemTitle String  项目标题
 * isProducrTestData Boolean 未开发接口是否直接生成测试数据
 * systomMenuApi String  菜单配置模块公共路径(本地)
 * isCustomMenu Boolean 是否启用菜单配置模块(本地)
 * theme String 当前已配置主题选择 0：白色背景 1：深色背景
 * isTestEnvironment Boolean 后台版本是否为node测试环境
 * isBigData Boolean 是否为大数据编排项目
 * mapPramData  Array  地图组件默认参数配置
 */
export default {
  mixins: [elementMethodsMixins],
  data() {
    return {
      settingConfig: {
        commonUrl: 'http://localhost:4000', // 配置数据接口公共部分
        dataUrl: 'http://localhost:4000', // 图表、组件数据公共接口
        // dataIviewCode: 'e6f5f802-3919-4df3-a491-cfdaadc567a8', // 数据视图获取编码/id
        systemPermissions: 'admin', // 权限管理  admin/user
        isProducrTestData: true, // 未开发接口是否直接生成测试数据
        isCustomMenu: true, // 是否启用菜单配置模块
        systomMenuApi: 'http://localhost:4000', // 菜单配置模块公共路径
        // 获取当前项目菜单接口
        // getMenuUrl: "http://23.36.123.128/api/applicationcenter/function/findAll?key=0a3724b5-74cf-4ef1-b7b2-93d2619d6270&type=1",
        // 获取项目所有接口的接口路径
        getInterfaceUrl: 'http://localhost:4000/application/insert',
        itemTitle: '测试系统', // 项目标题
        theme: '2', // 当前已配置主题选择 0:老实蓝色背景 1：大屏展示类背景风格 2：深蓝色主题风格(默认为2)
        isTestEnvironment: true, // 后台版本是否为node测试环境
        answerId: '001', // 应用id
        isBigData: false, // 是否为大数据编排项目使用
        bigData: {// 大数据编排项目特殊配置
          bigDataTemplateId: '001', // 大数据编排项目模板页面id
          // pageDataUrl: 'http://23.36.71.111:8082/flowBDService/v1/columnList?id=04d3d87a-e69c-e71e-7531-a084c0708498', // 当前项目列表页面数据请求路径
          viewId: '002', // 视图id
          iframeDefaultUrl: 'http://23.36.250.99:666/views/showmap.html?callid=101291123'// iframe地图初始路径
        },
        mapPramConfig: [{// 地图组件默认参数配置
          paramKey: 'type',
          description: '类型',
          paramValue: 'classBreaksDef',
          isShow: true,
          formType: 'select',
          selectArr: [{
            lab: '分类方式',
            val: 'classBreaksDef'
          }, {
            lab: '唯一值方式',
            val: 'uniqueValueDef'
          }]
        }, {// 地图组件默认参数配置
          paramKey: 'fromColor',
          description: '色带一',
          paramValue: '#333',
          isShow: true,
          formType: 'color'
        }, {// 地图组件默认参数配置
          paramKey: 'toColor',
          description: '色带二',
          paramValue: '#333',
          isShow: true,
          formType: 'color'
        }, {
          paramKey: 'classificationField',
          description: '匹配值的字段名',
          paramValue: '',
          isShow: true,
          formType: 'select',
          selectArr: [{
            lab: '用地面积1',
            val: 'class1'
          }, {
            lab: '用地面积2',
            val: 'class2'
          }]
        }, {
          paramKey: 'attributeField',
          description: '唯一值1',
          paramValue: '',
          isShow: false,
          formType: 'select',
          selectArr: [{
            lab: '学校类型1',
            val: 'class1'
          }, {
            lab: '学校类型2',
            val: 'class2'
          }]
        }],
        defaultType: 'classBreaksDef'
      }
    }
  },
  watch: {
    'settingConfig.mapPramConfig': {
      handler(val) {
        if (val[0].paramValue !== this.defaultType) {
          this.defaultType = val[0].paramValue
          if (this.defaultType === 'classBreaksDef') {
            val[4].isShow = false
            val[3].isShow = true
          } else {
            val[4].isShow = true
            val[3].isShow = false
          }
        }
      },
      deep: true
    }
  },
  // components:{BaoWeiCharts},
  mounted() {
    // 组件开始渲染加载数据事件
    // setTimeout(() => {
    localStorage.setItem('country', '市局')
    this.$refs['baoweiCharts'].startRender()
    // }, 1000)
    this.$nextTick(() => {
      setTimeout(() => {
        this.changeChartsData()
      }, 1000)
    })
  },
  methods: {
    dtcs() {
      document
        .getElementById('ifrmmap')
        .contentWindow.postMessage(`LocalQxbyname|梁平区`, '*')
    },
    elementMethods(obj) {
      switch (obj.methodsName) {
        case 'menuClick': // 菜单点击事件
          this.menuClick(obj)
          break
        case 'getchartsList': // 模块获取数据格式化处理
          this.getchartsList(obj)
          break
        case 'getTopBarData': // 顶部栏数据查询事件格式化处理
          this.getTopBarData(obj)
          break
        case 'rowClick': // 行点击事件
          this.rowClick(obj)
          break
        case 'operateButtonClick': // 表格右侧按钮点击事件

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
