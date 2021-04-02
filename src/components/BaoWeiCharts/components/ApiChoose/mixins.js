import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      // dataViewList: [], //视图列表
      // itemApiData: [], //应用接口列表
      viewId: ''
    }
  },
  mounted() {
    if (this.form.apiType === '0') {
      this.getDataIview()
    } else {
      this.getItemApi()
    }
  },
  methods: {
    // 项目所有接口获取--应用接口列表获取
    getItemApi() {
      const method = this.settingConfig.isCustomMenu ? 'post' : 'get'
      let url = ''

      if (!this.settingConfig.isCustomMenu) {
        const serviceId = this.settingConfig.serviceId ? this.settingConfig.serviceId : this.settingConfig.answerId
        url = window.BaseApi + `/shareservice/app/authorizeListByApp?uuid=${serviceId}`
      } else {
        url = this.settingConfig.getInterfaceUrl
      }
      serviceAxios[method](url, {}).then(res => {
        if (res.code === 20000) {
          // this.itemApiData = res.data
          res.data.forEach(item => {
            item.url = item.aaaRequestUrl
            const num = item.aaaRequestUrl.indexOf('/api/service')
            item.aaaRequestUrl = item.aaaRequestUrl.substring(num)
          })
          this.$emit('update:itemApiData', res.data)
        }
      })
    },
    // 视图id变化事件
    viewIdChange() {

    },
    // 数据视图列表获取
    getDataIview() {
      let url = ''
      let options = 'get'
      // 判断当前后台环境是 node/java
      const isTestEnvironment = this.settingConfig.isTestEnvironment
      let reqData = {
        params: {
          appCode: this.settingConfig.answerId
        }
      }
      if (isTestEnvironment) {
        if (isTestEnvironment === 'java') {
          url = this.settingConfig.commonUrl + '/dataView/selectViewAllData'
          options = 'post'
          reqData = {
            appCode: this.settingConfig.answerId,
            pageCurrent: 1,
            pageSize: 10000
          }
        } else {
          url = this.settingConfig.commonUrl + '/dataView/viewList'
        }
      } else {
        url = window.BaseApi + '/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus='
      }
      serviceAxios[options](
        url, reqData
      )
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            // this.dataViewList = resData.records
            this.$emit('update:dataViewList', resData.records)
          }
        })
    },
    // 接口名称变化事件
    urlNameChange(val) {
      this.itemApiData.forEach(item => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    }

  }
}
