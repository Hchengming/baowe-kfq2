/**
 * dialog拖拽功能
 */

export const dragDialog = {
  methods: {
    // 弹出框拖拽事件
    dragElement (e) {
      let eventF = e || window.event // 兼容IE浏览器
      var diffX = eventF.clientX
      var diffY = eventF.clientY
      const settingFormStyle = this.$refs[this.dialogRef].$el.style
      const settingFormStyleCopy = JSON.parse(JSON.stringify(settingFormStyle))
      const top = this.numberStr(settingFormStyleCopy.top)
      const left = this.numberStr(settingFormStyleCopy.left)
      let timer
      clearTimeout(timer)
      settingFormStyle.cursor = 'default'
      timer = setTimeout(() => {
        document.onmousemove = function (event) {
          var moveX = event.clientX - diffX + left
          var moveY = event.clientY - diffY + top
          settingFormStyle.top = moveY + 'px'
          settingFormStyle.left = moveX + 'px'
          settingFormStyle.cursor = 'move'
        }
      }, 500)

      document.onmouseup = function () {
        this.onmousemove = null
        this.onmouseup = null
        settingFormStyle.cursor = 'default'
        clearTimeout(timer)
      }
    },
    // 字符串转数组
    numberStr (val) {
      let num = 0
      if (val) {
        num = Number(val.replace('px', ''))
      }
      return num
    }
  }
}
