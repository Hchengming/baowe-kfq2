<template>
  <div>
    <section v-for="(item, index) in pageData"
             :key="index">
      <statistics :statisticsAll="item"
                  :browserXY="browserXY"
                  :dataUrl="settingConfig.dataUrl"
                  @deleteMoule="deleteMoule"
                  @rowClick="rowClick"
                  @updateMoule="updateMoule"
                  @childSettingAdd="childSettingAdd"
                  @childInsertData="childInsertData"
                  @statisticsClose="statisticsClose"
                  @screenKeep="screenKeep"
                  @tablePageSort="tablePageSort"
                  @whereSubmit="whereSubmit"
                  :systemPermissions="systemPermissions"></statistics>
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
      systemPermissions: 'admin', // 系统权限控制
      templateArr: ['baowei_1'],
      menuId: '',
      addSettingForm: {
        title: '开发区分类统计', // 标题
        subtitle1: '副标题1', // 副标题1
        subtitle2: '副标题2', // 副标题2
        url: '/data/cs1', // 接口
        keyArr: [
          // {
          //   key: 'title',
          //   explain: '类型',
          //   dw: '',
          //   relationKey: '',
          //   width: 180
          // },
          // {
          //   key: 'num',
          //   explain: '个数',
          //   dw: '个',
          //   relationKey: '',
          //   width: 100
          // },
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
        pageSize: 10 // 每页显示数据条数
      }
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
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
    // 模块图表配置数据获取
    getData (moduleId, currentPage) {
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
              // 模块配置数据格式转换
              item.contentAreaConfig = JSON.parse(item.contentAreaConfig)
              // 筛选配置数据格式转换
              if (item.conditionAreaConfig.replace(/\s*/g, '')) {
                item.conditionAreaConfig = JSON.parse(item.conditionAreaConfig)
              } else {
                item.conditionAreaConfig = []
              }

              let keys = []
              item.contentAreaConfig.keyArr.forEach(obj => {
                keys.push(obj.key)
              })
              let obj = {
                url: item.contentAreaConfig.url,
                keys: keys,
                index: index
              }
              if (item.contentAreaConfig.isPage === '1') {
                if (moduleId === item.moduleId) {
                  obj.currentPage = currentPage
                } else {
                  obj.currentPage = 1
                }

                obj.pageSize = item.contentAreaConfig.pageSize
              }
              this.pageData = resData
              // 默认请求参数解析
              let defaultReqData = {}
              item.conditionAreaConfig.forEach(conditionObj => {
                if (conditionObj.defaultValue) {
                  defaultReqData[conditionObj.key] = conditionObj.defaultValue
                }
              })

              setTimeout(() => {
                this.getTableData(obj, defaultReqData)
              }, 500)
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
      // 查询参数接入
      if (whereReqData) {
        for (let key in whereReqData) {
          reqData[key] = whereReqData[key]
        }
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
