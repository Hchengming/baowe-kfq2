export default {
  data() {
    const _this = this
    return {
      mapPramConfig: [], // 地图参数配置数据
      mapPramCloums: [
        {
          // 地图参数配置项
          key: 'paramKey',
          label: '参数名',
          width: 250,
          formType: 'input'
        },
        {
          key: 'description',
          label: '释义',
          width: 250,
          formType: 'input'
        },
        {
          key: 'paramValue',
          label: '值',
          width: 250,
          change(items, index, item) {
            _this.mapParamValueChange(items, index, item)
          },
          formType(items, index, item) {
            return items.formType ? items.formType : 'input'
          },
          selectArr(items, index, item) {
            return items.selectArr ? items.selectArr : []
          }
        }
      ]
    }
  },
  watch: {
    'settingConfig.mapPramConfig': {
      handler() {
        this.mapPramConfigChange()
      },
      deep: true
    }
  },
  mounted() {
    if (this.form.iframeAll && this.form.iframeAll.mapPramConfig) {
      this.mapPramConfigChange()
    }
  },
  methods: {
    // 默认值变化事件
    mapParamValueChange(items, index, item) {
      this.settingConfig.mapPramConfig.forEach(val => {
        // console.log(item, val.paramKey)
        if (val.paramKey === 'type') {
          val.paramValue = items[item.key]
          // console.log(val.paramValue)
        }
      })
    },
    // 默认参数配置数据更新
    mapPramConfigChange() {
      if (this.settingConfig.mapPramConfig && this.form.iframeAll.mapPramConfig) {
        if (this.form.iframeAll.mapPramConfig.length === 0) {
          this.form.iframeAll.mapPramConfig = this.settingConfig.mapPramConfig
        } else {
          this.settingConfig.mapPramConfig.forEach(val => {
            this.form.iframeAll.mapPramConfig.forEach(item => {
              if (item.paramKey === val.paramKey && val.isShow !== item.isShow) {
                item.isShow = val.isShow
                console.log(item, item.isShow)
              }
            })
          })
        }
      }
    },
    setParamValue() {
      // this.settingConfig.mapPramConfig
    }
  }
}
