// tabs
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      tabsSettingData: [], // tabs配置数据集合
      // tabs配置数据
      tabsConfig: {
        componentType: 'tabs', // 组件类型
        title: '', // 标题
        titleIsShow: true, // 标题栏是否显示
        width: 30,
        height: 30,
        left: 1,
        top: 1,
        zindex: '8', // 视图层级
        isDrafting: false, // 是否启用拖拽功能
        mask: false, // 是否添加遮罩层
        titleData: [
          {
            label: '用户管理',
            tabsCode: 'user'
          },
          {
            label: '配置管理',
            tabsCode: 'second'
          }
        ]
      }
    }
  },
  methods: {
    // tabs切换交互
    tabsInteractive(tabsCode, moduleId) {
      this.tabsSettingData.forEach((x, index) => {
        if (x.moduleId === moduleId) {
          this.$refs['tabsView'][index].chooseActive(tabsCode)
        }
      })
    },
    // 获取当前页面所有tabs配置数据
    getTabsData() {
      return this.tabsSettingData
    },
    // tabs所有配置数据查询
    tabsSettingSelect() {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/tabs/selectTabsConfig',
          { menuId: this.menuId }
        )
        .then(res => {
          //
          res.data.map(item => { item.tabsConfig = JSON.parse(item.tabsConfig) })
          this.tabsSettingData = res.data
          // console.log(this.tabsSettingData, 'this.tabsSettingData')
          // res.data.forEach(item => {
          //   item.timeAxisConfig = JSON.parse(item.timeAxisConfig)
          // })
          // this.timeSource = res.data
          // this.getTimeAxisDatas(res.data)
          // this.$message({
          //   type: 'success',
          //   message: '选项卡所有配置数据查询成功'
          // })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '选项卡所有配置数据查询失败'
          })
        })
    },
    // tabs切换模块配置数据提交事件
    tabsSettingSubmit(config, close, moduleId) {
      const reqData = {
        tabsConfigs: config
      }
      let api = ''
      if (moduleId) {
        // 修改
        reqData.moduleId = moduleId

        api = '/tabs/updateTabsConfig'
      } else {
        // 新增
        reqData.menuId = this.menuId
        reqData.projectId = this.settingConfig.answerId
        api = '/tabs/addTabsConfig'
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqData)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前选项卡配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (close) {
            close()
          }
          this.tabsSettingSelect()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '当前选项卡配置数据保存失败'
          })
        })
      // console.log(config)
    },
    // tabs配置模块删除事件
    tabsSettingdelete(moduleId) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/tabs/deleteTabsConfig',
          { moduleId }
        )
        .then(res => {
          this.tabsSettingSelect()
          this.$message({
            type: 'success',
            message: '选项卡删除成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '选项卡删除失败'
          })
        })
    },
    // 新增配置弹窗显示事件
    tabsSettingShow() {
      this.$refs['tabsSetting'].show('add')
    }
  }
}
