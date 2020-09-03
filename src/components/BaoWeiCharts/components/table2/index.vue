<template>
  <div id="bw_table">
    <el-table :border="border"
              :data="tabledata"
              @cell-click="cellClick"
              @row-click="rowClick"
              :row-class-name="tableRowClassName"
              stripe
              :height="nowHieght()"
              :style="{width: '100%'}">
      <el-table-column v-for="(item,index) in colums"
                       :key="index"
                       :class-name="item.className+' '+cellCursorClass(item.key)"
                       :sortable="index>0?true:false"
                       :label="colLabel(item)"
                       :width="colWidth(item,index)">
        <template slot-scope="scope">
          <el-tooltip :content="NumStrTransformation(scope.row[item.key])"
                      :placement="setPlacement(index,colums)">
            <span>{{scope.row[item.key]}}</span>
          </el-tooltip>
          <!-- <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :current-page="paginationAll.currentPage"
                   :page-size="paginationAll.pageSize"
                   :page-sizes="[10,50, 100, 500, 1000]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="paginationAll.total"
                   v-if="paginationAll"></el-pagination>
    <!--    <el-pagination-->
    <!--      @size-change="handleSizeChange"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--      :current-page="currentPage4"-->
    <!--      :page-sizes="[10,50, 100, 500, 1000]"-->
    <!--      :page-size="10"-->
    <!--      layout="total, sizes, prev, pager, next, jumper"-->
    <!--      :total="400">-->
    <!--    </el-pagination>-->
  </div>
</template>
<script>
export default {
  data () {
    return {
      cellCursor: ''
    }
  },
  props: ['tabledata', 'colums', 'height', 'width', 'paginationAll', 'border', 'statisticsAll'],
  computed: {},
  methods: {
    // 获取行索引
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.rowIndex = rowIndex
    },
    // 数字转字符串
    NumStrTransformation (val) {
      if (typeof val === 'number') {
        val = val.toString()
      }
      return val
    },
    // topTitle显示位置控制
    setPlacement (index, column) {
      let length = column.length
      if (index + 1 <= length / 2) {
        return 'top-start'
      } else {
        return 'top-end'
      }
    },
    // 单元格样式
    cellCursorClass (key) {
      let calss = 'cursor-default'
      if (this.statisticsAll.contentAreaConfig.submodule === '1') {
        if (this.statisticsAll.contentAreaConfig.clickToShow === 'row' && this.statisticsAll.isRowDrillDown === '1') {
          calss = 'cursor-pointer'
        }
        if (this.statisticsAll.contentAreaConfig.clickToShow === 'cell' && this.statisticsAll.drillDownKeyAll &&
          this.statisticsAll.drillDownKeyAll.indexOf(key) > -1) {
          calss = 'cursor-pointer'
        }
      }
      return calss
    },
    nowHieght () {
      if (this.paginationAll) {
        return this.height - 35
      } else {
        return this.height
      }
    },
    // headername 获取
    colLabel (item) {
      return item.dw ? item.explain + `(${item.dw})` : item.explain
    },
    // 动态获取宽度
    colWidth (item, index) {
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
    rowClick (row, column, event) {
      // console.log(row)
      this.$emit('rowClick', row, row.rowIndex)
    },
    // 表格单元格点击事件
    cellClick (row, column) {
      this.$emit('cellClick', row, column.property)
    },
    // 分页变化事件
    handleCurrentChange (currentPage) {
      console.log(this.paginationAll)
      this.paginationAll.currentPage = currentPage
      this.$emit('tablePageSort', this.paginationAll)
    },
    // 每页条数变化事件
    handleSizeChange (pageSize) {
      this.paginationAll.pageSize = pageSize
      this.$emit('tablePageSort', this.paginationAll)
    }
  }
}
</script>
