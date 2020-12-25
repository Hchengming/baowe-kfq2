"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      isShow: false,
      keyNowIndex: null,
      // 当前配置字段索引
      fatherIndex: null,
      // 父级行索引
      nowKey: '',
      // 当前选中key值
      otherKeySetting: {
        cellRenderer: null,
        // 单元格数据自定义js脚本渲染
        tipRenderer: null,
        // 单元格鼠标移入悬浮框内容自定义js脚本渲染
        colDataformat: null // 表格数据格式化

      },
      form: {},
      // 表单数据
      otherFormConfig: {} // 表单配置数据

    };
  },
  watch: {
    isShow: {
      handler: function handler(val) {
        if (!val) {
          this.otherKeySetting = {
            cellRenderer: null,
            tipRenderer: null,
            colDataformat: null
          };
        }
      }
    }
  },
  methods: {
    // 是否隐藏控制
    isHide: function isHide(form, item) {
      var offon = false;
      this.$emit('isHide', form, this.fatherIndex, item, function (val) {
        offon = val;
      });
      return offon;
    },
    // 带右侧按钮模块点击事件
    inputClick: function inputClick(form, item) {
      this.$emit('inputClick', form, this.fatherIndex, item);
    },
    // placeholder设置
    placeholder: function placeholder(item) {
      return item.placeholder ? item.placeholder : item.label;
    },
    // 弹窗显示事件
    show: function show(form, fatherIndex, otherFormConfig) {
      this.fatherIndex = fatherIndex;
      this.isShow = true;
      this.form = form;
      this.otherFormConfig = otherFormConfig;
    },
    // 配置确认事件
    onSubmit: function onSubmit() {
      this.$emit('otherKeySettingSubmit', this.form, this.fatherIndex);
      this.isShow = false;
    },
    // textarea放大事件---js脚本
    enlarge: function enlarge(key) {
      this.nowKey = key;
      this.otherKeySetting[key] = this.otherKeySetting[key] ? this.otherKeySetting[key] : "function(colums,rowData){\n                return ''\n             }";
      this.$refs.jsMethodsSetting.show({
        jsMethods: this.otherKeySetting[key]
      });
    },
    // js脚本提交保存事件
    changeJsMethods: function changeJsMethods(jsMethods) {
      this.otherKeySetting[this.nowKey] = jsMethods;
    }
  }
};
exports["default"] = _default;