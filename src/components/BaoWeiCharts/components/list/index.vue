<template>
  <!-- 列表模块  开发区分类统计/开发区分类情况使用-->
  <div id="bw_list">
    <ul
      :style="{'height':nowHieght+'px','overflow':'auto'}"
      class="bw_list1"
    >
      <li
        v-for="(item,index) in data"
        :key="index"
        :style="{'line-height':'30px'}"
        :class="{'border':item.border?true:false}"
        @click="rowClick(item,index)"
      >
        <div
          v-for="(col,num) in colums"
          :key="num"
          :class="['cell',cellCursorClass(col.key)]"
          :style="{'width':col.width+'px'}"
          @click="cellClick(item,col.key)"
        >
          <el-tooltip
            v-if="col.key!=='operationButton'"
            :content="cellTip(col,item)"
            :placement="setPlacement(num,colums)"
          >
            <span :class="colClass(col)">
              <!-- {{ item[col.key] }} -->
              <span v-html="cellHtml(col,item)" />
              <span class="txt3 theme-color">{{ col.dw?col.dw:"" }}</span>
            </span>
          </el-tooltip>
          <div
            v-else
            class="right-operate-button"
          >
            <el-button
              v-for="val in settingForm.operateButton"
              :key="val.name"
              :type="val.type"
              size="mini"
              @click.native="operateButtonClick(val,item)"
            >{{ val.name }}</el-button>
          </div>
        </div>
      </li>
    </ul>
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
import commonMixins from '../Table2/TableMixins.js'
export default {
  mixins: [commonMixins],
  // props: ['data', 'colums', 'height', 'paginationAll', 'statisticsAll'],
  props: {
    data: {
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
    }
  },
  computed: {
    nowHieght() {
      if (this.paginationAll) {
        return this.height - 35
      } else {
        return this.height
      }
    }
  },
  methods: {
    // 数字转字符串
    NumStrTransformation(val, dw) {
      let str = ''
      dw = dw || ''
      if (typeof val === 'number') {
        str = val.toString() + dw
      } else {
        str = val + dw
      }
      return str
    },
    rowClick(item, index) {
      this.$emit('rowClick', item, index)
    },
    cellClick(item, key) {
      this.$emit('cellClick', item, key)
    }
  }
}
</script>
