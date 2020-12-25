"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otherMixins = exports.iframeMixins = exports.ChartsMixins = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

var _dataPresentation = _interopRequireDefault(require("./dataPresentation.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 图表组件配置
var ChartsMixins = {
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
        proportion: 12 // 详情表格类列宽

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
  methods: {
    // 图表字段其他配置按钮点击事件
    otherKeySetting: function otherKeySetting(item, index) {
      this.$refs.otherKeySetting.show(item, index);
    },
    // 多表头配置按钮点击事件
    tableHeaderSetting: function tableHeaderSetting() {
      this.$refs['tableHeaderSetting'].show();
    },
    // 图表、列表全选按钮控制
    keyChooseAllShow: function keyChooseAllShow() {
      var _this2 = this;

      this.listKeyAll = true;
      this.chartsKeyAll = true;

      if (this.form.moduleType === '0') {
        this.form.keyArr.forEach(function (item) {
          if (item.isShow === false) {
            _this2.listKeyAll = false;
          }

          if (item.ischartsShow === false) {
            _this2.chartsKeyAll = false;
          }
        });
      }
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
    // 图表标题选中切换事件
    chartsTitleChange: function chartsTitleChange(key) {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.form.keyArr.forEach(function (item) {
          _this3.$set(item, 'ischartsTitle', false); // item.ischartsTitle = false


          if (item.key === key) {
            _this3.$set(item, 'ischartsTitle', true); // item.ischartsTitle = offon

          }
        });
      });
    },
    // 接口类型切换事件
    apiTypeChange: function apiTypeChange(val) {
      this.isPageDisabled = false;

      if (val === '0') {
        this.form.isPage = '1';
        this.isPageDisabled = true;
        this.form.options = 'POST';
        this.$refs['apiChoose'].getDataIview();
      } else {
        this.form.options = 'GET';
        this.$refs['apiChoose'].getItemApi();
      }
    },
    // 操作按钮配置 按钮点击事件
    operateButtonSetting: function operateButtonSetting() {
      this.$refs['operateButtonSetting'].show(this.form.operateButton);
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
    },
    // 是否下钻切换事件
    submoduleChange: function submoduleChange(val) {
      if (val === '1') return false;
      var html = '';

      if (this.statisticsAll) {
        if (this.form.clickToShow === 'row' && this.statisticsAll.isRowDrillDown === '1') {
          html = '当前单元格点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？';
          this.$refs['judgePop2'].show(html);
        } else if (this.form.clickToShow === 'cell' && this.statisticsAll.drillDownKeyAll) {
          html = '当前行点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？';
          this.$refs['judgePop2'].show(html);
        }
      }
    },
    // 行点击、单元格点击切换事件
    clickToShowChange: function clickToShowChange(val) {
      var html = '';

      if (this.statisticsAll) {
        if (val === 'row' && this.statisticsAll.drillDownKeyAll) {
          html = '当前单元格点击已配置子级模块，是否<span class="txt1">强制切换</span>？';
          this.$refs['judgePop'].show(html, 'cell');
        } else if (val === 'cell' && this.statisticsAll.isRowDrillDown === '1') {
          html = '当前行点击已配置子级模块，是否<span class="txt1">强制切换</span>？';
          this.$refs['judgePop'].show(html, 'row');
        }
      }
    },
    // 行点击、单元格点击--切换取消事件
    handleClose: function handleClose(clickToShow) {
      this.form.clickToShow = clickToShow;
    },
    // 是否下钻切换事件
    handleClose2: function handleClose2() {
      this.form.submodule = '1';
    },
    // 字段列表数据获取事件
    getKeys: function getKeys(fn) {
      var _this4 = this;

      var params = {};
      this.form.paramConfig.forEach(function (item) {
        var paramValue = _this4.getParamValue(item.paramValue);

        if (item.isUse) {
          switch (item.dataType) {
            case 'number':
              if (Number(paramValue)) {
                _this4.$set(params, item.paramKey, Number(paramValue));
              } else {
                params[item.paramKey] = null;
              }

              break;

            case 'object':
              params[item.paramKey] = null;

              if (JSON.parse(paramValue)) {
                params[item.paramKey] = JSON.parse(paramValue);
              }

              break;

            default:
              params[item.paramKey] = paramValue;
          }
        }
      });
      var options = this.form.options === 'POST' ? 'post' : 'get';

      if (options === 'get') {
        params = {
          params: params
        };
      }

      var url = this.form.url.indexOf('http') > -1 ? this.form.url : this.dataUrl + this.form.url;

      _request["default"][options](url.replace(/\s*/g, ''), params).then(function (res) {
        if (res.code === 20000 || res.code === 200) {
          var resData = res.data;
          fn(resData);
        }
      });
    },
    // 自定义参数-值获取
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
      var _this5 = this;

      var queryParamList = [];
      this.form.paramConfig.forEach(function (item) {
        var paramValue = _this5.getParamValue(item.paramValue);

        var params = _defineProperty({}, item.paramKey, paramValue);

        if (item.isUse) {
          switch (item.dataType) {
            case 'number':
              if (Number(paramValue)) {
                params[item.paramKey] = Number(paramValue);
              } else {
                params[item.paramKey] = null;
              }

              break;

            case 'object':
              params[item.paramKey] = JSON.parse(paramValue);
              break;

            default:
              params[item.paramKey] = paramValue;
          }

          queryParamList.push(params);
        }
      });
      if (!this.form.url) return false;

      _request["default"].post(this.form.url, {
        viewId: this.form.viewId,
        pageSize: 1,
        pageNumber: 1,
        queryParamList: queryParamList
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          _this5.form.keyArr = [];

          for (var key in resData.list[0]) {
            var obj = {
              key: key,
              explain: key
            };

            _this5.setRowKey(obj);

            _this5.form.keyArr.push(obj);
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
      var _this6 = this;

      if (this.form.apiType === '0') {
        this.getViewKeysData();
        return false;
      } // 判断应用接口是否已经返回字段信息


      var offon = false;
      this.itemApiData.forEach(function (items) {
        if (items.aaaRequestUrl === _this6.form.url && items.returnField) {
          _this6.form.keyArr = [];
          _this6.form.detailsTableAll = [];
          items.returnField.forEach(function (item) {
            if (_this6.form.moduleType === '0') {
              var obj = {
                key: item.key,
                explain: item.label
              };

              _this6.setRowKey(obj);

              _this6.form.keyArr.push(obj);
            }
          });
          offon = true;
        }
      });
      if (offon) return false; // 没返回情况字段获取

      if (this.form.moduleType === '0') {
        // 图表字段获取
        this.form.keyArr = [];
        this.getKeys(function (resData) {
          var keysItem = {};

          if (_this6.form.isPage === '1') {
            if (resData.list && resData.list.constructor !== Array) {
              _this6.$message({
                message: '返回数据格式错误，需标准带分页格式数据',
                type: 'error'
              });

              return false;
            }

            keysItem = resData.list[0];
          } else {
            if (resData && resData.constructor !== Array) {
              _this6.$message({
                message: '返回数据格式错误，需返回标准数组',
                type: 'error'
              });

              return false;
            }

            keysItem = resData[0];
          }

          for (var key in keysItem) {
            var obj = {
              key: key
            };

            _this6.setRowKey(obj);

            _this6.form.keyArr.push(obj);
          }

          _this6.setDefaultKey(_this6.form.keyArr, '0');
        });
      }
    },
    // 字段配置数据初始化--参数含有字段直接配置label
    setDefaultKey: function setDefaultKey(data, moduleType) {
      var _this7 = this;

      data.forEach(function (items) {
        _this7.form.paramConfig.forEach(function (item) {
          if (items.key === item.paramKey) {
            if (moduleType === '0') {
              items.explain = item.description;
            } else {
              items.title = item.description;
            }
          }
        });
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
    // 强制删除字段确认事件
    judgePopConfirm: function judgePopConfirm() {
      this.form.keyArr.splice(this.deleteKeyIndex, 1);
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
    }
  }
};
exports.ChartsMixins = ChartsMixins;
var iframeMixins = {
  methods: {
    // iframe选择类型变化事件
    iframeTypeChange: function iframeTypeChange(type) {
      if (type === '1') {
        var menuItem = JSON.parse(sessionStorage.getItem('menuItem'));
        this.form.paramConfig = [];

        for (var key in menuItem) {
          if (key !== 'children') {
            this.form.paramConfig.push({
              paramKey: key,
              description: '',
              paramValue: menuItem[key],
              dataType: _typeof(menuItem[key]),
              isUse: false
            });
          }
        }
      }

      this.$refs.paramKeyConfig.getCommonParams();
    },
    // iframe参数选择变化事件
    iframeUseChange: function iframeUseChange() {
      var obj = {};
      this.form.paramConfig.forEach(function (item) {
        if (item.isUse) {
          obj[item.paramKey] = item.paramValue;
        }
      });
      var paramsStr = this.setParamsUrl(obj);
      var num = this.form.iframeAll.iframeUrl.indexOf('html');

      if (num > -1) {
        this.form.iframeAll.iframeUrl = this.form.iframeAll.iframeUrl.substring(0, num + 4) + paramsStr;
      } else {
        this.form.iframeAll.iframeUrl = paramsStr;
      }
    },
    // 参数配置事件
    setParamsUrl: function setParamsUrl(obj) {
      var result = '';
      var item;

      for (item in obj) {
        if (obj[item] && String(obj[item])) {
          result += "&".concat(item, "=").concat(obj[item]);
        }
      }

      if (result) {
        result = '?' + result.slice(1);
      }

      return result;
    }
  }
};
exports.iframeMixins = iframeMixins;
var otherMixins = {
  data: function data() {
    return {
      dialogRef: 'settingFormDialog',
      // 弹出框refs名
      dialogVisible: false,
      options: [],
      rules: [],
      csData: [],
      scrollTop: 0,
      deleteKeyIndex: null,
      settingJsonIsShow: false,
      parentParamsAll: {},
      // 父级下钻参数
      defaultData: [{
        title: '',
        num: '',
        area: '',
        rowid: '001'
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
  watch: {
    form: {
      handler: function handler() {
        this.formInit();
      }
    },
    deep: true
  },
  mounted: function mounted() {
    var _this8 = this;

    this.options = [];
    this.formInit();

    _dataPresentation["default"].forEach(function (item) {
      _this8.options.push({
        value: item.type,
        label: item.title
      });
    });
  },
  methods: {
    // form数据初始化
    formInit: function formInit() {
      if (!this.form.blankTemplateConfig) {
        this.form.blankTemplateConfig = {};
      } // 其他表格配置字段初始化 tableOtherConfig


      if (!this.form.tableOtherConfig) {
        this.$set(this.form, 'tableOtherConfig', {
          tableType: '0',
          onlyKey: '',
          childKey: 'children'
        }); // this.form.tableOtherConfig = {
        // }
      }
    },
    // 内容部分下拉事件
    elDialogBodyScroll: function elDialogBodyScroll() {
      var _this9 = this;

      var _this = this;

      this.$nextTick(function () {
        var dom = document.querySelector('#' + _this9.settingFormId() + ' .el-dialog__body');

        dom.onscroll = function (e) {
          _this.scrollTop = e.target.scrollTop; // console.log(this.scrollTop)
        };
      });
    },
    // 模块id设置
    settingFormId: function settingFormId() {
      return this.statisticsAll ? 'settingForm' + this.statisticsAll.moduleId : 'settingForm';
    },
    // 通过配置json数据 修改配置数据事件
    setForm: function setForm(settingForm) {
      for (var key in settingForm) {
        this.form[key] = settingForm[key];
      }
    },
    // 模板类型选择变化事件
    moduleTypeChange: function moduleTypeChange() {
      this.form.keyArr = [];
      this.form.operateButton = [];
      this.form.paramConfig = [];
      this.form.detailsTableAll = [];
      this.form.tableHeaderConfig = {};
    },
    // 高度一键铺满
    heightMax: function heightMax() {
      this.form.height = 100;
      this.form.top = 0;
    },
    // 宽度一键铺满
    widthMax: function widthMax() {
      this.form.width = 100;
      this.form.left = 0;
    },
    // 弹窗关闭事件
    close: function close() {
      this.dialogVisible = false; // this.$refs['settingForm'].resetFields()
    },
    // 弹窗显示事件
    show: function show(obj) {
      this.dialogVisible = true;

      if (obj) {
        this.parentParamsAll = obj;
      }

      this.form.isDrafting = !!this.form.isDrafting; // 内容部分下拉事件

      this.elDialogBodyScroll(); // 图表、列表全选按钮控制

      this.keyChooseAllShow();
    },
    // 表单确认事件
    onSubmit: function onSubmit() {
      var _this10 = this;

      this.$refs['chartsDataSettting'].screenSubmit(function (conditionAreaConfig) {
        _this10.form.conditionAreaConfig = conditionAreaConfig;

        _this10.$emit('submit', _this10.form);
      });
    },
    // 接口名称变化事件
    urlNameChange: function urlNameChange(val) {
      var _this11 = this;

      //  console.log(val)
      this.itemApiData.forEach(function (item) {
        if (item.apeName === val) {
          _this11.form.url = item.aaaRequestUrl;
          _this11.form.options = item.method;
        }
      });
    },
    // 接口路径变化事件
    urlChange: function urlChange(val) {
      var _this12 = this;

      this.itemApiData.forEach(function (item) {
        if (item.aaaRequestUrl === val) {
          _this12.form.options = item.method;
          _this12.form.urlName = item.apeName;
        }
      });
    }
  }
};
exports.otherMixins = otherMixins;