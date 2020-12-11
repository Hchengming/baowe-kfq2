<template>
  <el-table-column
    v-if="!item.children || item.children.length === 0"
    :class-name="item.className + ' ' + cellCursorClass(item.key)"
    :prop="item.key"
    :label="colLabel(item)"
    :width="colWidth(item)"
    :sortable="item.colSort=='1'"
    :fixed="item.colFixed==='left'||item.colFixed==='right'?item.colFixed:undefined"
  >
    <template slot-scope="scope">
      <el-tooltip
        v-if="item.key !== 'operationButton'"
        :content="cellTip(item, scope.row)"
        :placement="setPlacement(item)"
      >
        <span
          :class="[colClass(item)]"
          :style="{ color: textColor(scope.row[item.key]) }"
          v-html="cellHtml(item, scope.row)"
        />
      </el-tooltip>
      <div v-else class="right-operate-button">
        <el-button
          v-for="val in settingForm.operateButton"
          :key="val.name"
          :type="val.type"
          size="mini"
          @click="operateButtonClick(val, scope.row)"
        >{{ val.name }}</el-button>
      </div>
      <!-- <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span> -->
    </template>
  </el-table-column>
  <el-table-column v-else :label="colLabel(item)">
    <table-column
      v-for="(val, num) in item.children"
      :key="num"
      :colums="colums"
      :setting-form="settingForm"
      :statistics-all="statisticsAll"
      :item="val"
    />
  </el-table-column>
</template>
<script>
import listTableCommonJs from '../TableMixins'
export default {
  name: 'TableColumn',
  mixins: [listTableCommonJs],
  props: {
    item: {
      type: Object,
      default: null
    },
    colums: {
      type: Array, default: null
    },
    statisticsAll: {
      type: Object, default: null
    },
    settingForm: {
      type: Object, default: null
    }
  },
  methods: {
    textColor(val) {
      let color = ''
      if (val) {
        if (typeof val === 'number') {
          val = val.toString()
        }
        const num = val.indexOf(' @{')
        if (num > -1) {
          color = 'red'
        }
      }
      return color
    },

    // headername 获取
    colLabel(item) {
      const title = item.label ? item.label : item.explain
      // console.log(item, item.dw ? item.explain + `(${item.dw})` : item.explain)
      return item.dw ? title + `(${item.dw})` : title
    },
    // 动态获取宽度
    colWidth(item) {
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
    }
  }
}
</script>

