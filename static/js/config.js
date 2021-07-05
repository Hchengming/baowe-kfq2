const fn1 = () => {
  window.BaseApi = 'http://localhost:4000'
  window.config = {
    // BaseApi: "http://localhost:4000",
    applicationInterfaceApi: 'http://localhost:4000' // 二级首页配置--应用接口公共api
  }
}

const fn2 = () => {
  window.BaseApi = 'http://23.36.123.128/api'
  window.config = {
    // BaseApi: "http://localhost:4000",
    SecondPageApi: 'http://23.36.123.82:8005', // 二级首页配置--应用接口公共api
    // 二级首页数据接口地址
    SecondPageDataApi: 'http://23.36.123.33:38080'
  }
}

const type = '1'

type === '1' ? fn1() : fn2()
