export default {
  data() {
    return {
      isShow: false,
      tabsFormClone: {}
    }
  },
  methods: {
    yearChange(){},
    // 弹窗显示事件
    show() {
      this.tabsFormClone = JSON.parse(JSON.stringify(this.timeConfig))
      this.isShow = true
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('axisAdd', this.timeConfig)
      this.isShow = false
    }
  }
}
