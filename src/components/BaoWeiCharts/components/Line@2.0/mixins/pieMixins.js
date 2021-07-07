export default {
  data() {
    return {
      chooseItem: null // 饼图切换选中数据
    }
  },
  methods: {
    // 鼠标移入悬浮框显示内容配置
    setPieToopTip(options) {
      // 01 数值求和
      // let total = null
      // options.series.forEach((item) => {
      //         let max = 0
      //         item.data.forEach(num => {
      //             max += num.value
      //         })
      //         total = max
      //     })
      // 02 显示配置

      // options.tooltip = {
      //     trigger: 'item',
      //     formatter(params) {
      //         let str = `${params.seriesName}`
      //         const bfb =
      //             Math.floor((params.data.value / total) * 10000) / 100
      //         str += `<br><span class="e-charts-tooltip-list" style="background:${params.color}"></span> ${params.data.name}：${params.data.value} (${bfb})%`
      //         return str
      //     }
      // }
      options.tooltip = {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      }
      const fnc = this.settingForm.suspensionFrameJs
      if (fnc && fnc.replace(/\s*/g, '')) {
        options.tooltip.formatter = (params) => {
          return this.suspensionFrameFnc(params)
        }
      }
    },
    // 饼图、环图显示数据设置
    pieLabelSetting(options) {
      if (['ring', 'pie'].indexOf(this.chartType) > -1) {
        options.label = {
          show: true,
          formatter: '{b} : {c}'
        }
      }
    },
    // 饼图顶部选择按钮点击事件
    pieChange(item) {
      this.chooseItem = item
      this.echartsInit()
      this.$emit('pieTabsClick', item)
    },
    // 饼图饼是否可点击设置
    pieCursor() {
      const arr = []
      let cursor = 'default'
      this.settingForm.keyArr.forEach(item => {
        if (item.isClick === '1') {
          arr.push(item.key)
        }
      })
      if (arr.length > 0 && arr.indexOf(this.chooseItem.key) > -1) {
        cursor = 'pointer'
      }
      return cursor
    },
    // 饼图、环图 series图表显示配置
    setPieSeries(options) {
      // 01 当前数据类选择
      if (!this.chooseItem) {
        this.chooseItem = this.chartColumns[0]
      }
      // 02 series配置
      const seriesData = []
      this.data.forEach(item => {
        seriesData.push({
          value: Number(item[this.chooseItem.key]) ? Number(item[this.chooseItem.key]) : item[this.chooseItem.key],
          name: item[this.titleKey]
        })
      })
      options.series = [{
        name: this.chooseItem.explain,
        type: 'pie',
        avoidLabelOverlap: true,
        data: seriesData,
        cursor: this.pieCursor()
      }]
      // 03 饼图、环图区分配置
      if (this.chartType === 'ring') {
        options.series[0].radius = ['50%', '70%']
      } else if (this.chartType === 'pie') {
        options.series[0].radius = '55%'
        options.series[0].center = ['50%', '50%']
      }
    },
    // 饼图、环图 背景颜色设置
    setPieColor(options) {
      if (!options.color) {
        if (this.data.length > 40) return
        options.color = this.colorArr
      }
    }
  }
}
