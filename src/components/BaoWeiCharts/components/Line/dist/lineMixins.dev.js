"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
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
      histogramOptions: {},
      // 柱状图配置数据
      barOptions: {},
      // 条形图配置数据
      extend: {},
      chartSettings: {}
    };
  },
  computed: {
    chartColumns: function chartColumns() {
      var offon = this.chartColumn[0].ischartsShow !== undefined;
      var arr = [];
      var nums = 0;
      this.chartColumn.forEach(function (item) {
        if (offon && item.ischartsShow) {
          arr.push(item);
        } else if (!offon && item.isShow) {
          arr.push(item);
        }
      });
      arr.forEach(function (item, index) {
        if (item.ischartsTitle) {
          nums = index;
        }
      }); // console.log(nums)

      if (nums) {
        var obj = arr[nums];
        arr.splice(nums, 1);
        arr.splice(0, 0, obj);
      } // console.log(arr)


      return arr;
    },
    chartEvents: function chartEvents() {
      var _this = this;

      return {
        click: function click(e) {
          _this.chartClick(e);

          _this.$emit('eventClick', e);
        }
      };
    },
    chartData: function chartData() {
      var _this2 = this;

      var chartData = {};
      if (!this.data || this.data.length === 0) return {}; // console.log(123)

      chartData.columns = [];
      this.chartColumns.forEach(function (item) {
        var dw = item.dw ? "(".concat(item.dw, ")") : '';
        chartData.columns.push(item.explain + dw);
      });
      chartData.rows = [];
      this.data.forEach(function (items, index) {
        var obj = {};

        _this2.chartColumns.forEach(function (item) {
          var dw = item.dw ? "(".concat(item.dw, ")") : '';
          obj[item.explain + dw] = items[item.key] ? items[item.key] : index;
        });

        chartData.rows.push(obj);
      }); // 柱状图啊数据倒序

      if (this.chartType === 'bar') {
        chartData.rows.reverse();
      } // console.log(chartData)


      this.setHistogramOptions();
      this.setBarOptions();
      return chartData;
    },
    // 饼图、环图数据获取
    chartData2: function chartData2() {
      var _this3 = this;

      var chartData = {};
      if (!this.data || this.data.length === 0) return {}; //  return chartData;
      // if(!offon) titles=this.chartColumns[0].explain

      chartData.columns = [this.chartColumns[0].explain];

      if (this.chartColumns.length > 2) {
        if (this.pieType) {
          chartData.columns.push(this.pieType);
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.pieType = this.chartColumns[1].explain;
          chartData.columns.push(this.chartColumns[1].explain); // eslint-disable-next-line vue/no-side-effects-in-computed-properties

          this.pieDW = this.chartColumns[1].dw;
        }
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.pieType = this.chartColumns[1].explain; // console.log(this.chartColumns[1])

        chartData.columns.push(this.chartColumns[1].explain); // eslint-disable-next-line vue/no-side-effects-in-computed-properties

        this.pieDW = this.chartColumns[1].dw;
      }

      chartData.rows = [];
      this.data.forEach(function (items, index) {
        var obj = {};

        _this3.chartColumns.forEach(function (item) {
          obj[item.explain] = items[item.key] ? items[item.key] : index;
          obj.itemStyle = {
            color: 'black'
          };
        });

        chartData.rows.push(obj);
      });
      return chartData;
    },
    // 获取饼图、环图切换配置数据
    picRingBtnArr: function picRingBtnArr() {
      var arr = [];
      this.chartColumns.forEach(function (item, index) {
        if (index > 0) {
          arr.push(item);
        }
      });
      return arr;
    },
    // 条形图配置
    barSettings: function barSettings() {
      var obj = {};
      this.chartStacking(obj);
      return obj;
    },
    // 柱状图配置
    histogramSettings: function histogramSettings() {
      var obj = {};
      this.chartStacking(obj);
      return obj;
    },
    // 饼图配置
    nowPieSetting: function nowPieSetting() {
      var obj = this.pieSettings ? this.pieSettings : {};
      obj.radius = this.height / 4;
      obj.offsetY = this.height / 2;
      obj.label = {
        show: true,
        formatter: '{b} : {c}'
      };
      return obj;
    },
    // 环图配置
    nowRingSetting: function nowRingSetting() {
      var obj = this.ringSettings ? this.ringSettings : {};
      var nRadius = this.height / 4 > 80 ? this.height / 4 - 15 : this.height / 4 - 10;
      obj.radius = [nRadius, this.height / 4];
      obj.offsetY = this.height / 2;
      obj.label = {
        show: true,
        formatter: '{b} : {c}' // formatter: '{b} : {c} ({d}%)'

      }; // 饼图颜色自定义
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

      return obj;
    }
  },
  mounted: function mounted() {
    this.setGrid(this.options);
    this.themeConfig(); // 柱状图配置

    this.setHistogramOptions(); // 条形图配置

    this.setBarOptions();
  },
  watch: {},
  methods: {
    // 条形图、柱状图堆叠配置
    chartStacking: function chartStacking(obj) {
      if (this.settingForm.barHisShowType === '1' && this.chartData && this.chartData.columns.length > 0) {
        obj.stack = {
          合集: []
        };
        this.chartData.columns.forEach(function (item, index) {
          if (index > 0) {
            obj.stack['合集'].push(item);
          }
        });
      }
    },
    // 图表边距位置设置
    setGrid: function setGrid(options) {
      // console.log(this.titleShow)
      if (!this.titleShow) {
        this.$set(options, 'grid', {
          top: 15,
          left: 5,
          bottom: 0,
          right: 5
        });
      } else {
        this.$set(options, 'grid', {
          top: 35,
          left: 5,
          bottom: 0,
          right: 5
        });
      }
    },
    // 条形图配置数据
    setBarOptions: function setBarOptions() {
      var _this4 = this;

      this.barOptions = {
        grid: {},
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 25,
            fontSize: 10,
            color: '#333333'
          }
        },
        yAxis: [{
          axisLabel: {
            fontSize: 10,
            interval: 0,
            color: '#333333'
          }
        }]
      };
      this.setGrid(this.barOptions);
      this.$nextTick(function () {
        // 是否自定义柱颜色
        var offonColor = true;

        _this4.chartColumns.forEach(function (item, index) {
          if (index > 0 && !item.zBgColor) {
            offonColor = false;
          }
        });

        var colors = function colors(params) {
          var bgcolor = '';

          _this4.chartColumns.forEach(function (item) {
            var dw = item.dw ? "(".concat(item.dw, ")") : '';

            if (item.explain + dw === params.seriesName) {
              bgcolor = item.zBgColor;
            }
          });

          return bgcolor;
        };

        _this4.barOptions.series = {
          type: 'bar',
          // 增加type字段
          barMaxWidth: 50,
          // 最大柱宽
          barCategoryGap: 5,
          // 柱间距
          barGap: 0,
          // 顶部切换模块背景颜色
          color: offonColor ? function (params) {
            return colors(params);
          } : undefined,
          itemStyle: {
            // 柱体背景颜色
            color: offonColor ? function (params) {
              return colors(params);
            } : undefined
          },
          label: {
            show: true,
            // 开启显示
            position: 'right',
            // 在上方显示
            // rotate: 90,
            // distance: 25,
            // align: 'right',
            // offset: [10, 0],
            // verticalAlign: 'middle',
            fontSize: 10 // rich: {
            //     name: {
            //         textBorderColor: '#fff'
            //     }
            // }

          }
        };

        _this4.$emit('setOptions', _this4.barOptions, _this4.chartType, _this4.data);
      });
    },
    // 柱状图配置数据
    setHistogramOptions: function setHistogramOptions() {
      var _this5 = this;

      // let options = this.histogramOptions
      this.histogramOptions = {
        grid: {},
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 25,
            fontSize: 10,
            color: '#333333'
          }
        },
        yAxis: [{
          axisLabel: {
            fontSize: 10,
            interval: 0
          }
        }]
      };
      this.setGrid(this.histogramOptions); // 悬浮框数据调整
      // 01 获取数值总和

      this.$nextTick(function () {
        var total = {};
        if (!_this5.chartData.rows) return false;

        _this5.chartData.rows.forEach(function (item) {
          for (var key in item) {
            var num = Number(item[key]);

            if (num) {
              total[key] ? total[key] += num : total[key] = num;
            }
          }
        });

        _this5.histogramOptions.tooltip = {
          formatter: function formatter(params) {
            var res = '';
            params.forEach(function (item, index) {
              var bfb = Math.floor(item.data / total[item.seriesName] * 10000) / 100;

              if (index === 0) {
                res = "".concat(item.seriesName, ":").concat(item.data, "(").concat(bfb, "%)");
              } else {
                res += "<br/>".concat(item.seriesName, ":").concat(item.data, "(").concat(bfb, "%)");
              }
            });
            return res;
          }
        }; // 是否自定义柱颜色

        var offonColor = true;

        _this5.chartColumns.forEach(function (item, index) {
          if (index > 0 && !item.zBgColor) {
            offonColor = false;
          }
        });

        var colors = function colors(params) {
          var bgcolor = '';

          _this5.chartColumns.forEach(function (item) {
            var dw = item.dw ? "(".concat(item.dw, ")") : '';

            if (item.explain + dw === params.seriesName) {
              bgcolor = item.zBgColor;
            }
          });

          return bgcolor;
        }; // 柱最大宽度设置  顶部数据显示


        _this5.histogramOptions.series = {
          barMaxWidth: 50,
          // 最大柱宽
          barCategoryGap: 5,
          // 柱间距
          barGap: 0,
          // 顶部切换模块背景颜色
          color: offonColor ? function (params) {
            return colors(params);
          } : undefined,
          itemStyle: {
            // 柱体背景颜色
            color: offonColor ? function (params) {
              return colors(params);
            } : undefined
          },
          // type: 'histogram', //增加type字段
          label: {
            show: true,
            // 开启显示
            position: 'top',
            // 在上方显示
            // rotate: 90,
            // distance: 5,
            // align: 'left',
            verticalAlign: 'middle',
            fontSize: 10 // formatter: function(params) {
            //     if (params.value !== 0.01) {
            //         return params.value;
            //     } else {
            //         return '';
            //     }
            // },
            // normal: {
            // },
            // rich: {
            //     name: {
            //         textBorderColor: '#fff'
            //     }
            // }

          }
        };

        _this5.$emit('setOptions', _this5.histogramOptions, _this5.chartType, _this5.data);
      });
    },
    // 图表点击事件
    chartClick: function chartClick(e) {
      // 柱状图出现点击状态事件
      if (this.chartType === 'histogram') {
        this.histogramOptions.xAxis.axisLabel.color = function (value, index) {
          return e.dataIndex === index ? '#0091FF' : '#333333';
        };
      } else if (this.chartType === 'bar') {
        this.$set(this.barOptions, 'yAxis.0.axisLabel.color', function (value, index) {
          return e.dataIndex === index ? '#0091FF' : '#333333';
        });
      }
    },
    // 主题颜色配置
    themeConfig: function themeConfig() {
      switch (this.settingConfig.theme) {
        case '1':
          this.options.xAxis.axisLabel.color = 'white';
          this.options['yAxis.0.axisLabel.color'] = 'white';
          break;
      }
    },
    // 饼图、环图选中数据切换
    pieChange: function pieChange(change) {
      var _this6 = this;

      this.pieType = change;
      this.chartColumns.forEach(function (item) {
        if (item.explain === change) {
          _this6.pieDW = item.dw;
        }
      });
    }
  }
};
exports["default"] = _default;