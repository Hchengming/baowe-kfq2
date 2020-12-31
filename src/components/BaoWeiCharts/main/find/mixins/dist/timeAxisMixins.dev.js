"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 时间轴
var _default = {
  data: function data() {
    return {
      // 时间轴配置项
      timeConfig: {
        left: 1,
        top: 1,
        width: 20,
        zindex: '8',
        // 视图层级
        start: '',
        // 开始时间
        end: '' // 结束时间

      },
      timeSource: [],
      timeConfigClone: {}
    };
  },
  methods: {
    // 时间点击事件
    timeClick: function timeClick(date) {
      console.log(date);
    },
    // 时间轴配置提交事件
    timeAxisEmit: function timeAxisEmit(config, moduleId, close) {
      var _this = this;

      var reqObj = {
        timeAxisConfig: config
      };
      var api = '';

      if (moduleId) {
        // 修改
        reqObj.moduleId = moduleId;
        api = '/timeAxisConfig/updateTimeAxisConfig';
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId;
        api = '/timeAxisConfig/addTimeAxisConfig';
      }

      _request["default"].post(this.settingConfig.commonUrl + api, reqObj).then(function () {
        _this.$message({
          type: 'success',
          message: '当前时间轴配置数据保存成功'
        }); // 编辑弹窗关闭事件执行


        if (close) {
          close();
        }

        _this.timeAxisSelect();
      })["catch"](function () {
        _this.$message({
          type: 'error',
          message: '当前时间轴配置数据保存失败'
        });
      });
    },
    // 时间轴所有配置数据查询
    timeAxisSelect: function timeAxisSelect() {
      var _this2 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/timeAxisConfig/selectTimeAxisConfig', {
        menuId: this.nowMenuItem.menuId
      }).then(function (res) {
        res.data.forEach(function (item) {
          item.timeAxisConfig = JSON.parse(item.timeAxisConfig);
        });
        _this2.timeSource = res.data;

        _this2.$message({
          type: 'success',
          message: '时间轴所有配置数据查询成功'
        });
      })["catch"](function () {
        _this2.$message({
          type: 'error',
          message: '时间轴所有配置数据查询失败'
        });
      });
    },
    // 时间轴模块删除事件
    deleteTimeAxis: function deleteTimeAxis(moduleId) {
      var _this3 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/timeAxisConfig/deleteTimeAxisConfig', {
        moduleId: moduleId
      }).then(function (res) {
        _this3.timeAxisSelect();

        _this3.$message({
          type: 'success',
          message: '时间轴删除成功'
        });
      })["catch"](function () {
        _this3.$message({
          type: 'error',
          message: '时间轴删除失败'
        });
      });
    }
  }
};
exports["default"] = _default;