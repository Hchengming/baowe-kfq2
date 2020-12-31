export default {
  data() {
    return {
      isShow: false,
      timeConfigClone: {}
    }
  },
  methods: {
    // 弹窗显示事件
    show() {
      this.isShow = true
      this.timeConfigClone = JSON.parse(JSON.stringify(this.timeConfig))
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$refs['timeConfig'].resetFields()
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('timeAxisEmit', this.timeConfig, null, () => {
        this.close()
      })
    }
  }
}
