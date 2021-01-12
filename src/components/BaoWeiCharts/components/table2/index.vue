<template>
  <div id="bw_table" ref="bw-table">
    <div v-if="settingForm.tablefunctionalComponents && settingForm.tablefunctionalComponents.length > 0" class="table-functional-components">
      <i v-if="settingForm.tablefunctionalComponents.indexOf('colFilter') > -1" class="el-icon-edit" title="列筛选" @click="colFilterClick">
        <col-filter ref="colFilter" :table-colums="tableColums" :setting-form="settingForm" @handleCheckChange="handleCheckChange" />
      </i>
    </div>
    <el-table
      v-if="tableShow"
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
        :colums="newClums"
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
// import csData from './cs.json'
import ColFilter from './ColFilter'
export default {
  components: { TableColumn, ColFilter },
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
      tableWidth: 0,
      offon: false,
      tableColums: [], // 列配置数据
      tableColumsClone: [], // 初始列配置数据
      tableShow: true

    }
  },
  // watch: {
  //   colums(val) {
  //     this.newClums = JSON.parse(JSON.stringify(this.colums))
  //     this.getTableColums()
  //   }
  // },
  mounted() {
    this.newClums = JSON.parse(JSON.stringify(this.colums))
    this.getTableColums()
  },
  methods: {
    // 表格列配置初始化
    getTableColums() {
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
          this.newClums.forEach(item => {
            if (items.key === item.key) {
              Object.assign(items, item)
            }
          })
        })
      } else {
        // 02 普通表格
        tableColums = this.newClums
      }
      this.tableColumsClone = tableColums
      this.tableColums = tableColums
    },
    // 多表头列配置数据筛选
    tableColumsFilter(tableColums) {
      const func = (array, array2) => {
        array.forEach(item => {
          if (item.children && item.children.length > 0) {
            let offon = false
            const obj = JSON.parse(JSON.stringify(item))
            obj.children = []
            item.children.forEach(xx => {
              if (
                xx.isShow === true ||
                (xx.children && xx.children.length > 0)
              ) {
                offon = true
              }
            })
            if (offon) {
              array2.push(obj)
              func(item.children, array2[array2.length - 1].children)
            }
          } else {
            if (item.isShow === true) {
              array2.push(item)
            }
          }
        })
      }
      const tableColum2 = []
      func(tableColums, tableColum2)
      return tableColum2
    },
    // 列筛选按钮点击事件
    colFilterClick() {
      this.$refs['colFilter'].show(this.tableColumsClone)
    },
    // 表格列筛选变化事件
    handleCheckChange(treeData) {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableColums = this.tableColumsFilter(treeData)
        this.tableShow = true
      })
    },
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
    // 表格高度配置
    nowHieght() {
      let height = this.height
      if (this.paginationAll) {
        height -= 35
      }
      if (this.settingForm.tablefunctionalComponents && this.settingForm.tablefunctionalComponents.length > 0) {
        height -= 40
      }
      return height
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
