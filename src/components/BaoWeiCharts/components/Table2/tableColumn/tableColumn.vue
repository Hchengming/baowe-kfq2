<template>
  <el-table-column
    v-if="!item.children || item.children.length === 0"
    :class-name="item.className + ' ' + cellCursorClass(item.key)"
    :prop="item.key"
    :label="colLabel(item)"
    :width="colWidth(item)"
    :sortable="item.colSort == '1'"
    :fixed="
      item.colFixed === 'left' || item.colFixed === 'right'
        ? item.colFixed
        : undefined
    "
  >
    <template slot-scope="scope">
      <el-tooltip
        v-if="item.key !== 'operationButton'"
        :content="cellTip(item, scope.row)"
        :placement="setPlacement(item)"
      >
        <span
          :class="[colClass(item)]"
          :style="{ color: textColor(scope.row[item.key]),cursor:cellCursor(item.key) }"
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
      :width="width"
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
      type: Array,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default: null
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
      return item.dw ? title + `(${item.dw})` : title
    },
    // 动态获取宽度
    colWidth(item) {
      let widths = item.width ? Number(item.width) : 100
      if (item.tableCustom) {
        let maxWidth = 0
        this.colums.forEach(item => {
          if (item.key && item.isShow) {
            if (item.width) {
              maxWidth += Number(item.width)
            } else {
              maxWidth += 100
            }
          }
        })
        if (maxWidth < this.width) {
          widths = Number(item.width) + this.width - maxWidth - 11
        }
      }
      return widths
    }
  }
}
</script>
