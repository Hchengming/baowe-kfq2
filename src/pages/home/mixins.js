import axios from 'axios'
export const elementMethodsMixins = {
  data() {
    return {
      iframeUrl: 'http://23.36.250.99:666/views/showmap.html?callid=10129', //iframe路径
      iframeShow: false, //iframe显示控制
      iframeClass: '', //iframe其他类名
      nowKfqflqk: '', //用地类型
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
      //详情列表测试数据
      // destailTableCS:{}
    }
  },
  methods: {
    //改变图表渲染数据
    changeChartsData() {
      let obj = {
        moduleId: '12345',
        data: [], //渲染数据
        paginationAll: {
          currentPage: 1,
          pageSize: 10,
          total: 120
        }
      }
      this.$refs['baoweiCharts'].changeChartsData(obj)
    },
    //菜单点击事件
    menuClick() {
      this.changeChartsData()
    },
    //图表组件行点击事件
    rowClick() {
      // if (obj.moduleId === 'c0b9411a32474571a5bf14cc1337a4bc') {
      //   switch (obj.rowItem.xmjd) {
      //     case '申报':
      //       this.$refs['baoweiCharts'].menuJump('SBMX')
      //       break
      //     case '立项':
      //       this.$refs['baoweiCharts'].menuJump('LXMX')
      //       break
      //     case '实施中':
      //       this.$refs['baoweiCharts'].menuJump('SSMX')
      //       break
      //     case '结题':
      //       this.$refs['baoweiCharts'].menuJump('XMCGGL')
      //       break
      //   }
      // }
    },
    axiosCommon(reqData, obj, fn) {
      obj.sftsqk(true) //确认未特殊情况，拦截默认数据请求处理
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
    //顶部栏查询数据处理
    getTopBarData(obj) {
      // console.log(obj, '顶部栏查询数据处理')
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
    getchartsList(obj) {
      this.kjxmcssj(obj)
      this.csItemData(obj)
      //查询统计--开发区统计数据处理
      if (obj.config.moduleId === 'be548b710e60489d8b62209d4952c7de') {
        //确认未特殊情况，拦截默认数据请求处理
        this.axiosCommon({}, obj, resData => {
          let datas = resData.kfqdjPOS.concat(resData.kfqpjflPOS)
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === '3f727d02b84a40febd4245425b524bb6') {
        //查询统计--开发区统计--开发区个数单元格下钻数据处理
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
        //查询统计--开发区统计--开发区面积单元格下钻--用地构成数据处理
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
        //查询统计--开发区统计--开发区面积单元格下钻--用地分类数据处理
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
        //各区开发区用地情况
        let reqData = {
          kfqflqk: obj.kfqflqk
        }
        this.axiosCommon(reqData, obj, resData => {
          obj.tsqkData(resData)
        })
      } else if (obj.config.moduleId === 'af241261ece84295875a16c869db2111') {
        //查询统计--各区开发区用地情况下钻--开发区分类情况数据处理
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
        //查询统计--各区开发区用地情况下钻--用地构成数据处理
        let reqData = {
          kfqflqk: obj.kfqflqk,
          xzqmc: obj.qxmc
        }
        this.axiosCommon(reqData, obj, resData => {
          let datas = resData.kfqydgcqkPOS
          obj.tsqkData(datas)
        })
      } else if (obj.config.moduleId === '3b7cb3df8b4e4e7abeb6cef06093ce65') {
        //查询统计--各区开发区用地情况下钻--开发区列表数据处理
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
        //开发区-详情-基本情况数据处理
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
        obj.config.moduleId == '67455c2f9c424562b8238805cdc7c5b3'
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
        //业务审批-测试数据
        obj.sftsqk(true) //确认未特殊情况，拦截默认数据请求处理
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
        obj.sftsqk(true) //确认未特殊情况，拦截默认数据请求处理
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
    //科技项目管理系统--测试数据导入
    kjxmcssj(obj) {
      let csmoduleIdArr = [
        '2caa113e4dd74436bcf45724d2f73402',
        '09fe68333aec4eb89cc3e50b0b42d9c1',
        '0ca2001b54ab4cbca80a9cde0a28f971',
        'd8675563f28a4a83806c3ab55a24f5eb'
      ]
      if (csmoduleIdArr.indexOf(obj.config.moduleId) > -1) {
        // 项目成果管理
        obj.sftsqk(true)
        let keyArr = obj.config.contentAreaConfig.keyArr

        obj.tsqkData(this.setCSdata(keyArr))
      } else if (obj.config.moduleId === 'c0b9411a32474571a5bf14cc1337a4bc') {
        obj.sftsqk(true)
        let data = [
          {
            xmjd: '申报',
            menuCode: 'SBMX',
            xmsl: 8
          },
          {
            xmjd: '立项',
            menuCode: 'LXMX',
            xmsl: 12
          },
          {
            xmjd: '实施中',
            menuCode: 'SSMX',
            xmsl: 12
          },
          {
            xmjd: '结题',
            menuCode: 'XMCGGL',
            xmsl: 2
          }
        ]
        obj.tsqkData(data)
      } else if (obj.config.moduleId === '202cd225e93f424ea7cc235a2b44a031') {
        obj.sftsqk(true)
        let data = [
          {
            gg:
              '解放军军机进入台湾西南空域解放军军机进入台湾西南空域解放军军机进入台湾西南空域'
          },
          {
            gg: '青岛涉冷链样本检出51份阳性'
          },
          {
            gg: '郭麒麟问虞书欣怎么总卖萌'
          },
          {
            gg: '俄6名罪犯用勺子挖隧道越狱'
          }
        ]
        obj.tsqkData(data)
      } else if (obj.config.moduleId === 'ad19ebf29fe5410b886c30389c0f727d') {
        obj.sftsqk(true)
        let data = [
          {
            title: '自定义配置项目操作文档.docx'
          },
          {
            title: '开发区一张图系统对外提供接口调用方式.docx'
          },
          {
            title: '自定义框架开发计划.xlsx'
          },
          {
            title: '自定义工具配置规范.docx'
          }
        ]
        obj.tsqkData(data)
      } else if (obj.config.moduleId === '697bebafe1af42d2a8394a7b2ef28d97') {
        obj.sftsqk(true)
        let data = []
        let nf = 2000
        for (let i = 0; i < 20; i++) {
          nf += 1
          data.push({
            nf: nf + '年',
            num: Math.floor(Math.random() * 100)
          })
        }
        obj.tsqkData(data)
      }
    },
    //测试数据配置
    setCSdata(keyArr) {
      let arr = []
      for (let i = 0; i < 20; i++) {
        let obj = {}
        keyArr.forEach(item => {
          obj[item.key] = '测试' + Math.floor(Math.random() * 10000)
        })
        arr.push(obj)
      }
      return {
        list: arr,
        totalCount: 40
      }
    },
    csItemData(obj) {
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
