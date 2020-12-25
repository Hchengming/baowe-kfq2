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
      // dataViewList: [], //视图列表
      // itemApiData: [], //应用接口列表
      viewId: ''
    };
  },
  mounted: function mounted() {
    if (this.form.apiType === '0') {
      this.getDataIview();
    } else {
      this.getItemApi();
    }
  },
  methods: {
    // 项目所有接口获取--应用接口列表获取
    getItemApi: function getItemApi() {
      var _this = this;

      // console.log('serviceId')
      var method = this.settingConfig.isCustomMenu ? 'post' : 'get';
      var url = '';

      if (!this.settingConfig.isCustomMenu) {
        var serviceId = this.settingConfig.serviceId ? this.settingConfig.serviceId : this.settingConfig.answerId;
        url = "http://23.36.123.128/api/shareservice/app/authorizeListByApp?uuid=".concat(serviceId);
      } else {
        url = this.settingConfig.getInterfaceUrl;
      }

      _request["default"][method](url, {}).then(function (res) {
        if (res.code === 20000) {
          // this.itemApiData = res.data
          _this.$emit('update:itemApiData', res.data);
        }
      });
    },
    // 视图id变化事件
    viewIdChange: function viewIdChange() {},
    // 数据视图列表获取
    getDataIview: function getDataIview() {
      var _this2 = this;

      var url = ''; // 判断当前后台环境是否为node测试环境

      if (this.settingConfig.isTestEnvironment) {
        url = this.settingConfig.commonUrl + '/dataView/viewList';
      } else {
        url = 'http://23.36.123.128/api/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus=';
      }

      _request["default"].get(url, {
        params: {
          appCode: this.settingConfig.answerId
        }
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          // this.dataViewList = resData.records
          _this2.$emit('update:dataViewList', resData.records);
        }
      });
    },
    // 接口名称变化事件
    urlNameChange: function urlNameChange(val) {
      var _this3 = this;

      //  console.log(val)
      this.itemApiData.forEach(function (item) {
        if (item.apeName === val) {
          _this3.form.url = item.aaaRequestUrl;
          _this3.form.options = item.method;
        }
      });
    }
  }
};
exports["default"] = _default;