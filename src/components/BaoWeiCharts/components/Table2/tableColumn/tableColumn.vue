<template>
  <el-table-column :class-name="item.className+' '+cellCursorClass(item.key)"
                   :prop="item.key"
                   :sortable="false"
                   :label="colLabel(item)"
                   v-if="!item.children||item.children.length===0"
                   :width="colWidth(item)">
    <template slot-scope="scope">
      <el-tooltip v-if="item.key!=='operationButton'"
                  :content="NumStrTransformation(scope.row[item.key])"
                  :placement="setPlacement(item)">
        <span :class="colClass(item)">{{scope.row[item.key]}}</span>
      </el-tooltip>
      <div v-else
           class="right-operate-button">
        <el-button v-for="val in settingForm.operateButton"
                   :key="val.name"
                   :type="val.type"
                   @click="operateButtonClick(val,scope.row)"
                   size="mini">{{val.name}}</el-button>
      </div>
      <!-- <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span> -->
    </template>

  </el-table-column>
  <el-table-column v-else
                   :label="colLabel(item)">
    <table-column v-for="(val,num) in item.children"
                  :colums="colums"
                  :settingForm="settingForm"
                  :statisticsAll="statisticsAll"
                  :key="num"
                  :item="val">
    </table-column>
  </el-table-column>

</template>
<script>
import listTableCommonJs from '../commonMixins'
export default {
  mixins: [listTableCommonJs],
  name: "tableColumn",
  props: {
    item: {
      type: Object
    },
    colums: {
      type: Array
    },
    statisticsAll: {
      type: Object
    },
    settingForm: {
      type: Object
    }
  },
  methods: {
    // 数字转字符串
    NumStrTransformation (val) {
      if (typeof val === 'number') {
        val = val.toString()
      }
      return val
    },
    // headername 获取
    colLabel (item) {
      let title = item.label ? item.label : item.explain
      // console.log(item, item.dw ? item.explain + `(${item.dw})` : item.explain)
      return item.dw ? title + `(${item.dw})` : title
    },
    // 动态获取宽度
    colWidth (item) {
      let widths = item.width
      if (item.key === this.colums[0].key) {
        let maxWidth = 0
        this.colums.forEach((item, index) => {
          if (index > 0) {
            maxWidth += item.width
          }
        })
        if (maxWidth + this.colums[0].width < this.width) {
          widths = this.width - maxWidth - 8
        }
      }
      return widths
    },
    // colClass (item) {
    //   this.$emit('colClass', item)
    // },
    // setPlacement (index) {
    //   this.$emit('setPlacement', index)
    // },
    // // 单元格样式
    // cellCursorClass (key) {
    //   this.$emit('cellCursorClass', key)
    // },
    // operateButtonClick (buttonSetting, rowItem) {
    //   this.$emit('operateButtonClick', buttonSetting, rowItem)
    // }
  }
}
</script>

