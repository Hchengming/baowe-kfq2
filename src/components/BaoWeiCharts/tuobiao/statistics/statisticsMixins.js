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
      // 01-自定义筛选项
      let datas = []
      if (conditionAreaConfig.screenData && conditionAreaConfig.screenData.length > 0) {
        datas = datas.concat(conditionAreaConfig.screenData)
      }
      // 02-通用配置项
      if (conditionAreaConfig.commonFilterData && conditionAreaConfig.commonFilterData.length > 0) {
        datas = datas.concat(conditionAreaConfig.commonFilterData)
      }
      datas.forEach(item => {
        if (item.defaultValue) {
          this.whereForm[item.key] = item.defaultValue
        }
      })
    },
    // 筛选模块配置图标点击事件
    screenSetting() {
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
