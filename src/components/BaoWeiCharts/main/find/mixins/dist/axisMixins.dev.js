"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 类目轴
var _default = {
  data: function data() {
    return {
      axisConfig: {
        left: 1,
        top: 1,
        zindex: '8',
        // 视图层级
        axisData: []
      },
      axisSource: [] // 当前页面类目轴配置数据集合

    };
  },
  methods: {
    // 新增配置弹窗显示事件
    axisSettingShow: function axisSettingShow() {
      this.axisConfig.axisData = [];
      this.$refs['AxisSetting'].show();
    },
    // 配置数据提交事件
    categoryConfigSubmit: function categoryConfigSubmit(config, moduleId, close) {
      var _this = this;

      var reqObj = {
        categoryConfig: config
      };
      var api = '';

      if (moduleId) {
        // 修改
        reqObj.moduleId = moduleId;
        api = '/categoryConfig/updateCategoryConfig';
      } else {
        // 新增
        reqObj.menuId = this.nowMenuItem.menuId;
        api = '/categoryConfig/addCategoryConfig';
      }

      console.log(reqObj, api);

      _request["default"].post(this.settingConfig.commonUrl + api, reqObj).then(function () {
        _this.$message({
          type: 'success',
          message: '当前类目轴配置数据保存成功'
        }); // 编辑弹窗关闭事件执行


        if (close) {
          close();
        }

        _this.categoryConfigSelect();
      })["catch"](function () {
        _this.$message({
          type: 'error',
          message: '当前类目轴配置数据保存失败'
        });
      });
    },
    // 类目轴所有数据查询事件
    categoryConfigSelect: function categoryConfigSelect() {
      var _this2 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/categoryConfig/selectCategoryConfig', {
        menuId: this.nowMenuItem.menuId
      }).then(function (res) {
        res.data.forEach(function (item) {
          item.categoryConfig = JSON.parse(item.categoryConfig);
        });
        _this2.axisSource = res.data; // console.log(this.axisSource, 'this.axisSource')

        _this2.$message({
          type: 'success',
          message: '类目轴所有配置数据查询成功'
        });
      })["catch"](function () {
        _this2.$message({
          type: 'error',
          message: '类目轴所有配置数据查询失败'
        });
      });
    },
    // 删除按钮点击事件
    deleteCategory: function deleteCategory(moduleId) {
      var _this3 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/categoryConfig/deleteCategoryConfig', {
        moduleId: moduleId
      }).then(function (res) {
        _this3.categoryConfigSelect();

        _this3.$message({
          type: 'success',
          message: '类目轴删除成功'
        });
      })["catch"](function () {
        _this3.$message({
          type: 'error',
          message: '类目轴删除失败'
        });
      });
    },
    // 类目轴-类目点击事件
    axisClick: function axisClick(data) {
      console.log(data, '类目点击事件');
    }
  }
};
exports["default"] = _default;