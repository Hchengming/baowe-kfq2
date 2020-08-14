<template>
  <!-- 列表模块  开发区分类统计/开发区分类情况使用-->
  <div id="bw_list">
    <ul class="bw_list1"
        :style="{'height':nowHieght+'px','overflow':'auto'}">
      <li v-for="(item,index) in data"
          @click="rowClick(item)"
          :style="{'line-height':'30px'}"
          :class="{'border':item.border}"
          :key="index">
        <div v-for="(col,num) in colums"
             :key="num"
             @click="cellClick(item,col.key)"
             :style="{'width':col.width+'px'}">
          {{item[col.key]}}
          <span class="txt3 theme-color">{{col.dw}}</span>
        </div>
      </li>
    </ul>
    <el-pagination @current-change="handleCurrentChange"
                   :current-page="paginationAll.currentPage"
                   :page-size="paginationAll.pageSize"
                   layout="total,  prev, pager, next, jumper"
                   :total="paginationAll.total"
                   v-if="paginationAll"></el-pagination>
  </div>
</template>

<script>
export default {
  props: ['data', 'colums', 'height', 'paginationAll'],
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
    rowClick (item) {
      this.$emit('rowClick', item)
      // console.log(item)
    },
    cellClick (item, key) {
      this.$emit('cellClick', item, key)
    },
    // 分页变化事件
    handleCurrentChange (val) {
      // this.paginationAll.currentPage = val;
      this.$emit('tablePageSort', val)
    }
  }
}
</script>
<style scoped lang="scss">
// @color: #4886f7;

.bw_list1 {
  border-bottom: 1px solid #f1f1f1;
  li {
    display: flex;
    line-height: 32px;
    justify-content: space-between;

    > span {
      display: inline-block;
      text-align: left;
    }
    .txt3 {
      // color: @color;
      font-weight: lighter;
      // color: #7f7f7f;
      font-size: 12px;
      padding-left: 5px;
    }
  }
  li.border {
    border-bottom: 1px solid #d8d8d8;
  }
}
</style>
