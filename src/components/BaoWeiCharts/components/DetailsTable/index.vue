<template>
  <div
    class="stataic_destail_table"
    :style="{'height':height+'px','overflow':'auto'}"
  >
    <div class="detail_box model_box info_table">
      <el-row
        v-for="(items,indexs) in destailSetting"
        :key="indexs"
        class="detail_row"
      >
        <el-col
          v-for="(item,index) in items.row"
          v-show="item.isHide!=true"
          :key="index"
          :span="item.proportion?item.proportion:24"
          class="detail_col"
        >
          <div
            class="key"
            :style="{width:skyWidth}"
          >
            <span>{{ item.title }}</span>
          </div>
          <div
            :class="['value',{'bg':item.val==0?false:!item.val?true:false}]"
            :style="{width:valWidth}"
          >{{ item.val }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import dataMixins from './mixins.js'
export default {
  mixins: [dataMixins],
  props: {
    tableData: {
      type: Object
    },
    detailsTableAll: {
      type: Array
    },
    labelWidth: {
      type: Number
    },
    height: {
      type: Number
    }
  }
}
</script>
