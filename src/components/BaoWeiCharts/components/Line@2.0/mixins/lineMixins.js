export default {
  methods: {
    setLineAxis(options) {
      this.setBarAxis(options)
    },
    setLineSeries(options) {
      this.chartColumns.forEach((items, indexs) => {
        const obj = {
          name: items.title,
          type: 'line',
          barGap: 0,
          data: [],
          label: {
            show: true
          },
          itemStyle: {
            // 柱体背景颜色
            color: items.zBgColor ? items.zBgColor : this.colorArr[indexs]
          },
          cursor: this.barCursor(items.key)
        }
        this.data.forEach(item => {
          obj.data.push(item[items.key])
        })
        options.series.push(obj)
      })
    }
  }
}
