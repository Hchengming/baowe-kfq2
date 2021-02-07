// 自定义组件
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      customComponentsData: [], // 当前页面自定义组件数据
      customComponentsConfig: {// 自定义组件配置数据
        js: '', // js部分内容
        temp: '', // template(html)部分内容
        left: 1,
        top: 1,
        width: 32,
        height: 32,
        zindex: 8,
        title: '', // 标题
        parentModuleId: '', // 父级容器组件id
        parentTabsCode: ''// 父级容器编码（用于选项卡）
      },
      customComponentsParamStr: ''// 交互传值监听
    }
  },
  mounted() {
    this.customComponentsChange()
  },
  methods: {
    // 设置定时器监听组件交互情况
    customComponentsChange() {
      setInterval(() => {
        const str = localStorage.getItem('customComponentsParam')
        if (str !== this.customComponentsParamStr) {
          this.customComponentsParamStr = str
          this.customInteractive(JSON.parse(str))
        }
      }, 50)
    },
    // 交互对象判断
    customInteractive(object) {
      let offon = false
      if (!object || !object.interactiveModuleId) return
      // 1、判断是否为图表组件集交互
      const pageData = this.$refs['middleware'].pageData
      pageData.forEach(config => {
        if (config.moduleId === object.interactiveModuleId) {
          this.$refs['middleware'].interactiveCover(object.param, object.interactiveModuleId)
          offon = true
        }
      })
      if (offon) return
      // 2、判断是否为顶部栏交互
      if (object.interactiveModuleId === this.nowMenuItem.menuId) {
        this.getTopBarData(object.param)
        return
      }
      // 3、时间轴交互
      this.timeSource.forEach(item => {
        if (item.moduleId === object.interactiveModuleId) {
          // console.log(item.timeAxisConfig.moduleId)
          this.getTimeAxisDatas2(object.param, object.interactiveModuleId)
        }
      })
    },
    // 自定义模块配置页面弹出
    customComponentsSettingShow() {
      this.$refs['customComponentsSetting'].show()
    },
    // 自定义配置确认事件
    customComponentsEmit(param) {
      const reqObj = {
        configs: param.config
      }
      let api = ''
      if (param.moduleId) {
        // 修改
        api = '/customComponents/updateCustomComponentsConfig'
        reqObj.moduleId = param.moduleId
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId
        reqObj.projectId = this.settingConfig.answerId
        api = '/customComponents/addCustomComponentsConfig'
        if (this.parentContainerType === 'container') {
          reqObj.customComponentsConfig.parentModuleId = this.parentModuleId
          if (this.parentTabsCode) {
            reqObj.customComponentsConfig.parentTabsCode = this.parentTabsCode
          }
        }
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前自定义组件配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (param.close) {
            param.close()
          }
          this.customComponentSelect()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '当前自定义组件配置数据保存失败'
          })
        })
    },
    // 页面自定义组件配置数据查询事件
    customComponentSelect() {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/customComponents/selectCustomComponentsConfig',
          { menuId: this.nowMenuItem.menuId }
        )
        .then(res => {
          // console.log('12')
          res.data.map(item => {
            item.config = JSON.parse(item.config)
          })

          this.customComponentsData = res.data
          // console.log('111', this.customComponentsData)
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '页面自定义组件配置数据查询失败'
          })
        })
    },
    // 模块删除事件
    customComponentsDelete(param) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/customComponents/deleteCustomComponentsConfig',
          { moduleId: param.moduleId }
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: '页面自定义组件配置删除成功'
          })
          this.customComponentSelect()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '页面自定义组件配置删除失败'
          })
        })
    }
  }
}
