import axios from 'axios'
import { MessageBox } from 'element-ui'
const service = axios.create({
  // baseURL: window.config.BaseApi, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // TODO:数据视图同步数据字段需要6秒以上
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'cessssssssssssssssssssssssssssssssssssss'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
/**
 * If you want to get http information such as headers or status
 * Please return  response => response
 */
service.interceptors.response.use(
  response => {
    let res = response.data
    const headers = response.headers

    if (typeof res === 'string') {
      res = JSON.parse(res)
    }

    // 文件下载
    if (
      res.type &&
      (res.type.indexOf('application/octet-stream') > -1 ||
        res.type.indexOf('text/xml') > -1)
    ) {
      // 头部信息（包含文件名）
      res.headers = headers
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          '您已注销，您可以取消以停留在此页，或重新登录',
          '确认退出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '返回',
            type: 'warning'
          }
        ).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      }
      return Promise.reject(new Error(res.message || '未指定的错误'))
    } else {
      return res
    }
  },
  error => {
    if (error.response && error.response.data) {
      switch (error.response.data.code) {
        case 50014:
          MessageBox.confirm(
            '您的登录已经过期。您可以[取消]以停留在此页或[重新登录]',
            '确认退出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '返回',
              type: 'warning'
            }
          ).then(() => {
            // store.dispatch('user/resetToken').then(() => {
            //   location.reload()
            // })
          })
          break
        case 401:
          MessageBox.confirm(
            '您无权访问。您可以[取消]以停留在此页或[重新登录]',
            '确认退出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '返回',
              type: 'warning'
            }
          ).then(() => {
            // store.dispatch('user/resetToken').then(() => {
            //   location.reload()
            // })
          })
          break
      }
    }
    let message = '网络错误,请检查网络后重试！'
    message =
      error.message && error.message.indexOf('timeout') > -1
        ? '请求超时，请重试或联系管理员！'
        : message
    return Promise.reject(message)
  }
)

export default service
