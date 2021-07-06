export default {
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500, 1000]
    }
  },
  methods: {
    // 单元格鼠标移入状态设置
    cellCursor(key) {
      const arr = []
      let cursor = 'default'
      this.settingForm.keyArr.forEach(item => {
        if (item.isClick === '1') {
          arr.push(item.key)
        }
      })
      if (arr.length > 0 && arr.indexOf(key) > -1) {
        cursor = 'pointer'
      }
      return cursor
    },
    // 单元格显示数据
    cellHtml(colums, rowData) {
      return this.jsMethodsFuc(colums, rowData, 'cellRenderer')
    },
    // 单元格提示信息配置
    cellTip(colums, rowData) {
      return this.jsMethodsFuc(colums, rowData, 'tipRenderer')
    },
    // 单元格配置js脚本运行公共方法
    jsMethodsFuc(colums, rowData, keys) {
      let docHtml = ''
      if (colums[keys]) {
        // eslint-disable-next-line no-eval
        const fnc = eval(`(false || ${colums[keys]})`)
        docHtml = fnc(colums, rowData)
      } else {
        docHtml = rowData[colums.key]
      }
      if (typeof docHtml === 'number') {
        docHtml = docHtml.toString()
      }
      return docHtml
    },
    // 单元格类名设置
    colClass(item) {
      const menuTapAll = this.settingForm.menuTapAll
      let colClass = ''
      // 判断是为菜单跳转字段
      if (menuTapAll && menuTapAll.isMenuTap === '1') {
        if (item.key === menuTapAll.menuTapKey) {
          colClass = 'theme-color cursor-pointer'
        }
      }
      // 判断当前字段是否已配置单元格下钻子页面
      // if (
      //   this.statisticsAll.drillDownKeyAll &&
      //           this.statisticsAll.drillDownKeyAll.indexOf(item.key) > -1
      // ) {
      //   colClass = 'theme-color cursor-pointer'
      // }
      // 判断是否已配置详情功能
      // if (this.settingForm.isDestail === '1') {
      //   colClass = 'cursor-pointer'
      // }
      // // 判断是否为行下钻
      // if (
      //   this.settingForm.submodule === '1' &&
      //           this.settingForm.clickToShow === 'row'
      // ) {
      //   colClass = 'cursor-pointer'
      // }
      if (item.isClick === '1') {
        colClass = 'theme-color cursor-pointer'
      }
      return colClass
    },

    // topTitle显示位置控制
    setPlacement(data) {
      let index = 0
      const length = this.colums.length
      this.colums.forEach((item, num) => {
        if (item.key === data.key) {
          index = num
        }
      })
      if (index + 1 <= length / 2) {
        return 'top-start'
      } else {
        return 'top-end'
      }
    },
    // 单元格样式
    cellCursorClass(key) {
      let calss = ''
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
