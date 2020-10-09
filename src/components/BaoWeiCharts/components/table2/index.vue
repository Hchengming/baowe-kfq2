<template>
  <div id="bw_table">
    <el-table :border="true"
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
                       :prop="item.key"
                       :sortable="item.key!=='operationButton'"
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
          <!-- <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span> -->
        </template>

      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :current-page="paginationAll.currentPage"
                   :page-size="paginationAll.pageSize"
                   :page-sizes="[10,50, 100, 500, 1000]"
                   layout="total, prev, pager, next"
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
import listTableCommonJs from './commonMixins'
export default {
  mixins:[listTableCommonJs],
  data () {
    return {
      cellCursor: ''
    }
  },
  // props: ['tabledata', 'colums', 'height', 'width', 'paginationAll', 'border', 'statisticsAll'],
  props: {
    tabledata: {
      type: Array
    },
    colums: {
      type: Array
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    settingForm:{
      type: Object
    },
    paginationAll: {
      type: Object
    },
    statisticsAll: {
      type: Object
    },
    border: {
      type: Boolean
    }
  },
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
      this.$emit('rowClick', row, row.rowIndex)
    },
    // 表格单元格点击事件
    cellClick (row, column) {
      this.$emit('cellClick', row, column.property)
    },
   
  }
}
</script>
