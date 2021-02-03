// 时间轴
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      // 时间轴配置项
      timeConfig: {
        left: 1,
        top: 1,
        width: 20,
        title: '', // 标题
        label: '', // 标签
        class: '', // 类名
        zindex: '8', // 视图层级
        start: '', // 开始时间
        end: '', // 结束时间
        missingTime: [], // 缺失时间
        missingTimeStr: '', // 缺失时间字符串显示
        dataAcquisitionMethod: '0', // 数据获取方式 0 自定义 1 通过接口获取
        apiType: '1', // 0：数据视图 1：应用接口
        viewId: '', // 当前视图id
        url: '', // 接口
        urlName: '', // 接口名称
        options: 'GET', // 请求方式  GET/POST
        paramConfig: [], // 请求参数配置
        timeAxisData: [], // 时间轴数据
        defaultTime: '', // 时间轴初始选中年份(默认值为今年)
        parentModuleId: '', // 父级容器组件id
        parentTabsCode: ''// 父级容器编码（用于选项卡）
      },
      timeSource: [],
      timeConfigClone: {}
    }
  },

  methods: {
    // 当前页面时间轴显示数据（排除容器内显示模块）
    pageTimeSource() {
      const arr = []
      this.timeSource.forEach(item => {
        if (!item.timeAxisConfig.parentModuleId) {
          arr.push(item)
        }
      })
      return arr
    },
    // 时间点击事件
    timeClick(param) {
      // 点击事件暴露
      this.$emit('elementMethods', {
        name: '时间轴轴点击事件',
        methodsName: 'timeAxisClick',
        moduleId: param.moduleId,
        data: param.data
      })
      // 点击事件交互
      this.timeAxisInteractive(param.data, param.moduleId)
    },
    // 时间轴配置提交事件
    timeAxisEmit(param) {
      const reqObj = {
        timeAxisConfigs: param.config
      }
      let api = ''
      if (param.moduleId) {
        // 修改
        reqObj.moduleId = param.moduleId
        api = '/timeAxisConfig/updateTimeAxisConfig'
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId
        reqObj.projectId = this.settingConfig.answerId
        api = '/timeAxisConfig/addTimeAxisConfig'
        if (this.parentContainerType === 'container') {
          reqObj.timeAxisConfigs.parentModuleId = this.parentModuleId
          if (this.parentTabsCode) {
            reqObj.timeAxisConfigs.parentTabsCode = this.parentTabsCode
          }
        }
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前时间轴配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (param.close) {
            param.close()
          }
          this.timeAxisSelect()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '当前时间轴配置数据保存失败'
          })
        })
    },
    // 时间轴所有配置数据查询
    timeAxisSelect() {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/timeAxisConfig/selectTimeAxisConfig',
          { menuId: this.nowMenuItem.menuId }
        )
        .then(res => {
          res.data.forEach(item => {
            item.timeAxisConfig = JSON.parse(item.timeAxisConfig)
          })
          this.timeSource = res.data
          this.pageModuleData.timeAxis = this.timeSource
          // console.log(this.timeSource, 'timeSource')

          this.getTimeAxisDatas(res.data)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴所有配置数据查询失败'
          })
        })
    },
    // 时间轴模块删除事件
    deleteTimeAxis(param) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/timeAxisConfig/deleteTimeAxisConfig',
          { moduleId: param.moduleId }
        )
        .then(res => {
          this.timeAxisSelect()
          this.$message({
            type: 'success',
            message: '时间轴删除成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴删除失败'
          })
        })
    },
    // 时间轴接口数据查询
    getTimeAxisDatas(timeSource) {
      timeSource.forEach((item, index) => {
        if (item.timeAxisConfig.dataAcquisitionMethod === '1') {
          // 默认参数获取
          const reqData = {}
          item.timeAxisConfig.paramConfig.forEach(xx => {
            reqData[xx.paramKey] = xx.paramValue
          })
          // 0：数据视图 1：应用接口
          // if (item.timeAxisConfig.apiType === '0') {
          //   this.getIviewData(item.timeAxisConfig, reqData, index)
          // } else {
          //   this.getYYJKData(item.timeAxisConfig, reqData, index)
          // }
          this.getTimesData(item, reqData, index)
        }
      })
    },
    // 时间轴配置数据交互触发  (obj)交互传入数据
    getTimeAxisDatas2(obj, moduleId) {
      this.timeSource.forEach((item, index) => {
        if (item.timeAxisConfig.dataAcquisitionMethod === '1' && item.moduleId === moduleId) {
          // 默认参数获取
          let offon = true
          item.timeAxisConfig.paramConfig.forEach(xx => {
            if (xx.paramKey === Object.keys(obj)[0]) {
              xx.paramValue = obj[xx.paramKey]
              offon = false
            }
          })
          if (offon) {
            item.timeAxisConfig.paramConfig.push({
              paramKey: Object.keys(obj)[0],
              paramValue: obj[Object.keys(obj)[0]]
            })
          }
          const reqData = {}
          item.timeAxisConfig.paramConfig.forEach(xx => {
            reqData[xx.paramKey] = xx.paramValue
          })
          this.getTimesData(item, reqData, index)
        }
      })
    },
    // 数据请求 数据视图、应用接口区分
    getTimesData(item, reqData, index) {
      console.log(123)
      // 0：数据视图 1：应用接口
      if (item.timeAxisConfig.apiType === '0') {
        const url = window.BaseApi + item.timeAxisConfig.url
        this.getIviewData(item.timeAxisConfig, reqData, index, url)
      } else {
        const url = item.timeAxisConfig.url.indexOf('http') > -1
          ? item.timeAxisConfig.url
          : item.timeAxisConfig.url.indexOf('/api/service') > -1 ? window.config.applicationInterfaceApi + item.timeAxisConfig.url : this.settingConfig.dataUrl + item.timeAxisConfig.url
        this.getYYJKData(item.timeAxisConfig, reqData, index, url)
      }
    },
    // 应用接口数据获取
    getYYJKData(timeAxisConfig, reqData, index, url) {
      this.getTimeAxisData(timeAxisConfig, reqData, index, url)
    },
    // 数据视图数据获取
    getIviewData(timeAxisConfig, reqData, index, url) {
      const queryParamList = []
      for (const key in reqData) {
        queryParamList.push({
          [key]: reqData[key]
        })
      }
      reqData = {
        viewId: timeAxisConfig.viewId,
        pageSize: 1,
        pageNumber: 1000,
        queryParamList: queryParamList
      }

      this.getTimeAxisData(timeAxisConfig, reqData, index, url)
    },
    // 时间轴接口数据获取
    getTimeAxisData(timeAxisConfig, reqData, index, url) {
      // const url =

      const options = timeAxisConfig.options.toLowerCase()

      serviceAxios[options](url, reqData)
        .then(res => {
          const data = timeAxisConfig.apiType === '0' ? res.data.list : res.data
          // 01-最小，最大年度获取
          timeAxisConfig.start = data[0].time
          timeAxisConfig.end = data[data.length - 1].time

          data.forEach(item => {
            if (Number(item.time) < Number(timeAxisConfig.start)) {
              timeAxisConfig.start = item.time
            }
            if (Number(item.time) > Number(timeAxisConfig.end)) {
              timeAxisConfig.end = item.time
            }
          })
          // 02-缺失年度获取
          timeAxisConfig.missingTime = []
          for (
            let i = Number(timeAxisConfig.start);
            i <= Number(timeAxisConfig.end);
            i++
          ) {
            let offon = true
            data.forEach(item => {
              if (i === Number(item.time)) {
                offon = false
              }
            })
            if (offon) {
              timeAxisConfig.missingTime.push(i.toString())
            }
          }
          timeAxisConfig.missingTimeStr = timeAxisConfig.missingTime.toString()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴接口数据获取失败11'
          })
        })
    }
  }
}
