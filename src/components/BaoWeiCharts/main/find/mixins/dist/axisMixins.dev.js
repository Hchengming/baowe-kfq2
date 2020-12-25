"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      axisConfig: {
        left: 1,
        top: 1,
        zindex: '8',
        // 视图层级
        isDrafting: false // 是否启用拖拽功能

      },
      axisSource: [],
      timeConfig: {
        left: 1,
        top: 1,
        width: 20,
        zindex: '8',
        // 视图层级
        isDrafting: false,
        // 是否启用拖拽功能
        start: '',
        end: ''
      },
      timeSource: []
    };
  },
  methods: {
    // 时间轴配置提交事件
    axisAdd: function axisAdd(config) {
      // console.log(config)
      this.$refs['AxisSetting'].close();
      this.axisSource.push({
        axisConfig: {
          zindex: config.axisConfig.zindex,
          top: config.axisConfig.top,
          left: config.axisConfig.left,
          isDrafting: config.axisConfig.isDrafting
        },
        axisData: config.axisData
      });
    },
    deleteAxis: function deleteAxis(idx) {
      this.axisSource.splice(idx, 1);
    },
    axisClick: function axisClick() {},
    timeAxisAdd: function timeAxisAdd(config) {
      this.timeSource.push(config);
    },
    deleteTimeAxis: function deleteTimeAxis(idx) {
      this.timeSource.splice(idx, 1);
    },
    timeClick: function timeClick() {}
  }
};
exports["default"] = _default;