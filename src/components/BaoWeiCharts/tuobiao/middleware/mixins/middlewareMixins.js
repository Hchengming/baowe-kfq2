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
      parentContainerType: 'page', // 父级容器类型 page:页面  container 容器组件
      parentModuleId: '', // 当前新增模块父级容器id
      parentTabsCode: '', // 父级选项卡编码
      childData: [] // 子级测试数据
    }
  },
  mounted() {
    _this = this
  },
  methods: {
    // iframe组件显示隐藏控制
    iframeHideShow(reqObj, items, item) {
      // console.log(reqObj, items, item, 'iframe组件显示隐藏控制')
      let nowItem = null
      this.pageData.forEach(x => {
        if (x.moduleId === item.moduleId) {
          if (item.hideShow) {
            nowItem = x
            x.isShow = item.hideShow === '1'
          }
        }
      })
      // iframe组件地图交互
      if (item.mapKey) {
        setTimeout(() => {
          const iframeId =
nowItem.contentAreaConfig.iframeAll.iframeId || 'ifrmmap'
          const doc = document.getElementById(iframeId)
          doc.contentWindow.postMessage(
            `${item.mapKey}|${reqObj.rowItem[items.paramsChoose]}`,
            '*'
          )
        }, 1200)
      }

      // console.log(reqObj, items, item, '000')
      // console.log(iframeId)
    },
    // 组件数据加载完成后执行事件
    dataLoadingFnc(componenInfo, reqData) {
      const fnc = componenInfo.contentAreaConfig.jsMethods
      if (fnc && fnc.replace(/\s*/g, '')) {
        try {
          // eslint-disable-next-line no-eval
          const test = eval('(false || ' + fnc + ')')
          test({
            componenInfo: componenInfo,
            reqData,
            _this: this
          })
        } catch (e) {
          this.$message({
            type: 'error',
            message: '组件数据加载完成后执行脚本问题：' + e
          })
        }
      }
    },
    // 返回数据格式化
    formattingDataJsFnc(componenInfo, resData, reqData) {
      const fnc = componenInfo.contentAreaConfig.formattingDataJs
      if (fnc && fnc.replace(/\s*/g, '')) {
        try {
          // eslint-disable-next-line no-eval
          const test = eval('(false || ' + fnc + ')')
          // const data = JSON.parse(JSON.stringify(resData))
          return test({ resData, reqData })
          // console.log(resData, '222')
        } catch (e) {
          this.$message({
            type: 'error',
            message: '组件数据格式化执行脚本问题：' + e
          })
        }
      } else {
        return resData
      }
    },
    setOptions(param) {
      const obj = {
        methodsName: 'setOptions',
        name: '图表配置外层定制化事件'
      }
      // param
      this.chartsMethods(Object.assign(obj, param))
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
    rowClick(param) {
      // console.log(param, 'rowClick')
      this.chartsMethods({
        methodsName: 'rowClick',
        rowItem: param.rowItem,
        name: '行点击事件',
        statisticsAll: param.statisticsAll,
        moduleId: param.statisticsAll.moduleId
      })
      // this.iframeMapChange(item, statisticsAll)
    },
    // 单元格点击事件
    cellClick(param) {
      this.chartsMethods({
        methodsName: 'cellClick',
        rowItem: param.rowItem,
        name: '单元格点击事件',
        statisticsAll: param.statisticsAll,
        moduleId: param.statisticsAll.moduleId,
        // whereForm: param.whereForm,
        key: param.key
      })
      this.iframeMapChange(param.rowItem, param.statisticsAll)
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
    // 旧的筛选数据删除事件
    oldConditionAreaConfigUpdate(filterConfig, moduleId) {
      if (filterConfig.screenData.length === 0) {
        this.screenKeep({}, moduleId)
      }
    },
    // statistics组件--模块修改保存事件
    updateMoule(param) {
      // contentAreaConfig, moduleId, fn, whereForm
      // 大数据编排项目修改
      //
      if (this.settingConfig.isBigData) {
        this.$emit('chartsMethods', {
          methodsName: 'updateChartList',
          name: '图表组件配置修改事件',
          param: param
        })
        return false
      }

      const reqData = {
        secondMasterPageConfigPOS: [
          {
            contentAreaConfig: param.contentAreaConfig,
            moduleId: param.moduleId
          }
        ]
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
            if (param.fn) {
              param.fn()
            }

            const obj = {}
            let newItem = {}
            this.pageData.forEach((item, index) => {
              if (item.moduleId === param.moduleId) {
                obj.index = index
                newItem = item
              }
            })
            obj.url = param.contentAreaConfig.url
            if (param.contentAreaConfig.isPage === '1') {
              obj.pageSize = param.contentAreaConfig.pageSize
              obj.currentPage = 1
            }

            if (
              param.contentAreaConfig.moduleType !== '1' &&
              param.contentAreaConfig.moduleType !== '3'
            ) {
              this.getTableData(obj, param.whereForm, newItem)
            }
            if (param) return
            this.pageModuleData.pageData.forEach(x => {
              if (x.moduleId === param.moduleId) {
                x.contentAreaConfig = param.contentAreaConfig
              }
            })
          } else {
            this.$message({
              message: '模块修改失败',
              type: 'error'
            })
          }
        })
    },
    // statistics组件--模块删除事件
    deleteMoule(param) {
      let reqUrl = ''
      // if (param.menuId) {
      reqUrl = '/busSecondmasterpageconfig/deleteSecondMasterPageConfigData'
      // } else {
      //   reqUrl = '/busSecondmasterpageconfig/deleteDrillDownData'
      // }
      serviceAxios
        .post(this.settingConfig.commonUrl + reqUrl, param)
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '模块删除成功',
              type: 'success'
            })
            // if (this.settingConfig.isBigData) {
            //   this.setBigData()
            // } else {
            this.getData()
            // }
          }
        })
    },
    // 子页面新增事件
    childSettingAdd(obj) {
      // console.log(obj)
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/insertDrillDownData',
          {
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
            obj.fn()
          }
        })
    },
    // 子页面数据查询事件
    // 父级模块id 行数据id 副标题1 单元格点击选中格key值
    childInsertData({ parentModuleId, childKV, subtitle1, key }) {
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
        if (
          !item.parentModuleId ||
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
            '/busSecondmasterpageconfig/queryDrillDownData',
          {
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
                // console.log(this.pageData)
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
              if (
                items.contentAreaConfig.moduleType !== '1' &&
                items.contentAreaConfig.moduleType !== '3'
              ) {
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
    addTemplate(obj) {
      this.addSettingForm = JSON.parse(JSON.stringify(this.addSettingFormClone))
      if (obj) {
        this.parentContainerType = 'container'
        this.parentModuleId = obj.moduleId
        this.parentTabsCode = obj.tabsCode
      } else {
        this.parentContainerType = 'page'
      }
      this.$refs['settingForm'].show()
    },
    // 新增确认事件
    addKeep(param) {
      const menuId = param.menuId ? param.menuId : this.menuId
      if (this.parentContainerType === 'container') {
        param.contentAreaConfig.parentModuleId = this.parentModuleId
        if (this.parentTabsCode) {
          param.contentAreaConfig.parentTabsCode = this.parentTabsCode
        }
      }
      const reqData = {
        secondMasterPageConfigPOS: [
          {
            contentAreaConfig: param.contentAreaConfig,
            projectId: this.settingConfig.answerId,
            menuId: menuId
          }
        ]
      }
      if (!menuId) {
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
        secondMasterPageConfigPOS: [
          {
            conditionAreaConfig: conditionAreaConfig,
            moduleId: moduleId
          }
        ]
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
    whereSubmit(param) {
      this.chartsMethods({
        moduleId: param.moduleId,
        name: '查询按钮点击事件',
        methodsName: 'whereSubmit',
        whereForm: param.whereForm
      })
      const obj = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === param.moduleId) {
          obj.index = index
          obj.url = item.contentAreaConfig.url
          if (item.contentAreaConfig.isPage === '1') {
            obj.pageSize = item.contentAreaConfig.pageSize
            obj.currentPage = 1
          }
          item.whereForm = JSON.parse(JSON.stringify(param.whereForm))
          this.getTableData(obj, param.whereForm, item)
        }
      })
    },
    // 详情配置保存事件
    detailsAreaConfigEmit(param) {
      // moduleId, detailsAreaConfig, fn
      // console.log(detailsAreaConfig)
      const reqData = {
        moduleId: param.moduleId,
        detailsAreaConfig: param.detailsAreaConfig
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
              if (item.moduleId === param.moduleId) {
                item.detailsAreaConfig = param.detailsAreaConfig
              }
            })
            param.fn()
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
    settingClick(param) {
      let keyArr = []
      if (param.statisticsAll.parentModuleId) {
        this.pageData.forEach(item => {
          if (item.moduleId === param.statisticsAll.parentModuleId) {
            keyArr = item.contentAreaConfig.keyArr
          }
        })
      }
      param.fn(keyArr)
    }
  }
}
