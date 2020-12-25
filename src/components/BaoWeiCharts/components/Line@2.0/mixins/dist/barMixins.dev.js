"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {};
  },
  methods: {
    // 鼠标移入悬浮框显示内容配置
    setBarToopTip: function setBarToopTip(options) {
      // 01 数值求和
      var totalArr = [];
      options.series.forEach(function (item, index) {
        var max = 0;
        item.data.forEach(function (num) {
          max += num;
        });
        totalArr[index] = max;
      }); // 02 显示配置

      options.tooltip = {
        trigger: 'axis',
        formatter: function formatter(params) {
          var str = "".concat(params[0].axisValue);
          params.forEach(function (item, index) {
            var bfb = Number(item.data) ? Math.floor(item.data / totalArr[index] * 10000) / 100 : 0;
            str += "<br><span class=\"e-charts-tooltip-list\" style=\"background:".concat(item.color, "\"></span> ").concat(item.seriesName, "\uFF1A").concat(item.data, " (").concat(bfb, ")%");
          });
          return str;
        }
      };
    },
    // 柱状图、条形图出现点击状态事件
    barClick: function barClick(params, options, myChart) {
      // 柱状图
      if (this.chartType === 'histogram') {
        myChart.setOption({
          xAxis: {
            axisLabel: {
              textStyle: {
                color: function color(value, index) {
                  return index === params.dataIndex ? '#0091FF' : '#333333';
                }
              }
            }
          }
        });
      } else if (this.chartType === 'bar') {
        // 条形图
        myChart.setOption({
          yAxis: {
            axisLabel: {
              textStyle: {
                color: function color(value, index) {
                  return index === params.dataIndex ? '#0091FF' : '#333333';
                }
              }
            }
          }
        });
      }
    },
    // series图表显示配置
    setBarSeries: function setBarSeries(options) {
      var _this = this;

      this.chartColumns.forEach(function (items, indexs) {
        var obj = {
          name: items.title,
          type: 'bar',
          barGap: 0,
          data: [],
          label: {
            show: true,
            // 开启显示
            position: _this.chartType === 'bar' ? 'right' : 'top',
            // 在上方显示
            fontSize: 10
          },
          itemStyle: {
            // 柱体背景颜色
            color: items.zBgColor ? items.zBgColor : _this.colorArr[indexs]
          }
        };

        _this.data.forEach(function (item) {
          obj.data.push(Number(item[items.key]));
        });

        options.series.push(obj);
      });
    },
    // x轴、y轴公共配置
    setBarAxis: function setBarAxis(options) {
      var _this2 = this;

      var valueAxis = {
        type: 'value'
      };
      var dataTitle = [];
      this.data.forEach(function (item) {
        dataTitle.push(item[_this2.titleKey]);
      });

      if (this.chartType === 'bar') {
        dataTitle.reverse();
      }

      var dataAxis = {
        type: 'category',
        data: dataTitle
      };

      if (this.chartType === 'bar') {
        options.xAxis = valueAxis;
        options.yAxis = dataAxis;
      } else if (this.chartType === 'histogram' || this.chartType === 'line') {
        options.xAxis = dataAxis;
        options.yAxis = valueAxis;
      }

      options.xAxis.axisLabel = this.xAxisLabel;
      options.yAxis.axisLabel = this.yAxisLabel;
    }
  }
};
exports["default"] = _default;