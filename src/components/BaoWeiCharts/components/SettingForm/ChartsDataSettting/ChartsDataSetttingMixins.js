export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    if (this.settingConfig.isBigData) {
      this.activeName = 'third'
    }
  },
  methods: {
    // tabs切换点击事件
    handleClick() {
      // console.log(this.form.keyArr)
      // if (this.activeName === 'first') {
      //     this.$refs['paramKeyConfig'].paramKeyConfigHenx()
      // }
    },
    // 筛选项配置数据保存事件
    screenSubmit(fn) {
      // if (!this.settingConfig.isBigData) {
      this.$refs['screenSetting'].screenSubmit(fn)
      // }
    }
  }
}
