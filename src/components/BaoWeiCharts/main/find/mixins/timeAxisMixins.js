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
        zindex: '8', // 视图层级
        start: '', // 开始时间
        end: '' // 结束时间
      },
      timeSource: [],
      timeConfigClone: {}
    }
  },

  methods: {
    // 时间点击事件
    timeClick(data, moduleId) {
      // 点击事件暴露
      this.$emit('elementMethods', {
        name: '类目轴点击事件',
        methodsName: 'timeAxisClick',
        moduleId,
        data
      })
      // 点击事件交互
      this.timeAxisInteractive(data, moduleId)
    },
    // 时间轴配置提交事件
    timeAxisEmit(config, moduleId, close) {
      const reqObj = {
        timeAxisConfigs: config
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
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前时间轴配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (close) {
            close()
          }
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
          // this.$message({
          //   type: 'success',
          //   message: '时间轴所有配置数据查询成功'
          // })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴所有配置数据查询失败'
          })
        })
    },
    // 时间轴模块删除事件
    deleteTimeAxis(moduleId) {
      serviceAxios
        .post(this.settingConfig.commonUrl + '/timeAxisConfig/deleteTimeAxisConfig', { moduleId })
        .then(res => {
          this.timeAxisSelect()
          this.$message({
            type: 'success',
            message: '时间轴删除成功'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '时间轴删除失败'
          })
        })
    }
  }
}
