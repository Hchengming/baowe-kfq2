<template>
  <!-- 详情展示组件 -->
  <el-dialog
    ref="destailSettingDialog"
    :append-to-body="true"
    :width="width"
    :visible.sync="dialogVisible"
    class="destail-wrap dialog-common"
    title="详情展示信息"
  >
    <div class="detail_box model_box info_table">
      <el-row
        v-for="(items,indexs) in destailSetting"
        :key="indexs"
        class="detail_row"
      >
        <el-col
          v-for="(item,index) in items.row"
          v-show="item.isHide!=true"
          :key="index"
          :span="item.proportion?item.proportion:24"
          class="detail_col"
        >
          <div
            :style="{width:skyWidth}"
            class="key"
          >
            <span>{{ item.title }}</span>
          </div>
          <div
            :class="['value',{'bg':item.val==0?false:!item.val?true:false}]"
            :style="{width:valWidth}"
          >{{ item.val }}</div>
        </el-col>
      </el-row>
      <!-- 左右按钮图标 -->
      <i
        v-if="isPageBtn"
        :class="['iconfont','iconzuofanye','theme-color','page_detail','page_prev','no-print',{'first':nowIndex===0}]"
        type="ios-arrow-dropleft"
        @click="pageBtn(-1,nowIndex===0)"
      />

      <i
        v-if="isPageBtn"
        :class="['iconfont','iconyoufanye','theme-color','page_detail','page_next','no-print',{'last':nowIndex===lastIndex()}]"
        type="ios-arrow-dropright"
        @click="pageBtn(1,nowIndex===lastIndex())"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="close"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    statisticsAll: {
      type: Object,
      default() {
        return {
          data: []
        }
      }
    }
  },
  data() {
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
    lastIndex() {
      if (this.statisticsAll.data) {
        return this.statisticsAll.data.length - 1
      } else {
        return null
      }
    },
    show(index) {
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
    setDestailSetting(index) {
      const tableItem = this.statisticsAll.data[index]
      const detailsAreaConfig = JSON.parse(JSON.stringify(this.statisticsAll.detailsAreaConfig))
      detailsAreaConfig.settingData.forEach(item => {
        for (const key in tableItem) {
          if (item.key === key) {
            item.val = tableItem[key]
          }
        }
        // this.destailSetting.push(item)
      })

      let num = 0
      let RowData = []
      this.destailSetting = []
      const lastBQ = (index) => {
        if (index === detailsAreaConfig.settingData.length - 1) {
          if (num < 24) {
            const RowDataLength = RowData.length
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
          const proportion = item.proportion ? item.proportion : 24
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
    },
    // 翻页事件
    pageBtn(num, offon) {
      if (offon) return false
      this.nowIndex += num
      // const tableItem = this.statisticsAll.data[index]
      this.setDestailSetting(this.nowIndex)
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
</style>
