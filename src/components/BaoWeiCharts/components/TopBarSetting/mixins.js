import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      dialogRef: 'topBarSetting',
      itemApiData: [],
      dataViewList: [],
      isShow: false,
      form: {
        url: '',
        urlName: '',
        options: 'GET',
        width: 100,
        // bgKey: "bgcolor", // 背景使用字段   bgType=2 使用
        // bgType: "2", // 背景类型选择  0：单色调 1：双色调 2：自定义
        apiType: '0',
        viewId: '',
        // bg1: "", // 背景一 bgType=0或bgType=1 使用
        // bg2: "", // 背景二  bgType=1 使用
        paramConfig: []
      },
      topBarSettingData: [],
      tableCloums: [{
        label: '索引',
        key: 'index',
        // disabled: true,
        formType: 'number',
        width: 80
      }, {
        label: '背景颜色',
        key: 'background',
        disabled: true,
        formType: 'color',
        width: 80
      }],
      bgColorSettingData: []

    }
  },
  methods: {
    // 颜色配置新增事件暴露
    bgSettingAdd() {
      // console.log(this.bgColorSettingData.length - 1)
      this.bgColorSettingData[this.bgColorSettingData.length - 1].index = this.bgColorSettingData.length - 1
    },
    // 接口类型切换事件
    apiTypeChange(val) {
      this.form.url = ''
      this.form.urlName = ''
      if (val === '0') {
        this.form.options = 'POST'
        this.$refs['apiChoose'].getDataIview()
        // 判断当前后台环境是否为node测试环境
        if (this.settingConfig.isTestEnvironment) {
          this.form.url = this.settingConfig.commonUrl + '/dataView/searchResult'
        } else {
          this.form.url = '/.DataView/view/v1/sql/searchResult'
        }
      } else {
        this.form.options = 'GET'
        this.$refs['apiChoose'].getItemApi()
      }
    },
    // 弹窗显示事件
    show(topBarConfig) {
      if (topBarConfig) {
        this.form = topBarConfig.form
        this.topBarSettingData = topBarConfig.configData
        this.bgColorSettingData = topBarConfig.bgColorSettingData ? topBarConfig.bgColorSettingData : []
      } else {
        this.form = JSON.parse(JSON.stringify(this.form))
        this.topBarSettingData = []
        this.bgColorSettingData = []
      }
      this.isShow = true
    },
    // 弹窗确认事件
    onSubmit() {
      this.$emit(
        'submit', {
          form: this.form,
          topBarSettingData: this.topBarSettingData,
          bgColorSettingData: this.bgColorSettingData
        },
        () => {
          this.isShow = false
        }
      )
    },
    // 字段列表数据获取事件
    getKeys(fn) {
      let params = {}
      this.form.paramConfig.forEach(item => {
        if (item.isUse) {
          switch (item.dataType) {
            case 'number':
              if (Number(item.paramValue)) {
                this.$set(params, item.paramKey, Number(item.paramValue))
              } else {
                params[item.paramKey] = null
              }
              break
            case 'object':
              params[item.paramKey] = null
              if (JSON.parse(item.paramValue)) {
                params[item.paramKey] = JSON.parse(item.paramValue)
              }
              break
            default:
              params[item.paramKey] = item.paramValue
          }
        }
      })
      // console.log(params)
      const options = this.form.options === 'POST' ? 'post' : 'get'
      if (options === 'get') {
        params = {
          params: params
        }
      }
      serviceAxios[options](this.form.url, params).then(res => {
        if (res.code === 20000) {
          const resData = res.data
          fn(resData)
        }
      })
    },
    // 字段获取
    getKeysData() {
      this.topBarSettingData = []
      let offon = false
      this.itemApiData.forEach(items => {
        if (items.aaaRequestUrl === this.form.url && items.returnField) {
          items.returnField.forEach(item => {
            this.topBarSettingData.push({
              key: item.key,
              label: item.label,
              dw: '',
              isShow: true
            })
          })
          offon = true
        }
      })
      if (offon) return false
      this.getKeys(resData => {
        if (resData.constructor !== Array) {
          this.$message({
            message: '返回数据格式错误，需返回标准对象',
            type: 'error'
          })
          return false
        }

        for (const key in resData[0]) {
          this.topBarSettingData.push({
            key: key,
            label: '',
            dw: '',
            isShow: true
          })
        }
        this.topBarSettingData.forEach(items => {
          this.form.paramConfig.forEach(item => {
            if (items.key === item.paramKey) {
              items.label = item.description
            }
          })
        })
      })
    }
  }
}
