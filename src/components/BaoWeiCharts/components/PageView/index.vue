<template>
  <div ref="containerViews" class="container-view">
    <div class="el-tab-pane-icon">
      <i class="el-icon-circle-plus-outline" @click="drawerShow = true" />
    </div>
    <!-- 时间轴 -->
    <time-axis
      v-for="(item, index) in timeSource()"
      ref="timeAxis"
      :key="index"
      :setting-config="settingConfig"
      :setting-form="item.timeAxisConfig"
      :module-id="item.moduleId"
      :container-elelemt="containerElelemt"
      @componentFunc="componentFunc"
    />
    <!-- 类目轴 -->
    <axis
      v-for="item in axisSource()"
      :key="item.moduleId"
      :setting-form="item.categoryConfig"
      :setting-config="settingConfig"
      :module-id="item.moduleId"
      :container-elelemt="containerElelemt"
      @componentFunc="componentFunc"
    />
    <!-- 图表 -->
    <section v-for="item in pageData()" :key="item.moduleId">
      <statistics
        ref="statisticsAll"
        :statistics-all="item"
        :browser-x-y="browserXY"
        :setting-config="settingConfig"
        :add-setting-form="addSettingForm"
        :container-elelemt="containerElelemt"
        @componentFunc="componentFunc"
      >
        <div
          v-if="
            item.contentAreaConfig.blankTemplateConfig &&
              item.contentAreaConfig.blankTemplateConfig.slot
          "
          :slot="item.contentAreaConfig.blankTemplateConfig.slot"
          style="width: 100%; height: 100%"
        >
          <slot :name="item.contentAreaConfig.blankTemplateConfig.slot" />
        </div>
      </statistics>
    </section>
    <!-- tabs切换项新增 -->

    <el-drawer
      :visible.sync="drawerShow"
      :append-to-body="true"
      title="选项卡容器内组件新增"
      direction="rtl"
      class="pageSetting"
    >
      <!-- 页面组件新增 -->
      <assembly :assembly-data="assemblyData" @addAssembly="addAssembly" />
    </el-drawer>
  </div>
</template>
<script>
import assembly from '../../main/find/assembly'
import TimeAxis from '../TimeAxis/index'
import Axis from '../Axis/index'
import Statistics from '../../tuobiao/statistics'
export default {
  components: { assembly, TimeAxis, Axis, Statistics },
  props: {
    moduleId: { type: String, default: null },
    tabsCode: { type: String, default: null },
    pageModuleData: { type: Object, default: null },
    settingConfig: { type: Object, default: null },
    addSettingForm: { type: Object, default: null }
  },
  data() {
    return {
      browserXY: {
        width: window.innerWidth,
        height: window.innerHeight,
        mainWidth: null,
        mainHeight: null
      },
      drawerShow: false,
      containerElelemt: null,
      assemblyData: [
        {
          type: 'tableChart',
          name: '图表组件集',
          icon: 'icontubiao'
        },
        {
          type: 'axis',
          name: '类目轴',
          icon: 'icondangan'
        },
        {
          type: 'timeAxis',
          name: '时间轴',
          icon: 'icondangan'
        }
      ]
    }
  },
  mounted() {
    this.containerElelemt = this.$refs['containerViews']
  },
  methods: {
    // 类目轴数据
    axisSource() {
      const arr = []

      if (this.pageModuleData.categoryAxis) {
        this.pageModuleData.categoryAxis.forEach(item => {
          if (item.categoryConfig.parentModuleId === this.moduleId) {
            if (this.tabsCode) {
              if (this.tabsCode === item.categoryConfig.parentTabsCode) {
                arr.push(item)
              }
            } else {
              arr.push(item)
            }
          }
        })
      }
      console.log(arr)
      return arr
    },
    // 时间轴数据
    timeSource() {
      const arr = []
      if (this.pageModuleData.timeAxis) {
        this.pageModuleData.timeAxis.forEach(item => {
          // console.log(item.timeAxisConfig.parentModuleId, this.moduleId)
          if (item.timeAxisConfig.parentModuleId === this.moduleId) {
            console.log(item.timeAxisConfig.parentTabsCode, this.tabsCode)
            if (this.tabsCode) {
              if (this.tabsCode === item.timeAxisConfig.parentTabsCode) {
                arr.push(item)
              }
            } else {
              arr.push(item)
            }
          }
        })
      }
      return arr
    },
    // 图表数据
    pageData() {
      const arr = []
      if (this.pageModuleData.pageData) {
        this.pageModuleData.pageData.forEach(item => {
          if (item.contentAreaConfig.parentModuleId === this.moduleId) {
            if (this.tabsCode) {
              if (this.tabsCode === item.contentAreaConfig.parentTabsCode) {
                arr.push(item)
              }
            } else {
              arr.push(item)
            }
          }
        })
      }
      return arr
    },
    // 组件方法暴露
    componentFunc(obj) {
      //
      if (this[obj.method]) {
        this[obj.method](obj.param)
      } else {
        this.$emit('componentFunc', obj)
      }
    },
    // 抽屉新增事件
    addAssembly(type) {
      // console.log(this.pageModuleData, 'pageModuleData')
      // console.log(type, 'type')
      this.drawerShow = false
      this.$emit('componentFunc', {
        method: 'pageViewAdd',
        param: {
          type,
          moduleId: this.moduleId,
          tabsCode: this.tabsCode ? this.tabsCode : undefined
        }
      })
    },
    // 监听屏幕变化事件
    resize() {
      this.browserXY.width = window.innerWidth
      this.browserXY.height = window.innerWidth
    },
    // 内容区域宽高变化事件
    mainStyleChange() {
      const element = document.getElementsByClassName('my_main_content')[0]
      this.browserXY.mainWidth = element.scrollWidth
    }
  }
}
</script>
<style lang="scss" scoped>
.container-view {
  width: 100%;
  height: 100%;
  position: relative;
  .el-tab-pane-icon {
    position: absolute;
    right: 5px;
    top: 5px;
    i {
      font-size: 22px;
      color: #3b85d8;
      cursor: pointer;
    }
  }
}
</style>
