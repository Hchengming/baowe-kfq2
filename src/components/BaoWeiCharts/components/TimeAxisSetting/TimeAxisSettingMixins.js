export default {
  data() {
    return {
      isShow: false,
      itemApiData: [], // 应用接口列表数据
      dataViewList: []// 数据视图列表数据
    }
  },
  methods: {
    // 缺失时间按钮点击事件
    missingTimeBtnClick() {
      this.$refs['missingTime'].show()
    },
    // // 接口类型切换事件
    // apiTypeChange(val) {
    //   // this.isPageDisabled = false
    //   if (val === '0') {
    //     // this.isPageDisabled = true
    //     this.$refs['apiChoose'].getDataIview()
    //   } else {
    //     this.$refs['apiChoose'].getItemApi()
    //   }
    // },
    // 接口类型切换事件
    apiTypeChange(val) {
      this.timeConfig.url = ''
      this.timeConfig.urlName = ''
      if (val === '0') {
        this.timeConfig.options = 'POST'
        this.$refs['apiChoose'].getDataIview()
        // 判断当前后台环境是否为node测试环境
        if (this.settingConfig.isTestEnvironment) {
          this.timeConfig.url = '/dataView/searchResult'
        } else {
          this.timeConfig.url = '/.DataView/view/v1/sql/searchResult'
        }
      } else {
        this.timeConfig.options = 'GET'
        this.$refs['apiChoose'].getItemApi()
      }
    },
    // 弹窗显示事件
    show() {
      this.isShow = true
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$refs['timeConfig'].resetFields()
      this.timeConfig.missingTime = []
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('componentFunc', {
        method: 'timeAxisEmit',
        param: {
          config: this.timeConfig,
          moduleId: null,
          close: () => {
            this.close()
          }
        }
      })
      // this.$emit('timeAxisEmit', this.timeConfig, null, () => {
      //   this.close()
      // })
    }
  }
}
