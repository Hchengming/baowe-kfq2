<template>
  <!-- 折线图 -->
  <div
    class="v_chart_line"
    :style="{'height':height+'px'}"
  >
    <div class="pie_box">
      <!-- 条形图展示 -->
      <ve-bar
        v-if="chartType=='bar'"
        :legend-visible="titleShow"
        :data="chartData"
        :settings="chartSettings"
        :height="height+'px'"
        :extend="options"
        :events="chartEvents"
      />
      <!-- 折线图展示 -->
      <ve-line
        v-if="chartType=='line'"
        :legend-visible="titleShow"
        :extend="options"
        :data="chartData"
        :settings="chartSettings"
        :height="height+'px'"
        :events="chartEvents"
      />
      <!-- 柱状图展示 -->
      <ve-histogram
        v-if="chartType=='histogram'"
        :legend-visible="titleShow"
        :data="chartData"
        :settings="histogramSettings"
        :height="height+'px'"
        :extend="options"
        :events="chartEvents"
      />
      <div
        v-if="chartType=='pie'||chartType=='ring'"
        class="v_chart_pie"
      >
        <div class="choose">
          <div class="btn">
            <button
              v-for="(item,index) in picRingBtnArr"
              :key="index"
              :class="{'theme-bg-color':pieType==item.explain}"
              @click="pieChange(item.explain)"
            >{{ item.explain }}</button>
          </div>
          <span class="txt">单位({{ pieDW }})</span>
        </div>
        <div class="pie_box">
          <ve-pie
            v-if="chartType=='pie'"
            :data="chartData2"
            class="pie"
            :height="chartColumns.length>2?height-25+'px':height+'px'"
            :legend-visible="false"
            :settings="nowPieSetting"
            :events="chartEvents"
          />
          <!-- 环图 -->
          <ve-ring
            v-if="chartType=='ring'"
            :data="chartData2"
            :height="chartColumns.length>2?height-25+'px':height+'px'"
            :legend-visible="false"
            :settings="nowRingSetting"
            :events="chartEvents"
          />
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

export default {
  props: {
    data: {
      type: Array,
      default: null
    },
    chartColumns: {
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
    }
  },
  data() {
    return {
      pieDW: '',
      pieType: '',
      xAxis: {},
      options: {
        grid: {},
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 25,
            fontSize: 10
          }
        },
        'yAxis.0.axisLabel.fontSize': 10,
        'yAxis.0.axisLabel.interval': 0

      },
      extend: {},
      chartSettings: {}

    }
  },
  computed: {
    chartEvents() {
      const _this = this
      return {
        click(e) {
          // console.log(e)
          _this.$emit('eventClick', e)
        }
      }
    },
    chartData() {
      const chartData = {}
      if (!this.data || this.data.length === 0) return {}
      // console.log(123)
      chartData.columns = []
      this.chartColumns.forEach(item => {
        const dw = item.dw ? `(${item.dw})` : ''
        chartData.columns.push(item.explain + dw)
      })
      chartData.rows = []
      this.data.forEach((items, index) => {
        const obj = {}
        this.chartColumns.forEach(item => {
          const dw = item.dw ? `(${item.dw})` : ''
          obj[item.explain + dw] = items[item.key] ? items[item.key] : index
        })
        chartData.rows.push(obj)
      })

      console.log(chartData)
      return chartData
    },
    // 饼图、环图数据获取
    chartData2() {
      const chartData = {}

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
        const obj = {}
        this.chartColumns.forEach(item => {
          obj[item.explain] = items[item.key] ? items[item.key] : index
          obj.itemStyle = { color: 'black' }
        })
        chartData.rows.push(obj)
      })

      return chartData
    },
    // 获取饼图、环图切换配置数据
    picRingBtnArr() {
      const arr = []
      this.chartColumns.forEach((item, index) => {
        if (index > 0) {
          arr.push(item)
        }
      })
      return arr
    },
    // 柱状图配置
    histogramSettings() {
      const obj = {}

      return obj
    },
    // 饼图配置
    nowPieSetting() {
      const obj = this.pieSettings ? this.pieSettings : {}
      obj.radius = this.height / 4
      obj.offsetY = this.height / 2
      obj.label = {
        show: true,
        formatter: '{b} : {c}'
      }
      return obj
    },
    // 环图配置
    nowRingSetting() {
      const obj = this.ringSettings ? this.ringSettings : {}
      const nRadius =
        this.height / 4 > 80 ? this.height / 4 - 15 : this.height / 4 - 10
      obj.radius = [nRadius, this.height / 4]
      obj.offsetY = this.height / 2
      obj.label = {
        show: true,
        formatter: '{b} : {c}'
        // formatter: '{b} : {c} ({d}%)'
      }
      // 饼图颜色自定义
      // obj.itemStyle={
      //   color:function(params) {
      //     console.log(params)
      //                //自定义颜色
      //                var colorList = [
      //                        'red','#B5C334','#FCCE10','#E87C25','#27727B',
      //                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
      //                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
      //                    ];
      //                    return colorList[params.dataIndex]
      //                 }
      // }
      return obj
    }
  },
  mounted() {
    this.$set(this.options, 'grid', {
      top: 15,
      left: 5,
      bottom: 0,
      right: 5
    })
    // if (!this.titleShow) {
    //   this.$set(this.options, 'grid', {
    //     top: 15,
    //     left: 5,
    //     bottom: 0,
    //     right: 5
    //   })
    // } else {
    //   this.$set(this.options, 'grid', {
    //     top: 45,
    //     left: 5,
    //     bottom: 0,
    //     right: 5
    //   })
    // }
    if (this.chartType === 'histogram') {
      this.options.series = (v) => {
        if (v && v.length > 0) {
          v.forEach(i => {
            i.barMaxWidth = 50
          })
        }

        return v
      }
      //  this.$set(this.options, 'series', obj.series(v){

      //   })
    }
  },
  methods: {
    // 饼图、环图选中数据切换
    pieChange(change) {
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
