// 模块拉伸

// 阻止事件冒泡
const stopPropagation = event => {
  // 如果提供了事件对象，则这是一个非IE浏览器
  if (event && event.stopPropagation) {
    // 因此它支持W3C的stopPropagation()方法
    event.stopPropagation()
  } else {
    // 否则，我们需要使用IE的方式来取消事件冒泡
    window.event.cancelBubble = true
  }
}
// 阻止浏览器默认事件
const stopDefault = e => {
  // 阻止默认浏览器动作(W3C)
  if (e && e.preventDefault) e.preventDefault()
  // IE中阻止函数器默认动作的方式
  else window.event.returnValue = false
  return false
}

/**
 * 模块拉伸事件
 * event
 * position  拉伸点的位置  例[top,left]
 * settingForm  配置数据(包括width,height,top,left)
 * stretch  被拉伸元素
 * fatherClassName  相对定位父级元素
 * fnc  拖拽后回调事件
 * */

const stretch = ({
  event,
  position,
  settingForm,
  stretch,
  fatherElement,
  fnc, _this
}) => {
  stopPropagation(event)
  stopDefault(event)
  if (typeof stretch.setCapture !== 'undefined') {
    stretch.setCapture()
  }
  // 1 获取鼠标按下时的位置
  const diffX = event.clientX
  const diffY = event.clientY
  // 2 获取当前模块的宽高、位置
  console.log(111)
  const width = (settingForm.width * fatherElement.scrollWidth) / 100
  const height = (settingForm.height * fatherElement.scrollHeight) / 100
  const top = (settingForm.top * fatherElement.scrollHeight) / 100
  const left = (settingForm.left * fatherElement.scrollWidth) / 100
  // 2执行鼠标移动
  // const document = document.getElementsByTagName('body')[0]
  document.onmousemove = function(e) {
    // 2-1  获取鼠标移动的距离
    e = e || window.event
    const moveX = e.clientX - diffX
    const moveY = e.clientY - diffY
    let width_c = width
    let height_c = height
    let left_c = left
    let top_c = top
    // console.log(width_c) 我给自己留了200块噻
    // 限制条件  模块宽高均大于100

    if (position[0] === 'top') {
      height_c = height - moveY
      top_c = moveY + top
    }
    if (position[0] === 'bottom') {
      height_c = height + moveY
    }

    if (position[1] === 'left') {
      width_c = width - moveX
      left_c = left + moveX
    }
    if (position[1] === 'right') {
      width_c = width + moveX
    }
    _this.$nextTick(() => {
      // if (width_c > 100 && height_c > 100 && width_c <= (fatherElement.scrollWidth - left_c) && height_c <= fatherElement.scrollHeight - top_c && left_c >= 0 && top_c >= 0) {
      settingForm.width = (width_c / fatherElement.scrollWidth) * 100
      settingForm.height = (height_c / fatherElement.scrollHeight) * 100
      settingForm.left = (left_c / fatherElement.scrollWidth) * 100
      settingForm.top = (top_c / fatherElement.scrollHeight) * 100
      // }
    })
  }
  // 3 鼠标松开
  document.onmouseup = function() {
    // console.log('===============')
    this.onmousemove = null
    this.onmouseup = null
    // 修复低版本ie bug
    if (typeof stretch.releaseCapture !== 'undefined') {
      stretch.releaseCapture()
    }
    fnc()
  }
}

export default stretch
