"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    // tabs切换点击事件
    handleClick: function handleClick() {// if (this.activeName === 'first') {
      //     this.$refs['paramKeyConfig'].paramKeyConfigHenx()
      // }
    },
    // 筛选项配置数据保存事件
    screenSubmit: function screenSubmit(fn) {
      this.$refs['screenSetting'].screenSubmit(fn);
    }
  }
};
exports["default"] = _default;