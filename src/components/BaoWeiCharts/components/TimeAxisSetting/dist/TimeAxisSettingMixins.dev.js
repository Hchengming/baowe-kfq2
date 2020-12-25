"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      isShow: false,
      tabsFormClone: {}
    };
  },
  methods: {
    yearChange: function yearChange() {},
    // 弹窗显示事件
    show: function show() {
      // this.moduleId = moduleId
      // this.tabsFormClone = JSON.parse(JSON.stringify(this.timeConfig))
      this.isShow = true;
    },
    // 弹窗关闭事件
    close: function close() {
      this.isShow = false;
    },
    // 配置确认提交事件
    onSubmit: function onSubmit() {
      this.$emit('timeAxisEmit', this.timeConfig); // this.isShow = false
    }
  }
};
exports["default"] = _default;