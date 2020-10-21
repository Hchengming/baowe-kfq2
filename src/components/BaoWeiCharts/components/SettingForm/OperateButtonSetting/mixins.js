export default {
  data() {
    return {
      isShow: false,
      operateButton: []
    }
  },
  methods: {
    // 页面显示事件
    show(data) {
      this.operateButton = data ? JSON.parse(JSON.stringify(data)) : []
      this.isShow = true
    },
    // 按钮配置确认事件
    onSubmit() {
      this.isShow = false
      this.$emit('submit', this.operateButton)
    }
  }
}
