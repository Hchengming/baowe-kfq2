export default {
  data() {
    return {
      isShow: false,
      titleColums: [
        {
          key: 'label',
          label: '标签',
          placeholder: '标签名',
          width: 300,
          formType: 'input'
        }, {
          key: 'tabsCode',
          label: '编码',
          placeholder: '唯一编码',
          width: 309,
          formType: 'input'
        }
      ]
      // tabsFormClone: {}
    }
  },
  // watch: {
  //   isShow(val) {
  //     if (!val) {
  //       // tabsForm 数据重置
  //       for (const key in this.tabsFormClone) {
  //         this.tabsForm[key] = this.tabsFormClone[key]
  //       }
  //     }
  //   }
  // },
  methods: {
    // 弹窗显示事件
    show(type) {
      this.isShow = true
      if (type === 'add') {
        this.tabsForm.titleData = []
      }
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$refs['tabsForm'].resetFields()
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('tabsSubmit', this.tabsForm, () => {
        this.close()
      })
    }
  }
}
