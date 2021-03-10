// import serviceAxios from './ChartsDataSettting/KeysSetting/node_modules/@/utils/request.js.js'

// 图表组件配置
export const ChartsMixins = {
  data() {
    return {
      dataViewList: [], // 视图列表数据  。
      itemApiData: [], // 应用接口列表数据
      isPageDisabled: false,
      listKeyAll: false, // 列表全选
      chartsKeyAll: false, // 图表全选
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
        proportion: 12 // 详情表格类列宽
      },
      proportionAll: [
        {
          label: '1',
          value: 24
        },
        {
          label: '2/3',
          value: 16
        },
        {
          label: '1/2',
          value: 12
        },
        {
          label: '1/3',
          value: 8
        }
      ]
    }
  },
  methods: {
    // 接口类型切换事件
    apiTypeChange(val) {
      this.isPageDisabled = false
      this.form.url = ''
      this.form.urlName = ''
      if (val === '0') {
        this.form.isPage = '1'
        this.isPageDisabled = true
        this.form.options = 'POST'
        this.$refs['apiChoose'].getDataIview()
        // 判断当前后台环境是否为node测试环境
        if (this.settingConfig.isTestEnvironment) {
          this.form.url = '/dataView/searchResult'
        } else {
          this.form.url = '/.DataView/view/v1/sql/searchResult'
        }
      } else {
        this.form.options = 'GET'
        this.$refs['apiChoose'].getItemApi()
      }
    },
    // 是否下钻切换事件
    submoduleChange(val) {
      if (val === '1') return false
      let html = ''
      if (this.statisticsAll) {
        if (
          this.form.clickToShow === 'row' &&
          this.statisticsAll.isRowDrillDown === '1'
        ) {
          html =
            '当前单元格点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop2'].show(html)
        } else if (
          this.form.clickToShow === 'cell' &&
          this.statisticsAll.drillDownKeyAll
        ) {
          html =
            '当前行点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop2'].show(html)
        }
      }
    },
    // 行点击、单元格点击切换事件
    clickToShowChange(val) {
      let html = ''
      if (this.statisticsAll) {
        if (val === 'row' && this.statisticsAll.drillDownKeyAll) {
          html =
            '当前单元格点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop'].show(html, 'cell')
        } else if (
          val === 'cell' &&
          this.statisticsAll.isRowDrillDown === '1'
        ) {
          html =
            '当前行点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop'].show(html, 'row')
        }
      }
    },
    // 行点击、单元格点击--切换取消事件
    handleClose(clickToShow) {
      this.form.clickToShow = clickToShow
    },
    // 是否下钻切换事件
    handleClose2() {
      this.form.submodule = '1'
    },

    // 强制删除字段确认事件
    judgePopConfirm() {
      this.form.keyArr.splice(this.deleteKeyIndex, 1)
    }
  }
}

export const iframeMixins = {
  methods: {
    // iframe选择类型变化事件
    iframeTypeChange(type) {
      if (type === '1') {
        const menuItem = JSON.parse(sessionStorage.getItem('menuItem'))
        this.form.paramConfig = []
        for (const key in menuItem) {
          if (key !== 'children') {
            this.form.paramConfig.push({
              paramKey: key,
              description: '',
              paramValue: menuItem[key],
              dataType: typeof menuItem[key],
              isUse: false
            })
          }
        }
      }
      this.$refs.paramKeyConfig.getCommonParams()
    },
    // iframe参数选择变化事件
    iframeUseChange() {
      const obj = {}
      this.form.paramConfig.forEach(item => {
        if (item.isUse) {
          obj[item.paramKey] = item.paramValue
        }
      })
      const paramsStr = this.setParamsUrl(obj)
      const num = this.form.iframeAll.iframeUrl.indexOf('html')
      if (num > -1) {
        this.form.iframeAll.iframeUrl =
          this.form.iframeAll.iframeUrl.substring(0, num + 4) + paramsStr
      } else {
        this.form.iframeAll.iframeUrl = paramsStr
      }
    },
    // 参数配置事件
    setParamsUrl(obj) {
      let result = ''
      let item
      for (item in obj) {
        if (obj[item] && String(obj[item])) {
          result += `&${item}=${obj[item]}`
        }
      }
      if (result) {
        result = '?' + result.slice(1)
      }
      return result
    }
  }
}
import dataPresentation from './dataPresentation.json'
export const otherMixins = {
  data() {
    return {
      dialogRef: 'settingFormDialog', // 弹出框refs名
      dialogVisible: false,
      options: [],
      rules: [],
      csData: [],
      scrollTop: 0,
      deleteKeyIndex: null,
      settingJsonIsShow: false,
      parentParamsAll: {}, // 父级下钻参数
      defaultData: [
        {
          title: '',
          num: '',
          area: '',
          rowid: '001'
        }
      ]
    }
  },

  watch: {
    form: {
      handler() {
        this.formInit()
      }
    },
    deep: true
  },
  mounted() {
    this.options = []
    this.formInit()
    dataPresentation.forEach(item => {
      this.options.push({
        value: item.type,
        label: item.title
      })
    })
  },
  methods: {
    // form数据初始化
    formInit() {
      if (!this.form) return
      // console.log(this.form, 'this.form')
      if (!this.form.blankTemplateConfig) {
        this.form.blankTemplateConfig = {}
      }
      // 其他表格配置字段初始化 tableOtherConfig
      if (!this.form.tableOtherConfig) {
        this.$set(this.form, 'tableOtherConfig', {
          tableType: '0',
          onlyKey: '',
          childKey: 'children'
        })
      }
    },
    // 内容部分下拉事件
    elDialogBodyScroll() {
      const _this = this
      this.$nextTick(() => {
        const dom = document.querySelector(
          '#' + this.settingFormId() + ' .el-dialog__body'
        )
        dom.onscroll = function(e) {
          _this.scrollTop = e.target.scrollTop
          // console.log(this.scrollTop)
        }
      })
    },
    // 模块id设置
    settingFormId() {
      return this.statisticsAll
        ? 'settingForm' + this.statisticsAll.moduleId
        : 'settingForm'
    },

    // 通过配置json数据 修改配置数据事件
    setForm(settingForm) {
      for (const key in settingForm) {
        this.form[key] = settingForm[key]
      }
    },
    // 模板类型选择变化事件
    moduleTypeChange() {
      this.form.keyArr = []
      this.form.operateButton = []
      this.form.paramConfig = []
      this.form.detailsTableAll = []
      this.form.tableHeaderConfig = {}
    },
    // 高度一键铺满
    heightMax() {
      this.form.height = 100
      this.form.top = 0
    },
    // 宽度一键铺满
    widthMax() {
      this.form.width = 100
      this.form.left = 0
    },
    // 弹窗关闭事件
    close() {
      this.dialogVisible = false
      // this.$refs['settingForm'].resetFields()
    },
    // 弹窗显示事件
    show(obj) {
      this.dialogVisible = true
      // console.log(this.form)
      if (obj) {
        this.parentParamsAll = obj
      }
      //   console.log(this.form);
      // 配置数据旧版本兼容处理
      this.compatibleProcessing()

      // this.form.isDrafting = !!this.form.isDrafting;
      // 内容部分下拉事件
      this.elDialogBodyScroll()
      // 图表、列表全选按钮控制
      this.keyChooseAllShow()
      // console.log(this.form)

      // 判断当项目用于大数据编排项目时请求路径确定
      if (this.settingConfig.isBigData) {
        this.$nextTick(() => {
          // console.log(this.form.moduleType, 'his.form.moduleType')
          if (this.form.moduleType === '0') {
            this.form.apiType = '0'
            this.form.viewId = this.settingConfig.bigData.viewId
            // 判断当前后台环境是否为node测试环境  那就不走了呗
            if (this.settingConfig.isTestEnvironment) {
              this.form.url = '/dataView/searchResult'
            } else {
              this.form.url = '/.DataView/view/v1/sql/searchResult'
            }
            this.form.options = 'POST'
          }

          // 模板模块新增时生产一个模板编码
          if (
            this.settingConfig.answerId ===
              this.settingConfig.bigData.bigDataTemplateId &&
            !this.statisticsAll
          ) {
            const RandomId = len =>
              Math.random()
                .toString(36)
                .substr(3, len)
            this.form.moduleCode = RandomId(10)
          }
        })
      }
    },
    // 配置数据旧版本兼容处理
    compatibleProcessing() {
      // 01-筛选项配置初始化--旧版本兼容
      if (this.statisticsAll) {
        this.form.filterConfig = this.statisticsAll.conditionAreaConfig
      } else {
        if (!this.form.filterConfig) {
          this.$set(this.form, 'filterConfig', {
            // 筛选项配置信息
            screenData: [], // 查询项配置
            btnSettingData: [], // 查询按钮配置
            isShowInsertButton: '1' // 查询按钮是否显示配置
          })
        }
      }
    },
    // 图表、列表全选按钮控制
    keyChooseAllShow() {
      this.listKeyAll = true
      this.chartsKeyAll = true
      if (this.form.moduleType === '0') {
        this.form.keyArr.forEach(item => {
          if (item.isShow === false) {
            this.listKeyAll = false
          }
          if (item.ischartsShow === false) {
            this.chartsKeyAll = false
          }
        })
      }
    },
    // 表单确认事件
    onSubmit() {
      if (!this.form.moduleType || this.form.moduleType === '0') {
        this.$refs['chartsDataSettting'].screenSubmit(() => {
          // this.form.conditionAreaConfig = conditionAreaConfig
          // console.log(this.form);
          this.$emit('componentFunc', {
            method: 'addKeep',
            name: '模块新增',
            param: {
              contentAreaConfig: this.form
            }
          })
          // this.$emit('submit', this.form)
        })
      } else {
        this.$emit('componentFunc', {
          method: 'addKeep',
          name: '模块新增',
          param: {
            contentAreaConfig: this.form
          }
        })
        // this.$emit('submit', this.form)
      }
    },
    // 接口名称变化事件
    urlNameChange(val) {
      //  console.log(val)
      this.itemApiData.forEach(item => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    },
    // 接口路径变化事件
    urlChange(val) {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === val) {
          this.form.options = item.method
          this.form.urlName = item.apeName
        }
      })
    }
  }
}
