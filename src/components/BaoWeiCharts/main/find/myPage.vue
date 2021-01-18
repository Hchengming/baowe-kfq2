<template>
  <div
    v-loading="pageLoading"
    class="my_main_content"
    element-loading-text="页面加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <!-- 图表组件 -->
    <middleware
      ref="middleware"
      :item-api-data="itemApiData"
      :data-view-list="dataViewList"
      :setting-config="settingConfig"
      :page-module-data="pageModuleData"
      @pageLoading="setPageLoding"
      @chartsMethods="elementMethods"
      @componentFunc="componentFunc"
    >
      <div
        v-for="item in slotName"
        :key="item"
        :slot="item"
        style="width: 100%; height: 100%"
      >
        <slot :name="item" />
      </div>
    </middleware>
    <!-- 地图组件 -->
    <!-- <myMap ref="myMaps"></myMap> -->
    <!-- 顶部栏组件 -->
    <top-bar
      v-if="topListShow"
      ref="topBar"
      :item-api-data="itemApiData"
      :top-bar-all="topBarAll"
      :setting-config="settingConfig"
      :data-view-list="dataViewList"
      @delete="topBarDelete"
      @update="topBarUpdate"
      @topBarClick="topBarClick"
      @interactive="topBarInteractiveIconClick"
    />
    <top-bar-setting
      ref="topBarSetting"
      :data-view-list="dataViewList"
      :item-api-data="itemApiData"
      :setting-config="settingConfig"
      @submit="topBarAdd"
    />
    <!-- 页面配置 -->
    <div v-if="settingConfig.systemPermissions === 'admin'" class="hoverMenu">
      <div class="box">
        <div class="top theme-bg-color">
          <i title="页面配置" class="iconfont iconkuangjiashezhi" />
        </div>
        <ul class="theme-box-shadow">
          <li
            v-if="settingConfig.isCustomMenu"
            @click="rightDrawerShow('menu')"
          >
            菜单
          </li>
          <li
            :class="{ 'theme-color': chooseType == 1 }"
            @click="rightDrawerShow('assembly')"
            @mouseout="chooseType = null"
            @mouseover="chooseType = 1"
          >
            页面
          </li>
          <li @click="rightDrawerShow('theme')">主题</li>
        </ul>
      </div>
    </div>
    <el-drawer
      :visible.sync="settingDrawer"
      :title="rightDrawerTypeTitle"
      :before-close="drawerClose"
      direction="rtl"
      class="pageSetting"
    >
      <!-- 菜单配置内容 -->
      <menu-setting
        v-if="rightDrawerType == 'menu'"
        :setting-config="settingConfig"
        @getMenuData="getMenuData"
      />
      <!-- 页面组件新增 -->
      <assembly
        v-if="rightDrawerType == 'assembly'"
        :assembly-data="assemblyData"
        @addAssembly="addAssembly"
      />
      <!-- 项目配置  主题配置 -->
      <project-config
        v-if="rightDrawerType == 'theme'"
        :now-project-config="nowProjectConfig"
        @projectConfigChange="projectConfigChange"
        @projectConfigSubmit="projectConfigSubmit"
      />
    </el-drawer>
    <!-- 类目轴配置 -->
    <axis-setting
      ref="AxisSetting"
      :axis-config="axisConfig"
      :setting-config="settingConfig"
      @axisConfigSubmit="categoryConfigSubmit"
    />
    <!-- 时间轴配置 -->
    <time-axis-setting
      ref="TimeAxisSetting"
      :time-config="timeConfig"
      :setting-config="settingConfig"
      @componentFunc="componentFunc"
    />
    <!-- 交互配置组件 -->
    <interactive-setting
      ref="InteractiveSetting"
      :interactive-module-all="interactiveModuleAll"
      :before-params-data="beforeParamsData"
      :interactive-data="interactiveData"
      @interactiveSubmit="interactiveDataEmit"
    />
    <!-- 类目轴 -->
    <axis
      v-for="item in axisSource"
      :key="item.moduleId"
      :setting-form="item.categoryConfig"
      :setting-config="settingConfig"
      :module-id="item.moduleId"
      @deleteCategory="deleteCategory"
      @axisClick="axisClick"
      @categoryConfigSubmit="categoryConfigSubmit"
      @interactive="categoryAxisInteractiveIconClick"
    />
    <!-- 时间轴 -->
    <time-axis
      v-for="(item, index) in timeSource"
      ref="timeAxis"
      :key="index"
      :setting-config="settingConfig"
      :setting-form="item.timeAxisConfig"
      :module-id="item.moduleId"
      @componentFunc="componentFunc"
    />
  </div>
</template>
<script>
import middleware from '../../tuobiao/middleware/index'
import assembly from './assembly'
import MenuSetting from '../../components/MenuSetting'
/* 顶部栏导入 */
import TopBar from '../../components/TopBar@2.0'
import TopBarSetting from '../../components/TopBarSetting'
import topBarMixins from './mixins/topBarMixins.js'
import myPageMixins from './mixins/myPageMixins.js'

import ProjectConfig from './ProjectConfig'
import interactiveMixins from './mixins/interactiveMixins'
/* 类目轴导入 */
import AxisSetting from '../../components/AxisSetting'
import Axis from '../../components/Axis'
import axisMixins from './mixins/axisMixins'
import timeAxisMixins from './mixins/timeAxisMixins'
import TimeAxisSetting from '../../components/TimeAxisSetting'
import TimeAxis from '../../components/TimeAxis'
// 交互配置组件
import InteractiveSetting from '../../components/InteractiveSetting'
import otherMixins from './mixins/otherMixins'
/* ====end==== */
// import myMap from '../../components/maps/map'
export default {
  components: {
    middleware,
    assembly,
    TopBar,
    TopBarSetting,
    MenuSetting,
    ProjectConfig,
    InteractiveSetting,
    AxisSetting,
    Axis,
    TimeAxisSetting,
    TimeAxis
    // myMap
  },
  mixins: [
    topBarMixins,
    myPageMixins,
    otherMixins,
    interactiveMixins,
    timeAxisMixins,
    axisMixins
  ],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    slotName: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: null
    },
    nowProjectConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageLoading: false,
      rightDrawerType: '',
      rightDrawerTypeTitle: '',
      nowMenuItem: {}, // 当前选中菜单配置信息
      settingDrawer: false, // 右侧抽屉显示隐藏控制
      chooseType: '',
      assemblyData: [
        {
          type: 'tableChart',
          name: '图表组件集',
          icon: 'icontubiao'
        },
        {
          type: 'topBar',
          name: '顶部栏组件',
          icon: 'icondingbulan'
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
        },
        {
          type: 'tabs',
          name: 'Tabs切换',
          icon: 'icondangan'
        }
      ]
    }
  },
  mounted() {
    const _this = this
    window.onresize = function() {
      _this.$refs['middleware'].resize()
    }
  },
  methods: {
    // 项目主体(主题)配置事件
    projectConfigChange(obj) {
      this.$emit('projectConfigChange', obj)
    },
    projectConfigSubmit(obj) {
      this.settingDrawer = false
      this.$emit('projectConfigSubmit', obj)
    },
    // 通过模块id改变模块渲染数据事件
    changePageData(moduleId, viewchange, wh) {
      this.$refs['middleware'].changePageData(moduleId, viewchange, wh)
    },
    // 图表模块显示隐藏控制事件
    modeuleShow(obj) {
      this.$refs['middleware'].modeuleShow(obj)
    },
    setPageLoding(offon) {
      // console.log(offon)
      this.pageLoading = offon
    },
    // 组件事件暴露
    elementMethods(reqObj) {
      this.$emit('elementMethods', reqObj)
      // 模块交互触发
      this.interactiveElementMethods(reqObj)
    },
    // 菜单点击事件
    menuClick(menuItem, menuTypes, fn) {
      this.nowMenuItem = menuItem
      this.$refs['middleware'].menuClick(menuItem, menuTypes, fn)
      this.getTopBarConfig()
      // 时间轴配置数据查询
      this.timeAxisSelect()
      // 类目轴配置数据查询
      this.categoryConfigSelect()

      sessionStorage.setItem('menuItem', JSON.stringify(menuItem))
    },
    // 内容区域宽高变化事件--菜单顶部宽度变化事件
    mainStyleChange() {
      this.$refs['middleware'].mainStyleChange()
      // this.$refs['myMaps'].resize()
    },
    // 菜单数据传递
    getMenuData(menuData) {
      this.$emit('getMenuData', menuData)
    },
    // 右侧抽屉显示事件
    rightDrawerShow(type) {
      this.rightDrawerType = type
      switch (type) {
        case 'menu':
          this.rightDrawerTypeTitle = '菜单配置'
          break
        case 'assembly':
          this.rightDrawerTypeTitle = '组件新增'
          break
        case 'theme':
          this.rightDrawerTypeTitle = '主题选择'
          break
      }
      console.log('123')
      this.settingDrawer = true
    },
    // 右侧抽屉关闭事件
    drawerClose() {
      this.settingDrawer = false
    },
    // 页面组件新增事件
    addAssembly(type) {
      this.parentContainerType = 'page'
      this.moduleAddClick(type)
      this.settingDrawer = false
    },
    // 模块新增执行
    moduleAddClick(type) {
      switch (type) {
        case 'tableChart': // 图表组件集
          this.$refs['middleware'].addTemplate()
          break
        case 'topBar': // 顶部栏组件
          this.$refs['topBarSetting'].show()
          break
        case 'tabs': // tabs切换
          this.$refs['middleware'].tabsSettingShow()
          break
        case 'axis': // 类目轴
          this.axisSettingShow()
          break
        case 'timeAxis': // 时间轴
          this.$refs['TimeAxisSetting'].show()
          break
      }
    }
  }

}
</script>
