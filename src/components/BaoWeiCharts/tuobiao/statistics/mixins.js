export const dataMixins = {
  data () {
    return {
      // 模块位置设置
      modelStyle: {
        width: 353,
        height: 230,
        top: 300,
        left: 10
      },
      // 模块修改表单设置
      settingForm: {},
      // 内容区域宽高
      mainStyle: {
        width: null,
        height: null,
        offsetTop: null,
        offsetLeft: null
      }
    }
  },
  mounted () {
    this.getMainStyle()
    this.getDemos()
  },
  methods: {
    // 内容区域宽高获取
    getMainStyle () {
      let element = document.getElementsByClassName('my_main_content')[0]
      this.mainStyle.width = element.scrollWidth
      this.mainStyle.height = element.scrollHeight
    },
    // 图表宽高设置
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
    },
    // 获取模块初始位置和宽高
    getDemos () {
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

        if (moveY < 8) {
          moveY = 8
        } else if (moveY > element.scrollHeight - drag.offsetHeight + 6) {
          moveY = element.scrollHeight - drag.offsetHeight + 6
        }

        _this.modelStyle.left = moveX
        _this.modelStyle.top = moveY

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
    },
    // 模块拖拽拉伸后保存事件
    TZLSKeep () {
      // this.$confirm('是否保存当前操作信息', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      // }).then(() => {

      // })
      this.$emit(
        'updateMoule',
        this.settingForm,
        this.statisticsAll.moduleId,
        () => {
          // this.$message({
          //     type: 'success',
          //     message: '模块布局保存成功!'
          // });
        }
      )
    }
  }
}

// 子页面配置
export const childMixins = {
  data () {
    return {
      nowRowId: '',
      nowCellKey: '',
      childSettingForm: {
        title: '开发区分类统计', // 标题
        subtitle1: '', // 副标题1
        subtitle2: '副标题2', // 副标题2
        url: '/api/kftjData', // 接口
        keyArr: [
          {
            key: 'title',
            explain: '类型',
            dw: '',
            relationKey: '',
            width: 180
          },
          {
            key: 'num',
            explain: '个数',
            dw: '个',
            relationKey: '',
            width: 100
          },
          {
            key: 'area',
            explain: '面积',
            dw: '公顷',
            relationKey: '',
            width: 120
          }
        ],
        height: 24.55,
        width: 27.69,
        top: 32.02,
        left: 0.78,
        zindex: '100', // 模块z-index
        displayMode: 'table', // 数据展现方式
        submodule: '1', // 是否含有子页面 1:有 0:没有
        clickToShow: 'row', // 子页面点击展现  row:行点击 cell:单元格点击
        isPage: '0', // 数据是否添加分页
        pageSize: 10, // 每页显示数据条数
        mask: '0' // 是否添加遮罩层  1:是 0:否
      },
      childAddType: '1' // 0：同级新增  1：子级新增
    }
  },
  methods: {
    // 表格行点击事件
    rowClick (rowData) {
      if (
        this.settingForm.submodule !== '1' ||
        this.settingForm.clickToShow !== 'row'
      ) {
        return
      }
      this.nowRowId = rowData.id
      this.nowCellKey = ''
      if (rowData.url) {
        window.open(rowData.url, '_blank')
      } else {
        let subtitle1 = rowData[this.settingForm.keyArr[0].key]
        if (this.statisticsAll.childModuleId) {
          this.$emit(
            'childInsertData',
            this.statisticsAll.moduleId,
            rowData.id,
            subtitle1
          )
          this.$emit('rowClick', rowData, this.statisticsAll)
        } else {
          if (this.isAdmin) {
            this.$refs['childSettingForm'].show()
          }
        }
      }
    },
    // 表格/列表单元格点击事件
    cellClick (rowData, key) {
      if (
        this.settingForm.submodule !== '1' ||
        this.settingForm.clickToShow !== 'cell'
      ) {
        return
      }
      this.nowRowId = rowData.id
      this.nowCellKey = key

      if (rowData[key + 'url']) {
        window.open(rowData[key + 'url'], '_blank')
      } else {
        if (
          this.statisticsAll.childModuleId &&
          this.statisticsAll.drillDownKeyAll &&
          this.statisticsAll.drillDownKeyAll.indexOf(key) > -1
        ) {
          this.$emit('cellClick', rowData, this.statisticsAll)
          let subtitle1 = rowData[this.settingForm.keyArr[0].key]
          this.$emit(
            'childInsertData',
            this.statisticsAll.moduleId,
            rowData.id,
            subtitle1,
            key
          )
        } else {
          if (this.isAdmin) {
            this.$refs['childSettingForm'].show()
            this.childAddType = '1'
          }
        }
      }
    },
    // 子级表单新增事件
    childSettingKeep (contentAreaConfig) {
      let obj
      if (this.childAddType === '1') {
        obj = {
          contentAreaConfig,
          moduleId: this.statisticsAll.moduleId,
          rowid: this.nowRowId,
          fn: () => {
            this.$refs['childSettingForm'].close()
          },
          key: this.nowCellKey
        }
      } else {
        obj = {
          contentAreaConfig,
          moduleId: this.statisticsAll.parentModuleId,
          rowid: '',
          key: this.statisticsAll.drillDownKeyCurrent,
          fn: () => {
            this.$refs['childSettingForm'].close()
          }
        }
      }
      this.$emit('childSettingAdd', obj)
    },
    // 子元素同级新增按钮点击事件
    TJAdd () {
      this.$refs['childSettingForm'].show()
      this.childAddType = '0'
    }
  }
}

// 筛选模块数据配置
export const screenMixins = {
  data () {
    return {
      whereOffon: false,
      conditionAreaConfig: [] // 后台返回筛选配置数据
    }
  },
  methods: {
    // 筛选模块配置图标点击事件
    screenSetting () {
      this.$refs['screenSetting'].show(
        this.statisticsAll.conditionAreaConfig,
        this.whereOffon
      )
    },
    // 筛选模块配置数据保存事件
    screenKeep (conditionAreaConfig) {
      this.$emit('screenKeep', conditionAreaConfig, this.statisticsAll.moduleId)
    },
    // 筛选模块显示事件
    filterShow () {
      this.whereOffon = !this.whereOffon
      this.$refs['where'].show(
        this.statisticsAll.conditionAreaConfig,
        this.whereOffon
      )
    },
    // 内容部分点击事件
    statisticsContentClick () {
      this.whereOffon = false
      this.$refs['where'].show(
        this.statisticsAll.conditionAreaConfig,
        this.whereOffon
      )
    },
    // 筛选下拉框保存事件
    whereSubmit () {
      this.whereOffon = false
      // console.log(form)
    }
  }
}
