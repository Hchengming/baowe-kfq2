import axios from 'axios'
let _this
export default {
  data () {
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
  mounted () {
    _this = this
  },
  methods: {
    // 监听屏幕变化事件
    resize () {
      _this.browserXY.width = window.innerWidth
      _this.browserXY.height = window.innerWidth
    },
    // 内容区域宽高变化事件
    mainStyleChange () {
      let element = document.getElementsByClassName('my_main_content')[0]
      this.browserXY.mainWidth = element.scrollWidth
    },
    // statistics组件--行数据点击事件
    rowClick (item) {
      this.$emit('rowClick', item)
    },
    // statistics组件--模块修改保存事件
    updateMoule (contentAreaConfig, moduleId, fn, whereForm) {
      const reqData = {
        secondMasterPageConfigPOS: [
          {
            contentAreaConfig: contentAreaConfig,
            moduleId: moduleId
          }
        ]
      }
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/updateSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          let code = res.data.code
          if (code === 20000) {
            this.$message({
              message: '模块配置修改成功',
              type: 'success'
            })
            if (fn) {
              fn()
            }
            let obj = {}
            this.pageData.forEach((item, index) => {
              if (item.moduleId === moduleId) {
                obj.index = index
              }
            })
            obj.url = contentAreaConfig.url
            if (contentAreaConfig.isPage === '1') {
              obj.pageSize = contentAreaConfig.pageSize
              obj.currentPage = 1
            }
            this.getTableData(obj, whereForm)
          } else {
            this.$message({
              message: '模块修改失败',
              type: 'error'
            })
          }
        })
    },
    // statistics组件--模块删除事件
    deleteMoule (moduleId, menuId) {
      let reqUrl
      if (menuId) {
        reqUrl = '/busSecondmasterpageconfig/deleteSecondMasterPageConfigData'
      } else {
        reqUrl = '/busSecondmasterpageconfig/deleteDrillDownData'
      }
      axios
        .post(this.settingConfig.commonUrl + reqUrl, { moduleId })
        .then(res => {
          let code = res.data.code
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
    childSettingAdd (obj) {
      // console.log(obj)
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/insertDrillDownData',
          {
            contentAreaConfig: obj.contentAreaConfig,
            parentModuleId: obj.moduleId,
            drillDownKeyCurrent: obj.key
          }
        )
        .then(res => {
          let code = res.data.code
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
    childInsertData (parentModuleId, childKV, subtitle1, key) {
      // console.log(parentModuleId, rowid, subtitle1, key)

      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/queryDrillDownData',
          {
            parentModuleId,
            drillDownKeyCurrent: key
          }
        )
        .then(res => {
          let code = res.data.code
          let reqData = res.data.data

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
              let reqObj = {
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
                reqObj.index = this.pageData.length - 1
              }
              // 默认请求参数解析
              let defaultReqData = {}
              items.conditionAreaConfig.screenData.forEach(conditionObj => {
                if (conditionObj.defaultValue) {
                  defaultReqData[conditionObj.key] = conditionObj.defaultValue
                }
              })
              // 请求参数（关键字段-值）写入
              for (let key in childKV) {
                defaultReqData[key] = childKV[key]
              }

              setTimeout(() => {
                this.getTableData(reqObj, defaultReqData)
              }, 100)
            })
          }
        })
        .catch(msg => {
          console.log(msg)
        })
    },
    // 新增按钮点击事件
    addTemplate () {
      this.$refs['settingForm'].show()
    },
    // 新增确认事件
    addKeep (contentAreaConfig) {
      const reqData = {
        secondMasterPageConfigPOS: [
          {
            contentAreaConfig: contentAreaConfig,
            menuId: this.menuId
          }
        ]
      }
      if (!this.menuId) {
        this.$message({
          message: '菜单id不能为空',
          type: 'error'
        })
      }
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/insertSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          let code = res.data.code
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
    screenKeep (conditionAreaConfig, moduleId) {
      const reqData = {
        secondMasterPageConfigPOS: [
          {
            conditionAreaConfig: conditionAreaConfig,
            moduleId: moduleId
          }
        ]
      }
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/updateSecondMasterPageConfigData',
          reqData
        )
        .then(res => {
          let code = res.data.code
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
          console.log(msg)
        })
    },
    // 列表数据筛选事件
    whereSubmit (moduleId, whereForm) {
      const obj = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          obj.index = index
          obj.url = item.contentAreaConfig.url
          if (item.contentAreaConfig.isPage === '1') {
            obj.pageSize = item.contentAreaConfig.pageSize
            obj.currentPage = 1
          }
          // obj.keys = []
          // item.contentAreaConfig.keyArr.forEach(obj => {
          //   obj.keys.push(obj.key)
          // })
          this.getTableData(obj, whereForm)
        }
      })
    },
    // 详情配置保存事件
    detailsAreaConfigEmit (moduleId, detailsAreaConfig, fn) {
      // console.log(detailsAreaConfig)
      const reqData = {
        moduleId,
        detailsAreaConfig
      }
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/insertDetailsAreaConfig',
          reqData
        )
        .then(res => {
          let code = res.data.code
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
          console.log(msg)
        })
    }
  }
}
