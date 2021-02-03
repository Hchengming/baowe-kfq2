// 自定义组件
import serviceAxios from '@/utils/request.js'
export default{
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
      }
    }
  },
  methods: {
    // 自定义模块配置页面弹出
    customComponentsSettingShow() {
      this.$refs['customComponentsSetting'].show()
    },
    // 自定义配置弹窗确认事件
    customComponentsEmit(param) {
      // console.log(param, '1111111111')
      const reqObj = {
        configs: param.config
      }
      let api = ''
      if (param.moduleId) {
        // 修改

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
            message: '当前时间轴配置数据保存成功'
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
            message: '当前时间轴配置数据保存失败'
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
    }
  }
}
