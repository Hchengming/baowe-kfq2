// let _this
export const dataMixins = {
  data() {
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
      // 拖拽图标样式设置
      // TZStyle: {},
      // 内容区域宽高
      mainStyle: {
        width: null,
        height: null,
        offsetTop: null,
        offsetLeft: null
      },
      cursor: 'defalut'
      // shubiaoMove: '' // 鼠标拖拽状态样式
    }
  },
  mounted() {
    // _this = this
    this.getMainStyle()
    this.getDemos()
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
      // this.modelStyle.height = this.settingForm.height
      if (this.settingForm.height <= 100) {
        this.modelStyle.height = parseFloat(
          (this.settingForm.height * this.mainStyle.height) / 100
        )
      } else {
        this.modelStyle.height = this.settingForm.height
      }

      this.modelStyle.width = parseFloat(
        (this.settingForm.width * this.mainStyle.width) / 100
      )
      if (this.settingForm.height <= 100) {
        this.modelStyle.top = parseFloat(
          (this.settingForm.top * this.mainStyle.height) / 100
        )
      } else {
        this.modelStyle.top = this.settingForm.top
      }

      this.modelStyle.left = parseFloat(
        (this.settingForm.left * this.mainStyle.width) / 100
      )
    },
    // 获取模块初始位置和宽高
    getDemos() {
      if (this.modelStyle.height / this.mainStyle.height <= 100) {
        this.settingForm.height =
          (this.modelStyle.height / this.mainStyle.height) * 100
      } else {
        this.settingForm.height = this.modelStyle.height
      }
      this.settingForm.width =
        (this.modelStyle.width / this.mainStyle.width) * 100

      if (this.modelStyle.height / this.mainStyle.height <= 100) {
        this.settingForm.top =
          (this.modelStyle.top / this.mainStyle.height) * 100
      } else {
        this.settingForm.top = this.modelStyle.top
      }
      console.log(this.modelStyle.height, this.settingForm.top)
      this.settingForm.left =
        (this.modelStyle.left / this.mainStyle.width) * 100
    },
    // 拖拽图标显示、样式控制
    // setTZStyle (display, left, top) {
    //   this.TZStyle = {
    //     display: display,
    //     left: left + 'px',
    //     top: top + 'px'
    //   }
    // },
    // 模块拖拽事件e
    mousedown_tz(e) {
      // console.log('mousedown')
      const _this = this
      //  设置定时器，鼠标按下一秒后启动拖拽事件
      var timer = null
      var mousedownTzZx = null
      this.cursor = ''
      clearTimeout(timer)
      timer = setTimeout(() => {
        // 权限控制
        if (this.isAdmin) {
          mousedownTzZx(e)
          this.cursor = 'move'
        }
      }, 200)
      const drag = this.$refs['statisticsWrap']
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
        if (_this.cursor === 'move') {
          _this.TZLSKeep()
        }
        _this.cursor = ''
        // 修复低版本ie bug
        if (typeof drag.releaseCapture !== 'undefined') {
          drag.releaseCapture()
        }
      }
    },
    // 左侧缩放
    mousedown_left_ls(e) {
      this.mousedown_ls(e, 'left')
    },
    // 右侧缩放
    mousedown_right_ls(e) {
      this.mousedown_ls(e, 'right')
    },
    // 模块拉伸事件
    mousedown_ls(event, type) {
      // console.log('mousedown')
      const _this = this
      this.stopPropagation(event)
      this.stopDefault(event)
      // let event = e || windeow.event;  //兼容IE浏览器
      const drag = this.$refs['statisticsWrap']
      const diffX = event.clientX
      const diffY = event.clientY

      if (typeof drag.setCapture !== 'undefined') {
        drag.setCapture()
      }
      const modelStyleClone = JSON.parse(JSON.stringify(_this.modelStyle))
      const width = modelStyleClone.width
      const height = modelStyleClone.height
      const left = modelStyleClone.left
      document.onmousemove = function(event) {
        // eslint-disable-next-line no-redeclare
        var event = event || window.event
        const moveX = event.clientX - diffX
        const moveY = event.clientY - diffY
        if (type === 'left') {
          _this.modelStyle.width = width - moveX
          _this.modelStyle.left = left + moveX
        } else {
          _this.modelStyle.width = width + moveX
        }
        _this.modelStyle.height = height + moveY
        _this.getDemos()
      }
      document.onmouseup = function() {
        this.onmousemove = null
        this.onmouseup = null
        // 修复低版本ie bug
        if (typeof drag.releaseCapture !== 'undefined') {
          drag.releaseCapture()
        }
        _this.TZLSKeep()
      }
    },
    // 阻止事件冒泡
    stopPropagation(event) {
      // 如果提供了事件对象，则这是一个非IE浏览器
      if (event && event.stopPropagation) {
        // 因此它支持W3C的stopPropagation()方法
        event.stopPropagation()
      } else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true
      }
    },
    // 阻止浏览器默认事件
    stopDefault(e) {
      // 阻止默认浏览器动作(W3C)
      if (e && e.preventDefault) e.preventDefault()
      // IE中阻止函数器默认动作的方式
      else window.event.returnValue = false
      return false
    },
    // 模块拖拽拉伸后保存事件
    TZLSKeep() {
      this.$emit(
        'updateMoule',
        this.settingForm,
        this.statisticsAll.moduleId,
        () => {
          // this.$message({
          //     type: 'success',
          //     message: '模块布局保存成功!'
          // });
        },
        this.whereForm
      )
    }
  }
}

// 子页面配置
export const childMixins = {
  data() {
    return {
      nowRowId: '',
      nowCellKey: '',
      childSettingForm: {},
      // childSettingForm: {
      //   title: '', // 标题
      //   subtitle1: '', // 副标题1
      //   subtitle2: '', // 副标题2
      //   moduleType: '0',//模块内容  0:图表 1:iframe地图 2:详情表格展示
      //   url: '', // 接口
      //   keyArr: [],
      //   height: 300,
      //   width: 27.69,
      //   top: 32.02,
      //   left: 0.78,
      //   defaultParameters: '', // 接口默认参数
      //   zindex: '100', // 模块z-index
      //   displayMode: 'table', // 数据展现方式
      //   submodule: '1', // 是否含有子页面 1:有 0:没有
      //   clickToShow: 'row', // 子页面点击展现  row:行点击 cell:单元格点击
      //   isPage: '0', // 数据是否添加分页
      //   pageSize: 10, // 每页显示数据条数
      //   mask: '0', // 是否添加遮罩层  1:是 0:否
      //   isDestail: '0' // 是否添加详情弹窗
      // },
      childAddType: '1' // 0：同级新增  1：子级新增
    }
  },
  mounted() {
    this.childSettingForm = JSON.parse(JSON.stringify(this.addSettingForm))
  },
  methods: {
    // 详情自定义配置页面点击弹出事件
    destailDialogShow(rowData, key, index) {
      // 操作模块点击排除
      if (key === 'operationButton') return

      if (
        this.settingForm.submodule === '0' &&
        this.settingForm.isDestail === '1'
      ) {
        // 点击弹出详情

        if (this.statisticsAll.detailsAreaConfig) {
          if (!this.nowDetailsAreaConfig.detailType) {
            this.nowDetailsAreaConfig = this.statisticsAll.detailsAreaConfig
          }
          if (this.nowDetailsAreaConfig.detailType === '1') {
            window.open(
              this.nowDetailsAreaConfig.commonApi +
                rowData[this.nowDetailsAreaConfig.destailsUrlKey],
              '_blank'
            )
          } else {
            this.destailShow(index)
          }
        } else {
          this.destailSettingShow()
        }
      }
    },
    // 表格行点击事件
    rowClick(rowData) {
      this.$emit('rowClick', rowData, this.statisticsAll)

      if (
        this.settingForm.clickToShow !== 'row' ||
        this.settingForm.submodule === '0'
      ) { return }

      // 行下钻
      this.nowCellKey = ''
      if (rowData.url) {
        window.open(rowData.url, '_blank')
      } else {
        const subtitle1 = rowData[this.settingForm.keyArr[0].key]
        // 下钻代入参数-值获取
        const childKV = this.getChildKeyValue(this.settingForm.keyArr, rowData)
        if (this.statisticsAll.isRowDrillDown === '1') {
          this.$emit(
            'childInsertData',
            this.statisticsAll.moduleId,
            childKV,
            subtitle1
          )
        } else {
          if (this.isAdmin) {
            this.getParentWhereFormUse()
            this.$refs['childSettingForm'].show({
              rowData,
              keyArr: this.settingForm.keyArr,
              parentParamsData: this.getParentWhereFormUse()
            })
            this.childAddType = '1'
          }
        }
      }

      // this.nowRowId = rowData.id
    },
    // 表格/列表单元格点击事件
    cellClick(rowData, key, rowIndex) {
      // 详情页面点击弹出事件
      this.destailDialogShow(rowData, key, rowIndex)
      this.$emit('cellClick', rowData, this.statisticsAll, key)
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
          this.statisticsAll.drillDownKeyAll &&
          this.statisticsAll.drillDownKeyAll.indexOf(key) > -1
        ) {
          // this.$emit('cellClick', rowData, this.statisticsAll)
          const subtitle1 = rowData[this.settingForm.keyArr[0].key]
          // 下钻代入参数-值获取
          const childKV = this.getChildKeyValue(
            this.settingForm.keyArr,
            rowData
          )
          this.$emit(
            'childInsertData',
            this.statisticsAll.moduleId,
            childKV,
            subtitle1,
            key
          )
        } else {
          if (this.isAdmin) {
            this.getParentWhereFormUse()
            this.$refs['childSettingForm'].show({
              rowData,
              keyArr: this.settingForm.keyArr,
              parentParamsData: this.getParentWhereFormUse()
            })
            this.childAddType = '1'
          }
        }
      }
    },
    // 父级筛选条件可传入子级条件筛选
    getParentWhereFormUse() {
      const arr = []
      if (
        this.statisticsAll.conditionAreaConfig &&
        this.statisticsAll.conditionAreaConfig.screenData
      ) {
        this.statisticsAll.conditionAreaConfig.screenData.forEach(item => {
          if (item.sfxjcx === '1') {
            let nowDataType = ''
            switch (item.type) {
              case 'number':
                nowDataType = 'number'
                break
              case 'checkbox':
                nowDataType = 'object'
                break
              default:
                nowDataType = 'string'
            }
            arr.push({
              paramKey: item.key,
              description: item.label,
              paramValue: this.whereForm[item.key],
              dataType: nowDataType,
              isUse: true
            })
          }
        })
      }
      return arr
    },
    // 下钻代入参数-值获取  下钻父级查询模块代入子级参数-值获取
    getChildKeyValue(keyArr, rowData) {
      const obj = {}
      keyArr.forEach(item => {
        if (item.isCruxKey) {
          obj[item.key] = rowData[item.key]
        }
      })
      // 下钻父级查询模块代入子级参数-值获取
      const conditionAreaConfig = this.statisticsAll.conditionAreaConfig
      const whereForms = this.$refs['where'].whereAll.form
      if (
        conditionAreaConfig &&
        conditionAreaConfig.screenData &&
        conditionAreaConfig.screenData.length > 0
      ) {
        conditionAreaConfig.screenData.forEach(item => {
          if (item.sfxjcx === '1') {
            obj[item.key] = whereForms[item.key]
          }
        })
      }
      return obj
    },
    // 子级表单新增事件
    childSettingKeep(contentAreaConfig) {
      let obj
      if (this.childAddType === '1') {
        obj = {
          contentAreaConfig,
          moduleId: this.statisticsAll.moduleId,
          // rowid: this.nowRowId,
          fn: () => {
            this.$refs['childSettingForm'].close()
          },
          key: this.nowCellKey
        }
      } else {
        obj = {
          contentAreaConfig,
          moduleId: this.statisticsAll.parentModuleId,
          // rowid: '',
          key: this.statisticsAll.drillDownKeyCurrent,
          fn: () => {
            this.$refs['childSettingForm'].close()
          }
        }
      }
      this.$emit('childSettingAdd', obj)
    },
    // 子元素同级新增按钮点击事件
    TJAdd() {
      this.$refs['childSettingForm'].show()
      this.childAddType = '0'
    },
    // 表格、列表右侧按钮点击事件
    operateButtonClick(buttonSetting, rowItem) {
      this.$emit(
        'operateButtonClick',
        buttonSetting,
        rowItem,
        this.statisticsAll.moduleId
      )
    }
  }
}

// 筛选模块数据配置
export const screenMixins = {
  data() {
    return {
      whereOffon: false,
      conditionAreaConfig: {}, // 后台返回筛选配置数据
      whereForm: {}
    }
  },
  mounted() {
    this.setWhereForm(this.statisticsAll.conditionAreaConfig)
  },
  methods: {
    // 筛选数据获取
    setWhereForm(conditionAreaConfig) {
      // console.log(conditionAreaConfig)
      if (conditionAreaConfig && conditionAreaConfig.screenData) {
        conditionAreaConfig.screenData.forEach(item => {
          if (item.defaultValue) {
            this.whereForm[item.key] = item.defaultValue
          }
        })
      }
    },
    // 筛选模块配置图标点击事件
    screenSetting() {
      // const defaultParameters = this.statisticsAll.contentAreaConfig.defaultParameters.replace(
      //   /\s*/g,
      //   ''
      // )
      // if (defaultParameters) {
      //   const obj = JSON.parse(defaultParameters)
      //   if (
      //     !this.statisticsAll.conditionAreaConfig ||
      //     !this.statisticsAll.conditionAreaConfig.screenData ||
      //     this.statisticsAll.conditionAreaConfig.screenData.length === 0
      //   ) {
      //     this.statisticsAll.conditionAreaConfig.screenData = []
      //     for (let key in obj) {
      //       this.statisticsAll.conditionAreaConfig.screenData.push({
      //         key: key,
      //         defaultValue: obj[key],
      //         sfxjcx: '0',
      //         type: ''
      //       })
      //     }
      //   }
      // }
      this.$refs['screenSetting'].show(
        this.statisticsAll.conditionAreaConfig,
        true
      )
    },
    // 筛选模块配置数据保存事件
    screenKeep(conditionAreaConfig) {
      this.setWhereForm(conditionAreaConfig)
      this.$emit('screenKeep', conditionAreaConfig, this.statisticsAll.moduleId)
    },
    // 筛选模块显示事件
    // filterShow () {
    //   this.whereOffon = !this.whereOffon
    //   this.$refs['where'].show(
    //     this.statisticsAll.conditionAreaConfig,
    //     this.whereOffon
    //   )
    // },
    // 内容部分点击事件
    // statisticsContentClick () {
    //   this.whereOffon = false
    //   this.$refs['where'].show(
    //     this.statisticsAll.conditionAreaConfig,
    //     this.whereOffon
    //   )
    // },
    // 筛选保存事件
    whereSubmit(form) {
      // this.whereOffon = false
      for (const key in form) {
        this.whereForm[key] = form[key]
      }
      this.$emit('whereSubmit', this.statisticsAll.moduleId, form)
    },
    // 查询模块其他按钮点击事件
    whereOtherBtnClick(item) {
      this.$emit('whereOtherBtnClick', item, this.statisticsAll.moduleId)
    }
  }
}

// 详情配置、显示模块配置
export const destailMixins = {
  data() {
    return {
      nowDetailsAreaConfig: {} // 当前详情配置数据
    }
  },
  methods: {
    // 详情配置组件显示事件
    destailSettingShow() {
      this.$refs.destailSetting.show(
        this.statisticsAll.data,
        this.settingForm.keyArr,
        this.statisticsAll.detailsAreaConfig
      )
    },
    // 详情配置保存事件
    destailSettingSubmit(detailsAreaConfig, fn) {
      this.nowDetailsAreaConfig = detailsAreaConfig
      this.$emit(
        'detailsAreaConfigEmit',
        this.statisticsAll.moduleId,
        detailsAreaConfig,
        fn
      )
    },
    // 详情弹出显示事件
    destailShow(index) {
      // console.log(this.statisticsAll)
      this.$refs['destail'].show(index)
    }
  }
}
