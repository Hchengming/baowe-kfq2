/**
 * 模块拖拽事件
 * e
 * settingForm  配置数据(包括top,left)
 * drap  被拖拽元素
 * fatherElement  相对定位父级元素
 * fnc  拖拽后回调事件
 * */
const drag = ({ e, settingForm, drag, fatherElement, fnc }) => {
  //  设置定时器，鼠标按下一秒后启动拖拽事件
  var timer = null
  var mousedownTzZx = null
  let offon = false
  clearTimeout(timer)
  timer = setTimeout(() => {
    // 权限控制
    mousedownTzZx(e)
    offon = true
  }, 200)
  // const drag = this.$refs[wrapRefs]
  mousedownTzZx = e => {
    const event = e || window.event // 兼容IE浏览器

    var diffX = event.clientX - drag.offsetLeft
    var diffY = event.clientY - drag.offsetTop
    // const fatherElement =
    if (typeof drag.setCapture !== 'undefined') {
      drag.setCapture()
    }
    document.onmousemove = function(event) {
      // eslint-disable-next-line no-redeclare
      var event = event || window.event
      var moveX = event.clientX - diffX
      var moveY = event.clientY - diffY
      // if (moveX <= 0) {
      //   moveX = 0
      // } else if (moveX > fatherElement.scrollWidth - drag.offsetWidth) {
      //   moveX = fatherElement.scrollWidth - drag.offsetWidth
      // }

      // if (moveY <= 0) {
      //   moveY = 0
      // } else if (moveY > fatherElement.scrollHeight - drag.offsetHeight) {
      //   moveY = fatherElement.scrollHeight - drag.offsetHeight
      // }
      if (moveX > 0 && moveX < fatherElement.scrollWidth - drag.scrollWidth) {
        settingForm.left = (moveX / fatherElement.scrollWidth) * 100
      }
      if (moveY > 0 && moveY < fatherElement.scrollHeight - drag.scrollHeight) {
        settingForm.top = (moveY / fatherElement.scrollHeight) * 100
      }
    }
  }
  document.onmouseup = function() {
    this.onmousemove = null
    this.onmouseup = null
    clearTimeout(timer)
    // console.log(_this.cursor)
    if (offon) {
      fnc()
    }
    // 修复低版本ie bug
    if (typeof drag.releaseCapture !== 'undefined') {
      drag.releaseCapture()
    }
  }
}

export default drag
