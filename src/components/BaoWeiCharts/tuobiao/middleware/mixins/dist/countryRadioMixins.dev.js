"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _country = _interopRequireDefault(require("../../../components/Where2.0/CommonWhere/find/Country/country.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  methods: {
    // 区县单选返回数据处理1
    setCountryRadio: function setCountryRadio(config, reqData) {
      var _this = this;

      var _loop = function _loop(key) {
        var screenData = config.contentAreaConfig.filterConfig.screenData;
        screenData.forEach(function (item) {
          if (item.type === 'country-radio' && item.key === key) {
            reqData[key] = _this.countryRadioValue(reqData[key]);
          }
        });
      };

      for (var key in reqData) {
        _loop(key);
      }
    },
    // 数据值数组化
    countryRadioValue: function countryRadioValue(val) {
      var str = '';

      if (val === '市局') {
        _country["default"].forEach(function (item) {
          if (item.children) {
            item.children.forEach(function (x) {
              if (x !== '所有') {
                if (str === '') {
                  str = x;
                } else {
                  str += ',' + x;
                }
              }
            });
          }
        });
      } else {
        str = val;
      }

      return str;
    }
  }
};
exports["default"] = _default;