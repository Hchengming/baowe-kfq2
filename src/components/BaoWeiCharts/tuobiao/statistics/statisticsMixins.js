// 子页面配置
export const childMixins = {
  data() {
    return {
      nowRowId: '',
      nowCellKey: '',
      childSettingForm: {},
      settingForm: {},
      childAddType: '1' // 0：同级新增  1：子级新增
    }
  },
  watch: {
    'statisticsAll.contentAreaConfig'() {
      this.settingForm = JSON.parse(
        JSON.stringify(this.statisticsAll.contentAreaConfig)
      )
    },
    deep: true
  },
  mounted() {
    this.settingForm = JSON.parse(
      JSON.stringify(this.statisticsAll.contentAreaConfig)
    )
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
    // 详情表格组件--单元格点击事件
    destailTableCellClick(rowData, key) {
      this.$emit('componentFunc', {
        method: 'cellClick',
        name: '单元格点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll,
          key
        }
      })
    },
    // 表格行点击事件
    rowClick(rowData) {
      this.$emit('componentFunc', {
        method: 'rowClick',
        name: '行点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll
        }
      })
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
          this.$emit('componentFunc', {
            method: 'childInsertData',
            name: '子页面数据查询事件',
            param: {
              parentModuleId: this.statisticsAll.moduleId,
              childKV,
              subtitle1
            }
          })
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
      this.$emit('componentFunc', {
        method: 'cellClick',
        name: '单元格点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll,
          key
        }
      })
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
          const subtitle1 = rowData[this.settingForm.keyArr[0].key]
          // 下钻代入参数-值获取
          const childKV = this.getChildKeyValue(
            this.settingForm.keyArr,
            rowData
          )
          this.$emit('componentFunc', {
            method: 'childInsertData',
            name: '子页面数据查询事件',
            param: {
              parentModuleId: this.statisticsAll.moduleId,
              childKV,
              subtitle1,
              key
            }
          })
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
      this.$emit('componentFunc', {
        method: 'childSettingAdd',
        name: '子级表单新增事件',
        param: obj
      })
    },
    // 子元素同级新增按钮点击事件
    TJAdd() {
      this.$refs['childSettingForm'].show()
      this.childAddType = '0'
    },
    // 表格、列表右侧按钮点击事件
    operateButtonClick(buttonSetting, rowItem) {
      this.$emit('componentFunc', {
        method: 'whereSubmit',
        name: '筛选保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          buttonSetting,
          rowItem
        }
      })
      // this.$emit(
      //   'operateButtonClick',
      //   buttonSetting,
      //   rowItem,
      //   this.statisticsAll.moduleId
      // )
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
      datas.forEach(item => {
        if (item.defaultValue) {
          this.whereForm[item.key] = item.defaultValue
        }
      })
    },
    // 筛选保存事件
    whereSubmit(form) {
      this.$emit('componentFunc', {
        method: 'whereSubmit',
        name: '筛选保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          whereForm: form
        }
      })
    },
    // 查询模块其他按钮点击事件
    whereOtherBtnClick(item) {
      this.$emit('componentFunc', {
        method: 'whereOtherBtnClick',
        name: '查询模块其他按钮点击事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          otherItem: item
        }
      })
    },
    // 当前筛选数据缓存
    whereFormKeep(form) {
      this.whereForm = form
      this.$emit('componentFunc', {
        method: 'whereFormKeep',
        name: '当前筛选数据缓存',
        param: {
          moduleId: this.statisticsAll.moduleId,
          form
        }
      })
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
      this.$emit('componentFunc', {
        method: 'detailsAreaConfigEmit',
        name: '详情配置保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          detailsAreaConfig,
          fn
        }
      })
    },
    // 详情弹出显示事件
    destailShow(index) {
      // console.log(this.statisticsAll)
      this.$refs['destail'].show(index)
    }
  }
}
