export default {
  data() {
    return {
      jsMethods: '',
      isShow: false,
      warn: ''
    }
  },
  methods: {
    show(obj) {
      this.jsMethods = obj.jsMethods

      if (this.settingType === '1') {
        // 列表、表格右侧按钮初始默认函数
        if (!this.jsMethods || !this.jsMethods.replace(/\s*/g, '')) {
          this.jsMethods = `function(rowItem){} `
        }
        this.warn = '默认参数rowItem为列表、表格当前行数据'
      } else if (this.settingType === '2') {
        // 筛选右侧按钮初始默认函数
        if (!this.jsMethods || !this.jsMethods.replace(/\s*/g, '')) {
          this.jsMethods = `function(obj){} `
        }
        this.warn = ''
      }
      this.isShow = true
    },
    onSubmit() {
      this.isShow = false
      this.$emit('submit', this.jsMethods)
    }
  }
}
