import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      nowPageData: [], // 当前页面自定义配置模块集合
      bigDataArr: []
    }
  },
  methods: {
    // 大数据编排项目初始化数据获取
    setBigData() {
      this.menuId = this.settingConfig.answerId
      // 1、当前页面配置模块获取
      this.getData2(this.settingConfig.answerId, (data1) => {
        this.bigDataArr = data1
        this.nowPageData = JSON.parse(JSON.stringify(data1))
        const moduleCodeArr = []
        data1.forEach(item => {
          if (item.contentAreaConfig) {
            moduleCodeArr.push(JSON.parse(item.contentAreaConfig).moduleCode)
          }
        })
        // 2、模板页面配置模块获取
        this.getData2(this.settingConfig.bigData.bigDataTemplateId, (data2) => {
          // 获取模板编码
          data2.forEach(item => {
            const code = JSON.parse(item.contentAreaConfig).moduleCode
            if (moduleCodeArr.indexOf(code) === -1) {
              this.bigDataArr.push(item)
            }
          })
          // 3、数据整理使用
          this.setPageData(this.bigDataArr)
        })
      })
    },
    // 模块图表配置数据获取(大数据模板)
    getData2(menuId, fnc) {
      serviceAxios['post'](
        this.settingConfig.commonUrl +
          '/busSecondmasterpageconfig/querySecondMasterPageConfigDataBegin',
        {
          menuId
        }
      )
        .then(res => {
          const resData = res.data
          fnc(resData)
        })
        .catch(msg => {
          this.$message({
            message: '大数据看板配置数据请求失败' + msg,
            type: 'error'
          })
          return false
        })
    }
  }
}
