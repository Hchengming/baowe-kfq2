"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      chooseItem: null // 饼图切换选中数据

    };
  },
  methods: {
    // 鼠标移入悬浮框显示内容配置
    setPieToopTip: function setPieToopTip(options) {
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
      };
    },
    // 饼图、环图显示数据设置
    pieLabelSetting: function pieLabelSetting(options) {
      if (['ring', 'pie'].indexOf(this.chartType) > -1) {
        options.label = {
          show: true,
          formatter: '{b} : {c}'
        };
      }
    },
    // 饼图顶部选择按钮点击事件
    pieChange: function pieChange(item) {
      this.chooseItem = item;
      this.echartsInit();
    },
    // 饼图、环图 series图表显示配置
    setPieSeries: function setPieSeries(options) {
      var _this = this;

      // 01 当前数据类选择
      if (!this.chooseItem) {
        this.chooseItem = this.chartColumns[0];
      } // console.log(this.chooseItem)
      // 02 series配置


      var seriesData = [];
      this.data.forEach(function (item) {
        seriesData.push({
          value: Number(item[_this.chooseItem.key]) ? Number(item[_this.chooseItem.key]) : item[_this.chooseItem.key],
          name: item[_this.titleKey]
        });
      });
      options.series = [{
        name: this.chooseItem.explain,
        type: 'pie',
        avoidLabelOverlap: true,
        data: seriesData
      }]; // 03 饼图、环图区分配置

      if (this.chartType === 'ring') {
        options.series[0].radius = ['50%', '70%'];
      } else if (this.chartType === 'pie') {
        options.series[0].radius = '55%';
        options.series[0].center = ['50%', '50%'];
      }
    },
    // 饼图、环图 背景颜色设置
    setPieColor: function setPieColor(options) {
      if (!options.color) {
        if (this.data.length > 20) return;
        options.color = this.colorArr;
      }
    }
  }
};
exports["default"] = _default;