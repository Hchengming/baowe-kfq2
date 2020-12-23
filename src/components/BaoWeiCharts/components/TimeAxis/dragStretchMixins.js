// let _this
export default {
    data() {
        return {
            // 模块位置设置
            modelStyle: {
                top: 300,
                left: 10,
                zindex: 0
            },
            // 模块修改表单设置
            settingForm: {},
            // 内容区域宽高
            mainStyle: {
              width: null,
              height: null,
              offsetTop: null,
              offsetLeft: null
            },
            cursor: 'defalut'
        }
    },
    mounted() {
      this.getMainStyle()
      this.settingForm = JSON.parse(
        JSON.stringify(this.configInfo)
      )
      this.setDemos()
      this.setyear()
    },
    methods: {
      // 内容区域宽高获取
      getMainStyle() {
        const element = document.getElementsByClassName('my_main_content')[0]
        this.mainStyle.width = element.scrollWidth
        this.mainStyle.height = element.scrollHeight
      },
      // 图表宽高设置
      setDemos() {
        this.modelStyle.top = parseFloat(
          (this.settingForm.top * this.mainStyle.height) / 100
        )

        this.modelStyle.left = parseFloat(
          (this.settingForm.left * this.mainStyle.width) / 100
        )
        this.modelStyle.zindex = this.settingForm.zindex
        },
      // 获取模块初始位置和宽高
      getDemos() {
        this.settingForm.top = (this.modelStyle.top / this.mainStyle.height) * 100
        this.settingForm.left = (this.modelStyle.left / this.mainStyle.width) * 100
      },
      setyear(){
        let start = parseInt(this.settingForm.start);
        let end = parseInt(this.settingForm.end);
        this.listData = []
        for(let i=start;i<=end;i++) {
          this.listData.push({
            time:i.toString()
          })
        }
      },
      // 模块拖拽事件e
      mousedown_tz(e) {
        const _this = this
        //  设置定时器，鼠标按下一秒后启动拖拽事件
        var timer = null
        var mousedownTzZx = null
        this.cursor = ''
        clearTimeout(timer)
        // console.log(this.settingForm.isDrafting)
        timer = setTimeout(() => {
          // 权限控制
          if (this.settingForm.isDrafting === true) {
            mousedownTzZx(e)
            this.cursor = 'move'
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
            // console.log('onmousemove')
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

            _this.modelStyle.left = moveX
            _this.modelStyle.top = moveY

            _this.getDemos()
          }
        }
        document.onmouseup = function() {
          this.onmousemove = null
          this.onmouseup = null
          clearTimeout(timer)
          // console.log('onmouseup')
          if (_this.cursor === 'move' && _this.isAdmin) {
            _this.TZLSKeep()
          }
          _this.cursor = ''
          // 修复低版本ie bug
          if (typeof drag.releaseCapture !== 'undefined') {
            drag.releaseCapture()
          }
        }
      },
      TZLSKeep() {

      }
    }
}
