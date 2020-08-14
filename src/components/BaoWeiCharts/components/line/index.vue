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
              :events="chartEvents"></ve-bar>
      <!-- 折线图展示 -->
      <ve-line v-if="chartType=='line'"
               :legend-visible="titleShow"
               :extend="options"
               :data="chartData"
               :settings="chartSettings"
               :height="height+'px'"
               :events="chartEvents"></ve-line>
      <!-- 柱状图展示 -->
      <ve-histogram v-if="chartType=='histogram'"
                    :legend-visible="titleShow"
                    :data="chartData"
                    :settings="chartSettings"
                    :height="height+'px'"
                    :extend="options"
                    :events="chartEvents"></ve-histogram>
      <div class="v_chart_pie"
           v-if="chartType=='pie'||chartType=='ring'">
        <div class="choose">
          <div class="btn">
            <button v-for="(item,index) in picRingBtnArr"
                    :key="index"
                    :class="{'theme-bg-color':pieType==item.explain}"
                    @click="pieChange(item.explain)">{{item.explain}}</button>
          </div>
          <span class="txt">单位({{pieDW}})</span>
        </div>
        <div class="pie_box">
          <ve-pie v-if="chartType=='pie'"
                  :data="chartData2"
                  class="pie"
                  :height="chartColumns.length>2?height-25+'px':height+'px'"
                  :legend-visible="false"
                  :settings="nowPieSetting"
                  :events="chartEvents"></ve-pie>
          <!-- 环图 -->
          <ve-ring :data="chartData2"
                   v-if="chartType=='ring'"
                   :height="chartColumns.length>2?height-25+'px':height+'px'"
                   :legend-visible="false"
                   :settings="nowRingSetting"
                   :events="chartEvents"></ve-ring>
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
let _this
// import Vue from 'vue'

export default {
  props: [
    'data',
    'chartColumns',
    'height',
    'chartType',
    'titleShow',
    'pieSettings',
    'ringSettings'
  ],
  data () {
    return {
      pieDW: '',
      pieType: '',
      xAxis: {},
      options: {
        // series: { barMinHeight: 1 },
        grid: {},
        xAxis: {},
        tooltip: {
          // trigger: "item",
          // position: function(pt) {
          //   return [pt[0], "10%"];
          // },
          // formatter: "{a} {b}: {c} ({d}%)" // 这里是鼠标移上去的显示数据
        }
      },
      chartEvents: {
        click (e) {
          _this.$emit('eventClick', e)
        }
      },
      extend: {},
      chartSettings: {}
    }
  },
  mounted () {
    //  this.options.yAxis.data.push(JSON.parse("{\"value\":\"" + '哈哈哈' + "\", \"id\":\"" + '66666666' + "\"}"));
    _this = this
    this.$set(this.options.xAxis, 'axisLabel', {
      interval: 0,
      rotate: 25,
      fontSize: 10
    })
    if (!this.titleShow) {
      this.$set(this.options, 'grid', {
        top: 15,
        left: 5,
        bottom: 5,
        right: 5
      })
    } else {
      this.$set(this.options, 'grid', {
        top: 30,
        left: 5,
        bottom: 5,
        right: 5
      })
    }
  },
  computed: {
    chartData () {
      let chartData = {}
      if (!this.data || this.data.length === 0) return {}
      chartData.columns = []
      this.chartColumns.forEach(item => {
        let dw = item.dw ? item.dw : ''
        chartData.columns.push(item.explain + `(${dw})`)
      })
      chartData.rows = []
      this.data.forEach((items, index) => {
        let obj = {}
        this.chartColumns.forEach(item => {
          let dw = item.dw ? item.dw : ''
          obj[item.explain + `(${dw})`] = items[item.key] ? items[item.key] : index
        })
        chartData.rows.push(obj)
      })
      return chartData
    },
    // 饼图、环图数据获取
    chartData2 () {
      let chartData = {}
      // console.log(this.data.length)

      if (!this.data || this.data.length === 0) return {}
      //  return chartData;
      chartData.columns = [this.chartColumns[0].explain]

      if (this.chartColumns.length > 2) {
        if (this.pieType) {
          chartData.columns.push(this.pieType)
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.pieType = this.chartColumns[1].explain
          chartData.columns.push(this.chartColumns[1].explain)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.pieDW = this.chartColumns[1].dw
        }
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.pieType = this.chartColumns[1].explain
        chartData.columns.push(this.chartColumns[1].explain)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.pieDW = this.chartColumns[1].dw
      }

      chartData.rows = []
      this.data.forEach((items, index) => {
        let obj = {}
        this.chartColumns.forEach(item => {
          obj[item.explain] = items[item.key] ? items[item.key] : index
        })
        chartData.rows.push(obj)
      })
      // console.log(chartData)
      return chartData
    },
    // 获取饼图、环图切换配置数据
    picRingBtnArr () {
      let arr = []
      this.chartColumns.forEach((item, index) => {
        if (index > 0) {
          arr.push(item)
        }
      })
      return arr
    },
    // 饼图配置
    nowPieSetting () {
      let obj = this.pieSettings ? this.pieSettings : {}
      obj.radius = this.height / 4
      obj.offsetY = this.height / 2
      return obj
    },
    // 环图配置
    nowRingSetting () {
      let obj = this.ringSettings ? this.ringSettings : {}
      let nRadius =
        this.height / 4 > 80 ? this.height / 4 - 15 : this.height / 4 - 10
      obj.radius = [nRadius, this.height / 4]
      obj.offsetY = this.height / 2
      return obj
    }
  },
  methods: {
    // 饼图、环图选中数据切换
    pieChange (change) {
      this.pieType = change
      this.chartColumns.forEach(item => {
        if (item.explain === change) {
          this.pieDW = item.dw
        }
      })
    }
  }
}
</script>
