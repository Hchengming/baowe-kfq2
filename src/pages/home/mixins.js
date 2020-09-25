import axios from 'axios'
export const elementMethodsMixins = {
  data () {
    return {
      iframeUrl: 'http://23.36.250.99:666/views/showmap.html?callid=10129', // iframe路径
      iframeShow: false, // iframe显示控制
      iframeClass: '', // iframe其他类名
      nowKfqflqk: '', // 用地类型
      csData: [
        {
          sort: 1,
          code: '001',
          dw: '事业部',
          sx: '测试中',
          fsr: '张三',
          xmlb: '测试项目',
          jssj: '2020-04-08 11:22:22'
        },
        {
          sort: 2,
          code: '002',
          dw: '事业部',
          sx: '测试中',
          fsr: '李氏',
          xmlb: '测试项目',
          jssj: '2020-04-08 11:22:22'
        }
      ]
      // 详情列表测试数据
      // destailTableCS:{}
    }
  },
  methods: {
    // 菜单点击事件
    menuClick () {},
    // 图表组件行点击事件
    rowClick () {},
    axiosCommon (reqData, obj, fn) {
      obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
      axios
        .post(this.settingConfig.dataUrl + obj.url, reqData)
        .then(res => {
          if (res.data.code === 20000) {
            let resData = res.data.data
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
    getTopBarData (obj) {
      console.log(obj, '顶部栏查询数据处理')
      if (obj.menuId === '8614b06f-1591-48de-a205-dfa44bb5f27b') {
        obj.sftsqk(true)
        axios
          .post(this.settingConfig.dataUrl + '/kfqcxtj/getKfqmjqkData', {})
          .then(res => {
            let code = res.data.code
            let resData = res.data.data
            if (code === 20000) {
              obj.tsqkData(resData)
            }
          })
      } else if (obj.menuId === 'e9ab2bd0cbc011eaad11d500e182c5cf') {
        obj.sftsqk(true)
        axios
          .post(this.settingConfig.dataUrl + '/kfqcxtj/getKfqmjqkData', {})
          .then(res => {
            let code = res.data.code
            let resData = res.data.data
            if (code === 20000) {
              obj.tsqkData(resData)
            }
          })
      }
    },
    // 开发区特殊图表数据处理
    getchartsList (obj) {
      this.csItemData(obj)
      // 查询统计--开发区统计数据处理
      if (obj.config.moduleId === 'be548b710e60489d8b62209d4952c7de') {
        // 确认未特殊情况，拦截默认数据请求处理
        this.axiosCommon({}, obj, resData => {
          let datas = resData.kfqdjPOS.concat(resData.kfqpjflPOS)
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === '3f727d02b84a40febd4245425b524bb6') {
        // 查询统计--开发区统计--开发区个数单元格下钻数据处理
        let reqData = {}
        if (obj.flmc === '国家级' || obj.flmc === '省级') {
          reqData.kfqjb = obj.flmc
        } else if (obj.flmc.indexOf('型') > -1) {
          reqData.kfqpjlx = obj.flmc
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === '5adc8916284043f7b0b407be4a0ddb45') {
        // 查询统计--开发区统计--开发区面积单元格下钻--用地构成数据处理
        let reqData = {}
        if (obj.flmc === '国家级' || obj.flmc === '省级') {
          reqData.kfqjb = obj.flmc
        } else if (obj.flmc.indexOf('型') > -1) {
          reqData.kfqpjlx = obj.flmc
        }
        reqData.ydflmc = '规划用地面积'
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === '77543b2481634b6eb72928e191363466') {
        // 查询统计--开发区统计--开发区面积单元格下钻--用地分类数据处理
        let reqData = {}
        if (obj.flmc === '国家级' || obj.flmc === '省级') {
          reqData.kfqjb = obj.flmc
        } else if (obj.flmc.indexOf('型') > -1) {
          reqData.kfqpjlx = obj.flmc
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === '9b4a6a24b8924a0abea954ff65406d1a') {
        // 各区开发区用地情况
        let reqData = {
          kfqflqk: obj.kfqflqk
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === 'af241261ece84295875a16c869db2111') {
        // 查询统计--各区开发区用地情况下钻--开发区分类情况数据处理
        let reqData = {
          kfqflqk: obj.kfqflqk,
          xzqmc: obj.qxmc
        }
        this.axiosCommon(reqData, obj, resData => {
          let datas = resData.kfqflqkPOS.kfqdjPOS.concat(
            resData.kfqflqkPOS.kfqpjflPOS
          )
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === '6b3a087daa2141a0aa0c54e24e71b43f') {
        // 查询统计--各区开发区用地情况下钻--用地构成数据处理
        let reqData = {
          kfqflqk: obj.kfqflqk,
          xzqmc: obj.qxmc
        }
        this.axiosCommon(reqData, obj, resData => {
          let datas = resData.kfqydgcqkPOS
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === '3b7cb3df8b4e4e7abeb6cef06093ce65') {
        // 查询统计--各区开发区用地情况下钻--开发区列表数据处理
        this.nowKfqflqk = obj.kfqflqk
        // console.log(nowKfqflqk)
        let reqData = {
          kfqflqk: obj.kfqflqk,
          pageCurrent: obj.currentPage,
          pageSize: obj.pageSize,
          xzqmc: obj.qxmc
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === '5884ee4dde24457aba42327ea0384b65') {
        // 开发区-详情-基本情况数据处理
        let reqData = {
          kfqflqk: this.nowKfqflqk,
          kfqmc: obj.kfqmc
        }

        this.axiosCommon(reqData, obj, resData => {
          // console.log(resData.kfqjbxxPOS)
          obj.tsqkData(resData.kfqjbxxPOS[0])
        })
      } else if (obj.config.moduleId === 'ea39c411e67b4e859c2b5c3bfe6adba4') {
        // 开发区-详情-用地分类情况数据处理
        let reqData = {
          kfqflqk: this.nowKfqflqk,
          kfqmc: obj.kfqmc
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData.kfqflqkPOS)
        })
      } else if (
        //
        obj.config.moduleId === '25941eb624bb4366a6ceb3c61046e73f' ||
        obj.config.moduleId === '67455c2f9c424562b8238805cdc7c5b3'
      ) {
        // 开发区-详情-用地构成情况数据处理
        let reqData = {
          kfqflqk: this.nowKfqflqk,
          kfqmc: obj.kfqmc
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData.kfqydgcqkPOS)
        })
      } else if (obj.config.moduleId === 'ab5f5a74b8b34389ab0f1384ae5cba37') {
        // 开发区-详情-日常监管信息数据处理
        let reqData = {
          pageCurrent: obj.currentPage,
          pageSize: obj.pageSize,
          kfqmc: obj.kfqmc
        }
        this.axiosCommon(reqData, obj, resData => {
          // console.log(resData.data)
          let datas = {
            list: resData.data,
            totalCount: resData.totalCount
          }
          obj.tsqkData(datas)
        })
      } else if (
        obj.config.moduleId === 'f078bac9b83445b395a79ad883bc6c9b' ||
        obj.config.moduleId === '3d47c3e05ffd4554b60ba4e28a3d6b03'
      ) {
        // 业务审批-测试数据
        obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
        obj.tsqkData(this.csData)
      } else if (obj.config.moduleId === '27845f321cc243c68dce3d0310748e07') {
        // 监测监管-日常监管信息数据处理
        let reqData = {
          endTime: '',
          startTime: ''
        }
        this.axiosCommon(reqData, obj, resData => {
          resData.list.forEach(item => {
            item.jgsl = Number(item.jgsl)
          })
          obj.tsqkData(resData.list)
        })
      } else if (obj.config.moduleId === '96536bf426af4721b426142fe1197799') {
        // 监测监管-日常监管信息数据处理
        let reqData = {
          endTime: '',
          kfqmc: '',
          pageCurrent: obj.currentPage,
          pageSize: obj.pageSize,
          startTime: ''
        }
        this.axiosCommon(reqData, obj, resData => {
          let datas = {
            list: resData.list,
            totalCount: resData.totalCount
          }

          // console.log(resData)
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === 'cb6077e904754ce5bbeca26a8245ceb7') {
        obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
        obj.tsqkData({
          sort: 1,
          code: '002',
          dw: '事业部',
          sx: '测试中',
          fsr: '李氏',
          xmlb: '测试项目'
        })
      }
    },
    csItemData (obj) {
      if (obj.config.moduleId === 'cdbf2a5005054819b298ca57c4f0dbc4') {
        // console.log(obj)
        obj.url = '/kfqcxtj/getKfqydqkDataByKfqflqk'
        this.axiosCommon({ kfqflqk: obj.kfqflqk }, obj, resData => {
          // let datas = {
          //   list: resData.list,
          //   totalCount: resData.totalCount
          // }

          // console.log(resData)
          obj.tsqkData(resData)
        })
      }
      //
    }
  }
}

// getKfqflDetailsData
// dqsjend: ""
// dqsjstart: ""
// kfqjb: "国家级"
// ydflmc: "规划用地面积"
