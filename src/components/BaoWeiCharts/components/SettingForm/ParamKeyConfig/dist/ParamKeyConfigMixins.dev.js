"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import filterDataDefault from "../../WhereSetting/CommonFilter/commonWhere.json";
var _default = {
  data: function data() {
    return {
      treeData: [],
      nowIndex: 0
    };
  },
  methods: {
    // 视图参数获取事件
    getViewParams: function getViewParams() {
      var _this = this;

      if (this.form.apiType === '0') {
        _request["default"].get("http://23.36.123.128/api/.DataView/view/v1/".concat(this.form.viewId, "/paramlist")).then(function (res) {
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            resData.forEach(function (item) {
              _this.form.paramConfig.push({
                paramKey: item.paramCode,
                description: item.paramName,
                paramValue: '',
                dataType: item.dataType === 'number' ? 'number' : 'string',
                isUse: true
              });
            });
          }
        });
      }
    },
    // 当前接口所有参数获取事件
    getparamConfig: function getparamConfig() {
      var _this2 = this;

      // 项目常用参数变量获取
      // this.getCommonParams()
      this.$set(this.form, 'paramConfig', []); // 获取当前接口参数

      if (this.form.apiType === '0') {
        // 视图参数获取
        this.getViewParams();
      } else {
        var arrKey = [];
        this.itemApiData.forEach(function (items) {
          if (items.aaaRequestUrl === _this2.form.url && items.param) {
            items.param.forEach(function (item) {
              if (arrKey.indexOf(item.name) === -1) {
                arrKey.push(item.name);

                _this2.form.paramConfig.push({
                  paramKey: item.name,
                  description: item.description,
                  paramValue: '',
                  dataType: item.dataType === 'string' ? 'string' : 'number',
                  isUse: true
                });
              }
            });
          }
        }); // 分页参数配置

        if (this.form.isPage === '1') {
          this.form.paramConfig.push({
            paramKey: 'pageSize',
            description: '每页显示条数',
            paramValue: this.form.pageSize,
            dataType: 'number',
            isUse: true
          });
          this.form.paramConfig.push({
            paramKey: 'currentPage',
            description: '当前页码',
            paramValue: 1,
            dataType: 'number',
            isUse: true
          });
        }
      } // 自定义配置筛选项参数写入


      if (this.statisticsAll && this.statisticsAll.conditionAreaConfig) {
        var config = this.statisticsAll.conditionAreaConfig;
        var datas = []; // 01-自定义筛选项

        if (config.screenData && config.screenData.length > 0) {
          datas = datas.concat(config.screenData);
        } // 02-通用配置项
        // if (config.commonFilterData && config.commonFilterData.length > 0) {
        //     datas = datas.concat(config.commonFilterData)
        // }


        datas.forEach(function (items) {
          var offon = true;
          var nowDataType = '';

          switch (items.type) {
            case 'number':
              nowDataType = 'number';
              break;

            case 'checkbox':
              nowDataType = 'object';
              break;

            default:
              nowDataType = 'string';
          }

          _this2.form.paramConfig.forEach(function (item) {
            if (item.paramKey === items.key) {
              if (items.type !== 'checkbox' && _this2.whereForm[items.key]) {
                item.paramValue = _this2.whereForm[items.key];
              }

              offon = false;
            }
          });

          if (offon) {
            // 数据类型判断
            var paramValue = nowDataType === 'checkbox' ? JSON.stringify(_this2.whereForm[items.key]) : _this2.whereForm[items.key];

            _this2.form.paramConfig.push({
              paramKey: items.key,
              description: items.label,
              dataType: nowDataType,
              paramValue: paramValue,
              isUse: true
            });
          }
        });
      } // 下钻参数写入


      if (this.parentParamsAll && this.parentParamsAll.keyArr) {
        this.parentParamsAll.keyArr.forEach(function (item) {
          if (item.isCruxKey) {
            _this2.form.paramConfig.push({
              paramKey: item.key,
              description: item.explain,
              paramValue: '',
              dataType: 'string',
              isUse: true
            });
          }
        });
      }

      if (this.parentParamsAll && this.parentParamsAll.parentParamsData && this.parentParamsAll.parentParamsData.length > 0) {
        this.parentParamsAll.parentParamsData.forEach(function (item) {
          _this2.form.paramConfig.push(item);
        });
      } // 初始值获取----公共参数与当前参数值一致


      this.form.paramConfig.forEach(function (items) {
        _this2.treeData.forEach(function (item) {
          if (items.paramKey === item.paramKey) {
            items.paramValue = item.paramValue;
          }
        });
      });
    },
    // 项目常用公共参数-值获取
    getCommonParams: function getCommonParams() {
      this.treeData = []; // localStorage 存储数据解析

      var len = localStorage.length;

      for (var i = 0; i < len; i++) {
        // 获取key 索引从0开始
        var getKey = localStorage.key(i); // 获取key对应的值

        var getVal = localStorage.getItem(getKey);

        var nowDataType = _typeof(getVal);

        if (this.isObject(getVal) === 'true') {
          nowDataType = 'object';
        }

        this.treeData.push({
          id: this.treeData.length,
          paramKey: getKey,
          dataType: nowDataType,
          paramValue: getVal // paramValue: nowDataType === 'object' ? JSON.stringify(getVal) : getVal

        });
      }
    },
    // 判断字符串是否可转换为对象
    isObject: function isObject(str) {
      try {
        if (JSON.parse(str) !== undefined) {
          return 'true';
        }
      } catch (e) {
        return e;
      }
    },
    // 参数值点击弹出树形弹窗选择事件
    treeShow: function treeShow(datas, index) {
      this.getCommonParams();
      this.nowIndex = index;
      this.$refs.treeModel.show(datas);
    },
    // 树形弹窗确认事件
    elTreeSubmit: function elTreeSubmit(data) {
      var item = this.form.paramConfig[this.nowIndex];
      item.paramValue = '${' + data.paramKey + '}';
      item.dataType = data.dataType;
    },
    // 参数是否使用选择变化事件
    useChange: function useChange(offon) {
      this.$emit('useChange', offon);
    }
  }
};
exports["default"] = _default;