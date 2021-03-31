"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    var _this = this;

    return {
      mapPramConfig: [],
      // 地图参数配置数据
      mapPramCloums: [{
        // 地图参数配置项
        key: 'paramKey',
        label: '参数名',
        width: 250,
        formType: 'input',
        disabled: function disabled(items, index, item) {
          return items.disabled;
        }
      }, {
        key: 'description',
        label: '释义',
        width: 250,
        formType: 'input'
      }, {
        key: 'paramValue',
        label: '值',
        width: 250,
        change: function change(items, index, item) {
          _this.mapParamValueChange(items, index, item);
        },
        formType: function formType(items, index, item) {
          return items.formType ? items.formType : 'input';
        },
        selectArr: function selectArr(items, index, item) {
          return items.selectArr ? items.selectArr : [];
        }
      }]
    };
  },
  watch: {
    'settingConfig.mapPramConfig': {
      handler: function handler() {
        this.mapPramConfigChange(function (item, val) {
          if (val.isShow !== item.isShow) {
            item.isShow = val.isShow;
          }
        });
      },
      deep: true
    }
  },
  mounted: function mounted() {
    // 地图模块默认参数初始化配置
    if (this.form.iframeAll && this.form.iframeAll.mapPramConfig) {
      this.mapPramConfigChange();
    }
  },
  methods: {
    // 默认值变化事件
    mapParamValueChange: function mapParamValueChange(items, index, item) {
      var _this2 = this;

      this.settingConfig.mapPramConfig.forEach(function (val) {
        if (val.paramKey === 'type') {
          val.paramValue = items[item.key];

          _this2.$set(val, 'value', items[item.key]);
        }
      });
    },
    // 默认参数配置数据更新
    mapPramConfigChange: function mapPramConfigChange(fn) {
      var _this3 = this;

      if (this.settingConfig.mapPramConfig && this.form.iframeAll.mapPramConfig) {
        if (this.form.iframeAll.mapPramConfig.length === 0) {
          this.form.iframeAll.mapPramConfig = this.settingConfig.mapPramConfig;
        } else {
          this.settingConfig.mapPramConfig.forEach(function (val) {
            _this3.form.iframeAll.mapPramConfig.forEach(function (item) {
              if (item.paramKey === val.paramKey) {
                if (fn) {
                  fn(item, val);
                }

                if (item.formType === 'select' && item.selectArr.toString() !== val.selectArr.toString()) {
                  item.selectArr = val.selectArr;
                }
              }
            });
          });
        }
      }
    },
    setParamValue: function setParamValue() {// this.settingConfig.mapPramConfig
    }
  }
};
exports["default"] = _default;