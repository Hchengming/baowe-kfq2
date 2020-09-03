<template>
  <!-- 详情展示组件 -->
  <el-dialog class="destail-wrap dialog-common"
             title="模块配置信息"
             :append-to-body="true"
             :width="width"
             ref="destailSettingDialog"
             :visible.sync="dialogVisible">
    <div class="detail_box model_box info_table">
      <el-row class="detail_row"
              v-for="(items,indexs) in destailSetting"
              :key="indexs">
        <el-col :span="item.proportion?item.proportion:24"
                class="detail_col"
                v-show="item.isHide!=true"
                v-for="(item,index) in items.row"
                :key="index">
          <div class="key"
               :style="{width:skyWidth}">
            <span>{{item.title}}</span>
          </div>
          <div :class="['value',{'bg':item.val==0?false:!item.val?true:false}]"
               :style="{width:valWidth}">{{item.val}}</div>
        </el-col>
      </el-row>
      <!-- 左右按钮图标 -->
      <i v-if="isPageBtn"
         @click="pageBtn(-1,nowIndex===0)"
         :class="['iconfont','iconzuofanye','theme-color','page_detail','page_prev','no-print',{'first':nowIndex===0}]"
         type="ios-arrow-dropleft" />

      <i v-if="isPageBtn"
         @click="pageBtn(1,nowIndex===lastIndex())"
         :class="['iconfont','iconyoufanye','theme-color','page_detail','page_next','no-print',{'last':nowIndex===lastIndex()}]"
         type="ios-arrow-dropright" />
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="close"
                 size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    statisticsAll: {
      type: Object,
      default () {
        return {
          data: []
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      isPageBtn: true,
      destailSetting: [],
      skyWidth: '',
      valWidth: '',
      nowIndex: 0, // 当前详情数据索引
      width: null // 弹窗宽度
    }
  },
  methods: {
    lastIndex () {
      if (this.statisticsAll.data) {
        return this.statisticsAll.data.length - 1
      } else {
        return null
      }
    },
    show (index) {
      this.dialogVisible = true
      const detailsAreaConfig = this.statisticsAll.detailsAreaConfig
      if (!detailsAreaConfig) return
      this.skyWidth = detailsAreaConfig.titleWidth ? detailsAreaConfig.titleWidth + 'px' : '80px'
      this.valWidth = `calc(100% - ${this.skyWidth})`
      this.nowIndex = index
      this.width = (detailsAreaConfig.width / window.innerWidth) * 100 + '%'

      this.setDestailSetting(index)
      // el-dialog
    },
    // 展示数据配置事件
    setDestailSetting (index) {
      const tableItem = this.statisticsAll.data[index]
      const detailsAreaConfig = JSON.parse(JSON.stringify(this.statisticsAll.detailsAreaConfig))
      detailsAreaConfig.settingData.forEach(item => {
        for (let key in tableItem) {
          if (item.key === key) {
            item.val = tableItem[key]
          }
        }
        // this.destailSetting.push(item)
      })

      let num = 0
      let RowData = []
      this.destailSetting = []
      let lastBQ = (index) => {
        if (index === detailsAreaConfig.settingData.length - 1) {
          if (num < 24) {
            let RowDataLength = RowData.length
            let colSpan = 0
            RowData.forEach((obj, objIndex) => {
              if (objIndex !== RowDataLength - 1) {
                colSpan += obj.proportion
              }
            })
            RowData[RowDataLength - 1].proportion = 24 - colSpan
            this.destailSetting.push({ row: RowData })
          }
        }
      }
      detailsAreaConfig.settingData.forEach((item, index) => {
        if (item.isShow === true) {
          let proportion = item.proportion ? item.proportion : 24
          if (num + proportion === 24) {
            RowData.push(item)
            this.destailSetting.push({ row: RowData })
            num = 0
            RowData = []
          } else if (num + proportion > 24) {
            this.destailSetting.push({ row: RowData })
            num = proportion
            RowData = [item]
            lastBQ(index)
          } else {
            RowData.push(item)
            num += proportion
            lastBQ(index)
          }
        }
      })
      // console.log(this.destailSetting)
    },
    // 翻页事件
    pageBtn (num, offon) {
      if (offon) return false
      this.nowIndex += num
      // const tableItem = this.statisticsAll.data[index]
      this.setDestailSetting(this.nowIndex)
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
</style>
