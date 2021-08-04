<template>
  <div class="middleware">
    <!-- @firstAddKeep   一级新增(克隆)
         @deleteMoule    模块删除
         @rowClick       行点击事件
         @cellClick   单元格点击事件
         @updateMoule    模块修改事件
         @childSettingAdd  子页面新增事件
         @childInsertData   子页面数据查询事件
         @statisticsClose    子级弹窗关闭事件
         @blankTemplateClose  空白模板关闭事件
         @screenKeep      筛选模块配置数据保存
         @tablePageSort    表格/列表分页点击事件
         @whereSubmit      筛选确认事件
         @detailsAreaConfigEmit  详情配置保存事件
         @whereOtherBtnClick   查询模块其他按钮点击事件
         @statisticsMore  头部右侧更多按钮点击事件
         @operateButtonClick  表格、列表右侧其他按钮点击事件
         @setOptions    图表配置数据暴露，外层定制化配置事件
         @interactive  图表交互按钮点击事件
         @whereFormKeep  筛选数据缓存
         @chartsMethods   传出事件集合
    -->
    <section v-for="(item, index) in pageDatas(pageData)" :key="index">
      <statistics
        ref="statisticsAll"
        :statistics-all="item"
        :browser-x-y="browserXY"
        :setting-config="settingConfig"
        :add-setting-form="addSettingForm"
        @componentFunc="componentFunc"
      >
        <div
          v-if="
            item.contentAreaConfig.blankTemplateConfig &&
              item.contentAreaConfig.blankTemplateConfig.slot
          "
          :slot="item.contentAreaConfig.blankTemplateConfig.slot"
          style="width: 100%; height: 100%"
        >
          <slot :name="item.contentAreaConfig.blankTemplateConfig.slot" />
        </div>
      </statistics>
    </section>

    <!-- 新增弹窗模块 -->
    <settingForm
      ref="settingForm"
      :form="addSettingForm"
      :data-url="settingConfig.dataUrl"
      :setting-config="settingConfig"
      @componentFunc="componentFunc"
    />

    <!-- tabs切换组件配置 -->
    <tab-setting
      ref="tabsSetting"
      :tabs-form="tabsConfig"
      @tabsSubmit="tabsSettingSubmit"
    />
    <!-- tabs渲染组件 -->
    <tabs-view
      v-for="item in tabsSettingData"
      ref="tabsView"
      :key="item.moduleId"
      :setting-config="settingConfig"
      :setting-form="item.tabsConfig"
      :module-id="item.moduleId"
      :page-module-data="pageModuleData"
      :add-setting-form="addSettingForm"
      :component-config="item"
      @tabsSettingSubmit="tabsSettingSubmit"
      @delete="tabsSettingdelete"
      @componentFunc="componentFunc"
    />
  </div>
</template>
<script>
import TabSetting from '../../components/TabSetting'
import Statistics from '../statistics'
import serviceAxios from '@/utils/request.js'
import SettingForm from '../../components/SettingForm'
// mixins
import middlewareMixins from './mixins/middlewareMixins'
import tabsMixins from './mixins/tabsMixins'
import countryRadioMixins from './mixins/countryRadioMixins'
import bigDataMixins from './mixins/bigDataMixins'
import TabsView from '../../components/Tabs'
export default {
  components: { Statistics, SettingForm, TabSetting, TabsView },
  mixins: [middlewareMixins, tabsMixins, bigDataMixins, countryRadioMixins],
  props: {
    settingConfig: {
      type: Object,
      default: null
    },
    pageModuleData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // systemPermissions: 'admin', // 系统权限控制
      templateArr: ['baowei_1'],
      menuId: '',
      addSettingForm: {
        componentType: 'charts', // 组件类型
        title: '', // 标题
        subtitle1: '', // 副标题1
        subtitle2: '', // 副标题2
        elementId: '', // 模块元素id
        elementClass: '', // 模块元素class
        isShow: '1', // 组件初始显示/隐藏
        isAddMoreIcon: '0', // 是否添加更多按钮 0：否 1：是
        moreUrl: '', // 更多页面跳转路径(当前数据为空则不跳转页面，自行进行二次开发)
        moduleType: '0', // 模块内容  0:图表 1:iframe地图  3：空白模板
        barHisShowType: '0', // 条形图、柱状图显示类型  0：默认  1：堆叠显示
        moduleCode: '', // 模板编码  当前模板唯一编码
        blankTemplateConfig: {
          // 空白模板配置项
          slot: '' // slot嵌入字段
        },
        destailTypeTheme: '0', // 详情表格展示组题样式选则 0：默认表格  1：主题一
        apiType: '1', // 0：数据视图 1：应用接口
        viewId: '', // 视图id
        viewParamType: '0', // 视图参数传递类型
        url: '', // 接口
        urlName: '', // 接口名称
        options: 'POST', // 请求方式  GET/POST
        keyArr: [], // 图表字段配置数据
        tableHeaderConfig: {}, // 表格多表头配置数据
        tableOtherConfig: {
          tableType: '0', // 表格类型 0:普通表格 1:树形表格
          onlyKey: '', // 行数据唯一字段
          childKey: 'children' // 树形表格子级字段名
        },
        operateButton: [], // 列表、表格右侧操作按钮配置数据
        paramConfig: [], // 请求参数配置
        destailsTableLabelWidth: 100, // 详情列表左侧标题宽度
        detailsTableAll: [], // 详情列表配置数据
        iframeAll: {
          iframeType: '0', // 0-map地图  1-其他类型
          iframeId: '', // 自定义iframe框id名
          iframeUrl: '', // iframe嵌入路径,
          mapPramConfig: [] // 地图参数配置
        },
        height: 30,
        width: 30,
        top: 0,
        left: 0,
        defaultParameters: '', // 接口默认参数
        zindex: '8', // 模块z-index
        displayMode: 'table', // 数据展现方式
        isDisplayModeHide: false, // 展现方式切换启用
        titleShow: '1', // 图表头部切换模块是否显示 0:不显示 1:显示
        submodule: '0', // 是否含有子页面
        menuTapAll: {
          isMenuTap: '0', // 是否执行菜单页面跳转   0:否 1:是
          menuTapKey: '', // 点击触发跳转字段
          menuCodeKey: '' // 菜单编码字段
        },
        clickToShow: 'row', // 子页面点击展现  row:行点击 cell:单元格点击
        isLinkMap: '0', // 是否链接iframe地图  0:不链接 1:链接
        mapPosition: '0', // 地图定位   0-定位到重庆 1-定位到区县  2-定位到开发区
        isPage: '1', // 数据是否添加分页
        mask: '0', // 是否添加遮罩层
        pageSize: 10, // 每页显示数据条数
        isDestail: '0', // 是否添加详情弹窗
        isDrafting: false, // 是否给用户启用模块拖拽功能
        isHeaderHide: false, // 模块头部是否显示
        isModuleClose: false, // 模块是否可关闭

        filterConfig: {
          // 筛选项配置信息
          screenData: [], // 查询项配置
          btnSettingData: [], // 查询按钮配置
          isShowInsertButton: '1' // 查询按钮是否显示配置
        },
        tablefunctionalComponents: [], // 表格功能组件选择 colFilter:列筛选
        fatherModuleType: 'page', // 父级模块类型  page:页面  tabs:tabs切换组件
        tabsModuleId: '', // tabs模块id
        tabsCode: '', // 父级tabs编码
        xName: '', // x轴标题字段
        xRotate: 25, // x轴标题倾斜角度
        yName: '', // y轴标题字段
        showSummary: false, // 表格是否添加合计行
        legendOrient: 'horizontal', // 图例布局
        legendLocation: 'center', // 图例显示位置
        barGroup: 0, // 柱体间距(%)
        barMaxWidth: 100, // 柱体最大宽度(px)
        labelShow: true, // 图形上文本标签
        barPosition: 'top', // 标签显示位置
        gridTop: 15, // 图表边距-顶部
        gridLeft: 60, // 图表边距-左侧
        gridBottom: 40, // 图表边距-底部
        gridRight: 5, // 图表边距-右侧

        jsMethods: '', // 数据加载完成后执行js脚本
        formattingDataJs: '', // 返回数据格式化js脚本
        suspensionFrameJs: '', // 图表悬浮框js脚本
        maxNum: '' // 度量最大值设置(双坐标轴以逗号隔开)
      },
      addSettingFormClone: {},
      conditionAreaConfigClone: {}, // 旧的筛选数据克隆
      whereData: [] // 所有模块筛选数据
    }
  },
  mounted() {
    this.addSettingFormClone = JSON.parse(JSON.stringify(this.addSettingForm))
  },
  methods: {
    // 容器组件内事件传递
    componentFunc(obj) {
      if (this[obj.method]) {
        this[obj.method](obj.param, obj)
      } else {
        this.$emit('componentFunc', obj)
      }
    },
    // 当前页面初始显示数据获取(容器外图表)
    pageDatas(pageData) {
      return pageData.filter(item => {
        return item.contentAreaConfig && !item.contentAreaConfig.parentModuleId
      })
    },
    // 所有模块筛选数据缓存
    whereFormKeep(param) {
      let offon = true
      this.whereData.forEach(item => {
        if (item.moduleId === param.moduleId) {
          offon = false
          item.form = param.form
        }
      })
      if (offon) {
        this.whereData.push({
          form: param.form,
          moduleId: param.moduleId
        })
      }
    },
    // 图表组件被交互事件
    interactiveCover(params, interactiveCondig) {
      let reqObj = {}
      this.whereData.forEach(item => {
        if (item.moduleId === interactiveCondig.moduleId && params) {
          for (const key in params) {
            reqObj = item.form
            reqObj[key] = params[key]
          }
        }
      })
      const obj = {}
      // let currentPage=pageAll.currentPage?
      let nowItem = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === interactiveCondig.moduleId) {
          obj.index = index
          if (item.contentAreaConfig.isPage === '1') {
            obj.pageSize = item.contentAreaConfig.pageSize
            obj.currentPage = 1
          }
          obj.url = item.contentAreaConfig.url
          if (interactiveCondig.hideShow) {
            item.isShow = interactiveCondig.hideShow !== '0'
          }
          nowItem = item
        }
      })
      this.getTableData(obj, reqObj, nowItem)
    },
    // 图表组件集交互按钮点击事件
    interactive(param) {
      this.$emit('chartsMethods', {
        statisticsAll: param.statisticsAll,
        methodsName: 'interactive',
        pageData: this.pageData,
        name: '图表组件集'
      })
    },
    // 通过模块id改变模块渲染数据事件
    changePageData(moduleId, viewchange, wh) {
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          this.$refs['statisticsAll'][index].statisticsAllChange(
            moduleId,
            viewchange,
            wh
          )
        }
      })
    },
    // 图表模块显示隐藏控制事件
    modeuleShow(obj) {
      // const data = JSON.parse(JSON.stringify(this.pageData))
      this.pageData.forEach(item => {
        if (item.moduleId === obj.moduleId) {
          item.isShow = obj.isShow
        }
      })
      // this.pageData = data
    },
    // 图表方法暴露
    chartsMethods(reqObj) {
      // let obj = {
      //   moduleId: reqObj.moduleId,
      //   methodsName: reqObj.methodsName,
      //   rowItem: reqObj.rowItem ? reqObj.rowItem : undefined,
      //   otherItem: reqObj.otherItem ? reqObj.otherItem : undefined
      // }
      this.$emit('chartsMethods', reqObj)
    },
    // 查询模块其他按钮点击事件(按钮配置数据，模块id)
    whereOtherBtnClick(param) {
      this.chartsMethods({
        moduleId: param.moduleId,
        name: '查询模块其他按钮点击事件',
        methodsName: 'whereOtherBtnClick',
        otherItem: param.otherItem
      })
    },
    // 表格、列表右侧其他按钮点击事件(按钮配置数据，模块id)
    operateButtonClick(param) {
      this.chartsMethods({
        moduleId: param.moduleId,
        name: '表格、列表右侧其他按钮点击事件',
        methodsName: 'operateButtonClick',
        buttonSetting: param.buttonSetting,
        rowItem: param.rowItem,
        statisticsAll: param.statisticsAll
      })
    },
    // 头部右侧更多按钮点击事件
    statisticsMore(param) {
      this.chartsMethods({
        statisticsAll: param.statisticsAll,
        moduleId: param.statisticsAll.moduleId,
        name: '头部右侧更多按钮点击事件',
        methodsName: 'statisticsMore'
      })
    },
    // 菜单点击事件
    menuClick(menuItem, menuTypes, fn, JumpParams) {
      this.menuId = menuItem.menuId
      // this.$nextTick(() => {
      if (menuTypes || fn) {
        this.getData({ menuTypes, fn }, JumpParams)
      } else {
        this.getData(null, JumpParams)
      }
      // })

      this.tabsSettingSelect()
    },
    // 饼图切换模块点击事件
    pieTabsClick(param) {
      this.chartsMethods({
        moduleId: param.moduleId,
        statisticsAll: param.statisticsAll,
        nowItem: param.nowItem,
        name: '饼图顶部切换栏点击事件',
        methodsName: 'pieTabsClick'
      })
    },
    // 子级弹窗关闭事件--同级子弹窗全部关闭
    statisticsClose(moduleId, parentModuleId) {
      this.chartsMethods({
        moduleId: moduleId,
        parentModuleId: parentModuleId,
        name: '页面关闭事件',
        methodsName: 'statisticsMore'
      })
      if (!parentModuleId) return
      const datas = []
      this.pageData.forEach(item => {
        if (item.parentModuleId) {
          // this.pageData.splice(index, 1)
          if (item.parentModuleId !== parentModuleId) {
            datas.push(item)
          }
        } else {
          // if (item.moduleId !== moduleId) {
          datas.push(item)
          // }
        }
      })
      this.pageData = datas
    },
    // 自定义空白模板关闭事件
    blankTemplateClose(param, obj) {
      // const datas = []
      this.pageData.forEach(item => {
        if (item.moduleId === param.moduleId) {
          this.$set(item, 'isShow', false)
        }
      })
      obj.methodsName = obj.method
      this.chartsMethods(obj)
    },
    // 表格分页点击事件
    tablePageSort(param) {
      // moduleId, paginationAll, whereForm
      let offon = true
      // eslint-disable-next-line no-unused-vars
      const obj = {}
      // let currentPage=pageAll.currentPage?
      let nowItem = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === param.moduleId) {
          obj.index = index
          obj.pageSize = param.paginationAll.pageSize
          obj.currentPage = param.paginationAll.currentPage
          obj.url = item.contentAreaConfig.url
          nowItem = item

          item.whereForm = JSON.parse(JSON.stringify(param.whereForm))

          if (item.parentModuleId) {
            // 子级页面分页--测试
            offon = false
            item.data = this.childData.slice(
              (param.paginationAll.currentPage - 1) *
                param.paginationAll.pageSize,
              param.paginationAll.currentPage * param.paginationAll.pageSize
            )
          }
        }
      })

      if (offon) {
        this.getTableData(obj, param.whereForm, nowItem)
      }
    },
    // 配置数据格式转换
    itemGSH(item) {
      // 详情配置数据格式转换
      if (item.detailsAreaConfig) {
        item.detailsAreaConfig = JSON.parse(item.detailsAreaConfig)
      }
      // 页面配置
      if (item.contentAreaConfig) {
        // 模块配置数据格式转换
        try {
          item.contentAreaConfig = JSON.parse(item.contentAreaConfig)
        } catch (e) {
          item.contentAreaConfig = {}
          console.log(e)
          // item.contentAreaConfig={}
        }
        // 菜单跳转字段旧版本未添加处理
        if (!item.contentAreaConfig.menuTapAll) {
          item.contentAreaConfig.menuTapAll = {
            isMenuTap: '0', // 是否执行菜单页面跳转   0:否 1:是
            menuTapKey: '', // 点击触发跳转字段
            menuCodeKey: '' // 菜单编码字段
          }
        }
        // 柱状图柱体间距加内容
        if (
          ['histogram', 'bar'].indexOf(item.contentAreaConfig.displayMode) >
            -1 &&
          item.contentAreaConfig.barGroup === undefined
        ) {
          item.contentAreaConfig.barGroup = 0
          item.contentAreaConfig.barMaxWidth = 100
        }
        // 图例显示位置
        if (item.contentAreaConfig.legendLocation === undefined) {
          item.contentAreaConfig.legendLocation = 'center'
          item.contentAreaConfig.legendOrient = 'horizontal'
        }
        // 表格功能组件选择旧版本兼容
        if (!item.contentAreaConfig.tablefunctionalComponents) {
          item.contentAreaConfig.tablefunctionalComponents = []
        }
        if (item.contentAreaConfig.xRotate === undefined) {
          item.contentAreaConfig.xRotate = 25
        }
        // 视图参数传递类型 旧版本兼容
        if (item.contentAreaConfig.viewParamType === undefined) {
          item.contentAreaConfig.viewParamType = '0'
        }
        // 初始显示/隐藏初始化
        if (item.contentAreaConfig.isShow === undefined) {
          item.contentAreaConfig.isShow = '1'
        }
        // 柱、条图 图形上文本标签、标签显示位置设置
        if (item.contentAreaConfig.labelShow === undefined) {
          item.contentAreaConfig.labelShow = true
          item.contentAreaConfig.barPosition = 'top'
        }
        // 大数据编排视图请求地址定死
        if (this.settingConfig.isBigData) {
          this.settingConfig.url = '/.DataView/view/v1/sql/resultAppend'
        }
      }

      // 筛选配置数据格式转换
      if (item.conditionAreaConfig) {
        item.conditionAreaConfig = JSON.parse(item.conditionAreaConfig)
        this.conditionAreaConfigClone = JSON.parse(
          JSON.stringify(item.conditionAreaConfig)
        )
      } else {
        item.conditionAreaConfig = {}
      }
      this.filterConfigZH(item)
    },
    // 筛选数据整合
    filterConfigZH(item) {
      let filterConfig = item.contentAreaConfig.filterConfig
      if (filterConfig) {
        filterConfig.screenData.forEach(item => {
          if (['radio', 'checkbox', 'select'].indexOf(item.type) > -1) {
            if (item.changeData) {
              if (typeof item.changeData === 'string') {
                item.arr = JSON.parse(item.changeData)
              } else {
                item.arr = item.changeData
                item.changeData = JSON.stringify(item.changeData)
              }
            }
            // item.arr = item.changeData ? typeof item.changeData === 'string' ? JSON.parse(item.changeData) : item.changeData : []
          }
        })
        // 新旧筛选内容整合
        // if (item.conditionAreaConfig.screenData) {
        //   filterConfig.screenData.forEach((items) => {
        //     let offon = true
        //     item.conditionAreaConfig.screenData.forEach((item) => {
        //       if (item.key === items.key) {
        //         offon = false
        //       }
        //     })
        //     if (offon) {
        //       item.conditionAreaConfig.screenData.push(items)
        //     }
        //   })
        // } else {
        //   item.conditionAreaConfig.screenData = filterConfig.screenData
        // }
        item.conditionAreaConfig.screenData = filterConfig.screenData
        item.conditionAreaConfig.btnSettingData = filterConfig.btnSettingData
        item.conditionAreaConfig.isShowInsertButton =
          filterConfig.isShowInsertButton
      } else {
        filterConfig = this.filterConfig
      }
    },
    // 页面加载状态变化
    pageLoding(offon) {
      this.$emit('pageLoding', offon)
    },
    // 模块图表配置数据获取
    getData(param, JumpParams) {
      this.pageData = []
      this.pageLoding(true)
      serviceAxios['post'](
        this.settingConfig.commonUrl +
          '/busSecondmasterpageconfig/querySecondMasterPageConfigDataBegin',
        {
          menuId: param && param.menuId ? param.menuId : this.menuId
        }
      )
        .then(res => {
          const code = res.code
          const resData = res.data

          if (code === 20000) {
            if (param && param.fn) {
              if (resData.length === 0) {
                param.fn(true)
              } else {
                param.fn(false)
                this.setPageData(resData, param, JumpParams)
              }
            }
            // else {
            //   this.setPageData(resData, param)
            // }
            if (!param) {
              this.setPageData(resData, null, JumpParams)
            }
          }
          this.pageLoding(false)
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
          this.pageLoding(false)
          return false
        })
    },
    // 当前页面模块数据处理
    setPageData(resData, param, JumpParams) {
      this.pageData = []
      resData.forEach((item, index) => {
        this.itemGSH(item, index)
        // 配置数据字段集获取
        const keys = []
        item.isShow = true
        item.contentAreaConfig.keyArr.forEach(obj => {
          keys.push(obj.key)
        })

        // 数据请求参数
        const obj = {
          url: item.contentAreaConfig.url,
          keys: keys,
          index: index
        }

        if (item.contentAreaConfig.isPage === '1') {
          obj.currentPage = 1
          obj.pageSize = item.contentAreaConfig.pageSize
        }
        this.pageData.push(item)
        // 默认请求参数解析
        if (
          item.contentAreaConfig.moduleType !== '1' &&
          item.contentAreaConfig.moduleType !== '3'
        ) {
          let reqData = {}
          if (JumpParams) {
            JumpParams.forEach(x => {
              if (x.moduleId === item.moduleId) {
                reqData = x.reqData
                for (const key in x.reqData) {
                  item.conditionAreaConfig.screenData.forEach(y => {
                    if (y.key === key) {
                      y.defaultValue = x.reqData[key]
                    }
                  })
                }
              }
            })
          }
          this.getTableData(obj, reqData, item, index)
        }
        // 初始隐藏组件
        if (item.contentAreaConfig.isShow === '0') {
          item.isShow = false
        }
      })
      if (param && param.getPageData) {
        param.getPageData(this.pageData)
      }
      this.settingConfig.pageData = this.pageData
      this.pageModuleData.pageData = this.pageData
      this.chartsMethods({
        methodsName: 'getPageData',
        name: '页面模块渲染数据加载完成事件',
        data: this.pageData,
        menuId: this.menuId
      })
    },
    // 自定义参数-值获取
    getParamValue(val, item) {
      let paramValue = ''
      if (val && typeof val === 'string' && val.indexOf('${') === 0) {
        const num = val.length - 1
        const key = val.substring(2, num)
        paramValue = localStorage.getItem(key)
      } else {
        paramValue = val
      }
      switch (item.dataType) {
        case 'number':
          if (Number(paramValue)) {
            paramValue = Number(paramValue)
          } else {
            paramValue = null
          }
          break
        case 'object':
          paramValue = JSON.parse(paramValue)
          break
      }
      if (item.type === 'checkbox') {
        paramValue = JSON.parse(paramValue)
      }
      return paramValue
    },
    // 数据获取参数配置
    setParams(config, reqData) {
      if (config.contentAreaConfig.filterConfig) {
        const screenData = config.contentAreaConfig.filterConfig.screenData
        screenData.forEach(item => {
          reqData[item.key] = this.getParamValue(item.defaultValue, item)
        })
      }
    },
    // 图表数据获取
    getTableData(obj, whereReqData, config, nowIndex) {
      nowIndex || 1
      let reqData = {
        currentPage: obj.currentPage,
        pageSize: obj.pageSize
        // keys: obj.keys,
      }
      // 01-默认请求参数导入
      if (config.contentAreaConfig.paramConfig) {
        config.contentAreaConfig.paramConfig.forEach(item => {
          if (!reqData[item.paramKey] && item.isUse) {
            reqData[item.paramKey] = this.getParamValue(item.paramValue, item)
          }
        })
      }

      // 02-筛选默认参数导入
      if (config.contentAreaConfig.filterConfig) {
        this.setParams(config, reqData)
      }
      // 03-筛选变化后参数导入
      if (whereReqData) {
        if (config.whereForm) {
          Object.assign(reqData, config.whereForm)
        }
        Object.assign(reqData, whereReqData)
      }
      // 04-区县-单选数据处理
      if (config.contentAreaConfig.filterConfig) {
        this.setCountryRadio(config, reqData)
      }
      this.$set(this.pageData[obj.index], 'isLoading', true)
      // 返回特殊情况数据处理
      const sftsqk = this.specialRequest(reqData, config, obj)
      if (!sftsqk) {
        // 根据请求方式的不同进行调整
        const options =
          config.contentAreaConfig.options === 'POST' ? 'post' : 'get'

        // 判断当前接口是否为数据视图

        if (config.contentAreaConfig.apiType === '0') {
          const queryParamList = []
          let sqlCondition = ' 1=1 '
          for (const key in reqData) {
            if (
              key !== 'pageSize' &&
              key !== 'currentPage' &&
              key !== 'viewId'
            ) {
              queryParamList.push({
                [key]: reqData[key]
              })
              sqlCondition += `  and  ${key} = '${reqData[key]}'`
            }
          }
          reqData = {
            viewId: config.contentAreaConfig.viewId,
            pageSize: reqData.pageSize,
            pageNumber: obj.currentPage
            // queryParamList: queryParamList
          }
          if (config.contentAreaConfig.viewParamType === '1') {
            reqData.sqlCondition = sqlCondition
          } else {
            reqData.queryParamList = queryParamList
          }

          nowIndex *= 200
          if (!reqData.viewId) {
            this.$set(this.pageData[obj.index], 'isLoading', false)
            return false
          }
        }

        if (options === 'get') {
          reqData = {
            params: reqData
          }
        }
        // 判断当前接口是完全接口还是测试接口
        let nowUrl = ''
        // if (this.settingConfig.isBigData) {
        //   nowUrl = this.settingConfig.bigData.pageDataUrl
        // } else {
        if (config.contentAreaConfig.apiType === '0') {
          nowUrl = window.BaseApi + obj.url
        } else {
          if (obj.url.indexOf('http') > -1) {
            nowUrl = obj.url
          } else {
            nowUrl =
              obj.url.indexOf('/api/service') > -1
                ? window.config.applicationInterfaceApi + obj.url
                : this.settingConfig.dataUrl + obj.url
          }
        }
        // }
        // 当未确认接口时可直接获取测试数据
        if (
          this.settingConfig.isProducrTestData &&
          !obj.url.replace(/\s*/g, '')
        ) {
          this.viewDataTranslation(
            this.setCSdata(config.contentAreaConfig),
            obj,
            config,
            reqData
          )
          return false
        }
        // 数据请求
        if (!obj.url) {
          this.pageData[obj.index].isLoading = false
          this.$set(this.pageData[obj.index], 'data', [])
          return
        }
        const _this = this

        setTimeout(() => {
          serviceAxios[options](nowUrl, reqData)
            .then(res => {
              if (_this.pageData[obj.index]) {
                _this.pageData[obj.index].isLoading = false
                // 返回数据格式化
                const resData = this.formattingDataJsFnc(
                  _this.pageData[obj.index],
                  res.data,
                  reqData
                )
                _this.viewDataTranslation(resData, obj, config, reqData)
                // 数据加载完成后js执行
                _this.dataLoadingFnc(_this.pageData[obj.index], reqData)
              }
            })
            .catch(msg => {
              this.$message({
                message: '数据请求失败' + msg,
                type: 'error'
              })
              // console.log('数据请求失败' + msg)
              _this.pageData[obj.index].isLoading = false
              return false
            })
        }, nowIndex)
      }
    },
    // 特殊请求二次开发暴露
    specialRequest(reqData, config, obj) {
      const reqObj = JSON.parse(JSON.stringify(reqData))
      reqObj.methodsName = 'getchartsList'
      reqObj.name = '图表数据请求事件'
      reqObj.config = config
      reqObj.currentPage = obj.currentPage
      reqObj.url = obj.url
      // 特殊情况处理 (获取数据格式特殊，默认情况无法处理)
      let sftsqk = false // 当前是否未特殊情况
      reqObj.sftsqk = offon => {
        // 是否未特殊情况返回
        sftsqk = offon
      }

      reqObj.tsqkData = data => {
        // 特殊情况数据处理后返回
        this.pageData[obj.index].isLoading = false
        this.viewDataTranslation(data, obj, config, reqData)
      }

      this.$emit('chartsMethods', reqObj)
      return sftsqk
    },
    // 图表渲染数据处理
    viewDataTranslation(resData, obj, config, reqData) {
      if (
        !config.contentAreaConfig.moduleType ||
        config.contentAreaConfig.moduleType === '0'
      ) {
        if (config.contentAreaConfig.isPage === '1') {
          this.$set(
            this.pageData[obj.index],
            'data',
            this.dataFormat(config, resData.list)
          )
          this.$set(this.pageData[obj.index], 'paginationAll', {
            currentPage: obj.currentPage,
            pageSize: obj.pageSize,
            total: resData.total
          })
          this.$emit('chartsMethods', {
            methodsName: 'getTableData',
            param: {
              tableData: this.dataFormat(config, resData.list),
              currentPage: obj.currentPage,
              pageSize: obj.pageSize,
              total: resData.total,
              moduleId: this.pageData[obj.index].moduleId,
              reqData
            }
          })
        } else {
          if (resData.constructor === Object) {
            resData = []
          }

          this.$set(
            this.pageData[obj.index],
            'data',
            this.dataFormat(config, resData)
          )
          this.$emit('chartsMethods', {
            methodsName: 'getTableData',
            param: {
              tableData: this.dataFormat(config, resData),
              moduleId: this.pageData[obj.index].moduleId,
              reqData
            }
          })
          this.$set(this.pageData[obj.index], 'paginationAll', undefined)
        }
      }
    },

    // 测试数据生产
    setCSdata(settingForm) {
      const arr = []
      for (let i = 0; i < 10; i++) {
        const obj = {}
        settingForm.keyArr.forEach(item => {
          obj[item.key] = item.explain + Math.floor(Math.random() * 10000)
        })
        arr.push(obj)
      }

      if (settingForm.isPage === '1') {
        return {
          list: arr,
          total: 20
        }
      } else {
        return arr
      }
    },
    // 返回数据格式化
    dataFormat(config, resData) {
      const colClums = config.contentAreaConfig.keyArr
      colClums.forEach(item => {
        if (item.colDataformat) {
          // eslint-disable-next-line no-eval
          const test = eval('(false || ' + item.colDataformat + ')')

          resData.forEach(val => {
            val[item.key] = test(item, val)
          })
        }
      })
      return resData
    }
  }
}
</script>
<style scoped>
.systemPermissionsClass {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
