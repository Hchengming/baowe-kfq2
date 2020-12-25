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
      axisConfig: {
        left: 1,
        top: 1,
        zindex: '8',
        // 视图层级
        isDrafting: false // 是否启用拖拽功能

      },
      axisSource: [],
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
      timeSource: []
    };
  },
  methods: {
    // 时间轴配置提交事件
    timeAxisEmit: function timeAxisEmit(config, moduleId) {
      var _this = this;

      // this.axisSource.push({
      //     axisConfig: {
      //         zindex: config.axisConfig.zindex,
      //         top: config.axisConfig.top,
      //         left: config.axisConfig.left,
      //         isDrafting: config.axisConfig.isDrafting,
      //     },
      //     axisData: config.axisData
      // })
      // if (config) return
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

      console.log(reqObj);

      _request["default"].post(this.settingConfig.commonUrl + api, reqObj).then(function () {
        // this.timeSource = res.data
        // console.log(this.timeSource, 'this.timeSource');
        _this.$message({
          type: 'success',
          message: '当前时间轴配置数据保存成功'
        });

        _this.$refs['TimeAxisSetting'].close();

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
        console.log(_this2.timeSource, 'this.timeSource');

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
    axisAdd: function axisAdd() {},
    deleteAxis: function deleteAxis(idx) {
      this.axisSource.splice(idx, 1);
    },
    axisClick: function axisClick() {},
    // timeAxisAdd(config) {
    //     this.timeSource.push(config)
    // },
    deleteTimeAxis: function deleteTimeAxis(idx) {
      this.timeSource.splice(idx, 1);
    },
    timeClick: function timeClick() {}
  }
};
exports["default"] = _default;