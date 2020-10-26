export default {
  data() {
    return {}
  },
  mounted() {
    if (this.iframePositionAll) {
      this.setMapPosition()
    }
    this.$nextTick(() => {
      if (this.iframeAll.iframeUrl.indexOf('#') === 1) {
        document.getElementById(
          'iframe' + this.statisticsAll.moduleId
        ).contentWindow.location.href = this.iframeAll.iframeUrl
      }
    })
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
    // iframe id配置
    iframeId() {
      let ids = ''
      if (
        this.iframeAll.iframeId &&
        this.iframeAll.iframeId.replace(/\s*/g, '')
      ) {
        ids = this.iframeAll.iframeId
      } else {
        ids =
          this.iframeAll.iframeType === '0'
            ? 'ifrmmap'
            : 'iframe' + this.statisticsAll.moduleId
      }
      return ids
    },
    // iframe url配置
    iframeFormat() {
      let str = this.iframeAll.iframeUrl
      if (str.indexOf('${') !== -1) {
        this.recursion(this.iframeAll.iframeUrl, url => {
          str = url
        })
      }

      // console.log(this.iframeAll.iframeUrl)
      return str
    },
    // 递归循环修改src
    recursion(url, fn) {
      const num1 = url.indexOf('${') + 2
      const num2 = url.indexOf('}')

      const key = url.substring(num1, num2)
      const val = localStorage.getItem(key)
      url = url.substring(0, num1 - 2) + val + url.substring(num2 + 1)

      if (url.indexOf('${') !== -1) {
        this.recursion(url, fn)
      } else {
        fn(url)
      }
    },
    // 地图定位
    setMapPosition() {
      // console.log(this.iframePositionAll)
      // const area = this.iframePositionAll.area
      // const doc = document.getElementById('ifrmmap')
      // switch (this.iframePositionAll.mapPosition) {
      //   case '0': // 显示整个重庆地图(地图恢复到初始显示范围)
      //     doc.contentWindow.postMessage('SetInitExtent|', '*')
      //     break
      //   case '1': // 定位到区县
      //     doc.contentWindow.postMessage(`LocalQxbyname|${area}`, '*')
      //     break
      //   case '2': // 定位到开发区
      //     doc.contentWindow.postMessage(`LocalKFQBYName|${area}`, '*')
      //     break
      // }
    }
  }
}
