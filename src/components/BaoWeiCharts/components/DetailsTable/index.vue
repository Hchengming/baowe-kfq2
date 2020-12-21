<template>
  <div
    class="stataic_destail_table"
    :style="{'height':height+'px','overflow':'auto'}"
  >
    <div :class="['detail_box', 'model_box' ,'info_table',{'destail-theme-1':settingForm.destailTypeTheme==='1'}]">
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
          @click.native="cellClick(item)"
        >
          <!--主题 默认展示 -->
          <div
            v-if="settingForm.destailTypeTheme==='0'||!settingForm.destailTypeTheme"
            class="key"
            :style="{width:skyWidth}"
          >
            <span>{{ item.explain }}</span>
          </div>
          <div
            v-if="settingForm.destailTypeTheme==='0'||!settingForm.destailTypeTheme"
            :class="['value',{'bg':item.val==0?false:!item.val?true:false}]"
            :style="{width:valWidth}"
          >{{ item.val }}</div>
          <!--主题一 -->
          <div
            v-if="settingForm.destailTypeTheme==='1'"
            class="theme-2-list"
          >
            <div class="title">
              {{ item.explain }}
            </div>
            <div :class="['val']">{{ item.val }}</div>
          </div>
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
      type: Object,
      default: null
    },
    settingForm: {
      type: Object, default: null

    },
    labelWidth: {
      type: Number, default: null

    },
    height: {
      type: Number, default: null
    }
  }
}
</script>
