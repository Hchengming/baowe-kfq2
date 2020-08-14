// 拖拽缩放
// DragAndZoom
export const dragAndZoom = {
  data () {
    return {
      // 模块样式设置
      modelStyle: {
        width: 353,
        height: 230,
        top: 300,
        left: 10
      },
      // 内容区域宽高
      mainStyle: {
        width: null,
        height: null,
        offsetTop: null,
        offsetLeft: null
      }
    }
  },
  methods: {
    // 内容区域宽高获取
    getMainStyle () {
      let element = document.getElementsByClassName('my_main_content')[0]
      this.mainStyle.width = element.scrollWidth
      this.mainStyle.height = element.scrollHeight
    },
    // 模块宽高设置
    setDemos () {
      this.modelStyle.height = parseFloat(
        (this.settingForm.height * this.mainStyle.height) / 100
      )
      this.modelStyle.width = parseFloat(
        (this.settingForm.width * this.mainStyle.width) / 100
      )
      this.modelStyle.top = parseFloat(
        (this.settingForm.top * this.mainStyle.height) / 100
      )
      this.modelStyle.left = parseFloat(
        (this.settingForm.left * this.mainStyle.width) / 100
      )
      // console.log(this.modelStyle)
    },
    // 模块初始位置和宽高
    getDemos () {
      this.getMainStyle()
      this.settingForm.height =
        (this.modelStyle.height / this.mainStyle.height) * 100
      this.settingForm.width =
        (this.modelStyle.width / this.mainStyle.width) * 100
      this.settingForm.top = (this.modelStyle.top / this.mainStyle.height) * 100
      this.settingForm.left =
        (this.modelStyle.left / this.mainStyle.width) * 100
    },
    // 模块拖拽事件e
    mousedown_tz (e) {
      let event = e || window.event // 兼容IE浏览器
      let drag = this.$refs.statisticsWrap
      var diffX = event.clientX - drag.offsetLeft
      var diffY = event.clientY - drag.offsetTop
      let _this = this
      let element = document.getElementsByClassName('my_main_content')[0]
      if (typeof drag.setCapture !== 'undefined') {
        drag.setCapture()
      }
      document.onmousemove = function (event) {
        // eslint-disable-next-line no-redeclare
        var event = event || window.event
        var moveX = event.clientX - diffX
        var moveY = event.clientY - diffY
        if (moveX < 8) {
          moveX = 8
        } else if (moveX > element.scrollWidth - drag.offsetWidth + 6) {
          moveX = element.scrollWidth - drag.offsetWidth + 6
        }
        // console.log(moveY, _this.mainStyle.hieght, drag.offsetHeight)
        if (moveY < 8) {
          moveY = 8
        } else if (moveY > element.scrollHeight - drag.offsetHeight + 6) {
          moveY = element.scrollHeight - drag.offsetHeight + 6
        }

        _this.modelStyle.left = moveX
        _this.modelStyle.top = moveY
        // console.log(moveX,moveY,_this.modelStyle.left,_this.modelStyle.top)
        _this.getDemos()
      }
      document.onmouseup = function () {
        this.onmousemove = null
        this.onmouseup = null
        // 修复低版本ie bug
        if (typeof drag.releaseCapture !== 'undefined') {
          drag.releaseCapture()
        }
        _this.TZLSKeep()
      }
    },
    // 模块拉伸事件
    mousedown_ls (event) {
      // let event = e || windeow.event;  //兼容IE浏览器
      let drag = this.$refs.statisticsWrap
      var diffX = event.clientX
      var diffY = event.clientY
      let _this = this
      if (typeof drag.setCapture !== 'undefined') {
        drag.setCapture()
      }
      let width = _this.modelStyle.width
      let height = _this.modelStyle.height
      document.onmousemove = function (event) {
        // eslint-disable-next-line no-redeclare
        var event = event || window.event
        var moveX = event.clientX - diffX
        var moveY = event.clientY - diffY
        _this.modelStyle.width = width + moveX
        _this.modelStyle.height = height + moveY
        _this.getDemos()
      }
      document.onmouseup = function () {
        this.onmousemove = null
        this.onmouseup = null
        // 修复低版本ie bug
        if (typeof drag.releaseCapture !== 'undefined') {
          drag.releaseCapture()
        }
        _this.TZLSKeep()
      }
    }
  }
}
