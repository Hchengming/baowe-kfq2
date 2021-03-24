import country from '../../../components/Where2.0/CommonWhere/find/Country/country.json'
export default {
  methods: {
    // 区县单选返回数据处理1
    setCountryRadio(config, reqData) {
      for (const key in reqData) {
        const screenData = config.contentAreaConfig.filterConfig.screenData
        screenData.forEach(item => {
          if (item.type === 'country-radio' && item.key === key) {
            reqData[key] = this.countryRadioValue(reqData[key])
          }
        })
      }
    },
    // 数据值数组化
    countryRadioValue(val) {
      let str = ''
      if (val === '市局' || val === '所有') {
        country.forEach(item => {
          if (item.children) {
            item.children.forEach(x => {
              if (x !== '所有') {
                if (str === '') {
                  str = x
                } else {
                  str += (',' + x)
                }
              }
            })
          }
        })
      } else {
        str = val
      }
      return str
    }
  }
}
