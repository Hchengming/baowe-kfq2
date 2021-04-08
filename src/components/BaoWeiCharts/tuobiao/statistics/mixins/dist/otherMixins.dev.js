"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _drag = _interopRequireDefault(require("../../../utils/drag"));

var _export = _interopRequireDefault(require("../export/export"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 模块拖拽拉伸 位置配置
_vue["default"].prototype.XLSX = _xlsx["default"];
var _default = {
  data: function data() {
    return {
      modelStyle: {
        width: 353,
        height: 230
      },
      boxOffon: false,
      // 内容区域显示控制
      stretchElelemt: null,
      // 被拉伸元素
      defaultForm: {} // 表单项默认参数

    };
  },
  watch: {
    browserXY: {
      handler: function handler() {
        this.setDemos();
      },
      deep: true
    },
    settingForm: {
      handler: function handler() {
        this.setDemos();
      },
      deep: true
    },
    'statisticsAll.isShow': {
      handler: function handler() {
        this.$refs['where'].setWhereAll(this.statisticsAll.conditionAreaConfig);
      },
      deep: true
    }
  },
  mounted: function mounted() {
    this.stretchElelemt = this.$refs['statisticsWrap'];
  },
  computed: {
    listWrapStyle: function listWrapStyle() {
      var style = {}; // if (this.settingForm.top) {

      var element = this.containerElelemt ? this.containerElelemt : document.getElementsByClassName('my_main_content')[0];
      style = {
        top: parseFloat(this.settingForm.top * element.clientHeight / 100) + 'px',
        left: parseFloat(this.settingForm.left * element.scrollWidth / 100) + 'px',
        'z-index': this.settingForm.zindex,
        width: this.settingForm.width * element.scrollWidth / 100 + 'px',
        height: this.settingForm.height * element.clientHeight / 100 + 'px'
      }; // this.setDemos()
      // console.log(style, 'stysettingFormle')
      // }

      return style;
    },
    isAdmin: function isAdmin() {
      return this.settingConfig.systemPermissions === 'admin';
    },
    // 删除判断弹出文字
    deleteTitle: function deleteTitle() {
      var title = '';

      if (this.statisticsAll.isRowDrillDown === '1' || this.statisticsAll.drillDownKeyAll) {
        title = '当前模块已配置有子级，是否强制删除当前模块和所有子级模块？';
      } else {
        title = '确定删除删除当前模块？';
      }

      return title;
    }
  },
  methods: {
    // 本地导出excel事件
    localExportExcel: function localExportExcel() {
      var cloums = [];
      this.nowClums().forEach(function (item) {
        cloums.push({
          field: item.key,
          headerName: item.explain
        });
      });
      (0, _export["default"])(cloums, this.statisticsAll.data, this.settingForm.title, 'text', [], [], this); // console.log(copyTableColumns,
      //   copyTableData,
      //   name,
      //   firstWorkName,
      //   this.exportExcelAll.filter,
      //   this.exportExcelAll.otherTable,
      //   this)

      console.log(this.nowClums());
    },
    // 表单内容区域高度
    boxHeight: function boxHeight() {
      var Height = null; // 判断是否有查询模块

      Height = this.modelStyle.height - 56;

      if (this.statisticsAll.conditionAreaConfig && this.statisticsAll.conditionAreaConfig.screenData && this.statisticsAll.conditionAreaConfig.screenData.length > 0) {
        var offon = false;
        this.statisticsAll.conditionAreaConfig.screenData.forEach(function (item) {
          if (item.isShow !== '0') {
            offon = true;
          }
        });
        if (offon) Height = this.modelStyle.height - 56 - this.whereHeight;
      } // iframe模块


      if (this.settingForm.moduleType === '1') {
        Height += 55;
      } else {
        // 标题栏隐藏
        if (this.settingForm.isHeaderHide) {
          Height += 46;
        }
      }

      return Height;
    },
    // 图表宽高设置
    setDemos: function setDemos() {
      var element = this.containerElelemt ? this.containerElelemt : document.getElementsByClassName('my_main_content')[0];
      this.modelStyle.height = parseFloat(this.settingForm.height * element.clientHeight / 100);
      this.modelStyle.width = parseFloat(this.settingForm.width * element.scrollWidth / 100);
    },
    // 模块拖拽事件
    mousedown_tz: function mousedown_tz(e) {
      var _this = this;

      if (this.isScaleStretch()) {
        var element = this.containerElelemt ? this.containerElelemt : document.getElementsByClassName('my_main_content')[0];
        (0, _drag["default"])({
          e: e,
          settingForm: this.settingForm,
          drag: this.$refs['statisticsWrap'],
          fatherElement: element,
          fnc: function fnc() {
            _this.TZLSKeep();
          }
        });
      }
    },
    // 是否可拉伸缩放
    isScaleStretch: function isScaleStretch() {
      var offon = this.isAdmin; // 大数据编排项目判断

      if (this.settingConfig.isBigData) {
        offon = this.settingConfig.answerId === this.settingConfig.bigData.bigDataTemplateId;
      }

      return offon;
    },
    // 模块拖拽拉伸后保存事件 反正喜欢你又不能变了
    TZLSKeep: function TZLSKeep() {
      this.$emit('componentFunc', {
        method: 'updateMoule',
        name: '模块删除按钮点击事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          contentAreaConfig: this.settingForm,
          whereForm: this.whereForm
        }
      });
    },
    // 模块拉伸时添加遮罩避免卡顿
    setBoxOffon: function setBoxOffon(offon) {
      this.boxOffon = offon;
    }
  }
};
exports["default"] = _default;