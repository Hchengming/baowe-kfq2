import echarts from 'echarts'
export default {
  data() {
    return {}
  },
  methods: {
    // 鼠标移入悬浮框显示内容配置
    setBarToopTip(options) {
      // 01 数值求和
      const totalArr = []
      options.series.forEach((item, index) => {
        let max = 0
        item.data.forEach(num => {
          max += num
        })
        totalArr[index] = max
      })
      // 02 显示配置
      options.tooltip = {
        trigger: 'axis',
        formatter(params) {
          let str = `${params[0].axisValue}`
          params.forEach((item, index) => {
            const bfb = Number(item.data)
              ? Math.floor((item.data / totalArr[index]) * 10000) / 100
              : 0

            str += `<br><span class="e-charts-tooltip-list" style="background:${item.color}"></span> ${item.seriesName}：${item.data} (${bfb})%`
          })
          return str
        }
      }
    },
    // 柱状图、条形图出现点击状态事件
    barClick(params, options, myChart) {
      // 柱状图

      if (this.chartType === 'histogram') {
        myChart.setOption({
          xAxis: {
            axisLabel: {
              textStyle: {
                color: function(value, index) {
                  return index === params.dataIndex ? '#0091FF' : '#333333'
                }
              }
            }
          }
        })
      } else if (this.chartType === 'bar') {
        // 条形图
        myChart.setOption({
          yAxis: {
            axisLabel: {
              textStyle: {
                color: function(value, index) {
                  return index === params.dataIndex ? '#0091FF' : '#333333'
                }
              }
            }
          }
        })
      }
    },
    // 饼图饼是否可点击设置
    barCursor(key) {
      const arr = []
      let cursor = 'default'
      this.settingForm.keyArr.forEach(item => {
        if (item.isClick === '1') {
          arr.push(item.key)
        }
      })
      if (arr.length > 0 && arr.indexOf(key) > -1) {
        cursor = 'pointer'
      }
      return cursor
    },
    labelOption() {
      let obj = {
        show: this.settingForm.labelShow, // 开启显示
        position: this.chartType === 'bar' ? 'right' : 'top', // 在上方显示

        fontSize: 15
      }
      // 柱状图
      if (this.settingForm.barPosition === 'center') {
        if (this.chartType === 'histogram') {
          obj = Object.assign(obj, {
            position: 'insideBottom',
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            distance: 2
          })
        } else {
          obj.position = 'insideLeft'
        }
      }

      return obj
    },
    // series图表显示配置
    setBarSeries(options) {
      this.chartColumns.forEach((items, indexs) => {
        const obj = {
          name: items.title,
          type: 'bar',
          barGap: this.settingForm.barGroup
            ? this.settingForm.barGroup / 100
            : 0,
          barMaxWidth: this.settingForm.barMaxWidth
            ? this.settingForm.barMaxWidth
            : 100,
          data: [],
          stack: this.setStack(items),
          label: this.labelOption(),
          itemStyle: {
            // 柱体背景颜色
            color: this.setItemStyle(items, indexs)
          },
          cursor: this.barCursor(items.key)
        }

        this.data.forEach(item => {
          obj.data.push(Number(item[items.key]))
        })

        options.series.push(obj)
      })
    },
    // 堆栈设置
    setStack(items) {
      if (this.settingForm.barHisShowType !== '1') {
        return undefined
      } else {
        return items.stack
      }
    },
    // 柱图背景样式设置
    setItemStyle(items, indexs) {
      if (!items.zBgColor) {
        return this.colorArr[indexs]
      } else {
        if (items.zBgColor2) {
          if (this.chartType === 'bar') {
            return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: items.zBgColor },
              { offset: 1, color: items.zBgColor2 }
            ])
          } else {
            return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: items.zBgColor },
              { offset: 1, color: items.zBgColor2 }
            ])
          }
        } else {
          return items.zBgColor
        }
      }
    },
    // x轴、y轴公共配置
    setBarAxis(options) {
      const valueAxis = {
        type: 'value'
      }
      const dataTitle = []
      this.data.forEach(item => {
        dataTitle.push(item[this.titleKey])
      })
      if (this.chartType === 'bar') {
        dataTitle.reverse()
      }
      const dataAxis = {
        type: 'category',
        data: dataTitle
      }

      if (this.chartType === 'bar') {
        options.xAxis = valueAxis
        options.yAxis = dataAxis
      } else if (this.chartType === 'histogram' || this.chartType === 'line') {
        options.xAxis = dataAxis
        options.yAxis = valueAxis
      }
      // y轴名称
      if (this.settingForm.yName) {
        options.yAxis.name = this.settingForm.yName
        options.yAxis.nameLocation = 'end'
        options.yAxis.nameTextStyle = {
          color: this.settingConfig.theme === 1 ? '#d3c6c6' : '#3b85d8'
        }
      }
      // x轴名称
      if (this.settingForm.xName) {
        options.xAxis.name = this.settingForm.xName
        options.xAxis.nameLocation = 'end'
        options.grid.right = this.settingForm.xName.length * 12 + 16
        options.xAxis.nameTextStyle = {
          color: this.settingConfig.theme === 1 ? '#d3c6c6' : '#3b85d8'
        }
      }
      // console.log(this.settingConfig)
      this.xAxisLabel.rotate = this.settingForm.xRotate
      options.xAxis.axisLabel = this.xAxisLabel
      options.yAxis.axisLabel = this.yAxisLabel
    }
  }
}
