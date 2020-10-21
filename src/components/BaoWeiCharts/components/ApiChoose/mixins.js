import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {}
  },
  methods: {
    //数据视图列表获取
    getDataIview() {
      serviceAxios
        .get(
          'http://23.36.250.116:8044/api/.DataView/view/v1/list?datasourceId=&parentViewId=&viewType=VIEW&viewCodeOrComment=&viewStatus=PUBLISHED',
          {
            params: {
              appCode: '51017107-15bf-488f-adb3-c59b8ef3fdf0'
            }
          }
        )
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            console.log(resData)
          }
        })
    },
    //数据视图参数获取
    getDataIviewParams(viewId) {
      console.log(viewId)
      serviceAxios
        .get('http://23.36.250.116:8044/api/.DataView/param/v1/list', {
          params: {
            viewId: 'a1d660fe-e0c6-94c2-9e21-4ed618cbfdd9'
          }
        })
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            console.log(resData)
          }
        })
    },
    // 接口名称变化事件
    urlNameChange(val) {
      //  console.log(val)
      this.itemApiData.forEach(item => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    },
    // 接口路径变化事件
    urlChange(val) {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === val) {
          this.form.options = item.method
          this.form.urlName = item.apeName
        }
      })
    },
    // 字段获取事件
    getKeysData() {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === this.form.url && item.param) {
          this.$emit('getKeysData', item.param)
        }
      })
    }
  }
}
