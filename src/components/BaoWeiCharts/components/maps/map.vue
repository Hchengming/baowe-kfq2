<template>
  <div>
    <div
      v-if="mapIsShow"
      id="map_wrap"
      ref="statisticsWrap"
      :style="{'height':modelStyle.height+'px','width':modelStyle.width+'px','left':modelStyle.left+'px','top':modelStyle.top+'px','z-index':settingForm.zindex}"
    >
      <div class="map_content">
        <!-- 国家简易行政区图组件 -->
        <map1
          v-if="settingForm.myType=='XZQMap'"
          ref="XZQ_map"
        />
        <span class="map_setting">
          <i
            title="设置"
            class="el-icon-setting"
            @click="settingClick"
          />
          <i
            title="拖拽"
            class="icontuozhuai iconfont"
            @mousedown="mousedown_tz"
          />
          <i
            title="缩放"
            class="iconfont iconkuozhan"
            @mousedown="mousedown_ls"
          />
        </span>
      </div>
    </div>
    <!-- 编辑模块 -->
    <edmit
      ref="edmit"
      :map-all="mapAll"
      :form="settingForm"
      @submit="submit"
    />
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
  data() {
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
  mounted() {
    // this.settingForm = this.mapAll.form;
  },
  methods: {
    // 菜单点击事件
    menuClick(menuItem) {
      this.menuid = menuItem.menuid
      this.mapIsShow = false
      const mapsArr = sessionStorage.getItem('mapsArr')
      if (mapsArr && mapsArr.search(this.menuid) > -1) {
        this.mapIsShow = true
      }
    },
    // 初始菜单查询
    getMapsData() { },
    // 监听屏幕变化事件
    resize() {
      this.getMainStyle()
      this.setDemos()
    },
    // 设置图标点击事件
    settingClick() {
      this.mapAll.isShow = true
    },
    // 锚点新增
    addMarker(marker) {
      this.$refs['XZQ_map'].addMarker(marker)
    },
    // 地图模块新增事件
    addTemplate() {
      this.mapAll.isShow = true
    },

    // 地图配置数据保存事件
    submit() {
      this.mapIsShow = true
      const mapsArr = sessionStorage.getItem('mapsArr')

      if (!mapsArr) {
        sessionStorage.setItem('mapsArr', `[${this.menuid}]`)
      } else {
        const arr = JSON.parse(mapsArr)
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
    TZLSKeep() {
      // console.log(this.modelStyle)
    }
  }
}
</script>
