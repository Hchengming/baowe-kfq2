/**
 * dialog拖拽功能
 */

export const dragDialog = {
  methods: {
    // 弹出框拖拽事件
    dragElement(e) {
      const eventF = e || window.event // 兼容IE浏览器
      var diffX = eventF.clientX
      var diffY = eventF.clientY
      const settingFormStyle = this.$refs[this.dialogRef].$el.style
      const settingFormStyleCopy = JSON.parse(JSON.stringify(settingFormStyle))
      const top = this.numberStr(settingFormStyleCopy.top)
      const left = this.numberStr(settingFormStyleCopy.left)
      let timer = null
      clearTimeout(timer)
      settingFormStyle.cursor = 'default'
      timer = setTimeout(() => {
        document.onmousemove = function(event) {
          var moveX = event.clientX - diffX + left
          var moveY = event.clientY - diffY + top
          settingFormStyle.top = moveY + 'px'
          settingFormStyle.left = moveX + 'px'
          settingFormStyle.cursor = 'move'
        }
      }, 500)

      document.onmouseup = function() {
        this.onmousemove = null
        this.onmouseup = null
        settingFormStyle.cursor = 'default'
        clearTimeout(timer)
      }
    },
    // 字符串转数组
    numberStr(val) {
      let num = 0
      if (val) {
        num = Number(val.replace('px', ''))
      }
      return num
    }
  }
}

// 递归方法封装
export const commonMethods = {
  methods: {
    // 递归排序    data:递归数组  childName:子数组字段名 fn:应用方法   Hierarchy:当前数据位于数组的层级
    recursion(data, childName, fn, Hierarchy) {
      Hierarchy = Hierarchy ? Hierarchy + 1 : 1
      data.forEach(item => {
        item.hierarchy = Hierarchy
        if (
          item &&
          item[childName] !== undefined &&
          item[childName].length > 0
        ) {
          this.recursion(item[childName], childName, fn, Hierarchy)
        }
        fn(item)
      })
    }
  }
}

