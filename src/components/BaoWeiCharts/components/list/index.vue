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
          <el-tooltip v-if="col.key!=='operationButton'"
                      :content="NumStrTransformation(item[col.key],col.dw)"
                      :placement="setPlacement(item)">
            <span :class="colClass(col)">
              {{item[col.key]}}
              <span class="txt3 theme-color">{{col.dw?col.dw:""}}</span>
            </span>
          </el-tooltip>
          <div v-else
               class="right-operate-button">
            <el-button v-for="val in settingForm.operateButton"
                       :key="val.name"
                       :type="val.type"
                       @click.native="operateButtonClick(val,item)"
                       size="mini">{{val.name}}</el-button>
          </div>
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
import listTableCommonJs from '../Table2/commonMixins'
export default {
  mixins: [listTableCommonJs],
  // props: ['data', 'colums', 'height', 'paginationAll', 'statisticsAll'],
  props: {
    data: {
      type: Array
    },
    colums: {
      type: Array
    },
    height: {
      type: Number
    },
    settingForm: {
      type: Object
    },
    paginationAll: {
      type: Object
    },
    statisticsAll: {
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
    rowClick (item, index) {
      this.$emit('rowClick', item, index)
    },
    cellClick (item, key) {
      this.$emit('cellClick', item, key)
    }
  }
}
</script>
