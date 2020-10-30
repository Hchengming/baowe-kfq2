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
      @pageLoading="setPageLoding"
      @chartsMethods="elementMethods"
    />
    <!-- 地图组件 -->
    <!-- <myMap ref="myMaps"></myMap> -->
    <!-- 顶部栏组件 -->
    <top-bar
      v-if="topBarAll.data&&topBarAll.data.length>0"
      ref="topBar"
      :item-api-data="itemApiData"
      :top-bar-all="topBarAll"
      @delete="topBarDelete"
      @update="topBarUpdate"
      @topBarClick="topBarClick"
    />
    <top-bar-setting
      ref="topBarSetting"
      :item-api-data="itemApiData"
      @submit="topBarAdd"
    />
    <!-- 页面配置 -->
    <div v-if="settingConfig.systemPermissions==='admin'" class="hoverMenu">
      <div class="box">
        <div class="top theme-bg-color">
          <i
            title="页面配置"
            class="iconfont iconkuangjiashezhi"
          />
        </div>
        <ul class="theme-box-shadow">
          <li
            v-if="settingConfig.isCustomMenu"
            @click="rightDrawerShow('menu')"
          >菜单</li>
          <li
            :class="{ 'theme-color': chooseType == 1 }"
            @click="rightDrawerShow('assembly')"
            @mouseout="chooseType = null"
            @mouseover="chooseType = 1"
          >
            页面
          </li>
        </ul>
      </div>
    </div>
    <el-drawer
      :visible.sync="settingDrawer"
      :title="rightDrawerType == 'menu' ? '菜单配置' : '组件新增'"
      direction="rtl"
      :before-close="drawerClose"
      class="pageSetting"
    >
      <!-- 菜单配置内容 -->
      <menu-setting
        v-if="rightDrawerType=='menu'"
        :setting-config="settingConfig"
        @getMenuData="getMenuData"
      />
      <!-- 页面组件新增 -->
      <assembly
        v-if="rightDrawerType == 'assembly'"
        @addAssembly="addAssembly"
      />
    </el-drawer>
  </div>
</template>
<script>
import middleware from '../../tuobiao/middleware/index'
import assembly from './assembly'
import MenuSetting from '../../components/MenuSetting'
/* 顶部栏导入 */
import TopBar from '../../components/TopBar'
import TopBarSetting from '../../components/TopBarSetting'
import topBarMixins from './mixins/topBarMixins.js'
/* ====end==== */
// import myMap from '../../components/maps/map'
export default {
  components: {
    middleware,
    assembly,
    TopBar,
    TopBarSetting,
    MenuSetting
    // myMap
  },
  mixins: [topBarMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      pageLoading: false,
      rightDrawerType: '',
      nowMenuItem: {}, // 当前选中菜单配置信息
      settingDrawer: false, // 右侧抽屉显示隐藏控制
      chooseType: ''
    }
  },
  mounted() {
    const _this = this
    window.onresize = function() {
      _this.$refs['middleware'].resize()
    }
  },
  methods: {
     //图表渲染数据改变事件
    changeChartsData (fn) {
      this.$refs['middleware'].changeChartsData(fn)
    },
    setPageLoding(offon) {
      // console.log(offon)
      this.pageLoading = offon
    },
    // 组件事件暴露
    elementMethods(reqObj) {
      this.$emit('elementMethods', reqObj)
      // this.chartsMethods(reqObj)
    },
    // 菜单点击事件
    menuClick(menuItem, menuTypes, fn) {
      this.nowMenuItem = menuItem
      this.$refs['middleware'].menuClick(menuItem, menuTypes, fn)
      this.getTopBarConfig()
      // this.elementMethods({
      //   name: '菜单点击事件',
      //   methodsName: 'menuClick',
      //   menuItem
      // })
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
      this.settingDrawer = true
    },
    // 右侧抽屉关闭事件
    drawerClose() {
      this.settingDrawer = false
    },
    // 页面组件新增事件
    addAssembly(type) {
      switch (type) {
        case 'tableChart': // 图表组件集
          this.$refs['middleware'].addTemplate()
          break
        case 'topBar': // 顶部栏组件
          this.$refs['topBarSetting'].show()
          break
        // case 'map': //行政区图
        //   this.$refs['myMaps'].addTemplate()
        //   break
      }
      this.settingDrawer = false
    }
  }
}
</script>
