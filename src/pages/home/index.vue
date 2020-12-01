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
export default {
  mixins: [elementMethodsMixins],
  data () {
    return {
      // settingConfig: {
      //   commonUrl: 'http://23.36.123.85:8001', // 配置数据接口公共部分
      //   dataUrl: 'http://23.36.123.85:8882/api/v1', // 图表、组件数据公共接口
      //   systemPermissions: 'admin', // 权限管理
      //   //获取当前项目菜单接口
      //   getMenuUrl:"http://23.36.123.128/api/applicationcenter/function/findAll?key=0a3724b5-74cf-4ef1-b7b2-93d2619d6270&type=1",
      //   // getMenuUrl: "http://23.36.123.128/api/applicationcenter/function/findAll?key=fb054e83-9bb3-4385-a3c7-53a020434506&type=1",
      //   //获取项目所有接口的接口路径
      //   getInterfaceUrl: "http://23.36.123.128/api/shareservice/app/authorizeListByApp?uuid=fb054e83-9bb3-4385-a3c7-53a020434506",
      //   itemTitle: "重庆市开发区用地审核与监管系统",//项目标题
      //   //logo图标路径
      //   logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAIAAAAnX375AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2M0RCRUZGMzIyMzYxMUVBODE5RkJCQjNDMjBCMDBDNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2M0RCRUZGNDIyMzYxMUVBODE5RkJCQjNDMjBCMDBDNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzREJFRkYxMjIzNjExRUE4MTlGQkJCM0MyMEIwMEM3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYzREJFRkYyMjIzNjExRUE4MTlGQkJCM0MyMEIwMEM3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7IVG9gAAAzlJREFUeNpiFC16wUBfwMRAd0COlewsjEWu3FcaRIEkkE2qdkaSApaDlTHMmCPUhNNckRUicuLer9Vnf6w88+PXn/9EGsJCvH0e2uyhJhy+ehzIghZKbEBkp8oGtHjXtZ9U86WRHGso2HN8HDiD8cP3f6vP/ABafOHxb4qslBFkDjPhCDHiUBEjKjxuvvwDtvj784//yLESGIYNvjyyQsyYUj///F9//kegIQfW5HP/zd/ajZ9xhTN2K3WkWZr9ea2V2bDqWXP2R8vWL88+/pXiZ67x5gkx5sCq7NCtXzUbP9948YeAlQaykGjjEODEkn+2Xf656ux3IIks6KXLHmbMCSQx1b/58m8VOJyvPvuD08rbLWL8nFjCCugnoM+A/sMVC0C/An0M9Dem1O1Xf6w73+LMJJj2PXj7d/WZ78CkCGTgSThA15x58BuSsBWEUSwW42UmNl9+/fkfaBAwJE8/+E1McgW6qXvX1wO3fgHDGehpbnZGkgu8d1//la79hGkfCxNDvBXn2WoRIMmCYQBQPVAXUC8VSh8ICDDgAOZUF01QYukO5nPXYgcmkA0XfhBvAglWApNGvS8PMC8iCwLtBiJPHfbK9Z/x+IzMmkRflgXNPjgAisML+uFSX45aSV0rgfUDZhkNAUDxK8/+UD+TAM0NmPYe0hDRlYZqvPwUWEF+X3X2B5E5hOSiAGjujEPflp/+XujCk2zDOffI9/49Xz5+/0+SISxkRAbQjobNn9u3f/n55z9dkw959tEpxX76/g+flYkLPqBV+siVMLAcF+JG1yLGy9QXxoerwNt44UfVhs/44nLr5Z9ABDS90oMHo85iBNZWAYYcwCQz69C3P/9AzfZ0O65cJ25gxb4Wo8EAzFTAhsTmSz+ISj7AmnnzxZ+h2NpRQNMbfHnjLbkWHv8GJBVFmLGaAKyrgU1ArPHNgid1LDn5HTWhIqIEaBPQYmRZPtQWzIrT34dmgffq8z8gwiV159VfIs1h5rYsIVIpsM2/5/qvTz/+A9vvfBxQtz798Hfe0e/1m74AW4406ezBIxLYZAV2H4CpEZgmgSmThv1LZAD06+N3f+la+pBn38CkWIAAAwAdjXcayMgp/QAAAABJRU5ErkJggg=="
      // }
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
        theme: "0",//当前已配置主题选择 0：白色背景 1：深色背景
        themeCode:"001"//项目编码   
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
$--color-primary: #4e6ef2;
.theme-color {
  color: $--color-primary !important;
}
.theme-bg-color {
  background: $--color-primary !important;
}
.theme-box-shadow {
  box-shadow: 0 0 5px $--color-primary;
}
.theme-border-color {
  border-color: $--color-primary !important;
}
.menu-bg-color {
  background: $--color-primary !important;
}

.system-cs {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 999;
}
.bao-wei-charts-slot {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.el-button--primary{
 background-color: #{$--color-primary};
  border-color: #{$--color-primary};
}
.el-button--primary:focus,.el-button--primary:hover{
  background-color: #{$--color-primary}bd;
  border-color: #{$--color-primary}bd;
}
.el-radio__input.is-checked .el-radio__inner{
  border-color: $--color-primary;
  background: $--color-primary;
}
.el-radio__input.is-checked+.el-radio__label{
  color: $--color-primary;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color:$--color-primary;
    border-color:$--color-primary;
}
.el-dropdown .el-dropdown__caret-button.el-button--default::before {
  background: rgba(220, 223, 230, .5)
}
</style>
