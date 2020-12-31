"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import filterDataDefault from "../../WhereSetting/CommonFilter/commonWhere.json";
var _this;

var _default = {
  data: function data() {
    return {
      treeData: [],
      nowIndex: 0,
      tableCloums: [{
        key: 'paramKey',
        label: '参数名',
        width: 250,
        formType: 'input'
      }, {
        key: 'description',
        label: '释义',
        width: 250,
        formType: 'input'
      }, {
        key: 'paramValue',
        label: '值',
        width: 250,
        formType: 'inputButton',
        click: function click(items, index) {
          _this.treeShow(items, index);
        }
      }, {
        key: 'dataType',
        label: '数据类型',
        width: 250,
        formType: 'input'
      }, {
        key: 'isUse',
        label: '是否使用',
        width: 130,
        formType: 'checkbox'
      }]
    };
  },
  mounted: function mounted() {
    _this = this;
  },
  methods: {
    // 字段更新
    // paramKeyConfigHenx() {
    //     this.form.filterConfig.screenData.forEach(item => {
    //         this.form.paramConfig.forEach(x => {
    //             if (item.key === x.paramKey) {
    //                 x.description = item.label
    //                 x.paramValue = item.defaultValue
    //             }
    //         })
    //     })
    // },
    // 视图参数获取事件
    getViewParams: function getViewParams() {
      var _this2 = this;

      var url = ''; // 判断当前后台环境是否为node测试环境

      if (this.settingConfig.isTestEnvironment) {
        url = this.settingConfig.commonUrl + '/dataView/paramlist?viewId=' + this.form.viewId;
      } else {
        url = "http://23.36.123.128/api/.DataView/view/v1/".concat(this.form.viewId, "/paramlist");
      } // console.log(url)


      _request["default"].get(url).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          resData.forEach(function (item) {
            _this2.form.paramConfig.push({
              paramKey: item.paramCode,
              description: item.paramName,
              paramValue: '',
              dataType: item.dataType === 'number' ? 'number' : 'string',
              isUse: true
            });
          });
        }
      });
    },
    // 当前接口所有参数获取事件
    getparamConfig: function getparamConfig() {
      var _this3 = this;

      // 项目常用参数变量获取
      // this.getCommonParams()
      this.$set(this.form, 'paramConfig', []); // 获取当前接口参数

      if (this.form.apiType === '0') {
        // 视图参数获取
        this.getViewParams();
      } else {
        var arrKey = []; // console.log(this.itemApiData)

        this.itemApiData.forEach(function (items) {
          if (items.aaaRequestUrl === _this3.form.url && items.param) {
            items.param.forEach(function (item) {
              if (arrKey.indexOf(item.name) === -1) {
                arrKey.push(item.name);

                _this3.form.paramConfig.push({
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
        // if (this.form.isPage === '1') {
        //     this.form.paramConfig.push({
        //         paramKey: 'pageSize',
        //         description: '每页显示条数',
        //         paramValue: this.form.pageSize,
        //         dataType: 'number',
        //         isUse: true
        //     })
        //     this.form.paramConfig.push({
        //         paramKey: 'currentPage',
        //         description: '当前页码',
        //         paramValue: 1,
        //         dataType: 'number',
        //         isUse: true
        //     })
        // }
      } // 初始值获取----公共参数与当前参数值一致


      this.form.paramConfig.forEach(function (items) {
        _this3.treeData.forEach(function (item) {
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