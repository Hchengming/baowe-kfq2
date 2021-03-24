"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  data: function data() {
    return {
      isPageDisabled: false,
      listKeyAll: false,
      // 列表全选
      chartsKeyAll: false,
      // 图表全选
      rowKey: {
        key: '',
        // 字段名
        explain: '',
        // 含义
        dw: '',
        // 单位
        width: 120,
        // 列宽度
        isShow: true,
        // 表格列是否显示
        isCruxKey: false,
        // 是否作为下级查询参数
        isMapKey: false,
        // 是否为地图使用字段
        ischartsTitle: false,
        // 是否为图表标题字段
        ischartsShow: false,
        // 图表是否显示该字段
        zBgColor: '',
        // 图表当前字段柱状图，条形图柱背景颜色设置
        cellRenderer: null,
        // 单元格数据自定义js脚本渲染
        tipRenderer: null,
        // 单元格鼠标移入悬浮框内容自定义js脚本渲染
        colFixed: 'null',
        // 表格列固定配置 null/left/right
        colSort: '0',
        // 列排序功能 0：否 1：是
        proportion: 12,
        // 详情表格类列宽
        tableCustom: false,
        // 表格列自适应
        isClick: '0' // 字段是否可点击

      },
      proportionAll: [{
        label: '1',
        value: 24
      }, {
        label: '2/3',
        value: 16
      }, {
        label: '1/2',
        value: 12
      }, {
        label: '1/3',
        value: 8
      }]
    };
  },
  computed: {
    // 字段配置宽度列是否显示
    isWidth: function isWidth() {
      if (this.form.displayMode === 'list' || this.form.displayMode === 'table') {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    // 图表标题选中切换事件
    chartsTitleChange: function chartsTitleChange(key) {
      var _this = this;

      this.$nextTick(function () {
        _this.form.keyArr.forEach(function (item) {
          _this.$set(item, 'ischartsTitle', false); // item.ischartsTitle = false


          if (item.key === key) {
            _this.$set(item, 'ischartsTitle', true); // item.ischartsTitle = offon

          }
        });
      });
    },
    // 列自适应选择
    tableCustomChange: function tableCustomChange(key) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.form.keyArr.forEach(function (item) {
          _this2.$set(item, 'tableCustom', false);

          if (item.key === key) {
            _this2.$set(item, 'tableCustom', true);
          }
        });
      });
    },
    // 地图链接字段选择变化事件
    isMapKeyChange: function isMapKeyChange(item) {
      if (item.isMapKey) {
        this.form.keyArr.forEach(function (obj) {
          if (obj.key !== item.key) {
            obj.isMapKey = false;
          }
        });
      }
    },
    // 字段配置-参数获取
    getParamValue: function getParamValue(val) {
      var paramValue = '';

      if (val && typeof val === 'string' && val.indexOf('${') === 0) {
        var num = val.length - 1;
        var key = val.substring(2, num);
        paramValue = localStorage.getItem(key);
      } else {
        paramValue = val;
      }

      return paramValue;
    },
    // 数据视图配置字段获取事件
    getViewKeysData: function getViewKeysData() {
      var _this3 = this;

      var queryParamList = [];
      this.form.filterConfig.screenData.forEach(function (item) {
        var paramValue = _this3.getParamValue(item.defaultValue); // 区县单选数据处理


        if (item.type === 'country-radio') {
          paramValue = _this3.countryRadioValue(paramValue);
        }

        queryParamList.push(_defineProperty({}, item.key, paramValue));
      });
      if (!this.form.url) return false;

      _request["default"].post(window.BaseApi + this.form.url, {
        viewId: this.form.viewId,
        pageSize: 1,
        pageNumber: 1,
        queryParamList: queryParamList
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          _this3.form.keyArr = [];

          for (var key in resData.list[0]) {
            var obj = {
              key: key,
              explain: key
            };

            _this3.setRowKey(obj);

            _this3.form.keyArr.push(obj);
          }
        }
      });
    },
    // 字段新增数据格式化
    setRowKey: function setRowKey(obj) {
      for (var key in this.rowKey) {
        if (!obj[key]) {
          obj[key] = this.rowKey[key];
        }
      }
    },
    // 字段获取事件
    getKeysData: function getKeysData() {
      var _this4 = this;

      if (this.form.apiType === '0') {
        this.getViewKeysData();
        return false;
      } // 没返回情况字段获取


      if (this.form.moduleType === '0') {
        // 图表字段获取
        this.form.keyArr = [];
        this.getKeys(function (resData) {
          var keysItem = {}; // 判断是否为分页数据

          if (_this4.form.isPage === '1') {
            if (!resData.list || resData.list.constructor !== Array) {
              _this4.$message({
                message: '返回数据格式错误，需标准带分页格式数据',
                type: 'error'
              });

              return false;
            }

            keysItem = resData.list[0];
          } else {
            if (!resData || resData.constructor !== Array) {
              _this4.$message({
                message: '返回数据格式错误，需返回标准数组',
                type: 'error'
              });

              return false;
            }

            keysItem = resData[0];
          }

          for (var key in keysItem) {
            var obj = {
              key: key,
              explain: key
            };

            _this4.setRowKey(obj);

            _this4.form.keyArr.push(obj);
          }
        });
      }
    },
    // 字段列表数据获取事件
    getKeys: function getKeys(fn) {
      var _this5 = this;

      var params = {};
      this.form.filterConfig.screenData.forEach(function (item) {
        var paramValue = _this5.getParamValue(item.defaultValue); // 区县单选数据处理


        if (item.type === 'country-radio') {
          paramValue = _this5.countryRadioValue(paramValue);
        }

        params[item.key] = paramValue;
      });
      var options = this.form.options === 'POST' ? 'post' : 'get';

      if (options === 'get') {
        params = {
          params: params
        };
      }

      if (this.form.apiType !== '0' && this.form.isPage === '1') {
        params.currentPage = '1';
        params.pageSize = '1';
      }

      var url = '';

      if (this.form.url.indexOf('http') > -1) {
        url = this.form.url;
      } else {
        url = this.form.url.indexOf('/api/service') > -1 ? window.config.applicationInterfaceApi + this.form.url : this.settingConfig.dataUrl + this.form.url;
      }

      _request["default"][options](url.replace(/\s*/g, ''), params).then(function (res) {
        if (res.code === 20000 || res.code === 200) {
          var resData = res.data;
          fn(resData);
        }
      });
    },
    // 向上排序
    sortPrev: function sortPrev(item, index, offon) {
      if (offon) return;
      this.form.keyArr.splice(index, 1);
      this.form.keyArr.splice(index - 1, 0, item);
    },
    // 向下排序
    sortNext: function sortNext(item, index, offon) {
      if (offon) return;
      this.form.keyArr.splice(index, 1);
      this.form.keyArr.splice(index + 1, 0, item);
    },
    // 字段新增事件
    keyAdd: function keyAdd(index) {
      this.form.keyArr.splice(index + 1, 0, this.rowKey);
    },
    // 字段删除事件
    keyRemove: function keyRemove(index) {
      // this.form.keyArr.splice(index, 1)
      var nowKey = this.form.keyArr[index].key; // 判断当前删除字段是否已经挂载子级，若挂载，则弹出提示信息

      if (this.form.submodule === '1' && this.form.clickToShow === 'cell' && this.statisticsAll && this.statisticsAll.drillDownKeyAll.indexOf(nowKey) > -1) {
        var html = '当前字段已配置子级模块，是否<span class="txt1">强制删除</span>？';
        this.$refs['judgePop'].show(html);
        this.deleteKeyIndex = index;
      } else {
        this.form.keyArr.splice(index, 1);
      }
    },
    // 操作按钮配置 按钮点击事件
    operateButtonSetting: function operateButtonSetting() {
      this.$refs['operateButtonSetting'].show(this.form.operateButton);
    },
    // 多表头配置按钮点击事件
    tableHeaderSetting: function tableHeaderSetting() {
      this.$refs['tableHeaderSetting'].show();
    },
    // 图表字段其他配置按钮点击事件
    otherKeySetting: function otherKeySetting(item, index) {
      this.$refs.otherKeySetting.show(item, index);
    },
    // 列表字段全选功能
    ListkeyChooseChange: function ListkeyChooseChange(offon) {
      this.keyChooseChange('list', offon);
    },
    // 图表字段全选功能
    ChartskeyChooseChange: function ChartskeyChooseChange(offon) {
      this.keyChooseChange('charts', offon);
    },
    keyChooseChange: function keyChooseChange(val, offon) {
      this.form.keyArr.forEach(function (item) {
        if (val === 'list') {
          item.isShow = offon;
        } else if (val === 'charts') {
          item.ischartsShow = offon;
        }
      });
    },
    // 操作按钮配置数据确认事件
    operateButtonSubmit: function operateButtonSubmit(data) {
      this.form.operateButton = data;
      var offon = false;
      var num = null;
      this.form.keyArr.forEach(function (item, index) {
        if (item.key === 'operationButton') {
          offon = true;
          num = index;
        }
      });

      if (data.length > 0) {
        if (!offon) {
          var objs = {
            key: 'operationButton',
            explain: '操作',
            width: 100
          };
          this.setRowKey(objs);
          this.form.keyArr.push(objs);
        }
      } else {
        if (num !== null) {
          this.form.keyArr.splice(num, 1);
        }
      }
    }
  }
};
exports["default"] = _default;