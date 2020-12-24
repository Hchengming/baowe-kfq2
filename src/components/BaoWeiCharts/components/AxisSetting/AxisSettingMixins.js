export default {
  data() {
    return {
      isShow: false,
      axisData:[],
      tableCloums: [{
        label: '索引',
        key: 'index',
        formType: "number",
        width: 100
      }, {
        label: '值',
        key: 'value',
        disabled: false,
        formType: "input",
        width: 700
      }],
    }
  },
  watch: {

  },
  methods: {
    // 弹窗显示事件
    show() {
      this.isShow = true
    },
    initData(data){
      this.axisData = data.map(value => value)
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('axisAdd', {
        axisConfig: this.axisConfig,
        axisData: this.axisData
      })
      this.isShow = false
    },
    axisAdd() {
      this.axisData[this.axisData.length - 1].index = this.axisData.length - 1
    }
  }
}
