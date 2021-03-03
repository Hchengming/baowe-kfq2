export default {
  data() {
    return {
      iframeStyle: {}

    }
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
      // this.setIframeStyle()
      // console.log(this.settingForm.width * element.scrollWidth / 100)
      // {'height':600+'px','width':300+'px'}
    })
    this.bigDataInit()
  },
  watch: {
    iframePositionAll: {
      handler(val) {
        if (val) {
          this.setMapPosition()
        }
      },
      deep: true
    },
    // iframe路径变化监听
    'settingForm.iframeAll.iframeUrl': {
      handler() {
        this.bigDataInit()
      },
      deep: true
    }
  },
  methods: {
    // 数据编排项目地图初始化
    bigDataInit() {
      if (
        this.settingForm.iframeAll &&
        this.settingForm.iframeAll.iframeType === 0 &&
        this.settingConfig.isBigData
      ) {
        const doc = document.getElementById(this.iframeId())
        const options = {
          id: 'qwe123'
        }
        doc.contentWindow.postMessage(
          `showFeatureLayer|http://portal.xxzx.com/arcgis/rest/services/Hosted/result999/featureserver/0|${JSON.stringify(
            options
          )}`,
          '*'
        )
      }
    },
    // iframe样式设置
    // setIframeStyle() {
    //   const element = this.containerElelemt
    //     ? this.containerElelemt
    //     : document.getElementsByClassName('my_main_content')[0]
    //   this.iframeStyle = {
    //     height: this.height + 'px',
    //     width: this.settingForm.width * element.scrollWidth / 100 + 'px'
    //   }
    // },
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
      // 大数据编排特殊情况处理(有初始路径)
      if (this.settingConfig.isBigData) {
        if (!this.iframeAll.iframeUrl.replace(/\s*/g, '')) {
          str = this.settingConfig.bigData.iframeDefaultUrl
        }
      }
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
