"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

var _dataPresentation = _interopRequireDefault(require("../../../components/SettingForm/dataPresentation.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  data: function data() {
    return {
      beforeParamsData: [],
      // 当前模块供选择参数
      interactiveModuleAll: [],
      // 可交互模块集合
      interactiveData: [],
      // 交互配置数据
      interactiveModuleId: '' // 当前交互配置模块id

    };
  },
  methods: {
    // 图表组件集配置按钮点击事件
    chartsInteractiveSetting: function chartsInteractiveSetting(reqObj) {
      var _this = this;

      // 01-图表组件集交互数据配置---图表、iframe(当前模块)
      this.chartsInteractive(reqObj.statisticsAll); // 02-当前页面所有可交互模块获取(交互模块)

      this.interactivePageData(reqObj.pageData); // 03-交互配置数据获取

      this.getInteractiveData(function () {
        _this.$refs['InteractiveSetting'].show();
      });
    },
    // 图表组件集交互数据配置---图表、iframe
    chartsInteractive: function chartsInteractive(statisticsAll) {
      var _this2 = this;

      this.interactiveModuleId = statisticsAll.moduleId; // 判断是否为分页数据
      // let isPage=statisticsAll.contentAreaConfig.isPage;

      this.beforeParamsData = [];
      statisticsAll.contentAreaConfig.keyArr.forEach(function (item) {
        if (item.isShow) {
          _this2.beforeParamsData.push({
            lab: item.explain,
            val: item.key
          });
        }
      });
    },
    // 当前页面所有可交互模块获取
    interactivePageData: function interactivePageData() {
      var _this3 = this;

      this.interactiveModuleAll = []; // 一、所有图表图表、iframe

      var pageData = this.$refs['middleware'].pageData;
      pageData.forEach(function (config) {
        if (config.moduleId !== _this3.interactiveModuleId) {
          var moduleName = config.contentAreaConfig.title ? config.contentAreaConfig.title : '模块未命名'; // 1、图表

          if (!config.contentAreaConfig.moduleType || config.contentAreaConfig.moduleType === '0') {
            var interactiveParams = []; // 01-获取交付对应字段参数集合

            config.conditionAreaConfig.screenData.forEach(function (item) {
              interactiveParams.push({
                lab: item.label,
                val: item.key
              });
            });

            _this3.interactiveModuleAll.push({
              moduleId: config.moduleId,
              moduleName: moduleName,
              type: config.contentAreaConfig.displayMode,
              interactiveParams: interactiveParams
            });
          } else if (config.contentAreaConfig.moduleType === '1') {
            // 2、iframe框
            _this3.interactiveModuleAll.push({
              moduleId: config.moduleId,
              moduleName: moduleName,
              type: 'iframe',
              interactiveParams: []
            });
          }
        }
      }); // 二、顶部栏(顶部栏暂时不可作为交互对象)
      // if (this.topBarAll.moduleId && this.topBarAll.data.length > 0) {
      //     this.interactiveModuleAll.push({
      //         moduleId: this.topBarAll.moduleId,
      //         moduleName: '顶部栏',
      //         type: "topBar",
      //         interactiveParams: []
      //     });
      // }
      // console.log(this.topBarAll)
    },
    // 当前交互模块配置数据查询事件
    getInteractiveData: function getInteractiveData(fn) {
      var _this4 = this;

      this.interactiveData = [];

      _request["default"].post(this.settingConfig.commonUrl + '/jhConfig/selectJhConfig', {
        moduleId: this.interactiveModuleId
      }).then(function (res) {
        _this4.interactiveData = res.data ? JSON.parse(res.data.interactiveData) : [];
        fn();
      });
    },
    // 模块交互配置数据保存事件
    interactiveDataEmit: function interactiveDataEmit() {
      var _this5 = this;

      var reqObj = {
        moduleId: this.interactiveModuleId,
        interactiveData: this.interactiveData
      };

      _request["default"].post(this.settingConfig.commonUrl + '/jhConfig/updateJhConfig', reqObj).then(function (res) {
        console.log(res);

        _this5.$message({
          type: 'success',
          message: '当前模块交互配置数据编辑成功'
        });
      });
    },
    // 模块交互触发
    interactiveElementMethods: function interactiveElementMethods(reqObj) {
      // 图表组件集配置按钮点击事件获取
      if (reqObj.methodsName === 'interactive') {
        this.chartsInteractiveSetting(reqObj);
      } // 表格单元格点击事件--触发模块交互


      if (reqObj.methodsName === 'cellClick') {
        this.interactiveCellClick(reqObj);
      } // 图表点击事件--触发模块交互


      if (reqObj.methodsName === 'rowClick') {
        this.interactiveChartsClick(reqObj);
      }
    },
    // 图表点击触发交互事件
    interactiveChartsClick: function interactiveChartsClick(reqObj) {
      this.interactiveModuleId = reqObj.moduleId;
      var contentAreaConfig = reqObj.statisticsAll.contentAreaConfig;
      var arr = ['pie', 'ring', 'histogram', 'bar', 'line', 'radar'];

      if (arr.indexOf(contentAreaConfig.displayMode) > -1) {
        this.interactiveCharts(reqObj);
      }
    },
    // 表格、列表、详情通过表格单元格点击触发交互事件
    interactiveCellClick: function interactiveCellClick(reqObj) {
      this.interactiveModuleId = reqObj.moduleId;
      var contentAreaConfig = reqObj.statisticsAll.contentAreaConfig;

      if (['table', 'list', 'destailTable'].indexOf(contentAreaConfig.displayMode) > -1) {
        this.interactiveCharts(reqObj);
      }
    },
    // 图表点击触发交互公共事件
    interactiveCharts: function interactiveCharts(reqObj) {
      var _this6 = this;

      // console.log('==============12345')
      // 1-获取图表类型集合
      // console.log(reqObj, "reqObj");
      var chartsTypeArr = [];

      _dataPresentation["default"].forEach(function (obj) {
        chartsTypeArr.push(obj.type);
      }); // 2-根据图表类型确定触发方式


      this.getInteractiveData(function () {
        _this6.interactiveData.forEach(function (items) {
          // 单元格点击事件时判断点击字段是否为配置字段
          var offon = reqObj.key ? reqObj.key === items.paramsChoose : true;

          if (items.otherModuleConfig.length > 0 && offon) {
            items.otherModuleConfig.forEach(function (item) {
              if (chartsTypeArr.indexOf(item.moduleType) > -1) {
                // 01-交互对象（表格、列表、图表、详情表格单元格）
                var params = {};
                params[item.corParams] = reqObj.rowItem[items.paramsChoose];

                _this6.$refs['middleware'].interactiveCover(params, item.moduleId);
              } else if (item.moduleType === 'iframe') {
                // 02-交互对象
                // console.log(item.jsMethods)
                // eslint-disable-next-line no-eval
                var fnc = eval("(false || ".concat(item.jsMethods, ")"));
                fnc(_defineProperty({}, item.corParams, reqObj.rowItem[items.paramsChoose]));
              }
            });
          }
        });
      });
    },
    // 顶部栏交互按钮点击事件
    topBarInteractiveIconClick: function topBarInteractiveIconClick() {
      var _this7 = this;

      this.interactiveModuleId = this.topBarAll.moduleId; // 1、顶部栏组件集交互前数据配置

      this.beforeParamsData = [{
        lab: '标题',
        val: 'title'
      }]; // 2、当前页面所有可交互模块获取(交互模块)

      this.interactivePageData(); // 03-交互配置数据获取

      this.getInteractiveData(function () {
        _this7.$refs['InteractiveSetting'].show();
      });
    },
    // 顶部栏点击事件触发模块交互
    topBarInteractive: function topBarInteractive(rowItem) {
      this.interactiveModuleId = this.topBarAll.moduleId;
      var reqObj = {
        rowItem: rowItem
      };
      this.interactiveCharts(reqObj);
    }
  }
};
exports["default"] = _default;