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
        axisData: []
      },
      axisSource: []// 当前页面类目轴配置数据集合
    }
  },
  methods: {
    // 新增配置弹窗显示事件
    axisSettingShow() {
      this.axisConfig.axisData = []
      this.$refs['AxisSetting'].show()
    },
    // 配置数据提交事件
    categoryConfigSubmit(config, moduleId, close) {
      const reqObj = {
        categoryConfigs: config
      }
      let api = ''
      if (moduleId) {
        // 修改
        reqObj.moduleId = moduleId
        api = '/categoryConfig/updateCategoryConfig'
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId
        api = '/categoryConfig/addCategoryConfig'
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + api, reqObj)
        .then(() => {
          this.$message({
            type: 'success',
            message: '当前类目轴配置数据保存成功'
          })
          // 编辑弹窗关闭事件执行
          if (close) {
            close()
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
          console.log(res.data)
          res.data.forEach(item => {
            item.categoryConfig = JSON.parse(item.categoryConfig)
          })
          this.axisSource = res.data
          // console.log(this.axisSource, 'this.axisSource')
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
    deleteCategory(moduleId) {
      serviceAxios
        .post(this.settingConfig.commonUrl + '/categoryConfig/deleteCategoryConfig', { moduleId })
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
    axisClick(data, moduleId) {
      // 点击事件暴露
      this.$emit('elementMethods', {
        name: '类目轴点击事件',
        methodsName: 'categoryAxisClick',
        moduleId,
        data
      })
      // 点击事件交互
      this.categoryInteractive({ category: data.category }, moduleId)
    }
  }
}
