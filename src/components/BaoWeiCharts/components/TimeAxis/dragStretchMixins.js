// let _this
export default {
  data() {
    return {
      cursor: 'defalut'
    }
  },
  methods: {
    // 模块拖拽事件e
    mousedown_tz(e) {
      const _this = this
      //  设置定时器，鼠标按下一秒后启动拖拽事件
      var timer = null
      var mousedownTzZx = null
      this.cursor = ''
      let offon = false
      clearTimeout(timer)
      // console.log(this.settingForm.isDrafting)
      timer = setTimeout(() => {
        // 权限控制
        if (_this.settingConfig.systemPermissions === 'admin') {
          mousedownTzZx(e)
          offon = true
        }
      }, 200)
      const drag = this.$refs['listWrap']
      mousedownTzZx = e => {
        const event = e || window.event // 兼容IE浏览器

        var diffX = event.clientX - drag.offsetLeft
        var diffY = event.clientY - drag.offsetTop
        const element = document.getElementsByClassName('my_main_content')[0]
        if (typeof drag.setCapture !== 'undefined') {
          drag.setCapture()
        }
        document.onmousemove = function(event) {
          // eslint-disable-next-line no-redeclare
          var event = event || window.event
          var moveX = event.clientX - diffX
          var moveY = event.clientY - diffY
          if (moveX <= 0) {
            moveX = 0
          } else if (moveX > element.scrollWidth - drag.offsetWidth) {
            moveX = element.scrollWidth - drag.offsetWidth
          }

          if (moveY <= 0) {
            moveY = 0
          } else if (moveY > element.scrollHeight - drag.offsetHeight) {
            moveY = element.scrollHeight - drag.offsetHeight
          }
          _this.settingForm.left = (moveX / element.scrollWidth) * 100
          _this.settingForm.top = (moveY / element.scrollHeight) * 100
        }
      }
      document.onmouseup = function() {
        this.onmousemove = null
        this.onmouseup = null
        clearTimeout(timer)
        // console.log(_this.cursor)
        if (offon && _this.settingConfig.systemPermissions === 'admin') {
          _this.TZLSKeep()
        }
        // 修复低版本ie bug
        if (typeof drag.releaseCapture !== 'undefined') {
          drag.releaseCapture()
        }
      }
    }
  }
}
