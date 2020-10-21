export default {
  methods: {
    //单元格类名设置
    colClass(item) {
      let menuTapAll = this.settingForm.menuTapAll
      let colClass = ''
      //判断是为菜单跳转字段
      if (menuTapAll && menuTapAll.isMenuTap === '1') {
        if (item.key === menuTapAll.menuTapKey) {
          colClass = 'theme-color cursor-pointer'
        }
      }
      //判断当前字段是否已配置单元格下钻子页面
      if (
        this.statisticsAll.drillDownKeyAll &&
        this.statisticsAll.drillDownKeyAll.indexOf(item.key) > -1
      ) {
        colClass = 'theme-color cursor-pointer'
      }
      //判断是否已配置详情功能
      if (this.settingForm.isDestail === '1') {
        colClass = 'cursor-pointer'
      }
      //判断是否为行下钻
      if (
        this.settingForm.submodule === '1' &&
        this.settingForm.clickToShow === 'row'
      ) {
        colClass = 'cursor-pointer'
      }
      return colClass
    },
    //右侧其他按钮点击事件
    operateButtonClick(buttonSetting, rowItem) {
      // console.log('======')
      var event = window.event || arguments.callee.caller.arguments[0]
      if (
        buttonSetting.jsMethods &&
        buttonSetting.jsMethods.replace(/\s*/g, '') !== ''
      ) {
        let funcStr = buttonSetting.jsMethods
        let test = eval('(false || ' + funcStr + ')')
        // console.log('(false || ' + funcStr + ')')
        test(rowItem)
      }
      this.$emit('operateButtonClick', buttonSetting, rowItem)
      // console.log(event, 'event')
      event.stopPropagation()
      return false
    },
    // topTitle显示位置控制
    setPlacement(index, column) {
      let length = column.length
      if (index + 1 <= length / 2) {
        return 'top-start'
      } else {
        return 'top-end'
      }
    },
    // 单元格样式
    cellCursorClass(key) {
      let calss = 'cursor-default'
      if (this.settingForm.submodule === '1') {
        if (
          this.settingForm.clickToShow === 'row' &&
          this.statisticsAll.isRowDrillDown === '1'
        ) {
          calss = 'cursor-pointer'
        }
        if (
          this.settingForm.clickToShow === 'cell' &&
          this.statisticsAll.drillDownKeyAll &&
          this.statisticsAll.drillDownKeyAll.indexOf(key) > -1
        ) {
          calss = 'cursor-pointer'
        }
      }
      return calss
    },
    // 分页变化事件
    handleCurrentChange(currentPage) {
      this.paginationAll.currentPage = currentPage
      this.$emit('tablePageSort', this.paginationAll)
    },
    // 每页条数变化事件
    handleSizeChange(pageSize) {
      this.paginationAll.pageSize = pageSize
      this.$emit('tablePageSort', this.paginationAll)
    }
  }
}
