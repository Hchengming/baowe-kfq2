let _this
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      pageData: [],
      childPageData: [],
      browserXY: {
        width: window.innerWidth,
        height: window.innerHeight,
        mainWidth: null,
        mainHeight: null
      },

      childData: [] // 子级测试数据
    }
  },
  mounted() {
    _this = this
  },
  methods: {
    setOptions(options, chartType, data, moduleId) {
      this.chartsMethods({
        methodsName: 'setOptions',
        name: '图表配置外层定制化事件',
        options,
        chartType,
        data,
        moduleId
      })
    },
    // 监听屏幕变化事件
    resize() {
      _this.browserXY.width = window.innerWidth
      _this.browserXY.height = window.innerWidth
    },
    // 内容区域宽高变化事件
    mainStyleChange() {
      const element = document.getElementsByClassName('my_main_content')[0]
      this.browserXY.mainWidth = element.scrollWidth
    },
    // statistics组件--行数据点击事件
    rowClick(item, statisticsAll) {
      this.chartsMethods({
        methodsName: 'rowClick',
        rowItem: item,
        name: '行点击事件',
        statisticsAll,
        moduleId: statisticsAll.moduleId
      })
      // this.iframeMapChange(item, statisticsAll)
    },
    // 单元格点击事件
    cellClick(item, statisticsAll, key) {
      this.chartsMethods({
        methodsName: 'cellClick',
        rowItem: item,
        name: '单元格点击事件',
        statisticsAll,
        moduleId: statisticsAll.moduleId,
        key
      })
      this.iframeMapChange(item, statisticsAll)
    },
    // 行/单元格点击地图模块数据变化事件
    iframeMapChange(itemValue, statisticsAll) {
      let iframePositionVal = ''
      let mapKey = '' // 地图使用字段
      let offon = false
      // console.log(statisticsAll)
      if (statisticsAll.contentAreaConfig.isLinkMap === '1') {
        offon = true
        statisticsAll.contentAreaConfig.keyArr.forEach(item => {
          if (item.isMapKey) {
            mapKey = item.key
            iframePositionVal = itemValue[item.key]
          }
        })
      }
      // 添加开关 判断单元格点击字段是否为地图使用字段
      if (
        statisticsAll.contentAreaConfig.clickToShow === 'cell' &&
                statisticsAll.drillDownKeyCurrent !== mapKey
      ) {
        offon = false
      }
      if (offon) {
        // console.log(iframePositionVal, 'iframePositionVal')
        this.pageData.forEach(item => {
          if (item.contentAreaConfig.moduleType === '1') {
            this.$set(item, 'iframePositionAll', {
              mapPosition: statisticsAll.contentAreaConfig.mapPosition,
              area: iframePositionVal
            })
          }
        })
        // console.log(this.pageData)
      }
    },
    // statistics组件--模块修改保存事件
    updateMoule(contentAreaConfig, moduleId, fn, whereForm) {
      const reqData = {
        secondMasterPageConfigPOS: [{
          contentAreaConfig: contentAreaConfig,
          moduleId: moduleId
        }]
      }
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/updateSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '模块配置修改成功',
              type: 'success'
            })
            if (fn) {
              fn()
            }
            const obj = {}
            let newItem = {}
            this.pageData.forEach((item, index) => {
              if (item.moduleId === moduleId) {
                obj.index = index
                newItem = item
              }
            })
            obj.url = contentAreaConfig.url
            if (contentAreaConfig.isPage === '1') {
              obj.pageSize = contentAreaConfig.pageSize
              obj.currentPage = 1
            }
            if (contentAreaConfig.moduleType !== '1' && contentAreaConfig.moduleType !== '3') {
              this.getTableData(obj, whereForm, newItem)
            }
          } else {
            this.$message({
              message: '模块修改失败',
              type: 'error'
            })
          }
        })
    },
    // statistics组件--模块删除事件
    deleteMoule(moduleId, menuId, parentModuleId) {
      console.log('删除')
      let reqUrl
      if (menuId) {
        reqUrl = '/busSecondmasterpageconfig/deleteSecondMasterPageConfigData'
      } else {
        reqUrl = '/busSecondmasterpageconfig/deleteDrillDownData'
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + reqUrl, {
          moduleId,
          menuId,
          parentModuleId
        })
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '模块删除成功',
              type: 'success'
            })
            this.getData()
          }
        })
    },
    // 子页面新增事件
    childSettingAdd(obj) {
      // console.log(obj)
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/insertDrillDownData', {
            contentAreaConfig: obj.contentAreaConfig,
            parentModuleId: obj.moduleId,
            drillDownKeyCurrent: obj.key,
            menuId: this.menuId
          }
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '模块添加成功',
              type: 'success'
            })
            this.getData()
            // this.childInsertData(obj.moduleId, obj.rowid, '', obj.key)
            obj.fn()
          }
        })
    },
    // 子页面数据查询事件
    // 父级模块id 行数据id 副标题1 单元格点击选中格key值
    childInsertData(parentModuleId, childKV, subtitle1, key) {
      // console.log(parentModuleId, rowid, subtitle1, key)
      // 旧的二级数据删除
      // let pageDataClone = JSON.parse(JSON.stringify(this.pageData))
      const data = []
      let zfModuleId = ''
      this.pageData.forEach(item => {
        if (item.moduleId === parentModuleId) {
          zfModuleId = item.parentModuleId
        }
      })
      this.pageData.forEach(item => {
        if (!item.parentModuleId ||
                    item.parentModuleId === parentModuleId ||
                    item.moduleId === parentModuleId ||
                    item.parentModuleId === zfModuleId
        ) {
          data.push(item)
        }
      })
      this.pageData = data
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/queryDrillDownData', {
            parentModuleId,
            drillDownKeyCurrent: key
          }
        )
        .then(res => {
          const code = res.code
          const reqData = res.data
          if (code === 20000) {
            for (let i = this.pageData.length - 1; i >= 0; i--) {
              if (
                this.pageData[i].drillDownKeyCurrent &&
                                this.pageData[i].drillDownKeyCurrent !== key &&
                                this.pageData[i].parentModuleId === parentModuleId
              ) {
                this.pageData.splice(i, 1)
              }
            }

            reqData.forEach(items => {
              let offon = true
              this.itemGSH(items)
              items.contentAreaConfig.subtitle1 = subtitle1
              const reqObj = {
                url: items.contentAreaConfig.url
              }
              // 分页
              if (items.contentAreaConfig.isPage === '1') {
                reqObj.currentPage = 1
                reqObj.pageSize = items.contentAreaConfig.pageSize
                // items.paginationAll = {
                //   currentPage: 1, // 当前显示页数
                //   pageSize: items.contentAreaConfig.pageSize, // 每页数据条数
                //   total: null // 总数据量
                // }
              }
              this.pageData.forEach((item, index) => {
                if (item.moduleId === items.moduleId) {
                  item.contentAreaConfig = items.contentAreaConfig
                  item.conditionAreaConfig = items.conditionAreaConfig
                  reqObj.index = index
                  offon = false
                }
              })
              if (offon) {
                this.pageData.push(items)
                console.log(this.pageData)
                reqObj.index = this.pageData.length - 1
              }
              // 默认请求参数解析
              const defaultReqData = {}
              items.conditionAreaConfig.screenData.forEach(conditionObj => {
                if (conditionObj.defaultValue) {
                  defaultReqData[conditionObj.key] = conditionObj.defaultValue
                }
              })
              // 请求参数（关键字段-值）写入
              for (const key in childKV) {
                defaultReqData[key] = childKV[key]
              }

              // 判断下钻子级是否是iframe嵌入类型
              if (items.contentAreaConfig.moduleType !== '1' && items.contentAreaConfig.moduleType !== '3') {
                this.getTableData(reqObj, defaultReqData, items)
              }
            })
          }
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
          return false
        })
    },
    // 新增按钮点击事件
    addTemplate() {
      this.addSettingForm = JSON.parse(JSON.stringify(this.addSettingFormClone))
      this.$refs['settingForm'].show()
    },
    // 新增确认事件
    addKeep(contentAreaConfig) {
      // console.log(this.menuId)
      const reqData = {
        secondMasterPageConfigPOS: [{
          contentAreaConfig: contentAreaConfig,
          menuId: this.menuId
        }]
      }
      if (!this.menuId) {
        this.$message({
          message: '菜单id不能为空',
          type: 'error'
        })
      }
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/insertSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '模块添加成功',
              type: 'success'
            })
            this.$refs['settingForm'].close()
            this.getData()
          } else {
            this.$message({
              message: '模块添加失败',
              type: 'error'
            })
          }
        })
    },
    // statistics组件--筛选模块配置数据保存
    screenKeep(conditionAreaConfig, moduleId) {
      const reqData = {
        secondMasterPageConfigPOS: [{
          conditionAreaConfig: conditionAreaConfig,
          moduleId: moduleId
        }]
      }
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/updateSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '筛选配置数据添加成功',
              type: 'success'
            })
            // this.getData()
            this.pageData.forEach(item => {
              if (item.moduleId === moduleId) {
                item.conditionAreaConfig = conditionAreaConfig
              }
            })
          }
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
          return false
        })
    },
    // 列表数据筛选事件
    whereSubmit(moduleId, whereForm) {
      this.chartsMethods({
        moduleId: moduleId,
        name: '查询按钮点击事件',
        methodsName: 'whereSubmit',
        whereForm
      })
      const obj = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          obj.index = index
          obj.url = item.contentAreaConfig.url
          if (item.contentAreaConfig.isPage === '1') {
            obj.pageSize = item.contentAreaConfig.pageSize
            obj.currentPage = 1
          }
          this.getTableData(obj, whereForm, item)
        }
      })
    },
    // 详情配置保存事件
    detailsAreaConfigEmit(moduleId, detailsAreaConfig, fn) {
      // console.log(detailsAreaConfig)
      const reqData = {
        moduleId,
        detailsAreaConfig
      }
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busSecondmasterpageconfig/insertDetailsAreaConfig',
          reqData
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '详情配置数据添加成功',
              type: 'success'
            })
            this.pageData.forEach(item => {
              if (item.moduleId === moduleId) {
                item.detailsAreaConfig = detailsAreaConfig
              }
            })
            fn()
          }
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
          return false
        })
    },
    // 图表设置按钮点击事件
    settingClick(statisticsAll, fn) {
      let keyArr = []
      if (statisticsAll.parentModuleId) {
        this.pageData.forEach(item => {
          if (item.moduleId === statisticsAll.parentModuleId) {
            keyArr = item.contentAreaConfig.keyArr
          }
        })
      }
      fn(keyArr)
    }
  }
}
