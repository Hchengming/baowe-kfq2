<template>
  <!-- 列表模块  开发区分类统计/开发区分类情况使用-->
  <div id="bw_list">
    <ul class="bw_list1"
        :style="{'height':nowHieght+'px','overflow':'auto'}">
      <li v-for="(item,index) in data"
          @click="rowClick(item,index)"
          :style="{'line-height':'30px'}"
          :class="{'border':item.border?true:false}"
          :key="index">
        <div v-for="(col,num) in colums"
             :key="num"
             :class="['cell',cellCursorClass(col.key)]"
             @click="cellClick(item,col.key)"
             :style="{'width':col.width+'px'}">
          <el-tooltip :content="NumStrTransformation(item[col.key],col.dw)"
                      :placement="setPlacement(num,colums)">
            <span>
              {{item[col.key]}}
              <span class="txt3 theme-color">{{col.dw?col.dw:""}}</span>
            </span>

          </el-tooltip>

        </div>
      </li>
    </ul>
    <el-pagination @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :current-page="paginationAll.currentPage"
                   :page-size="paginationAll.pageSize"
                   :page-sizes="[10,50, 100, 500, 1000]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="paginationAll.total"
                   v-if="paginationAll"></el-pagination>
  </div>
</template>

<script>
export default {
  // props: ['data', 'colums', 'height', 'paginationAll', 'statisticsAll'],
  props:{
    data:{
      type: Array
    },
    colums:{
      type: Array
    },
    height:{
       type: Number
    },
     paginationAll:{
       type: Object
    },
    statisticsAll:{
      type: Object
    }
  },
  computed: {
    nowHieght () {
      if (this.paginationAll) {
        return this.height - 35
      } else {
        return this.height
      }
    }
  },
  methods: {
    // 数字转字符串
    NumStrTransformation (val, dw) {
      let str = ''
      dw = dw ? dw : ''
      if (typeof val === 'number') {
        str = val.toString() + dw
      } else {
        str = val + dw
      }
      return str
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
    rowClick (item, index) {
      this.$emit('rowClick', item, index)
    },
    cellClick (item, key) {
      this.$emit('cellClick', item, key)
    },
    // 分页变化事件
    handleCurrentChange (currentPage) {
      // eslint-disable-next-line no-undef
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
