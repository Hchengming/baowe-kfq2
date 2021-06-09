import country from '../../../components/Where2.0/CommonWhere/find/Country/country.json'
import country2 from '../../../components/Where2.0/CommonWhere/find/CountrySelect/country2.json'
export default {
  methods: {
    // 区县单选返回数据处理1
    setCountryRadio(config, reqData) {
      for (const key in reqData) {
        const screenData = config.contentAreaConfig.filterConfig.screenData
        screenData.forEach(item => {
          if (['country-radio'].indexOf(item.type) > -1 && item.key === key) {
            reqData[key] = this.countryRadioValue(reqData[key])
          }
          if (['country-select'].indexOf(item.type) > -1 && item.key === key) {
            reqData[key] = this.countrySelectValue(reqData[key])
          }
        })
      }
    },
    // 区县-下拉默认值
    countrySelectValue(defaultValue) {
      let str = ''
      country2.forEach(x => {
        if (x.value === defaultValue) {
          if (x.children) {
            const arr = x.children
            arr.splice(0, 1)
            str = arr.toString()
          } else {
            str = this.countryRadioValue('所有')
          }
        } else {
          if (x.children) {
            x.children.forEach(y => {
              if (y === defaultValue) {
                str = y
              }
            })
          }
        }
      })
      return str
    },
    // 数据值数组化
    countryRadioValue(val) {
      let str = ''
      if (val === '市局' || val === '所有' || val === '全市') {
        country.forEach(item => {
          if (item.children) {
            item.children.forEach(x => {
              if (x !== '所有') {
                if (str === '') {
                  str = x
                } else {
                  str += ',' + x
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
