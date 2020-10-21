export default {
  data() {
    return {
      treeData: [],
      nowIndex: 0
    }
  },
  methods: {
    // 当前接口所有参数获取事件
    getparamConfig() {
      // 项目常用参数变量获取
      this.getCommonParams()
      this.$set(this.form, 'paramConfig', [])
      // 获取当前接口参数
      const arrKey = []
      this.itemApiData.forEach(items => {
        if (items.aaaRequestUrl === this.form.url && items.param) {
          items.param.forEach(item => {
            if (arrKey.indexOf(item.name) === -1) {
              arrKey.push(item.name)
              this.form.paramConfig.push({
                paramKey: item.name,
                description: item.description,
                paramValue: '',
                dataType: item.dataType === 'string' ? 'string' : 'number',
                isUse: true
              })
            }
          })
        }
      })
      // 分页参数配置
      if (this.form.isPage === '1') {
        this.form.paramConfig.push({
          paramKey: 'pageSize',
          description: '每页显示条数',
          paramValue: this.form.pageSize,
          dataType: 'number',
          isUse: true
        })
        this.form.paramConfig.push({
          paramKey: 'currentPage',
          description: '当前页码',
          paramValue: 1,
          dataType: 'number',
          isUse: true
        })
      }
      // 自定义配置筛选项参数写入
      if (
        this.statisticsAll &&
        this.statisticsAll.conditionAreaConfig &&
        this.statisticsAll.conditionAreaConfig.screenData.length > 0
      ) {
        this.statisticsAll.conditionAreaConfig.screenData.forEach(items => {
          let offon = true
          let nowDataType = ''
          switch (items.type) {
            case 'number':
              nowDataType = 'number'
              break
            case 'checkbox':
              nowDataType = 'object'
              break
            default:
              nowDataType = 'string'
          }
          this.form.paramConfig.forEach(item => {
            if (item.paramKey === items.key) {
              if (items.type !== 'checkbox') {
                item.paramValue = this.whereForm[items.key]
              }
              offon = false
            }
          })
          if (offon) {
            // 数据类型判断

            const paramValue =
              nowDataType === 'checkbox'
                ? JSON.stringify(this.whereForm[items.key])
                : this.whereForm[items.key]
            this.form.paramConfig.push({
              paramKey: items.key,
              description: items.label,
              dataType: nowDataType,
              paramValue: paramValue,
              isUse: true
            })
          }
        })
      }
      // 下钻参数写入
      if (this.parentParamsAll && this.parentParamsAll.keyArr) {
        this.parentParamsAll.keyArr.forEach(item => {
          if (item.isCruxKey) {
            this.form.paramConfig.push({
              paramKey: item.key,
              description: item.explain,
              paramValue: '',
              dataType: 'string',
              isUse: true
            })
          }
        })
      }
      if (
        this.parentParamsAll &&
        this.parentParamsAll.parentParamsData &&
        this.parentParamsAll.parentParamsData.length > 0
      ) {
        this.parentParamsAll.parentParamsData.forEach(item => {
          this.form.paramConfig.push(item)
        })
      }

      // 初始值获取----公共参数与当前参数值一致
      this.form.paramConfig.forEach(items => {
        this.treeData.forEach(item => {
          if (items.paramKey === item.paramKey) {
            items.paramValue = item.paramValue
          }
        })
      })
    },
    // 筛选数据树形弹窗配置
    setTreeShow() {
      if (
        this.statisticsAll &&
        this.statisticsAll.conditionAreaConfig &&
        this.statisticsAll.conditionAreaConfig.screenData.length > 0
      ) {
        this.statisticsAll.conditionAreaConfig.screenData.forEach(items => {
          if (this.whereForm[items.key]) {
            let nowDataType = ''
            switch (items.type) {
              case 'number':
                nowDataType = 'number'
                break
              case 'checkbox':
                nowDataType = 'object'
                break
              default:
                nowDataType = 'string'
            }
            this.treeData.push({
              id: this.treeData.length,
              paramKey: items.key,
              dataType: nowDataType,
              paramValue:
                nowDataType === 'object'
                  ? JSON.stringify(this.whereForm[items.key])
                  : this.whereForm[items.key]
            })
          }
        })
      }
    },
    // 项目常用公共参数-值获取
    getCommonParams() {
      this.treeData = []
      this.setTreeShow()
      // 下钻参数写入
      if (
        this.parentParamsAll &&
        this.parentParamsAll.keyArr &&
        this.parentParamsAll.rowData
      ) {
        this.parentParamsAll.keyArr.forEach(item => {
          if (item.isCruxKey && this.parentParamsAll.rowData[item.key]) {
            this.treeData.push({
              id: this.treeData.length,
              paramKey: item.key,
              dataType: 'string',
              paramValue: this.parentParamsAll.rowData[item.key]
            })
          }
        })
      }
      // 用户信息解析
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      for (const key in userInfo) {
        const nowDataType = typeof userInfo[key]
        this.treeData.push({
          id: this.treeData.length,
          paramKey: key,
          dataType: nowDataType,
          paramValue:
            nowDataType === 'object'
              ? JSON.stringify(userInfo[key])
              : userInfo[key]
        })
      }
    },
    // 参数值点击弹出树形弹窗选择事件
    treeShow(datas, index) {
      this.nowIndex = index
      this.$refs.treeModel.show(datas)
      // console.log(this.treeData)
    },
    // 树形弹窗确认事件
    elTreeSubmit(data) {
      const item = this.form.paramConfig[this.nowIndex]
      item.paramValue = data.paramValue
      item.dataType = data.dataType
    },
    // 参数是否使用选择变化事件
    useChange(offon) {
      this.$emit('useChange', offon)
    }
  }
}
