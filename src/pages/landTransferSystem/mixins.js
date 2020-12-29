import serviceAxios from '@/utils/request.js'
import axios from 'axios'
export const elementMethodsMixins = {
  data() {
    return {
      nowMenuName: '项目首页', // 当前选中菜单名称
      taskMenuName: [], // 任务办理菜单及子菜单名称
      statisticsMenuName: [] // 数据统计菜单及子菜单名称
    }
  },
  mounted() {},
  methods: {
    // 菜单数据获取
    getMenuData(obj) {
      const menuData = obj.menuData
      menuData.forEach(item => {
        if (item.menuName === '任务办理') {
          this.taskMenuName = ['任务办理']
          item.children.forEach(obj => {
            this.taskMenuName.push(obj.menuName)
          })
        } else if (item.menuName === '数据统计') {
          this.statisticsMenuName = ['数据统计']
          item.children.forEach(obj => {
            this.statisticsMenuName.push(obj.menuName)
          })
        }
      })
    },
    // 模块组件显示隐藏判断
    moduleIsShow(val) {
      return val.indexOf(this.nowMenuName) > -1
    },
    // 菜单点击事件
    menuClick(obj) {
      this.nowMenuName = obj.menuItem.menuName

      // console.log(obj)
    },
    // 图表组件行点击事件
    rowClick() {},
    axiosCommon(reqData, obj, fn) {
      obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
      const url =
                obj.url.indexOf('http') > -1
                  ? obj.url
                  : this.settingConfig.dataUrl + obj.url

      axios
        .post(url, reqData)
        .then(res => {
          if (res.data.code === 20000) {
            const resData = res.data.data
            fn(resData)
          }
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
        })
    },
    // 顶部栏查询数据处理
    getTopBarData() {
      // console.log(obj)
    },
    // 请求日期获取
    getNYR(date) {
      const month = (new Date(date).getMonth() + 1)
      const day = (new Date(date).getDate())
      return new Date(date).getFullYear() + '/' + (month > 9 ? month : ('0' + month)) + '/' + (day > 9 ? day : ('0' + day))
    },
    // 特殊图表数据处理
    getchartsList(obj) {
      const moduleId = obj.config.moduleId
      if (moduleId === '963dc804be7946468bb5beca7bb144f7') {
        obj.sftsqk(true)
        // console.log(new Date(obj.htqdsj).getFullYear())
        let url = obj.config.contentAreaConfig.url
        if (url.indexOf('http') === -1) {
          url = this.settingConfig.dataUrl + url
        }
        serviceAxios.post(url, {
          currentPage: obj.currentPage ? obj.currentPage : 1,
          pageSize: obj.config.contentAreaConfig.pageSize,
          htqdsjks: obj.htqdsjks ? this.getNYR(obj.htqdsjks) : '',
          htqdsjjs: obj.htqdsjjs ? this.getNYR(obj.htqdsjjs) : '',
          htbh: obj.htbh,
          zdwz: obj.zdwz
        }).then(res => {
          const datas = {
            list: res.data.list,
            total: res.data.total
          }
          datas.list.forEach(item => {
            for (const key in item) {
              if (item[key] && key.indexOf('时间') > -1 && item[key].indexOf('/') > -1) {
                const data = item[key].split('/')
                item[key] = data[0] + '年' + data[1] + '月' + data[2] + '日'
              }
            }
            if (item['按开工时间分类'].indexOf('逾期') > -1) {
              item['约定动工时间'] = `${item['约定动工时间']} @{实际动工时间:${item['实际动工时间']}}@`
            } else {
              item['约定动工时间'] = `${item['约定动工时间']}@{实际动工时间:${item['实际动工时间']}}@`
            }
          })
          obj.tsqkData(datas)
        })
      }
      // console.log(obj)
    },
    // 测试数据配置
    setCSdata(keyArr) {
      const arr = []
      for (let i = 0; i < 20; i++) {
        const obj = {}
        keyArr.forEach(item => {
          obj[item.key] = '测试' + Math.floor(Math.random() * 10000)
        })
        arr.push(obj)
      }
      return {
        list: arr,
        totalCount: 40
      }
    }
  }
}
