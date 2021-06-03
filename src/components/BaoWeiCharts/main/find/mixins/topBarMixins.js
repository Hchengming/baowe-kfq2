import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      itemApiData: [], // 项目所有接口数据
      dataViewList: [], // 数据视图列表获取
      topListShow: false,
      nowElementId: '', // 当前组件id
      topBarAll: {
        form: {},
        moduleId: '',
        data: [], // 当前顶部数据内容
        configData: [] // 配置数据
      }
    }
  },
  methods: {
    // 顶部栏查询事件
    getTopBarConfig() {
      this.topListShow = false
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
                    '/busElementConfig/getElementDataByModuleId', { moduleId: this.nowMenuItem.menuId }
        )
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.topBarAll.data = []
            if (resData.length > 0) {
              this.topListShow = true
              this.nowElementId = resData[0].elementId
              const elementConfig = JSON.parse(resData[0].elementConfigs)
              this.topBarAll.bgColorSettingData = elementConfig.bgColorSettingData
              this.topBarAll.configData = elementConfig.topBarSettingData
              this.topBarAll.moduleId = resData[0].moduleId
              this.topBarAll.form = elementConfig.form
              this.getTopBarData()
            }
          }
        })
    },
    // 顶部栏渲染是数据变化事件
    changTopAll(viewcChange) {
      viewcChange(this.topBarAll)
    },
    // 具体数据获取
    getTopBarData(interactiveParams) {
      const form = this.topBarAll.form
      // 特殊情况处理 (获取数据格式特殊，默认情况无法处理)
      let sftsqk = false // 当前是否未特殊情况
      this.elementMethods({
        name: '顶部栏数据查询事件',
        methodsName: 'getTopBarData',
        menuId: this.nowMenuItem.menuId,
        config: form,
        interactiveParams, // 被交互数据
        sftsqk: offon => {
          // 是否未特殊情况返回
          sftsqk = !!offon
        },
        tsqkData: data => {
          // console.log('resData:', data)
          // 特殊情况数据处理后返回
          this.topBarAll.data = data
        }
      })
      console.log(form, ' console.log(form.url)')
      if (!sftsqk) {
        const options = form.options === 'GET' ? 'get' : 'post'
        // form.url = '/kfqcxtj/getKfqmjqkData'
        // 判断当前接口是完全接口还是测试接口
        let nowUrl = ''
        console.log(form.url)
        if (form.url.indexOf('http') > -1) {
          nowUrl = form.url
        } else {
          nowUrl = form.url.indexOf('/api/service') > -1 ? window.config.applicationInterfaceApi + form.url : this.settingConfig.dataUrl + form.url
        }
        let reqData = {}
        if (form.paramConfig && form.paramConfig.length > 0) {
          form.paramConfig.forEach(item => {
            if (item.isUse) {
              reqData[item.paramKey] = this.getParamValue(item.paramValue, item)
            }
          })
        }
        // 判断是否为被交互事件执行
        if (interactiveParams) {
          reqData = Object.assign(reqData, interactiveParams)
        }
        this.topBarAll.data = []
        reqData = options === 'get' ? { params: reqData } : reqData
        serviceAxios[options](nowUrl, reqData).then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.topBarAll.data = resData
          }
        })
      }
    },
    // 自定义参数-值获取
    getParamValue(val, item) {
      let paramValue = ''
      if (val && typeof val === 'string' && val.indexOf('${') === 0) {
        const num = val.length - 1
        const key = val.substring(2, num)
        paramValue = localStorage.getItem(key)
      } else {
        paramValue = val
      }
      switch (item.dataType) {
        case 'number':
          if (Number(paramValue)) {
            paramValue = Number(paramValue)
          } else {
            paramValue = null
          }
          break
        case 'object':
          paramValue = JSON.parse(paramValue)
          break
      }
      // console.log(item, val)
      return paramValue
    },
    // 顶部栏新增事件
    topBarAdd(elementConfig, fn) {
      // this.topBarAll = elementConfig.topBarSettingData
      fn()
      const reqObj = {
        moduleId: this.nowMenuItem.menuId,
        projectId: this.settingConfig.answerId,
        elementConfig: elementConfig
      }
      this.topBarEmit(reqObj, '/busElementConfig/insertElementData', '新增', fn)
    },
    // 顶部栏修改事件
    topBarUpdate(elementConfig, fn) {
      const reqObj = {
        moduleId: this.nowMenuItem.menuId,
        elementId: this.nowElementId,
        elementConfig: elementConfig
      }
      this.topBarEmit(reqObj, '/busElementConfig/updateElementData', '修改', fn)
    },
    // 新增、修改提交公共事件
    topBarEmit(reqObj, url, txt, fn) {
      serviceAxios
        .post(this.settingConfig.commonUrl + url, reqObj)
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: txt + '成功',
              type: 'success'
            })
            fn()
            this.getTopBarConfig()
          } else {
            this.$message({
              message: code + '报错',
              type: 'error'
            })
          }
        })
    },
    // 顶部栏删除事件
    topBarDelete() {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/busElementConfig/deleteElemeteById', { elementId: this.nowElementId, moduleId: this.nowMenuItem.menuId }
        )
        .then(res => {
          const code = res.code
          if (code === 20000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTopBarConfig()
          } else {
            this.$message({
              message: code + '报错',
              type: 'error'
            })
          }
        })
    },
    // 顶部菜单点击事件
    topBarClick(item) {
      this.elementMethods({
        name: '顶部菜单点击事件',
        methodsName: 'topBarClick',
        item
      })
      this.topBarInteractive(item)
    }
  }
}
