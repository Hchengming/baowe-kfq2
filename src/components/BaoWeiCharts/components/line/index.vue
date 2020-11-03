<template>
  <!-- 折线图 -->
  <div class="v_chart_line"
       :style="{'height':height+'px'}">
    <div class="pie_box">
      <!-- 条形图展示 -->
      <ve-bar v-if="chartType=='bar'"
              :legend-visible="titleShow"
              :data="chartData"
              :settings="chartSettings"
              :height="height+'px'"
              :extend="options"
              :events="chartEvents" />
      <!-- 折线图展示 -->
      <ve-line v-if="chartType=='line'"
               :legend-visible="titleShow"
               :extend="options"
               :data="chartData"
               :settings="chartSettings"
               :height="height+'px'"
               :events="chartEvents" />
      <!-- 柱状图展示 -->
      <ve-histogram v-if="chartType=='histogram'"
                    :legend-visible="titleShow"
                    :data="chartData"
                    :settings="histogramSettings"
                    :height="height+'px'"
                    :extend="histogramOptions()"
                    :events="chartEvents" />
      <div v-if="chartType=='pie'||chartType=='ring'"
           class="v_chart_pie">
        <div class="choose">
          <div class="btn">
            <button v-for="(item,index) in picRingBtnArr"
                    :key="index"
                    :class="{'theme-bg-color':pieType==item.explain}"
                    @click="pieChange(item.explain)">{{ item.explain }}</button>
          </div>
          <span class="txt">单位({{ pieDW }})</span>
        </div>
        <div class="pie_box">
          <ve-pie v-if="chartType=='pie'"
                  :data="chartData2"
                  class="pie"
                  :height="chartColumns.length>2?height-25+'px':height+'px'"
                  :legend-visible="false"
                  :settings="nowPieSetting"
                  :events="chartEvents" />
          <!-- 环图 -->
          <ve-ring v-if="chartType=='ring'"
                   :data="chartData2"
                   :height="chartColumns.length>2?height-25+'px':height+'px'"
                   :legend-visible="false"
                   :settings="nowRingSetting"
                   :events="chartEvents" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * pieSettings  饼图配置  Object
 * data   数据  Array
 * chartColumns   配置数据  Array
 * height  图表高度   Number
 * chartType  当前选中图表 String
 * titleShow 图表头部切换是否显示  Boolean
 * ringSettings  环图配置  Object
 */
// let _this
// import Vue from 'vue'
import lineMixins from './lineMixins'
export default {
  mixins: [lineMixins],
  props: {
    data: {
      type: Array,
      default: null
    },
    chartColumn: {
      type: Array,
      default: null
    },
    height: {
      type: Number,
      default: 0
    },
    chartType: {
      type: String,
      default: ''
    },
    titleShow: {
      type: Boolean,
      default: null
    },
    pieSettings: {
      type: Object,
      default: null
    },
    ringSettings: {
      type: Object,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    }
  }
}
</script>
