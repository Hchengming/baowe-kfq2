import country from '../../../components/Where2.0/CommonWhere/find/Country/country.json'
export default {
  methods: {
    // 区县单选返回数据处理1
    setCountryRadio(config, reqData) {
      for (const key in reqData) {
        const screenData = config.contentAreaConfig.filterConfig.screenData
        screenData.forEach(item => {
          if (item.type === 'country-radio' && item.key === key) {
            console.log(reqData[key])
            reqData[key] = this.countryRadioValue(reqData[key])
          }
        })
      }
    },
    // 数据值数组化
    countryRadioValue(val) {
      let arr = []
      if (val === '市局') {
        country.forEach(item => {
          if (item.children) {
            item.children.forEach(x => {
              if (x !== '所有') {
                arr.push(x)
              }
            })
          }
        })
      } else {
        arr = val.split(',')
      }
      return arr
    }
  }
}
