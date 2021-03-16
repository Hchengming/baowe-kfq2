export default {
  data() {
    return {
      destailSetting: []
    }
  },
  computed: {
    skyWidth() {
      return this.labelWidth ? this.labelWidth + 'px' : '80px'
    },
    valWidth() {
      if (this.labelWidth) {
        return `calc(100% - ${this.labelWidth}px)`
      } else {
        return `calc(100% - 80px)`
      }
    }
  },
  mounted() {
    if (this.settingForm.keyArr) {
      this.setDestailSetting()
    }
  },
  watch: {
    'settingForm.keyArr': {
      handler() {
        this.setDestailSetting()
      },
      deep: true
    }
  },
  methods: {
    // 单元格点击事件
    cellClick(colums) {
      this.$emit('cellClick', this.tableData, colums.key)
    },
    // 展示数据配置事件
    setDestailSetting() {
      const tableItem = this.tableData
      const detailsAreaConfig = JSON.parse(
        JSON.stringify(this.settingForm.keyArr)
      )
      detailsAreaConfig.forEach(item => {
        for (const key in tableItem) {
          if (item.key === key) {
            item.val = tableItem[key]
          }
        }
      })

      let num = 0
      let RowData = []
      this.destailSetting = []
      const lastBQ = index => {
        if (index === detailsAreaConfig.length - 1) {
          if (num < 24) {
            const RowDataLength = RowData.length
            let colSpan = 0
            RowData.forEach((obj, objIndex) => {
              if (objIndex !== RowDataLength - 1) {
                colSpan += obj.proportion
              }
            })
            RowData[RowDataLength - 1].proportion = 24 - colSpan
            this.destailSetting.push({ row: RowData })
          }
        }
      }
      detailsAreaConfig.forEach((item, index) => {
        if (item.isShow === true) {
          const proportion = item.proportion ? item.proportion : 24
          if (num + proportion === 24) {
            RowData.push(item)
            this.destailSetting.push({ row: RowData })
            num = 0
            RowData = []
          } else if (num + proportion > 24) {
            this.destailSetting.push({ row: RowData })
            num = proportion
            RowData = [item]
            lastBQ(index)
          } else {
            RowData.push(item)
            num += proportion
            lastBQ(index)
          }
        }
      })
    }
  }
}
