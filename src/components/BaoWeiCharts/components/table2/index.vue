<template>
  <div id="bw_table">
    <el-table
      :border="true"
      :data="tabledata"
      :row-class-name="tableRowClassName"
      stripe
      :height="nowHieght()"
      :row-key="settingForm.tableOtherConfig?settingForm.tableOtherConfig.onlyKey:undefined"
      :tree-props="{children: settingForm.tableOtherConfig?settingForm.tableOtherConfig.childKey:'children', hasChildren: 'hasChildren'}"
      :style="{width: '100%'}"
      @cell-click="cellClick"
      @row-click="rowClick"
    >
      <!-- <el-table-column v-for="(item,index) in colums"
                       :key="index"
                       :class-name="item.className+' '+cellCursorClass(item.key)"
                       :prop="item.key"
                       :sortable="false"
                       :label="colLabel(item)"
                       :width="colWidth(item,index)">
        <template slot-scope="scope">
          <el-tooltip v-if="item.key!=='operationButton'"
                      :content="NumStrTransformation(scope.row[item.key])"
                      :placement="setPlacement(index,colums)">
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

        </template>

      </el-table-column> -->
      <table-column
        v-for="(item,index) in tableColums()"
        :key="index"
        :item="item"
        :statistics-all="statisticsAll"
        :setting-form="settingForm"
        :colums="colums"
      />
    </el-table>
    <el-pagination
      v-if="paginationAll"
      :current-page="paginationAll.currentPage"
      :page-size="paginationAll.pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationAll.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>
<script>
import listTableCommonJs from './TableMixins'
import TableColumn from './tableColumn/tableColumn.vue'
export default {
  components: { TableColumn },
  mixins: [listTableCommonJs],
  // props: ['tabledata', 'colums', 'height', 'width', 'paginationAll', 'border', 'statisticsAll'],
  props: {
    tabledata: {
      type: Array,
      default: null
    },
    colums: {
      type: Array, default: null
    },
    height: {
      type: Number, default: null
    },
    width: {
      type: Number, default: null
    },
    settingForm: {
      type: Object, default: null
    },
    paginationAll: {
      type: Object, default: null
    },
    statisticsAll: {
      type: Object, default: null
    },
    border: {
      type: Boolean, default: null
    }
  },
  data() {
    return {
      cellCursor: ''
    }
  },
  computed: {},
  methods: {
    // 递归遍历树形数据
    reduiction(data, fn) {
      data.forEach((item, index) => {
        fn(item, index)
        if (item.children && item.children.length > 0) {
          this.reduiction(item.children, fn)
        }
      })
    },
    // 表格表头配置
    tableColums() {
      let tableColums = []
      // 判断是否为多表头表格
      if (this.settingForm.tableHeaderConfig && this.settingForm.tableHeaderConfig.hierarchy > 1) {
        // 01 多表头表格
        tableColums = this.settingForm.tableHeaderConfig.headerSetting[0].children
        this.reduiction(tableColums, items => {
          this.colums.forEach(item => {
            if (items.key === item.key) {
              Object.assign(items, item)
            }
          })
        })
      } else {
        // 02 普通表格
        tableColums = this.colums
      }
      return tableColums
    },
    // 获取行索引
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.rowIndex = rowIndex
    },
    // 数字转字符串
    NumStrTransformation(val) {
      if (typeof val === 'number') {
        val = val.toString()
      }
      return val
    },

    nowHieght() {
      if (this.paginationAll) {
        return this.height - 35
      } else {
        return this.height
      }
    },
    // headername 获取
    colLabel(item) {
      return item.dw ? item.explain + `(${item.dw})` : item.explain
    },
    // 动态获取宽度
    colWidth(item, index) {
      let widths = item.width
      if (index === 0) {
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
    // 行点击事件
    rowClick(row) {
      this.$emit('rowClick', row, row.rowIndex)
    },
    // 表格单元格点击事件
    cellClick(row, column) {
      this.$emit('cellClick', row, column.property)
    }

  }
}
</script>
