<template>
  <div id="bw_table" ref="bw-table">
    <el-table
      :border="true"
      :data="tabledata"
      :fit="true"
      :row-class-name="tableRowClassName"
      :height="nowHieght()"
      :row-key="
        settingForm.tableOtherConfig
          ? settingForm.tableOtherConfig.onlyKey
          : undefined
      "
      :tree-props="{
        children: settingForm.tableOtherConfig
          ? settingForm.tableOtherConfig.childKey
          : 'children',
        hasChildren: 'hasChildren'
      }"
      :style="{ width: '100%' }"
      stripe
      @cell-click="cellClick"
      @row-click="rowClick"
    >
      <table-column
        v-for="(item, index) in tableColums"
        :key="index"
        :item="item"
        :statistics-all="statisticsAll"
        :setting-form="settingForm"
        :colums="colums"
        :width="width"
      />
    </el-table>
    <el-pagination
      v-if="paginationAll"
      :current-page="paginationAll.currentPage"
      :page-size="paginationAll.pageSize"
      :page-sizes="pageSizes"
      :total="paginationAll.total"
      layout="total, sizes, prev, pager, next, jumper"
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
  props: {
    tabledata: {
      type: Array,
      default: null
    },
    colums: {
      type: Array,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    },
    paginationAll: {
      type: Object,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    border: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      cellCursor: '',
      newClums: [],
      tableWidth: 0
    }
  },

  computed: {
    // 表格表头配置
    tableColums() {
      let tableColums = []
      // 判断是否为多表头表格
      if (
        this.settingForm.tableHeaderConfig &&
        this.settingForm.tableHeaderConfig.hierarchy > 1
      ) {
        // 01 多表头表格
        tableColums = this.settingForm.tableHeaderConfig.headerSetting[0]
          .children
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
    }
  },
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
