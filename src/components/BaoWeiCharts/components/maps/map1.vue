<template>
  <!-- 国家简易行政区图 -->
  <div id="container" />
</template>

<script>
import './map.css'
let _this
export default {
  props: [],
  data() {
    return {
      adCode: 500000,
      depth: 2,
      map: {}
    }
  },
  mounted() {
    _this = this
    // eslint-disable-next-line no-undef
    this.map = new AMap.Map('container', {
      zoom: 8,
      center: [107.458122, 29.96256],
      pitch: 0,
      viewMode: '3D'
    })

    // 创建省份图层
    // var disProvince;
    // 颜色辅助方法

    this.initPro(this.adCode, this.depth)
    // this.addMarker();
  },
  methods: {
    // 区县配置
    initPro(code, dep) {
      dep = typeof dep === 'undefined' ? 2 : dep
      this.adCode = code
      this.depth = dep
      let disProvince = null
      disProvince && disProvince.setMap(null)

      // eslint-disable-next-line no-undef
      disProvince = new AMap.DistrictLayer.Province({
        zIndex: 12,
        zoom: 12,
        adcode: [code],
        depth: dep,
        styles: {
          fill: function(properties) {
            return _this.getColorByAdcode(properties.adcode)
          },
          'province-stroke': 'cornflowerblue',
          'city-stroke': 'white', // 中国地级市边界
          'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
        }
      })

      disProvince.setMap(this.map)
    },
    // 区县颜色配置
    getColorByAdcode(adcode) {
      var colors = {}
      if (!colors[adcode]) {
        var gb = Math.random() * 155 + 50
        colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)'
      }

      return colors[adcode]
    },
    // 锚点添加
    addMarker(markerArr) {
      this.map.clearMap()
      // 点标记显示内容，HTML要素字符串
      // eslint-disable-next-line no-unused-vars
      let marker
      markerArr.forEach((item) => {
        // eslint-disable-next-line no-undef
        const marker = new AMap.Marker({
          icon:
            '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
          position: item.position,
          // eslint-disable-next-line no-undef
          offset: new AMap.Pixel(-13, -30),
          title: item.title
        })

        this.map.add(marker)
      })
    }
  }
}
</script>
