<template>
  <div id="bw_table">
    <el-table :border="border"
              :data="tabledata"
              @cell-click="cellClick"
              @row-click="rowClick"
              stripe
              :height="nowHieght()"
              :style="{width: '100%'}">
      <el-table-column v-for="(item,index) in colums"
                       :key="index"
                       :prop="item.key"
                       :class-name="item.className"
                       :sortable="index>0?true:false"
                       :label="colLabel(item)"
                       :width="colWidth(item,index)"></el-table-column>
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
  props: ['tabledata', 'colums', 'height', 'width', 'paginationAll', 'border'],
  computed: {},
  methods: {
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
    rowClick (row) {
      this.$emit('rowClick', row)
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
