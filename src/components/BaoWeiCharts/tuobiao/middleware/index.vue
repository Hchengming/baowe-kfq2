<template>
  <div>
    <!-- @firstAddKeep   一级新增(克隆)
         @deleteMoule    模块删除
         @rowClick       行点击事件
         @updateMoule    模块修改事件
         @childSettingAdd  子页面新增事件
         @childInsertData   子页面数据查询事件
         @statisticsClose    子级弹窗关闭事件
         @screenKeep      筛选模块配置数据保存
         @tablePageSort    表格/列表分页点击事件
         @whereSubmit      筛选确认事件
         @destailsAreaConfigEmit  详情配置保存事件
    -->
    <section v-for="(item, index) in pageData"
             :key="index">
      <statistics :statisticsAll="item"
                  :browserXY="browserXY"
                  :dataUrl="settingConfig.dataUrl"
                  @firstAddKeep="addKeep"
                  @deleteMoule="deleteMoule"
                  @rowClick="rowClick"
                  @updateMoule="updateMoule"
                  @childSettingAdd="childSettingAdd"
                  @childInsertData="childInsertData"
                  @statisticsClose="statisticsClose"
                  @screenKeep="screenKeep"
                  @tablePageSort="tablePageSort"
                  @whereSubmit="whereSubmit"
                  @detailsAreaConfigEmit="detailsAreaConfigEmit"
                  @whereOtherBtnClick="whereOtherBtnClick"
                  :systemPermissions="settingConfig.systemPermissions"></statistics>
    </section>

    <!-- 新增弹窗模块 -->
    <settingForm ref="settingForm"
                 :form="addSettingForm"
                 :dataUrl="settingConfig.dataUrl"
                 @submit="addKeep"></settingForm>

  </div>
</template>
<script>
import dataMixins from './mixins'
import statistics from '../statistics'
import axios from 'axios'
import settingForm from '../../components/settingForm'
// eslint-disable-next-line no-unused-vars
// import defaultData from './KFQTJData.json'
export default {
  mixins: [dataMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  components: { statistics, settingForm },
  data () {
    return {
      // systemPermissions: 'admin', // 系统权限控制
      templateArr: ['baowei_1'],
      menuId: '',
      addSettingForm: {
        title: '开发区分类统计', // 标题
        subtitle1: '副标题1', // 副标题1
        subtitle2: '副标题2', // 副标题2
        url: '/data/cs1', // 接口
        keyArr: [
          {
            key: 'mjname',
            explain: '类型',
            dw: '',
            relationKey: '',
            width: 300
          },
          {
            key: 'mj',
            explain: '面积',
            dw: '公顷',
            relationKey: '',
            width: 200
          }
          // {
          //   key: 'area',
          //   explain: '面积',
          //   dw: '公顷',
          //   relationKey: '',
          //   width: 120
          // }
        ],
        height: 24.55,
        width: 27.69,
        top: 32.02,
        left: 20.78,
        defaultParameters: '', // 接口默认参数
        zindex: '8', // 模块z-index
        displayMode: 'list', // 数据展现方式
        submodule: '0', // 是否含有子页面
        clickToShow: 'row', // 子页面点击展现  row:行点击 cell:单元格点击
        isPage: '0', // 数据是否添加分页
        mask: '0', // 是否添加遮罩层
        pageSize: 10, // 每页显示数据条数
        isDestail: '0' // 是否添加详情弹窗
      }
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
    // 查询模块其他按钮点击事件(按钮配置数据，模块id)
    whereOtherBtnClick (setttingItem, moduleId) {

    },
    // 左侧菜单点击事件
    menuClick (menuItem) {
      this.menuId = menuItem.menuId
      this.getData()
    },
    // 子级弹窗关闭事件
    statisticsClose (moduleId) {
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          this.pageData.splice(index, 1)
        }
      })
    },
    // 表格分页点击事件
    tablePageSort (moduleId, paginationAll, whereForm) {
      let offon = true
      // eslint-disable-next-line no-unused-vars
      let obj = {}
      // let currentPage=pageAll.currentPage?
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          obj.index = index
          obj.pageSize = paginationAll.pageSize
          obj.currentPage = paginationAll.currentPage
          obj.url = item.contentAreaConfig.url

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
        this.getTableData(obj, whereForm)
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
    // 模块图表配置数据获取
    getData () {
      this.pageData = []
      axios
        .post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/querySecondMasterPageConfigDataBegin', {
          menuId: this.menuId
        })
        .then(res => {
          let code = res.data.code
          let resData = res.data.data

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
                // if (moduleId === item.moduleId) {
                //   obj.currentPage = currentPage
                // } else {
                obj.currentPage = 1
                // }

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

              setTimeout(() => {
                this.getTableData(obj, defaultReqData)
              }, 100)
            })
          }
        })
        .catch(msg => {
          console.log(msg)
        })
    },
    // 图表数据获取
    getTableData (obj, whereReqData) {
      let reqData = {
        currentPage: obj.currentPage,
        pageSize: obj.pageSize,
        keys: obj.keys
      }
      // 查询其他-参数接入
      if (whereReqData) {
        Object.assign(reqData, whereReqData)
      }
      axios
        .post(this.settingConfig.dataUrl + obj.url, reqData)
        .then(res => {
          if (res.data.code === 20000) {
            let resData = res.data.data

            if (reqData.currentPage && reqData.pageSize) {
              this.$set(this.pageData[obj.index], 'data', resData.list)
              this.$set(
                this.pageData[obj.index],
                'paginationAll',
                {
                  currentPage: obj.currentPage,
                  pageSize: obj.pageSize,
                  total: resData.totalCount
                }
              )
            } else {
              this.$set(this.pageData[obj.index], 'data', resData)
              this.$set(this.pageData[obj.index], 'paginationAll', undefined)
            }
            // console.log(this.pageData)
          }
        })
        .catch(msg => {
          this.$message({
            message: '请求失败' + msg,
            type: 'error'
          })
          return false
        })
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
