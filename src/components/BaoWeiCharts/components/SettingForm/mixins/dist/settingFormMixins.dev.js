"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otherMixins = exports.iframeMixins = exports.ChartsMixins = void 0;

var _dataPresentation = _interopRequireDefault(require("../dataPresentation.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import serviceAxios from './ChartsDataSettting/KeysSetting/node_modules/@/utils/request.js.js'
// 图表组件配置
var ChartsMixins = {
  data: function data() {
    return {
      dataViewList: [],
      // 视图列表数据  。
      itemApiData: [],
      // 应用接口列表数据
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
    // 接口类型切换事件
    apiTypeChange: function apiTypeChange(val) {
      this.isPageDisabled = false;
      this.form.url = '';
      this.form.urlName = '';

      if (val === '0') {
        this.form.isPage = '1';
        this.isPageDisabled = true;
        this.form.options = 'POST';
        this.$refs['apiChoose'].getDataIview(); // 判断当前后台环境是否为node测试环境

        if (this.settingConfig.isTestEnvironment) {
          this.form.url = '/dataView/searchResult';
        } else {
          this.form.url = '/.DataView/view/v1/sql/searchResult';
        }
      } else {
        this.form.options = 'GET';
        this.$refs['apiChoose'].getItemApi();
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
    // 强制删除字段确认事件
    judgePopConfirm: function judgePopConfirm() {
      this.form.keyArr.splice(this.deleteKeyIndex, 1);
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
  watch: {
    form: {
      handler: function handler() {
        this.formInit();
      }
    },
    deep: true
  },
  mounted: function mounted() {
    var _this2 = this;

    this.options = [];
    this.formInit();

    _dataPresentation["default"].forEach(function (item) {
      _this2.options.push({
        value: item.type,
        label: item.title
      });
    });
  },
  methods: {
    // form数据初始化
    formInit: function formInit() {
      if (!this.form) return;

      if (!this.form.blankTemplateConfig) {
        this.form.blankTemplateConfig = {};
      } // 其他表格配置字段初始化 tableOtherConfig


      if (!this.form.tableOtherConfig) {
        this.$set(this.form, 'tableOtherConfig', {
          tableType: '0',
          onlyKey: '',
          childKey: 'children'
        });
      }
    },
    // 内容部分下拉事件
    elDialogBodyScroll: function elDialogBodyScroll() {
      var _this3 = this;

      var _this = this;

      this.$nextTick(function () {
        var dom = document.querySelector('#' + _this3.settingFormId() + ' .el-dialog__body');

        dom.onscroll = function (e) {
          _this.scrollTop = e.target.scrollTop;
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
      // console.log('0000000000000000')
      if (!this.settingConfig.isBigData) {
        this.form.keyArr = [];
      }

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
      var _this4 = this;

      this.dialogVisible = true;

      if (obj) {
        this.parentParamsAll = obj;
      } // 配置数据旧版本兼容处理


      this.compatibleProcessing(); // this.form.isDrafting = !!this.form.isDrafting;
      // 内容部分下拉事件

      this.elDialogBodyScroll(); // 图表、列表全选按钮控制

      this.keyChooseAllShow(); // 判断当项目用于大数据编排项目时请求路径确定

      if (this.settingConfig.isBigData) {
        this.$nextTick(function () {
          if (_this4.form.moduleType === '0') {
            _this4.form.apiType = '0';
            _this4.form.viewId = _this4.settingConfig.bigData.viewId; // 判断当前后台环境是否为node测试环境  那就不走了呗

            if (_this4.settingConfig.isTestEnvironment) {
              _this4.form.url = '/dataView/searchResult';
            } else {
              _this4.form.url = '/.DataView/view/v1/sql/searchResult';
            }

            _this4.form.options = 'POST';
          } // 模板模块新增时生产一个模板编码


          if (_this4.settingConfig.answerId === _this4.settingConfig.bigData.bigDataTemplateId && !_this4.statisticsAll) {
            var RandomId = function RandomId(len) {
              return Math.random().toString(36).substr(3, len);
            };

            _this4.form.moduleCode = RandomId(10);
          }
        });
      } // 地图模块默认参数初始化配置


      if (this.form.iframeAll && this.form.iframeAll.mapPramConfig) {
        this.mapPramConfigChange();
      } // 初始配置字段录入


      if (!this.statisticsAll && this.settingConfig.chartsKeyArr) {
        setTimeout(function () {
          _this4.form.keyArr = _this4.form.keyArr.concat(_this4.settingConfig.chartsKeyArr);
        }, 100);
      }
    },
    // 配置数据旧版本兼容处理
    compatibleProcessing: function compatibleProcessing() {
      // 01-筛选项配置初始化--旧版本兼容
      if (this.statisticsAll) {
        this.form.filterConfig = this.statisticsAll.conditionAreaConfig;
      } else {
        if (!this.form.filterConfig) {
          this.$set(this.form, 'filterConfig', {
            // 筛选项配置信息
            screenData: [],
            // 查询项配置
            btnSettingData: [],
            // 查询按钮配置
            isShowInsertButton: '1' // 查询按钮是否显示配置

          });
        }
      } // 02 地图参数配置旧版本兼容处理


      if (!this.form.iframeAll.mapPramConfig) {
        this.$set(this.form.iframeAll, 'mapPramConfig', []);
      }
    },
    // 图表、列表全选按钮控制
    keyChooseAllShow: function keyChooseAllShow() {
      var _this5 = this;

      this.listKeyAll = true;
      this.chartsKeyAll = true;

      if (this.form.moduleType === '0') {
        this.form.keyArr.forEach(function (item) {
          if (item.isShow === false) {
            _this5.listKeyAll = false;
          }

          if (item.ischartsShow === false) {
            _this5.chartsKeyAll = false;
          }
        });
      }
    },
    // 表单确认事件
    onSubmit: function onSubmit() {
      var _this6 = this;

      if (!this.form.moduleType || this.form.moduleType === '0') {
        this.$refs['chartsDataSettting'].screenSubmit(function () {
          // this.form.conditionAreaConfig = conditionAreaConfig
          _this6.$emit('componentFunc', {
            method: 'addKeep',
            name: '模块新增',
            param: {
              contentAreaConfig: _this6.form
            }
          }); // this.$emit('submit', this.form)

        });
      } else {
        this.$emit('componentFunc', {
          method: 'addKeep',
          name: '模块新增',
          param: {
            contentAreaConfig: this.form
          }
        }); // this.$emit('submit', this.form)
      }

      if (this.settingConfig.isBigData) {
        this.close();
      }
    },
    // 接口名称变化事件
    urlNameChange: function urlNameChange(val) {
      var _this7 = this;

      this.itemApiData.forEach(function (item) {
        if (item.apeName === val) {
          _this7.form.url = item.aaaRequestUrl;
          _this7.form.options = item.method;
        }
      });
    },
    // 接口路径变化事件
    urlChange: function urlChange(val) {
      var _this8 = this;

      this.itemApiData.forEach(function (item) {
        if (item.aaaRequestUrl === val) {
          _this8.form.options = item.method;
          _this8.form.urlName = item.apeName;
        }
      });
    }
  }
};
exports.otherMixins = otherMixins;