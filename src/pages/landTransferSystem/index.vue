<template>
  <div id="charts-system-0a1a33" style="height: 100%">
    <bao-wei-charts
      ref="baoweiCharts"
      :setting-config="settingConfig"
      :slot-name="['tableDetails']"
      @elementMethods="elementMethods"
    >
      <div
        slot="tableDetails"
        style="width: 100%; height: 100%; overflow: auto"
      >
        <table-info ref="tableInfo" :table-data="tableData"/>
      </div>
      <div slot="content" class="landTransferSystem-slot-content">
        <!-- 项目首页 -->
        <item-home
          v-if="moduleIsShow('项目首页')"
          ref="itemHome"
          :setting-config="settingConfig"
          @modeuleShow="modeuleShow"
          @changTopAll="changTopAll"
          @changePageData="changePageData"
          @eventData="eventData"
        />
      </div>
    </bao-wei-charts>
  </div>
</template>
<script>
import BaoWeiCharts from '@/components/BaoWeiCharts/main'
import TableInfo from './page/TableInfo/index.vue'
import ItemHome from './page/ItemHome/index.vue'
import { elementMethodsMixins } from './mixins.js'
import './css/index.scss'
export default {
  components: {
    BaoWeiCharts,
    TableInfo,
    ItemHome
  },
  mixins: [elementMethodsMixins],
  data() {
    return {
      tableData: {},
      settingConfig: {
        dataIviewCode: 'e6f5f802-3919-4df3-a491-cfdaadc567a8', // 数据视图获取编码/id
        // commonUrl: 'http://23.36.25.177:8082',
        commonUrl: 'http://23.36.123.82:8005', // 配置数据接口公共部分
        dataUrl: 'http://23.36.123.82:8005', // 图表、组件数据公共接口
        systemPermissions: 'admin', // 权限管理
        isCustomMenu: true, // 是否启用菜单配置模块
        systomMenuApi: 'http://localhost:4000', // 菜单配置模块公共路径
        theme: '0', // 当前已配置主题 0：白色背景 1：深色背景
        // 获取当前项目菜单接口
        // getMenuUrl:
        //   'http://23.36.123.128/api/applicationcenter/function/findAll?key=e6f5f802-3919-4df3-a491-cfdaadc567a8&type=1',
        // 获取项目所有接口的接口路径
        getInterfaceUrl: 'http://localhost:4000/application/insert',
        itemTitle: '土地供应审批和监管信息化系统', // 项目标题
        answerId: '002'// 项目编码
      }
    }
  },
  // components:{BaoWeiCharts},
  mounted() {
    this.$refs['baoweiCharts'].startRender()
    // console.log()
    // document.querySelectorAll()
  },
  methods: {
    // 顶部栏数据变化事件
    changTopAll(viewChange) {
      this.$refs['baoweiCharts'].changTopAll(viewChange)
    },
    changePageData(moduleId, viewchange) {
      // console.log('111')
      this.$refs['baoweiCharts'].changePageData(moduleId, viewchange)
    },

    // 图表模块显示隐藏控制事件
    modeuleShow(obj) {
      this.$refs['baoweiCharts'].modeuleShow(obj)
      // this.$emit('modeuleShow', {
      //     moduleId: '2bad2eb0bc024f2fae31a2e20bfe18e6',
      //     isShow: true
      // })
    },
    eventData(data) {
      this.tableData = data
    },
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
          if (this.moduleIsShow('项目首页')) {
            this.$refs['itemHome'].getchartsList(obj)
          }
          this.getchartsList(obj)
          break
        case 'getTopBarData': // 顶部栏数据查询事件格式化处理
          this.$refs['itemHome'].getTopBarData(obj)
          this.getTopBarData(obj)
          break
        case 'rowClick': // 行点击事件
          if (this.moduleIsShow('项目首页')) {
            this.$refs['itemHome'].rowClick(obj)
          }
          // this.rowClick(obj)
          break
        case 'getMenuData': // 菜单数据获取事件
          this.getMenuData(obj)
          break
        case 'topBarClick': // 顶部栏单元格点击事件
          this.$refs['itemHome'].topBarClick(obj)
          break
        case 'getPageData': // 模块获取数据格式化处理
          if (this.moduleIsShow('项目首页')) {
            this.$refs['itemHome'].getPageData(obj)
          }
          break
        case 'setOptions': // 图表配置外层定制化事件
          if (this.moduleIsShow('项目首页')) {
            this.$refs['itemHome'].setOptions(obj)
          }
          break

        // case 'operateButtonClick': // 表格右侧按钮点击事件
        //   console.log('表格右侧按钮点击事件', obj)
        //   break
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
// @import '@/styles/element-variables.scss';
$--color-primary: #4472c4;
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
.el-button--primary {
  background-color: #{$--color-primary};
  border-color: #{$--color-primary};
}
.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #{$--color-primary}bd;
  border-color: #{$--color-primary}bd;
}
</style>
