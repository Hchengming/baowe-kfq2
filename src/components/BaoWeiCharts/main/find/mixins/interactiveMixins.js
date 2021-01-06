// 模块交互功能实现
import serviceAxios from '@/utils/request.js'
import dataPresentation from '../../../components/SettingForm/dataPresentation.json'
export default {
  data() {
    return {
      beforeParamsData: [], // 当前模块供选择参数
      interactiveModuleAll: [], // 可交互模块集合
      interactiveData: [], // 交互配置数据
      interactiveModuleId: '' // 当前交互配置模块id
    }
  },
  methods: {
    /* 阶段一--交互配置阶段*/
    // 情况1--图表组件集配置按钮点击事件
    chartsInteractiveSetting(reqObj) {
      // 01-图表组件集交互数据配置---图表、iframe(当前模块)
      this.chartsInteractive(reqObj.statisticsAll)
      // 02-当前页面所有可交互模块获取(交互模块)
      this.interactivePageData(reqObj.pageData)
      // 03-交互配置数据获取
      this.getInteractiveData(() => {
        this.$refs['InteractiveSetting'].show()
      })
    },

    // 图表组件集交互数据配置---图表、iframe
    chartsInteractive(statisticsAll) {
      this.interactiveModuleId = statisticsAll.moduleId
      // 判断是否为分页数据
      // let isPage=statisticsAll.contentAreaConfig.isPage;
      this.beforeParamsData = []
      statisticsAll.contentAreaConfig.keyArr.forEach(item => {
        if (item.isShow) {
          this.beforeParamsData.push({
            lab: item.explain,
            val: item.key
          })
        }
      })
    },
    // 顶部栏交互配置按钮点击事件--顶部栏
    topBarInteractiveIconClick() {
      this.interactiveModuleId = this.topBarAll.moduleId
      // 1、顶部栏组件集交互前数据配置
      this.beforeParamsData = [{ lab: '标题', val: 'title' }]
      // 2、当前页面所有可交互模块获取(交互模块)
      this.interactivePageData()
      // 03-交互配置数据获取
      this.getInteractiveData(() => {
        this.$refs['InteractiveSetting'].show()
      })
    },
    // 时间轴交互配置按钮点击事件
    timeAxisInteractiveIconClick(object) {
      this.interactiveModuleId = object.moduleId
      // 1、交互前数据配置
      this.beforeParamsData = [{ lab: '时间', val: 'time' }]
      // 2、当前页面所有可交互模块获取(交互模块)
      this.interactivePageData()
      // 03-交互配置数据获取
      this.getInteractiveData(() => {
        this.$refs['InteractiveSetting'].show()
      })
    },
    // 类目轴交互配置按钮点击事件
    categoryAxisInteractiveIconClick(object) {
      this.interactiveModuleId = object.moduleId
      // 1、交互前数据配置
      this.beforeParamsData = [{ lab: '类目', val: 'category' }]
      // 2、当前页面所有可交互模块获取(交互模块)
      this.interactivePageData()
      // 03-交互配置数据获取
      this.getInteractiveData(() => {
        this.$refs['InteractiveSetting'].show()
      })
    },
    // 当前页面所有可交互模块获取
    interactivePageData() {
      this.interactiveModuleAll = []
      // 一、所有图表图表、iframe
      const pageData = this.$refs['middleware'].pageData
      pageData.forEach(config => {
        if (config.moduleId !== this.interactiveModuleId) {
          const moduleName = config.contentAreaConfig.title
            ? config.contentAreaConfig.title
            : '模块未命名'
          // 1、图表
          if (
            !config.contentAreaConfig.moduleType ||
            config.contentAreaConfig.moduleType === '0'
          ) {
            const interactiveParams = []
            // 01-获取交互对应字段参数集合
            config.conditionAreaConfig.screenData.forEach(item => {
              interactiveParams.push({
                lab: item.label,
                val: item.key
              })
            })
            this.interactiveModuleAll.push({
              moduleId: config.moduleId,
              moduleName,
              type: config.contentAreaConfig.displayMode,
              interactiveParams
            })
          } else if (config.contentAreaConfig.moduleType === '1') {
            // 2、iframe框
            this.interactiveModuleAll.push({
              moduleId: config.moduleId,
              moduleName,
              type: 'iframe',
              interactiveParams: []
            })
          }
        }
      })
      // 二、顶部栏(顶部栏暂时不可作为交互对象)
      if (
        this.topBarAll.moduleId &&
        this.topBarAll.data.length > 0 &&
        this.topBarAll.moduleId !== this.interactiveModuleId
      ) {
        console.log(this.topBarAll, 'this.topBarAll')
        let topBarInteractiveParams = []
        if (this.topBarAll.form.paramConfig.length > 0) {
          topBarInteractiveParams = this.topBarAll.form.paramConfig.map(obj => {
            return {
              val: obj.paramKey,
              lab: obj.description
            }
          })
        }

        this.interactiveModuleAll.push({
          moduleId: this.topBarAll.moduleId,
          moduleName: '顶部栏',
          type: 'topBar',
          interactiveParams: topBarInteractiveParams
        })
      }
      // 三、时间轴
      if (this.timeSource.length > 0) {
        this.timeSource.forEach((item, index) => {
          if (item.moduleId !== this.interactiveModuleId) {
            this.interactiveModuleAll.push({
              moduleId: item.moduleId,
              moduleName: item.timeAxisConfig.title
                ? item.timeAxisConfig.title
                : '时间轴' + index,
              type: 'timeAxis',
              interactiveParams: []
            })
          }
        })
      }
      // 四、类目轴
      if (this.axisSource.length > 0) {
        this.axisSource.forEach((item, index) => {
          if (item.moduleId !== this.interactiveModuleId) {
            this.interactiveModuleAll.push({
              moduleId: item.moduleId,
              moduleName: item.categoryConfig.title
                ? item.categoryConfig.title
                : '类目轴' + index,
              type: 'categoryAxis',
              interactiveParams: []
            })
          }
        })
      }

      // console.log(this.topBarAll)
    },
    /* 阶段二--交互配置数据保存和查询*/

    // 当前交互模块配置数据查询事件
    getInteractiveData(fn) {
      this.interactiveData = []
      serviceAxios
        .post(this.settingConfig.commonUrl + '/jhConfig/selectJhConfig', {
          moduleId: this.interactiveModuleId
        })
        .then(res => {
          this.interactiveData = res.data
            ? JSON.parse(res.data.interactiveData)
            : []
          fn()
        })
    },
    // 模块交互配置数据保存事件
    interactiveDataEmit() {
      const reqObj = {
        moduleId: this.interactiveModuleId,
        interactiveData: this.interactiveData
      }
      console.log(this.interactiveData, 'this.interactiveData')
      serviceAxios
        .post(this.settingConfig.commonUrl + '/jhConfig/updateJhConfig', reqObj)
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '当前模块交互配置数据编辑成功'
          })
        })
    },

    /* 阶段三-点击触发*/

    // 图表组件集--模块交互触发
    interactiveElementMethods(reqObj) {
      // 图表组件集配置按钮点击事件获取
      if (reqObj.methodsName === 'interactive') {
        this.chartsInteractiveSetting(reqObj)
      }
      // 表格单元格点击事件--触发模块交互
      if (reqObj.methodsName === 'cellClick') {
        this.interactiveCellClick(reqObj)
      }
      // 图表点击事件--触发模块交互
      if (reqObj.methodsName === 'rowClick') {
        this.interactiveChartsClick(reqObj)
      }
    },

    // (图表)点击触发交互事件
    interactiveChartsClick(reqObj) {
      this.interactiveModuleId = reqObj.moduleId
      const contentAreaConfig = reqObj.statisticsAll.contentAreaConfig
      const arr = ['pie', 'ring', 'histogram', 'bar', 'line', 'radar']
      if (arr.indexOf(contentAreaConfig.displayMode) > -1) {
        this.interactiveImplement(reqObj)
      }
    },
    // (表格、列表、详情)通过表格单元格点击触发交互事件
    interactiveCellClick(reqObj) {
      this.interactiveModuleId = reqObj.moduleId
      const contentAreaConfig = reqObj.statisticsAll.contentAreaConfig
      if (
        ['table', 'list', 'destailTable'].indexOf(
          contentAreaConfig.displayMode
        ) > -1
      ) {
        this.interactiveImplement(reqObj)
      }
    },

    // (顶部栏)点击事件触发模块交互
    topBarInteractive(rowItem) {
      this.interactiveModuleId = this.topBarAll.moduleId
      const reqObj = {
        rowItem: rowItem
      }
      this.interactiveImplement(reqObj)
    },
    // (类目轴)点击事件触发模块数据交互
    categoryInteractive(rowItem, moduleId) {
      this.interactiveModuleId = moduleId
      const reqObj = {
        rowItem: rowItem
      }
      this.interactiveImplement(reqObj)
    },
    // (时间轴)点击事件触发模块数据交互
    timeAxisInteractive(rowItem, moduleId) {
      this.interactiveModuleId = moduleId
      const reqObj = {
        rowItem: rowItem
      }
      this.interactiveImplement(reqObj)
    },

    /* 阶段四-交互执行*/

    // 交互事件被触发公告事件
    interactiveImplement(reqObj) {
      // 获取图表类型集合
      const chartsTypeArr = []
      dataPresentation.forEach(obj => {
        chartsTypeArr.push(obj.type)
      })
      // 配置数据查询事件调用
      this.getInteractiveData(() => {
        this.interactiveData.forEach(items => {
          // 单元格点击事件时判断点击字段是否为交互字段
          const offon = reqObj.key ? reqObj.key === items.paramsChoose : true
          if (offon) {
            items.otherModuleConfig.forEach(item => {
              if (item.moduleType) {
                if (chartsTypeArr.indexOf(item.moduleType) > -1) {
                  // 图表组件集
                  console.log(reqObj, items, item, 'item.moduleType')
                  this.chartsBeInteractive(reqObj, items, item)
                } else {
                  switch (item.moduleType) {
                    case 'iframe': // iframe嵌入框
                      this.iframeBeInteractive(reqObj, items, item)
                      break
                    case 'topBar': // 顶部栏
                      this.topBarBeInteractive(reqObj, items, item)
                      break
                  }
                }
              }
            })
          }
        })
      })
    },
    // (iframe)被交互事件
    iframeBeInteractive(reqObj, items, item) {
      // eslint-disable-next-line no-eval
      const fnc = eval(`(false || ${item.jsMethods})`)
      fnc({
        [item.corParams]: reqObj.rowItem[items.paramsChoose]
      })
    },
    // (顶部栏)被交互事件
    topBarBeInteractive(reqObj, items, item) {
      const params = {}
      params[item.corParams] = reqObj.rowItem[items.paramsChoose]
      // console.log(params, 'params')
      this.getTopBarData(params)
    },
    // (图表)被交互事件--（表格、列表、图表、详情表格）
    chartsBeInteractive(reqObj, items, item) {
      const params = {}
      params[item.corParams] = reqObj.rowItem[items.paramsChoose]
      // console.log(params, items.paramsChoose, 'params----')
      this.$refs['middleware'].interactiveCover(params, item.moduleId)
    },
    // 图表被交互事件
    interactiveCharts(reqObj) {
      // 1-获取图表类型集合
      const chartsTypeArr = []
      dataPresentation.forEach(obj => {
        chartsTypeArr.push(obj.type)
      })
      // 2-根据图表类型确定触发方式
      this.getInteractiveData(() => {
        this.interactiveData.forEach(items => {
          console.log(items, '----')
          // 单元格点击事件时判断点击字段是否为配置字段
          const offon = reqObj.key ? reqObj.key === items.paramsChoose : true
          if (items.otherModuleConfig.length > 0 && offon) {
            items.otherModuleConfig.forEach(item => {
              if (chartsTypeArr.indexOf(item.moduleType) > -1) {
                // 01-交互对象（表格、列表、图表、详情表格单元格）
                const params = {}
                params[item.corParams] = reqObj.rowItem[items.paramsChoose]
                this.$refs['middleware'].interactiveCover(params, item.moduleId)
              } else if (item.moduleType === 'iframe') {
                // 02-交互对象
                // eslint-disable-next-line no-eval
                const fnc = eval(`(false || ${item.jsMethods})`)
                fnc({
                  [item.corParams]: reqObj.rowItem[items.paramsChoose]
                })
              }
            })
          }
        })
      })
    }
  }
}
