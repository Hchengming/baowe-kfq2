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
      }, {
        label: '实际值',
        key: 'category',
        disabled: false,
        formType: 'input',
        width: 350
      },
      {
        label: '显示值',
        key: 'displayValue',
        disabled: false,
        formType: 'input',
        width: 350
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
      this.$emit('componentFunc', {
        method: 'categoryConfigSubmit',
        name: '类目轴配置提交事件',
        param: {
          config: this.axisConfig,
          moduleId: this.moduleId,
          close: () => {
            this.close()
          }
        }
      })
    }
  }
}
