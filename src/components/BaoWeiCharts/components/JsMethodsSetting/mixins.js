export default {
  data() {
    return {
      jsMethods: '',
      isShow: false,
      warn: ''
    }
  },
  methods: {
    // 显示控制
    show(obj) {
      this.jsMethods = obj.jsMethods

      if (this.settingType === '1') {
        // 列表、表格右侧按钮初始默认函数
        if (!this.jsMethods || !this.jsMethods.replace(/\s*/g, '')) {
          this.jsMethods = `function(rowData){} `
        }
        this.warn = '默认参数rowData为列表、表格当前行数据。例:function(rowData){}'
      } else if (this.settingType === '2') {
        // 筛选右侧按钮初始默认函数
        if (!this.jsMethods || !this.jsMethods.replace(/\s*/g, '')) {
          this.jsMethods = `function(){} `
        }
        this.warn = ''
      } else if (this.settingType === '3') {
        this.warn = '默认参数colums为当前字段配置数据,rowData为当前行数据。例:function(colums,rowData){return:""}'
      } else if (this.settingType === '4') {
        // iframe交互
        this.warn = '默认参数param1为当前模块选中传递值，param2为当前点击行所有参数'
        this.jsMethods = obj.jsMethods ? obj.jsMethods : `function(param1,param2){} `
      } else if (this.settingType === '5') {
        this.warn = '默认参数params为当前组件信息和事件参数{ componenInfo,reqData}'
        this.jsMethods = obj.jsMethods ? obj.jsMethods : `function(params){} `
      }

      this.isShow = true
    },
    // 确认提交
    onSubmit() {
      this.isShow = false
      this.$emit('submit', this.jsMethods)
    }

  }
}
