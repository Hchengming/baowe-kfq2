"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  data: function data() {
    return {
      dialogRef: 'topBarSetting',
      itemApiData: [],
      dataViewList: [],
      isShow: false,
      form: {
        url: '',
        urlName: '',
        options: 'GET',
        width: 100,
        // bgKey: "bgcolor", // 背景使用字段   bgType=2 使用
        // bgType: "2", // 背景类型选择  0：单色调 1：双色调 2：自定义
        apiType: '0',
        viewId: '',
        // bg1: "", // 背景一 bgType=0或bgType=1 使用
        // bg2: "", // 背景二  bgType=1 使用
        paramConfig: []
      },
      topBarSettingData: [],
      tableCloums: [{
        label: '索引',
        key: 'index',
        // disabled: true,
        formType: 'number',
        width: 80
      }, {
        label: '背景颜色',
        key: 'background',
        disabled: true,
        formType: 'color',
        width: 80
      }],
      bgColorSettingData: []
    };
  },
  methods: {
    // 颜色配置新增事件暴露
    bgSettingAdd: function bgSettingAdd() {
      // console.log(this.bgColorSettingData.length - 1)
      this.bgColorSettingData[this.bgColorSettingData.length - 1].index = this.bgColorSettingData.length - 1;
    },
    // 接口类型切换事件
    apiTypeChange: function apiTypeChange(val) {
      this.isPageDisabled = false;

      if (val === '0') {
        this.form.isPage = '1';
        this.isPageDisabled = true;
        this.$refs['apiChoose'].getDataIview();
      } else {
        this.$refs['apiChoose'].getItemApi();
      }
    },
    // 弹窗显示事件
    show: function show(topBarConfig) {
      if (topBarConfig) {
        this.form = topBarConfig.form;
        this.topBarSettingData = topBarConfig.configData;
        this.bgColorSettingData = topBarConfig.bgColorSettingData ? topBarConfig.bgColorSettingData : [];
      } else {
        this.form = JSON.parse(JSON.stringify(this.form));
        this.topBarSettingData = [];
        this.bgColorSettingData = [];
      }

      this.isShow = true;
    },
    // 弹窗确认事件
    onSubmit: function onSubmit() {
      var _this = this;

      this.$emit('submit', {
        form: this.form,
        topBarSettingData: this.topBarSettingData,
        bgColorSettingData: this.bgColorSettingData
      }, function () {
        _this.isShow = false;
      });
    },
    // 字段列表数据获取事件
    getKeys: function getKeys(fn) {
      var _this2 = this;

      var params = {};
      this.form.paramConfig.forEach(function (item) {
        if (item.isUse) {
          switch (item.dataType) {
            case 'number':
              if (Number(item.paramValue)) {
                _this2.$set(params, item.paramKey, Number(item.paramValue));
              } else {
                params[item.paramKey] = null;
              }

              break;

            case 'object':
              params[item.paramKey] = null;

              if (JSON.parse(item.paramValue)) {
                params[item.paramKey] = JSON.parse(item.paramValue);
              }

              break;

            default:
              params[item.paramKey] = item.paramValue;
          }
        }
      }); // console.log(params)

      var options = this.form.options === 'POST' ? 'post' : 'get';

      if (options === 'get') {
        params = {
          params: params
        };
      }

      _request["default"][options](this.form.url, params).then(function (res) {
        if (res.code === 20000) {
          var resData = res.data;
          fn(resData);
        }
      });
    },
    // 字段获取
    getKeysData: function getKeysData() {
      var _this3 = this;

      this.topBarSettingData = [];
      var offon = false;
      this.itemApiData.forEach(function (items) {
        if (items.aaaRequestUrl === _this3.form.url && items.returnField) {
          items.returnField.forEach(function (item) {
            _this3.topBarSettingData.push({
              key: item.key,
              label: item.label,
              dw: '',
              isShow: true
            });
          });
          offon = true;
        }
      });
      if (offon) return false;
      this.getKeys(function (resData) {
        if (resData.constructor !== Array) {
          _this3.$message({
            message: '返回数据格式错误，需返回标准对象',
            type: 'error'
          });

          return false;
        }

        for (var key in resData[0]) {
          _this3.topBarSettingData.push({
            key: key,
            label: '',
            dw: '',
            isShow: true
          });
        }

        _this3.topBarSettingData.forEach(function (items) {
          _this3.form.paramConfig.forEach(function (item) {
            if (items.key === item.paramKey) {
              items.label = item.description;
            }
          });
        });
      });
    }
  }
};
exports["default"] = _default;