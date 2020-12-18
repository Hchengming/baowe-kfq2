import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      dialogRef: 'topBarSetting',
      isShow: false,
      form: {
        url: '',
        urlName: '',
        options: 'GET',
        width: 100,
        bgKey: 'bgcolor', // 背景使用字段   bgType=2 使用
        bgType: '2', // 背景类型选择  0：单色调 1：双色调 2：自定义
        apiType: '0',
        bg1: '', // 背景一 bgType=0或bgType=1 使用
        bg2: '', // 背景二  bgType=1 使用
        paramConfig: []
      },
      topBarSettingData: [],
      bgColorSettingData: [{
				index: 1,
				bgcolor: '',
			},{
				index: 2,
				bgcolor: '',
			},{
				index: 3,
				bgcolor: '',
			},{
				index: 4,
				bgcolor: '',
			},{
				index:5,
				bgcolor: '',
			}]
    }
  },
  methods: {
    // 接口类型切换事件
    apiTypeChange(val) {
      this.isPageDisabled = false
      if (val === '0') {
        this.form.isPage = '1'
        this.isPageDisabled = true
        this.$refs['apiChoose'].getDataIview()
      } else {
        this.$refs['apiChoose'].getItemApi()
      }
    },
    // 字段删除事件
    keyDelete(index) {
      this.bgColorSettingData.splice(index, 1)
    },
    // 上下点击排序事件
    sortChange(newIndex, nowIndex, item) {
      if (newIndex < 0 || newIndex > this.bgColorSettingData.length - 1) {
        return false
      }
      this.bgColorSettingData.splice(nowIndex, 1)
      this.bgColorSettingData.splice(newIndex, 0, item)
    },
    // 字段新增事件
    keyAdd() {
      this.bgColorSettingData.push({
       index: this.bgColorSettingData[this.bgColorSettingData.length-1].index + 1,
       bgcolor: '',
      })
    },
    // 弹窗显示事件
    show() {
			/* console.log('topBarConfig',topBarConfig)
      if (topBarConfig) {
        this.form = topBarConfig.form
        this.topBarSettingData = topBarConfig.configData
      } else {
        this.form = JSON.parse(JSON.stringify(this.form))
        this.topBarSettingData = []
      } */
      this.isShow = true
    },
    // 弹窗确认事件
    onSubmit() {
      this.$emit(
        'submit', {
          form: this.form,
          topBarSettingData: this.bgColorSettingData
          // bgColorSettingData: this.bgColorSettingData
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
