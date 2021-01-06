export default {
  data() {
    return {
      isShow: false,
      tableCloums: [{
        label: '序号',
        key: 'sort',
        formType: 'number',
        width: 100,
        disabled: true
      },
      {
        label: '值',
        key: 'category',
        disabled: false,
        formType: 'input',
        width: 700
      }
      ],
      axisConfigClone: {}
    }
  },
  watch: {
    'axisConfig.axisData': {
      handler(val) {
        if (val) {
          val.forEach((item, index) => {
            item.sort = index + 1
          })
        }
      }, deep: true
    }
  },
  methods: {
    // 弹窗显示事件
    show() {
      this.isShow = true
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$refs['axisConfig'].resetFields()
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('axisConfigSubmit', this.axisConfig, null, () => {
        this.close()
      })
    }
  }
}
