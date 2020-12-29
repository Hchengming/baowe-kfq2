// 时间轴
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      axisConfig: {
        left: 1,
        top: 1,
        zindex: '8', // 视图层级
        isDrafting: false // 是否启用拖拽功能
      },
      axisSource: [],
      // 时间轴配置项
      timeConfig: {
        left: 1,
        top: 1,
        width: 20,
        zindex: '8', // 视图层级
        start: '', // 开始时间
        end: '' // 结束时间
      },
      timeSource: []
    }
  },
  methods: {
    // 时间轴配置提交事件
    timeAxisEmit(config, moduleId) {
      // this.axisSource.push({
      //     axisConfig: {
      //         zindex: config.axisConfig.zindex,
      //         top: config.axisConfig.top,
      //         left: config.axisConfig.left,
      //         isDrafting: config.axisConfig.isDrafting,
      //     },
      //     axisData: config.axisData
      // })
      // if (config) return
      const reqObj = {
        timeAxisConfig: config
      }
      let api = ''
      if (moduleId) {
        // 修改
        reqObj.moduleId = moduleId
        api = '/timeAxisConfig/updateTimeAxisConfig'
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId
        api = '/timeAxisConfig/addTimeAxisConfig'
      }
      console.log(reqObj)
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          // this.timeSource = res.data
          // console.log(this.timeSource, 'this.timeSource');
          this.$message({
            type: 'success',
            message: '当前时间轴配置数据保存成功'
          })
          this.$refs['TimeAxisSetting'].close()
          this.timeAxisSelect()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '当前时间轴配置数据保存失败'
          })
        })
    },
    // 时间轴所有配置数据查询
    timeAxisSelect() {
      serviceAxios
        .post(this.settingConfig.commonUrl + '/timeAxisConfig/selectTimeAxisConfig', { menuId: this.nowMenuItem.menuId })
        .then(res => {
          res.data.forEach(item => {
            item.timeAxisConfig = JSON.parse(item.timeAxisConfig)
          })
          this.timeSource = res.data
          console.log(this.timeSource, 'this.timeSource')
          this.$message({
            type: 'success',
            message: '时间轴所有配置数据查询成功'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴所有配置数据查询失败'
          })
        })
    },

    axisAdd() {

    },
    deleteAxis(idx) {
      this.axisSource.splice(idx, 1)
    },
    axisClick() {

    },
    // timeAxisAdd(config) {
    //     this.timeSource.push(config)
    // },
    deleteTimeAxis(idx) {
      this.timeSource.splice(idx, 1)
    },
    timeClick() {

    }
  }
}