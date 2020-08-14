<template>
  <div>
    <section v-for="(item, index) in pageData"
             :key="index">
      <statistics :statisticsAll="item"
                  :browserXY="browserXY"
                  @deleteMoule="deleteMoule"
                  @rowClick="rowClick"
                  @updateMoule="updateMoule"
                  @childSettingAdd="childSettingAdd"
                  @childInsertData="childInsertData"
                  @statisticsClose="statisticsClose"
                  @screenKeep="screenKeep"
                  @tablePageSort="tablePageSort"
                  :systemPermissions="systemPermissions"></statistics>
    </section>

    <!-- 新增弹窗模块 -->
    <settingForm ref="settingForm"
                 :form="addSettingForm"
                 @submit="addKeep"></settingForm>
  </div>
</template>
<script>
import dataMixins from './mixins'
import statistics from '../statistics'
import axios from 'axios'
import settingForm from '../../components/settingForm'
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
        url: '/page/insertTableData', // 接口
        keyArr: [
          {
            key: 'title',
            explain: '类型',
            dw: '',
            relationKey: '',
            width: 180
          },
          {
            key: 'num',
            explain: '个数',
            dw: '个',
            relationKey: '',
            width: 100
          },
          {
            key: 'area',
            explain: '面积',
            dw: '公顷',
            relationKey: '',
            width: 120
          }
        ],
        height: 24.55,
        width: 27.69,
        top: 32.02,
        left: 20.78,
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
    this.getData()
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
    tablePageSort (moduleId, currentPage) {
      let offon = true
      // eslint-disable-next-line no-unused-vars
      let obj = {}
      this.pageData.forEach((item, index) => {
        if (item.moduleId === moduleId) {
          obj.index = index
          obj.pageSize = item.contentAreaConfig.pageSize
          obj.currentPage = currentPage
          obj.url = item.contentAreaConfig.url

          if (item.parentModuleId) {
            // 子级页面分页--测试
            offon = false
            item.data = this.childData.slice(
              (currentPage - 1) * item.paginationAll.pageSize,
              currentPage * item.paginationAll.pageSize
            )
          }
        }
      })

      if (offon) {
        this.getTableData(obj)
      }
    },
    // 模块图表配置数据获取
    getData (moduleId, currentPage) {
      axios
        .post(this.settingConfig.commonUrl + '/page/insertModule', {
          menuId: this.menuId
        })
        .then(res => {
          let status = res.data.status
          let reqData = res.data.data
          if (status === 0) {
            this.pageData = reqData
            reqData.forEach((item, index) => {
              // console.log(item)
              // item.isLoading=true;
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
              setTimeout(() => {
                this.getTableData(obj)
              }, 500)
            })
          }
          this.$refs['settingForm'].close()
        })
        .catch(msg => {
          console.log(msg)
        })
    },
    // 图表数据获取
    getTableData (obj) {
      let reqData = {
        currentPage: obj.currentPage,
        pageSize: obj.pageSize,
        keys: obj.keys
      }
      axios
        .post(this.settingConfig.commonUrl + obj.url, reqData)
        .then(res => {
          let status = res.data.status
          let resData = res.data.data
          if (status === 0) {
            this.$set(this.pageData[obj.index], 'data', resData.tableData)
            this.$set(
              this.pageData[obj.index],
              'paginationAll',
              resData.paginationAll
            )
          }
        })
        .catch(msg => {
          console.log(msg)
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
