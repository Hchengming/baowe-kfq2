export default {
  data() {
    return {
      iframeStyle: {},
      offon: true, // iframe渲染开关
      src: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.iframeAll.iframeUrl.indexOf('#') === 1) {
        document.getElementById(
          'iframe' + this.statisticsAll.moduleId
        ).contentWindow.location.href = this.iframeAll.iframeUrl
      }
    })
    this.iframeInit()
    this.src = this.iframeFormat()
  },
  watch: {
    // iframe路径变化监听
    'settingForm.iframeAll.iframeUrl': {
      handler() {
        this.iframeInit()
      },
      deep: true
    }
  },
  methods: {
    //
    iframeInit() {
      if (this.settingForm.iframeAll && this.offon) {
        this.offon = false
        const doc = document.getElementById(this.iframeId())
        console.log('doc', doc)
        if (doc) {
          doc.src = ''
          const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
          const isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
          if (isFF) {
            doc.src = this.iframeFormat()
            setTimeout(() => {
              this.offon = true
              doc.contentWindow.location = this.iframeFormat()
            }, 1000)
          } else {
            this.offon = true
            doc.src = this.iframeFormat()
            doc.contentWindow.location = this.iframeFormat()
          }
        }
      }
      // 数据编排项目地图初始化
      if (
        this.settingForm.iframeAll &&
        this.settingForm.iframeAll.iframeType === '0' &&
        this.settingConfig.isBigData
      ) {
        // const doc = document.getElementById(this.iframeId())
        // const options = {
        //   id: 'qwe123'
        // }
        // doc.contentWindow.postMessage(
        //   `showFeatureLayer|http://portal.xxzx.com/arcgis/rest/services/Hosted/result999/featureserver/0|${JSON.stringify(
        //     options
        //   )}`,
        //   '*'
        // )

        this.$emit('componentFunc', {
          method: 'bigDataMapInit',
          name: '大数据编排地图初始化事件',
          param: {
            id: this.iframeId(),
            iframeAll: this.settingForm.iframeAll
          }
        })
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
    }
  }
}
