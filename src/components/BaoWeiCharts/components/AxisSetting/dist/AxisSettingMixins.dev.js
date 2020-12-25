"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      isShow: false,
      axisData: [],
      tableCloums: [{
        label: '索引',
        key: 'index',
        formType: 'number',
        width: 100
      }, {
        label: '值',
        key: 'value',
        disabled: false,
        formType: 'input',
        width: 700
      }]
    };
  },
  methods: {
    // 弹窗显示事件
    show: function show() {
      this.isShow = true;
    },
    initData: function initData(data) {
      this.axisData = data.map(function (value) {
        return value;
      });
    },
    // 弹窗关闭事件
    close: function close() {
      this.isShow = false;
    },
    // 配置确认提交事件
    onSubmit: function onSubmit() {
      this.$emit('axisAdd', {
        axisConfig: this.axisConfig,
        axisData: this.axisData
      });
      this.isShow = false;
    },
    axisAdd: function axisAdd() {
      this.axisData[this.axisData.length - 1].index = this.axisData.length - 1;
    }
  }
};
exports["default"] = _default;