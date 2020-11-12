<template>
  <div class="v_chart_line" :style="{ height: height + 'px' }">
    <div class="v_chart_pie_choose" v-if="chartColumns.length>1&&['pie', 'ring'].indexOf(this.chartType) > -1">
      <div class="btn">
        <button
          v-for="(item, index) in chartColumns"
          :key="index"
          :class="{ 'theme-bg-color': item.key == chooseItem.key }"
          @click="pieChange(item)"
        >
          {{ item.explain }}
        </button>
      </div>
      <span class="txt">单位({{ chooseItem.dw }})</span>
    </div>
    <div
      id="chart-main"
      ref="myCharts"
      :style="{ width: '100%', height: chartsHeight() + 'px' }"
    ></div>
  </div>
</template>

<script>
import barMixins from "./mixins/barMixins";
import hisrogarmMixins from "./mixins/hisrogarmMixins";
import lineMixins from "./mixins/lineMixins";
import pieMixins from "./mixins/pieMixins";
import radarMixins from "./mixins/radarMixins";
import commonMixins from "./mixins/commonMixins";
export default {
  mixins: [
    commonMixins,
    barMixins,
    hisrogarmMixins,
    lineMixins,
    pieMixins,
    radarMixins,
  ],
  props: {
    data: {
      type: Array,
      default: null,
    },
    chartColumn: {
      type: Array,
      default: null,
    },
    height: {
      type: Number,
      default: 0,
    },
    chartType: {
      type: String,
      default: "",
    },
    titleShow: {
      type: Boolean,
      default: null,
    },
    settingConfig: {
      type: Object,
      default: null,
    },
    settingForm: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style>
</style>