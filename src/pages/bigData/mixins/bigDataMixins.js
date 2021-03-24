import serviceAxios from '@/utils/request.js'
export default {
  data() {
    return {
      bigDataArr: [],
      rowKey: {
        key: '', // 字段名
        explain: '', // 含义
        dw: '', // 单位
        width: 120, // 列宽度
        isShow: true, // 表格列是否显示
        isCruxKey: false, // 是否作为下级查询参数
        isMapKey: false, // 是否为地图使用字段
        ischartsTitle: false, // 是否为图表标题字段
        ischartsShow: false, // 图表是否显示该字段
        zBgColor: '', // 图表当前字段柱状图，条形图柱背景颜色设置
        cellRenderer: null, // 单元格数据自定义js脚本渲染
        tipRenderer: null, // 单元格鼠标移入悬浮框内容自定义js脚本渲染
        colFixed: 'null', // 表格列固定配置 null/left/right
        colSort: '0', // 列排序功能 0：否 1：是
        proportion: 12, // 详情表格类列宽
        tableCustom: false, // 表格列自适应
        isClick: '0' // 字段是否可点击
      },
      settingForm1: {
        componentType: 'charts',
        title: '地图模块',
        subtitle1: '',
        subtitle2: '',
        elementId: '',
        isAddMoreIcon: '0',
        moreUrl: '',
        moduleType: '1',
        barHisShowType: '0',
        moduleCode: 'ht2amrqeb',
        blankTemplateConfig: {
          slot: ''
        },
        destailTypeTheme: '0',
        apiType: '0',
        viewId: '002',
        url: '/dataView/searchResult',
        urlName: '',
        options: 'POST',
        keyArr: [],
        tableHeaderConfig: {},
        tableOtherConfig: {
          tableType: '0',
          onlyKey: '',
          childKey: 'children'
        },
        operateButton: [],
        paramConfig: [],
        destailsTableLabelWidth: 100,
        detailsTableAll: [],
        iframeAll: {
          iframeType: '0',
          iframeId: '',
          iframeUrl: ''
        },
        height: 99,
        width: 43.44,
        top: 0.5,
        left: 0.2,
        defaultParameters: '',
        zindex: '8',
        displayMode: 'table',
        isDisplayModeHide: false,
        titleShow: '1',
        submodule: '0',
        menuTapAll: {
          isMenuTap: '0',
          menuTapKey: '',
          menuCodeKey: ''
        },
        clickToShow: 'row',
        isLinkMap: '0',
        mapPosition: '0',
        isPage: '0',
        mask: '0',
        pageSize: 10,
        isDestail: '0',
        isDrafting: false,
        isHeaderHide: true,
        isModuleClose: false,
        filterConfig: {
          screenData: [],
          btnSettingData: [],
          isShowInsertButton: '1'
        },
        tablefunctionalComponents: [],
        fatherModuleType: 'page',
        tabsModuleId: '',
        tabsCode: '',
        xName: '',
        yName: ''
      },
      settingForm2: {
        componentType: 'charts',
        title: '列表',
        subtitle1: '',
        subtitle2: '',
        elementId: '',
        isAddMoreIcon: '0',
        moreUrl: '',
        moduleType: '0',
        barHisShowType: '0',
        moduleCode: '3m9wppomh',
        blankTemplateConfig: {
          slot: ''
        },
        destailTypeTheme: '0',
        apiType: '0',
        viewId: '002',
        url: '/dataView/searchResult',
        urlName: '',
        options: 'POST',
        keyArr: [
          // {
          //   key: 'name',
          //   explain: 'name',
          //   dw: '',
          //   width: 120,
          //   isShow: true,
          //   isCruxKey: false,
          //   isMapKey: false,
          //   ischartsTitle: false,
          //   ischartsShow: false,
          //   zBgColor: '',
          //   cellRenderer: null,
          //   tipRenderer: null,
          //   colFixed: 'null',
          //   colSort: '0',
          //   proportion: 12,
          //   tableCustom: false,
          //   isClick: '0'
          // },
          // {
          //   key: 'height',
          //   explain: 'height',
          //   dw: '',
          //   width: 120,
          //   isShow: true,
          //   isCruxKey: false,
          //   isMapKey: false,
          //   ischartsTitle: false,
          //   ischartsShow: false,
          //   zBgColor: '',
          //   cellRenderer: null,
          //   tipRenderer: null,
          //   colFixed: 'null',
          //   colSort: '0',
          //   proportion: 12,
          //   tableCustom: false,
          //   isClick: '0'
          // },
          // {
          //   key: 'weight',
          //   explain: 'weight',
          //   dw: '',
          //   width: 120,
          //   isShow: true,
          //   isCruxKey: false,
          //   isMapKey: false,
          //   ischartsTitle: false,
          //   ischartsShow: false,
          //   zBgColor: '',
          //   cellRenderer: null,
          //   tipRenderer: null,
          //   colFixed: 'null',
          //   colSort: '0',
          //   proportion: 12,
          //   tableCustom: false,
          //   isClick: '0'
          // },
          // {
          //   key: 'age',
          //   explain: 'age',
          //   dw: '',
          //   width: 120,
          //   isShow: true,
          //   isCruxKey: false,
          //   isMapKey: false,
          //   ischartsTitle: false,
          //   ischartsShow: false,
          //   zBgColor: '',
          //   cellRenderer: null,
          //   tipRenderer: null,
          //   colFixed: 'null',
          //   colSort: '0',
          //   proportion: 12,
          //   tableCustom: false,
          //   isClick: '0'
          // },
          // {
          //   key: 'sr',
          //   explain: 'sr',
          //   dw: '',
          //   width: 120,
          //   isShow: true,
          //   isCruxKey: false,
          //   isMapKey: false,
          //   ischartsTitle: false,
          //   ischartsShow: false,
          //   zBgColor: '',
          //   cellRenderer: null,
          //   tipRenderer: null,
          //   colFixed: 'null',
          //   colSort: '0',
          //   proportion: 12,
          //   tableCustom: false,
          //   isClick: '0'
          // }
        ],
        tableHeaderConfig: {},
        tableOtherConfig: {
          tableType: '0',
          onlyKey: '',
          childKey: 'children'
        },
        operateButton: [],
        paramConfig: [],
        destailsTableLabelWidth: 100,
        detailsTableAll: [],
        iframeAll: {
          iframeType: '0',
          iframeId: '',
          iframeUrl: ''
        },
        height: 99,
        width: 55.89,
        top: 0.5,
        left: 43.82,
        defaultParameters: '',
        zindex: '8',
        displayMode: 'table',
        isDisplayModeHide: false,
        titleShow: '1',
        submodule: '0',
        menuTapAll: {
          isMenuTap: '0',
          menuTapKey: '',
          menuCodeKey: ''
        },
        clickToShow: 'row',
        isLinkMap: '0',
        mapPosition: '0',
        isPage: '1',
        mask: '0',
        pageSize: 10,
        isDestail: '0',
        isDrafting: false,
        isHeaderHide: false,
        isModuleClose: false,
        filterConfig: {
          screenData: [],
          btnSettingData: [],
          isShowInsertButton: '1'
        },
        tablefunctionalComponents: [],
        fatherModuleType: 'page',
        tabsModuleId: '',
        tabsCode: '',
        xName: '',
        yName: ''
      }
    }
  },
  methods: {
    // 图表新增事件
    addChartList(contentAreaConfig) {
      // const contentAreaConfig = contentAreaConfig// 新增模块配置数据
      const menuId = this.settingConfig.answerId // 菜单id
      this.$refs['baoweiCharts'].addChartList({ contentAreaConfig, menuId })
    },
    // 图表修改事件---内部传出事件
    updateChartList(obj) {
      console.log(obj.param.contentAreaConfig.iframeAll.mapPramConfig)
      const reqData = {
        secondMasterPageConfigPOS: [
          {
            contentAreaConfig: obj.param.contentAreaConfig,
            moduleId: obj.param.moduleId
          }
        ]
      }
      serviceAxios.post(
        this.settingConfig.commonUrl +
          '/busSecondmasterpageconfig/updateSecondMasterPageConfigData',
        reqData
      ).then(res => {
        this.$message({
          message: '修改成功',
          type: 'scccess'
        })
      })
    },
    // 1-大数据编排项目初始化数据获取---内部传出事件
    setBigData() {
      // 1、当前页面配置模块获取--
      console.log(this.settingConfig.answerId)
      this.getData2(this.settingConfig.answerId, data1 => {
        if (data1.length === 0) {
          // this.getData2(this.settingConfig.bigData.templateId,(data2=>{
          this.addChartList(this.settingForm1)
          this.addChartList(this.settingForm2)
          // }))
        } else {
          this.$refs['baoweiCharts'].getData({ menuId: this.settingConfig.answerId, getPageData: (pageData) => {
            console.log(pageData, '000')
          } })
        }
        // if (data1.length === 0) {
        //   this.settingForm1.iframeAll.iframeUrl = this.settingConfig.bigData.iframeDefaultUrl
        //   this.addKeep({ contentAreaConfig: this.settingForm1 })
        //   this.settingForm2.viewId = this.settingConfig.bigData.viewId
        //   this.getViewKeysData(() => {
        //     this.addKeep({ contentAreaConfig: this.settingForm2 })
        //   })
        // } else {
        //   // this.getData()
        //   const menuId = this.settingConfig.answerId
        //   this.$refs['baoweiCharts'].getData({ menuId })
        // }
      })
    },
    // 数据视图配置字段获取事件
    getViewKeysData(fn) {
      const queryParamList = []
      // 判断当前后台环境是否为node测试环境
      if (this.settingConfig.isTestEnvironment) {
        this.settingForm2.url = '/dataView/searchResult'
      } else {
        this.settingForm2.url = '/.DataView/view/v1/sql/searchResult'
      }
      serviceAxios
        .post(window.BaseApi + this.settingForm2.url, {
          viewId: this.settingForm2.viewId,
          pageSize: 1,
          pageNumber: 1,
          queryParamList: queryParamList
        })
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.settingForm2.keyArr = []
            for (const key in resData.list[0]) {
              const obj = {
                key,
                explain: key
              }
              this.setRowKey(obj)
              this.settingForm2.keyArr.push(obj)
            }
            fn()
          }
        })
    },
    // 字段新增数据格式化
    setRowKey(obj) {
      for (const key in this.rowKey) {
        if (!obj[key]) {
          obj[key] = this.rowKey[key]
        }
      }
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
