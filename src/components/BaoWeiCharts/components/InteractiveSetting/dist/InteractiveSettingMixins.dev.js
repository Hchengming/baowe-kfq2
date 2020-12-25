"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dataPresentation = _interopRequireDefault(require("../SettingForm/dataPresentation.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  props: {
    beforeParamsData: {
      type: Array,
      "default": null
    },
    interactiveModuleAll: {
      type: Array,
      "default": null
    },
    interactiveData: {
      type: Array,
      "default": null
    }
  },
  data: function data() {
    var _this = this;

    return {
      dialogVisible: false,
      fatherIndex: null,
      // 配置行索引
      nowIndex: null,
      // 被交互选中模块索引
      triggerEventAll: [{
        lab: '点击触发',
        val: 'click'
      }],
      tableCloums: [{
        key: 'moduleId',
        label: '模块名称',
        width: 180,
        formType: 'select',
        selectArr: [],
        change: function change(items) {
          _this.moduleNameChange(items);
        }
      }, {
        key: 'moduleType',
        label: '模块类型',
        width: 100,
        formType: 'select',
        disabled: true,
        selectArr: []
      }, {
        key: 'corParams',
        label: '交互对应参数',
        width: 180,
        formType: function formType(items) {
          return items.moduleType === 'iframe' ? 'input' : 'select';
        },
        selectArr: []
      }, {
        key: 'jsMethods',
        label: 'js脚本',
        width: 200,
        formType: 'input',
        inputType: 'textarea',
        rows: 1,
        disabled: function disabled(items) {
          return items.moduleType !== 'iframe';
        },
        click: function click(items, index) {
          if (items.moduleType === 'iframe') {
            _this.nowIndex = index;

            _this.$refs['jsMethodsSetting'].show(items);
          }
        }
      }],
      interactiveObj: {
        paramsChoose: '',
        // 已选择参数
        triggerEvent: 'click',
        // 触发事件
        otherModuleConfig: [] // 其他模板交互数据

      }
    };
  },
  mounted: function mounted() {
    this.setModyleTypeArr();
  },
  methods: {
    // 模块类型集合数据配置
    setModyleTypeArr: function setModyleTypeArr() {
      var _this2 = this;

      this.tableCloums[1].selectArr = [{
        lab: 'iframe框',
        val: 'iframe'
      }];

      _dataPresentation["default"].forEach(function (item) {
        _this2.tableCloums[1].selectArr.push({
          lab: item.title,
          val: item.type
        });
      });
    },
    // 取消
    close: function close() {
      this.dialogVisible = false;
    },
    // 确 定
    onSubmit: function onSubmit() {
      this.dialogVisible = false;
      this.$emit('interactiveSubmit');
    },
    // 当前模块显示事件
    show: function show() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.dialogVisible = true; // 获取所有可交互模块

        var arr = [];

        _this3.interactiveModuleAll.forEach(function (item) {
          arr.push({
            lab: item.moduleName,
            val: item.moduleId
          });
        });

        _this3.tableCloums[0].selectArr = arr;
      });
    },
    // js脚本配置后返回数据
    changeJsMethods: function changeJsMethods(data) {
      this.interactiveData[this.fatherIndex].otherModuleConfig[this.nowIndex].jsMethods = data;
    },
    // 模块类型选择变化事件
    moduleNameChange: function moduleNameChange(items) {
      var _this4 = this;

      items.corParams = '';
      this.interactiveModuleAll.forEach(function (obj) {
        if (items.moduleId === obj.moduleId) {
          items.moduleType = obj.type;

          if (['iframe'].indexOf(items.moduleType) !== -1) {
            _this4.tableCloums[2].formType = 'input';
          } else {
            _this4.tableCloums[2].formType = 'select';
            _this4.tableCloums[2].selectArr = obj.interactiveParams;
          }
        }
      });
    },
    // 交互配置新增事件
    addInteractive: function addInteractive() {
      this.interactiveData.push({
        paramsChoose: '',
        // 已选择参数
        triggerEvent: 'click',
        // 触发事件
        otherModuleConfig: [] // 其他模板交互数据

      });
    },
    // 配置删除事件
    removeInteractive: function removeInteractive(index) {
      this.interactiveData.splice(index, 1);
    }
  }
};
exports["default"] = _default;