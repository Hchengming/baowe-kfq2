"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  methods: {
    setLineAxis: function setLineAxis(options) {
      this.setBarAxis(options);
    },
    setLineSeries: function setLineSeries(options) {
      var _this = this;

      this.chartColumns.forEach(function (items, indexs) {
        var obj = {
          name: items.title,
          type: 'line',
          barGap: 0,
          data: [],
          itemStyle: {
            // 柱体背景颜色
            color: items.zBgColor ? items.zBgColor : _this.colorArr[indexs]
          }
        };

        _this.data.forEach(function (item) {
          obj.data.push(item[items.key]);
        });

        options.series.push(obj);
      });
    }
  }
};
exports["default"] = _default;