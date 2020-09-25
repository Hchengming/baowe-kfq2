export default {
  data() {
    return {}
  },
  mounted() {
    if (this.iframePositionAll) {
      this.setMapPosition()
    }
  },
  watch: {
    iframePositionAll: {
      handler(val) {
        if (val) {
          this.setMapPosition()
        }
      },
      deep: true
    }
  },
  methods: {
    //地图定位
    setMapPosition() {
      // console.log(this.iframePositionAll)
      let area = this.iframePositionAll.area
      let doc = document.getElementById('ifrmmap')
      switch (this.iframePositionAll.mapPosition) {
        case '0': //显示整个重庆地图(地图恢复到初始显示范围)
        doc.contentWindow.postMessage("SetInitExtent|", '*');
        break
        case '1': //定位到区县
          doc.contentWindow.postMessage(`LocalQxbyname|${area}`, '*')
          break
        case '2': //定位到开发区
          doc.contentWindow.postMessage(`LocalKFQBYName|${area}`, '*')
          break
      }
    }
  }
}
