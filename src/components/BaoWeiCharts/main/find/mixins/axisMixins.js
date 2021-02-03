// 类目轴
import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      axisConfig: {
        left: 1,
        top: 1,
        zindex: '8', // 视图层级
        title: '', // 标题
        parentModuleId: '', // 父级容器组件id
        parentTabsCode: '', // 父级容器编码（用于选项卡）
        axisData: []
      },
      axisSource: []// 当前页面类目轴配置数据集合
    }
  },
  methods: {
    // 当前页面类目轴显示数据（排除容器内显示模块）
    pageAxisSource() {
      const arr = []
      this.axisSource.forEach(item => {
        // console.log(item, 'item')
        if (item.categoryConfig && !item.categoryConfig.parentModuleId) {
          arr.push(item)
        }
      })
      return arr
    },
    // 新增配置弹窗显示事件
    axisSettingShow() {
      this.axisConfig.axisData = []
      this.$refs['AxisSetting'].show()
    },
    // 配置数据提交事件
    categoryConfigSubmit(param) {
      const reqObj = {
        categoryConfigs: param.config
      }
      let api = ''
      if (param.moduleId) {
        // 修改
        reqObj.moduleId = param.moduleId
        api = '/categoryConfig/updateCategoryConfig'
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId
        reqObj.projectId = this.settingConfig.answerId
        api = '/categoryConfig/addCategoryConfig'
        if (this.parentContainerType === 'container') {
          reqObj.categoryConfigs.parentModuleId = this.parentModuleId
          if (this.parentTabsCode) {
            reqObj.categoryConfigs.parentTabsCode = this.parentTabsCode
          }
        }
      }
      // console.log(param, 'paramparamparam')
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前类目轴配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (param.close) {
            param.close()
          }
          this.categoryConfigSelect()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '当前类目轴配置数据保存失败'
          })
        })
    },
    // 类目轴所有数据查询事件
    categoryConfigSelect() {
      serviceAxios
        .post(this.settingConfig.commonUrl + '/categoryConfig/selectCategoryConfig', { menuId: this.nowMenuItem.menuId })
        .then(res => {
          // console.log(res.data)
          res.data.forEach(item => {
            item.categoryConfig = JSON.parse(item.categoryConfig)
          })
          this.axisSource = res.data

          this.pageModuleData.categoryAxis = res.data

          // this.$message({
          //   type: 'success',
          //   message: '类目轴所有配置数据查询成功'
          // })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '类目轴所有配置数据查询失败'
          })
        })
    },
    // 删除按钮点击事件
    deleteCategory(param) {
      serviceAxios
        .post(this.settingConfig.commonUrl + '/categoryConfig/deleteCategoryConfig', { moduleId: param.moduleId })
        .then(res => {
          this.categoryConfigSelect()
          this.$message({
            type: 'success',
            message: '类目轴删除成功'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '类目轴删除失败'
          })
        })
    },
    // 类目轴-类目点击事件
    axisClick(param) {
      // 点击事件暴露
      this.$emit('elementMethods', {
        name: '类目轴点击事件',
        methodsName: 'categoryAxisClick',
        moduleId: param.moduleId,
        data: param.data
      })
      // 点击事件交互
      this.categoryInteractive({ category: param.data.category }, param.moduleId)
    }
  }
}
