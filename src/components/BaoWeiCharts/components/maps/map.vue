<template>
  <div>
    <div id="map_wrap"
         :style="{'height':modelStyle.height+'px','width':modelStyle.width+'px','left':modelStyle.left+'px','top':modelStyle.top+'px','z-index':settingForm.zindex}"
         ref="statisticsWrap"
         v-if="mapIsShow">
      <div class="map_content">
        <!-- 国家简易行政区图组件 -->
        <map1 v-if="settingForm.myType=='XZQMap'"
              ref="XZQ_map"></map1>
        <span class="map_setting">
          <i @click="settingClick"
             title="设置"
             class="el-icon-setting"></i>
          <i title="拖拽"
             @mousedown="mousedown_tz"
             class="icontuozhuai iconfont"></i>
          <i title="缩放"
             @mousedown="mousedown_ls"
             class="iconfont iconkuozhan"></i>
        </span>
      </div>
    </div>
    <!-- 编辑模块 -->
    <edmit ref="edmit"
           :mapAll="mapAll"
           @submit="submit"
           :form="settingForm"></edmit>
  </div>
</template>
<script>
import './map.css'
import Map1 from './map1'
import Edmit from './find/edmit'
import { dragAndZoom } from '../../utils/mixins.js'
export default {
  components: { Map1, Edmit },
  mixins: [dragAndZoom],
  data () {
    return {
      mapIsShow: false,
      menuid: '',
      mapAll: {
        isShow: false
      },
      settingForm: {
        zoom: 12, // 地图缩放比例
        height: 24.55,
        width: 27.69,
        top: 32.02,
        left: 20.78,
        zindex: '8', // 模块z-index
        myType: 'XZQMap'
      }
    }
  },
  methods: {
    // 菜单点击事件
    menuClick (menuItem) {
      this.menuid = menuItem.menuid
      this.mapIsShow = false
      let mapsArr = sessionStorage.getItem('mapsArr')
      if (mapsArr && mapsArr.search(this.menuid) > -1) {
        this.mapIsShow = true
      }
    },
    // 初始菜单查询
    getMapsData () { },
    // 监听屏幕变化事件
    resize () {
      this.getMainStyle()
      this.setDemos()
    },
    // 设置图标点击事件
    settingClick () {
      this.mapAll.isShow = true
    },
    // 锚点新增
    addMarker (marker) {
      this.$refs['XZQ_map'].addMarker(marker)
    },
    // 地图模块新增事件
    addTemplate () {
      this.mapAll.isShow = true
    },

    // 地图配置数据保存事件
    submit () {
      this.mapIsShow = true
      let mapsArr = sessionStorage.getItem('mapsArr')

      if (!mapsArr) {
        sessionStorage.setItem('mapsArr', `[${this.menuid}]`)
      } else {
        let arr = JSON.parse(mapsArr)
        let offon = true
        arr.forEach((ids) => {
          if (ids === this.menuid) {
            offon = false
          }
        })
        if (offon) {
          arr.push(this.menuid)
        }
        sessionStorage.setItem('mapsArr', JSON.stringify(arr))
      }
    },
    // 拖拽、缩放后保存事件
    TZLSKeep () {
      // console.log(this.modelStyle)
    }
  },
  mounted () {
    // this.settingForm = this.mapAll.form;
  }
}
</script>
