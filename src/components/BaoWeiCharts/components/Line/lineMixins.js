export default {
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
            fontSize: 10,
            color: '#333333'
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
    chartColumns() {
      const offon = this.chartColumn[0].ischartsShow !== undefined
      const arr = []
      let nums = 0
      this.chartColumn.forEach(item => {
        if (offon && item.ischartsShow) {
          arr.push(item)
        } else if (!offon && item.isShow) {
          arr.push(item)
        }
      })
      arr.forEach((item, index) => {
        if (item.ischartsTitle) {
          nums = index
        }
      })
      // console.log(nums)
      if (nums) {
        const obj = arr[nums]
        arr.splice(nums, 1)
        arr.splice(0, 0, obj)
      }
      // console.log(arr)
      return arr
    },
    chartEvents() {
      const _this = this
      return {
        click(e) {
          _this.chartClick(e)
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

      // console.log(chartData)
      return chartData
    },
    // 饼图、环图数据获取
    chartData2() {
      const chartData = {}

      if (!this.data || this.data.length === 0) return {}
      //  return chartData;

      // if(!offon) titles=this.chartColumns[0].explain
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
        // console.log(this.chartColumns[1])
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
    if (!this.titleShow) {
      this.$set(this.options, 'grid', {
        top: 15,
        left: 5,
        bottom: 0,
        right: 5
      })
    } else {
      // console.log('===============')
      this.$set(this.options, 'grid', {
        top: 35,
        left: 5,
        bottom: 0,
        right: 5
      })
    }
    //柱状图最大宽度设置
    if (this.chartType === 'histogram') {
      this.options.series = v => {
        if (v && v.length > 0) {
          v.forEach(i => {
            i.barMaxWidth = 50
            i.label = {
              show: true, //开启显示
              position: 'top', //在上方显示
              textStyle: {
                //数值样式
                color: 'black',
                fontSize: 12
              }
            }
          })
        }

        return v
      }
    }
    this.themeConfig()
  },
  methods: {
    //图表点击事件
    chartClick(e) {
      //柱状图出现点击状态事件
      if (this.chartType === 'histogram') {
        this.options.xAxis.axisLabel.color = (value, index) => {
          return e.dataIndex === index ? '#0091FF' : '#333333'
        }
      } else {
        this.options.xAxis.axisLabel.color = '#333333'
      }
    },
    //主题颜色配置
    themeConfig() {
      switch (this.settingConfig.theme) {
        case '1':
          this.options.xAxis.axisLabel.color = 'white'
          this.options['yAxis.0.axisLabel.color'] = 'white'
          break
      }
    },
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
