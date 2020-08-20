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
    updateMoule (contentAreaConfig, moduleId, fn) {
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
            this.getTableData(obj)
          } else {
            this.$message({
              message: '模块修改失败',
              type: 'error'
            })
          }
        })
    },
    // statistics组件--模块删除事件
    deleteMoule (moduleId) {
      axios
        .post(
          this.settingConfig.commonUrl +
            '/busSecondmasterpageconfig/deleteSecondMasterPageConfigData',
          { moduleId }
        )
        .then(res => {
          let code = res.data.code
          if (code === 20000) {
            this.$message({
              message: '模块删除成功',
              type: 'success'
            })
            this.pageData.forEach((item, index) => {
              if (item.moduleId === moduleId) {
                this.pageData.splice(index, 1)
              }
            })
          }
        })
    },
    // 子页面新增事件
    childSettingAdd (obj) {
      axios
        .post(this.settingConfig.commonUrl + '/child/addChildModule', {
          contentAreaConfig: obj.contentAreaConfig,
          parentModuleId: obj.moduleId,
          key: obj.key
        })
        .then(res => {
          // console.log(res)
          let status = res.data.status
          // let reqData = res.data.data;
          if (status === 0) {
            this.$message({
              message: '模块添加成功',
              type: 'success'
            })
            this.getData()
            this.childInsertData(obj.moduleId, obj.rowid, '', obj.key)
            obj.fn()
          }
        })
    },
    // 子页面数据查询事件
    // 父级模块id 行数据id 副标题1 单元格点击选中格key值
    childInsertData (parentModuleId, rowid, subtitle1, key) {
      axios
        .post(this.settingConfig.commonUrl + '/child/insertChildModule', {
          parentModuleId,
          rowid,
          subtitle1,
          key
        })
        .then(res => {
          let status = res.data.status
          let reqData = res.data.data

          if (status === 0) {
            for (let i = this.pageData.length - 1; i >= 0; i--) {
              if (
                this.pageData[i].drillDownKeyCurrent &&
                this.pageData[i].drillDownKeyCurrent !== key
              ) {
                this.pageData.splice(i, 1)
              }
            }
            reqData.forEach(items => {
              let offon = true
              // 分页
              if (items.contentAreaConfig.isPage === '1') {
                items.paginationAll = {
                  currentPage: 1, // 当前显示页数
                  pageSize: items.contentAreaConfig.pageSize, // 每页数据条数
                  total: 35 // 总数据量
                }
                this.childData = JSON.parse(JSON.stringify(items.data))
                items.data = this.childData.slice(
                  0,
                  items.paginationAll.pageSize
                )
                // console.log(items)
              }
              this.pageData.forEach(item => {
                if (item.moduleId === items.moduleId) {
                  item.contentAreaConfig = items.contentAreaConfig
                  item.data = items.data
                  offon = false
                }
              })
              if (offon) {
                this.pageData.push(items)
              }
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
    }
  }
}
