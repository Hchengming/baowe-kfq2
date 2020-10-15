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
         @screenKeep      筛选模块配置数据保存
         @tablePageSort    表格/列表分页点击事件
         @whereSubmit      筛选确认事件
         @detailsAreaConfigEmit  详情配置保存事件
         @whereOtherBtnClick   查询模块其他按钮点击事件
         @statisticsMore  头部右侧更多按钮点击事件
         @operateButtonClick  表格、列表右侧其他按钮点击事件
    -->
    <section v-for="(item, index) in pageData"
             :key="index">
      <statistics :statisticsAll="item"
                  :browserXY="browserXY"
                  :dataUrl="settingConfig.dataUrl"
                  :addSettingForm='addSettingForm'
                  :itemApiData="itemApiData"
                  @firstAddKeep="addKeep"
                  @deleteMoule="deleteMoule"
                  @rowClick="rowClick"
                  @cellClick="cellClick"
                  @updateMoule="updateMoule"
                  @childSettingAdd="childSettingAdd"
                  @childInsertData="childInsertData"
                  @statisticsClose="statisticsClose"
                  @screenKeep="screenKeep"
                  @tablePageSort="tablePageSort"
                  @whereSubmit="whereSubmit"
                  @detailsAreaConfigEmit="detailsAreaConfigEmit"
                  @whereOtherBtnClick="whereOtherBtnClick"
                  @operateButtonClick='operateButtonClick'
                  @statisticsMore="statisticsMore"
                  @settingClick="settingClick"
                  :systemPermissions="settingConfig.systemPermissions"></statistics>
    </section>

    <!-- 新增弹窗模块 -->
    <settingForm ref="settingForm"
                 :form="addSettingForm"
                 :dataUrl="settingConfig.dataUrl"
                 :itemApiData="itemApiData"
                 @submit="addKeep"></settingForm>

  </div>
</template>
<script>
import dataMixins from './mixins'
import Statistics from '../statistics'
import serviceAxios from '@/utils/request.js'
import SettingForm from '../../components/SettingForm'
// import axios from 'axios'
// eslint-disable-next-line no-unused-vars
// import defaultData from './KFQTJData.json'
export default {
  mixins: [dataMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    itemApiData: {
      type: Array
    }
  },
  components: { Statistics, SettingForm },
  data () {
    return {
      // systemPermissions: 'admin', // 系统权限控制
      templateArr: ['baowei_1'],
      menuId: '',
      addSettingForm: {
        title: '', // 标题
        subtitle1: '', // 副标题1
        subtitle2: '', // 副标题2
        isAddMoreIcon: '0',//是否添加更多按钮 0：否 1：是
        moreUrl: '',//更多页面跳转路径(当前数据为空则不跳转页面，自行进行二次开发)
        moduleType: '0',//模块内容  0:图表 1:iframe地图 2:详情表格展示
        url: '', // 接口
        urlName: '',//接口名称
        options: 'GET',//请求方式  GET/POST
        keyArr: [],//图表字段配置数据
        operateButton: [],//列表、表格右侧操作按钮配置数据
        paramConfig: [],//请求参数配置
        destailsTableLabelWidth: 100,//详情列表左侧标题宽度
        detailsTableAll: [],//详情列表配置数据
        iframeAll: {
          iframeType: '0',// 0-map地图  1-其他类型
          iframeUrl: 'http://23.36.250.99:666/views/showmap.html?callid=10129',//iframe嵌入路径,
        },
        height: 300,
        width: 27.69,
        top: 32.02,
        left: 20.78,
        defaultParameters: '', // 接口默认参数
        zindex: '8', // 模块z-index
        displayMode: 'table', // 数据展现方式
        submodule: '0', // 是否含有子页面
        menuTapAll: {
          isMenuTap: '0',//是否执行菜单页面跳转   0:否 1:是
          menuTapKey: '',//点击触发跳转字段
          menuCodeKey: ''//菜单编码字段
        },
        clickToShow: 'row', // 子页面点击展现  row:行点击 cell:单元格点击
        isLinkMap: '0',//是否链接iframe地图  0:不链接 1:链接 
        mapPosition: '0',//地图定位   0-定位到重庆 1-定位到区县  2-定位到开发区
        isPage: '0', // 数据是否添加分页
        mask: '0', // 是否添加遮罩层
        pageSize: 10, // 每页显示数据条数
        isDestail: '0' // 是否添加详情弹窗
      },
      addSettingFormClone: {}
    }
  },
  mounted () {
    this.addSettingFormClone = JSON.parse(JSON.stringify(this.addSettingForm))
  },
  methods: {
    // 图表方法暴露
    chartsMethods (reqObj) {
      // console.log(reqObj)
      // let obj = {
      //   moduleId: reqObj.moduleId,
      //   methodsName: reqObj.methodsName,
      //   rowItem: reqObj.rowItem ? reqObj.rowItem : undefined,
      //   otherItem: reqObj.otherItem ? reqObj.otherItem : undefined
      // }
      this.$emit('chartsMethods', reqObj)
    },
    // 查询模块其他按钮点击事件(按钮配置数据，模块id)
    whereOtherBtnClick (setttingItem, moduleId) {
      this.chartsMethods({
        moduleId: moduleId,
        name: '查询模块其他按钮点击事件',
        methodsName: 'whereOtherBtnClick',
        otherItem: setttingItem
      })
    },
    // 表格、列表右侧其他按钮点击事件(按钮配置数据，模块id)
    operateButtonClick (buttonSetting, rowItem, moduleId) {
      this.chartsMethods({
        moduleId: moduleId,
        name: '表格、列表右侧其他按钮点击事件',
        methodsName: 'operateButtonClick',
        buttonSetting,
        rowItem
      })
    },
    //头部右侧更多按钮点击事件
    statisticsMore (statisticsAll) {
      this.chartsMethods({
        moduleId: statisticsAll.moduleId,
        name: '头部右侧更多按钮点击事件',
        methodsName: 'statisticsMore'
      })
    },
    // 菜单点击事件
    menuClick (menuItem) {
      this.menuId = menuItem.menuId
      this.getData()
    },
    // 子级弹窗关闭事件--同级子弹窗全部关闭
    statisticsClose (moduleId, parentModuleId) {
      let datas = []
      this.pageData.forEach((item) => {
        if (item.parentModuleId !== parentModuleId) {
          // this.pageData.splice(index, 1)
          datas.push(item)
        }
      })
      this.pageData = datas
    },
    // 表格分页点击事件
    tablePageSort (moduleId, paginationAll, whereForm) {
      let offon = true
      // eslint-disable-next-line no-unused-vars
      let obj = {}
      // let currentPage=pageAll.currentPage?
      let nowItem = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          obj.index = index
          obj.pageSize = paginationAll.pageSize
          obj.currentPage = paginationAll.currentPage
          obj.url = item.contentAreaConfig.url
          nowItem = item
          if (item.parentModuleId) {
            // 子级页面分页--测试
            offon = false
            item.data = this.childData.slice(
              (paginationAll.currentPage - 1) * paginationAll.pageSize,
              paginationAll.currentPage * paginationAll.pageSize
            )
          }
        }
      })

      if (offon) {
        this.getTableData(obj, whereForm, nowItem)
      }
    },
    // 配置数据格式转换
    itemGSH (item) {
      // 详情配置数据格式转换
      if (item.detailsAreaConfig) {
        item.detailsAreaConfig = JSON.parse(item.detailsAreaConfig)
      }

      // 模块配置数据格式转换
      item.contentAreaConfig = JSON.parse(item.contentAreaConfig)
      //菜单跳转字段旧版本未添加处理
      if (!item.contentAreaConfig.menuTapAll) {
        item.contentAreaConfig.menuTapAll = {
          isMenuTap: '0',//是否执行菜单页面跳转   0:否 1:是
          menuTapKey: '',//点击触发跳转字段
          menuCodeKey: ''//菜单编码字段
        }
      }
      // 筛选配置数据格式转换
      if (item.conditionAreaConfig && item.conditionAreaConfig.replace(/\s*/g, '')) {
        item.conditionAreaConfig = JSON.parse(item.conditionAreaConfig)
      } else {
        // 配置区域默认参数设置
        const defaultParameters = item.contentAreaConfig.defaultParameters ? item.contentAreaConfig.defaultParameters.replace(
          /\s*/g,
          ''
        ) : ''
        item.conditionAreaConfig = {
          screenData: []
        }
        if (defaultParameters) {
          const obj = JSON.parse(defaultParameters)
          if (
            !item.conditionAreaConfig || !item.conditionAreaConfig.screenData ||
            item.conditionAreaConfig.screenData.length === 0
          ) {
            for (let key in obj) {
              item.conditionAreaConfig.screenData.push({
                key: key,
                defaultValue: obj[key],
                sfxjcx: '0',
                type: 'input',
                label: key,
                labelWidth: 90,
                rightWidth: 120
              })
            }
          }
        }
      }
    },
    //页面加载状态变化
    pageLoding (offon) {
      this.$emit('pageLoading', offon)
    },
    // 模块图表配置数据获取
    getData () {
      this.pageData = []
      this.pageLoding(true)
      serviceAxios['post'](this.settingConfig.commonUrl + '/busSecondmasterpageconfig/querySecondMasterPageConfigDataBegin', {
        menuId: this.menuId
      })
        .then(res => {
          let code = res.code
          let resData = res.data
          if (code === 20000) {

            resData.forEach((item, index) => {
              this.itemGSH(item)
              // 配置数据字段集获取
              let keys = []
              item.contentAreaConfig.keyArr.forEach(obj => {
                keys.push(obj.key)
              })
              // 数据请求参数
              let obj = {
                url: item.contentAreaConfig.url,
                keys: keys,
                index: index
              }

              if (item.contentAreaConfig.isPage === '1') {
                obj.currentPage = 1
                obj.pageSize = item.contentAreaConfig.pageSize
              }
              this.pageData = resData
              // 默认请求参数解析
              let defaultReqData = {}
              if (item.conditionAreaConfig.screenData) {
                item.conditionAreaConfig.screenData.forEach(conditionObj => {
                  if (conditionObj.defaultValue) {
                    defaultReqData[conditionObj.key] = conditionObj.defaultValue
                  }
                })
              }

              if (item.contentAreaConfig.moduleType !== '1') {
                this.getTableData(obj, defaultReqData, item)
              }
            })
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
    // 图表数据获取
    getTableData (obj, whereReqData, config) {
      let reqData = {
        currentPage: obj.currentPage,
        pageSize: obj.pageSize,
        // keys: obj.keys,
      }
      // 查询其他-参数接入
      if (whereReqData) {
        Object.assign(reqData, whereReqData)
      }
      let resDataFn = (resData) => {
        // console.log(JSON.stringify(resData) )
        if (!config.contentAreaConfig.moduleType || config.contentAreaConfig.moduleType === '0') {
          if (config.contentAreaConfig.isPage === '1') {
            this.$set(this.pageData[obj.index], 'data', resData.list)
            this.$set(
              this.pageData[obj.index],
              'paginationAll',
              {
                currentPage: obj.currentPage,
                pageSize: obj.pageSize,
                total: resData.total
              }
            )
          } else {
            if (resData.constructor === Object) {
              resData = []
            }
            this.$set(this.pageData[obj.index], 'data', resData)
            this.$set(this.pageData[obj.index], 'paginationAll', undefined)
          }
        } else if (config.contentAreaConfig.moduleType === '2') {
          this.$set(this.pageData[obj.index], 'data', resData)
        }

      }
      let reqObj = JSON.parse(JSON.stringify(reqData))
      reqObj.methodsName = "getchartsList"
      reqObj.name = "图表数据请求事件"
      reqObj.config = config;
      reqObj.url = obj.url;
      //特殊情况处理 (获取数据格式特殊，默认情况无法处理)
      let sftsqk = false;//当前是否未特殊情况
      reqObj.sftsqk = (offon) => {//是否未特殊情况返回
        sftsqk = offon ? true : false
      }
      reqObj.tsqkData = (data) => {//特殊情况数据处理后返回
        resDataFn(data)
      }
      // console.log(reqObj, '===')
      this.$emit('chartsMethods', reqObj)
      if (!sftsqk) {
        //根据请求方式的不同进行调整
        let options = config.contentAreaConfig.options === 'POST' ? 'post' : 'get'
        //参数写入
        if (config.contentAreaConfig.paramConfig) {
          config.contentAreaConfig.paramConfig.forEach(item => {
            if (!reqData[item.paramKey] && item.isUse) {
              reqData[item.paramKey] = item.paramValue
            }
          })
        }
        if (options === 'get') {
          reqData = {
            params: reqData
          }
        }
        //判断当前接口是完全接口还是测试接口
        let nowUrl = ''
        if (obj.url.indexOf('http') > -1) {
          nowUrl = obj.url
        } else {
          nowUrl = this.settingConfig.dataUrl + obj.url
        }
        //当未确认接口时可直接获取测试数据
        if (this.settingConfig.isProducrTestData && !obj.url.replace(/\s*/g, '')) {
          resDataFn(this.setCSdata(config.contentAreaConfig))
          return false
        }
        //数据请求
        serviceAxios[options](nowUrl, reqData)
          .then(res => {
            if (res.code === 20000 || res.code === 200) {
              let resData = res.data
              resDataFn(resData)
            }
          })
          .catch(msg => {
            // console.log(this.settingConfig.isProducrTestData, msg)

            this.$message({
              message: '请求失败' + msg,
              type: 'error'
            })

            return false
          })
      }
    },
    //测试数据生产
    setCSdata (settingForm) {
      let arr = []
      for (let i = 0; i < 10; i++) {
        let obj = {}
        settingForm.keyArr.forEach(item => {
          obj[item.key] = item.explain + Math.floor(Math.random() * 10000)
        })
        arr.push(obj)
      }
      // console.log(arr)
      if (settingForm.isPage === '1') {
        return {
          list: arr,
          total: 20
        }
      } else {
        return arr
      }

    },
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
