"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destailMixins = exports.screenMixins = exports.childMixins = void 0;
// 子页面配置
var childMixins = {
  data: function data() {
    return {
      nowRowId: '',
      nowCellKey: '',
      childSettingForm: {},
      settingForm: {},
      childAddType: '1' // 0：同级新增  1：子级新增

    };
  },
  watch: {
    'statisticsAll.contentAreaConfig': function statisticsAllContentAreaConfig() {
      this.settingForm = JSON.parse(JSON.stringify(this.statisticsAll.contentAreaConfig));
    },
    deep: true
  },
  mounted: function mounted() {
    this.settingForm = JSON.parse(JSON.stringify(this.statisticsAll.contentAreaConfig));
    this.childSettingForm = JSON.parse(JSON.stringify(this.addSettingForm));
  },
  methods: {
    // 详情自定义配置页面点击弹出事件
    destailDialogShow: function destailDialogShow(rowData, key, index) {
      // 操作模块点击排除
      if (key === 'operationButton') return;

      if (this.settingForm.submodule === '0' && this.settingForm.isDestail === '1') {
        // 点击弹出详情
        if (this.statisticsAll.detailsAreaConfig) {
          if (!this.nowDetailsAreaConfig.detailType) {
            this.nowDetailsAreaConfig = this.statisticsAll.detailsAreaConfig;
          }

          if (this.nowDetailsAreaConfig.detailType === '1') {
            window.open(this.nowDetailsAreaConfig.commonApi + rowData[this.nowDetailsAreaConfig.destailsUrlKey], '_blank');
          } else {
            this.destailShow(index);
          }
        } else {
          this.destailSettingShow();
        }
      }
    },
    // 详情表格组件--单元格点击事件
    destailTableCellClick: function destailTableCellClick(rowData, key) {
      this.$emit('componentFunc', {
        method: 'cellClick',
        name: '单元格点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll,
          key: key
        }
      });
    },
    // 表格行点击事件
    rowClick: function rowClick(rowData) {
      this.$emit('componentFunc', {
        method: 'rowClick',
        name: '行点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll
        }
      });

      if (this.settingForm.clickToShow !== 'row' || this.settingForm.submodule === '0') {
        return;
      } // 行下钻


      this.nowCellKey = '';

      if (rowData.url) {
        window.open(rowData.url, '_blank');
      } else {
        var subtitle1 = rowData[this.settingForm.keyArr[0].key]; // 下钻代入参数-值获取

        var childKV = this.getChildKeyValue(this.settingForm.keyArr, rowData);

        if (this.statisticsAll.isRowDrillDown === '1') {
          this.$emit('componentFunc', {
            method: 'childInsertData',
            name: '子页面数据查询事件',
            param: {
              parentModuleId: this.statisticsAll.moduleId,
              childKV: childKV,
              subtitle1: subtitle1
            }
          });
        } else {
          if (this.isAdmin) {
            this.getParentWhereFormUse();
            this.$refs['childSettingForm'].show({
              rowData: rowData,
              keyArr: this.settingForm.keyArr,
              parentParamsData: this.getParentWhereFormUse()
            });
            this.childAddType = '1';
          }
        }
      } // this.nowRowId = rowData.id

    },
    // 表格/列表单元格点击事件
    cellClick: function cellClick(rowData, key, rowIndex) {
      // 详情页面点击弹出事件
      this.destailDialogShow(rowData, key, rowIndex);
      this.$emit('componentFunc', {
        method: 'cellClick',
        name: '单元格点击事件',
        param: {
          rowItem: rowData,
          statisticsAll: this.statisticsAll,
          key: key
        }
      });

      if (this.settingForm.submodule !== '1' || this.settingForm.clickToShow !== 'cell') {
        return;
      }

      this.nowRowId = rowData.id;
      this.nowCellKey = key;

      if (rowData[key + 'url']) {
        window.open(rowData[key + 'url'], '_blank');
      } else {
        if (this.statisticsAll.drillDownKeyAll && this.statisticsAll.drillDownKeyAll.indexOf(key) > -1) {
          var subtitle1 = rowData[this.settingForm.keyArr[0].key]; // 下钻代入参数-值获取

          var childKV = this.getChildKeyValue(this.settingForm.keyArr, rowData);
          this.$emit('componentFunc', {
            method: 'childInsertData',
            name: '子页面数据查询事件',
            param: {
              parentModuleId: this.statisticsAll.moduleId,
              childKV: childKV,
              subtitle1: subtitle1,
              key: key
            }
          });
        } else {
          if (this.isAdmin) {
            this.getParentWhereFormUse();
            this.$refs['childSettingForm'].show({
              rowData: rowData,
              keyArr: this.settingForm.keyArr,
              parentParamsData: this.getParentWhereFormUse()
            });
            this.childAddType = '1';
          }
        }
      }
    },
    // 父级筛选条件可传入子级条件筛选
    getParentWhereFormUse: function getParentWhereFormUse() {
      var _this = this;

      var arr = [];

      if (this.statisticsAll.conditionAreaConfig && this.statisticsAll.conditionAreaConfig.screenData) {
        this.statisticsAll.conditionAreaConfig.screenData.forEach(function (item) {
          if (item.sfxjcx === '1') {
            var nowDataType = '';

            switch (item.type) {
              case 'number':
                nowDataType = 'number';
                break;

              case 'checkbox':
                nowDataType = 'object';
                break;

              default:
                nowDataType = 'string';
            }

            arr.push({
              paramKey: item.key,
              description: item.label,
              paramValue: _this.whereForm[item.key],
              dataType: nowDataType,
              isUse: true
            });
          }
        });
      }

      return arr;
    },
    // 下钻代入参数-值获取  下钻父级查询模块代入子级参数-值获取
    getChildKeyValue: function getChildKeyValue(keyArr, rowData) {
      var obj = {};
      keyArr.forEach(function (item) {
        if (item.isCruxKey) {
          obj[item.key] = rowData[item.key];
        }
      }); // 下钻父级查询模块代入子级参数-值获取

      var conditionAreaConfig = this.statisticsAll.conditionAreaConfig;
      var whereForms = this.$refs['where'].whereAll.form;

      if (conditionAreaConfig && conditionAreaConfig.screenData && conditionAreaConfig.screenData.length > 0) {
        conditionAreaConfig.screenData.forEach(function (item) {
          if (item.sfxjcx === '1') {
            obj[item.key] = whereForms[item.key];
          }
        });
      }

      return obj;
    },
    // 子级表单新增事件
    childSettingKeep: function childSettingKeep(contentAreaConfig) {
      var _this2 = this;

      var obj;

      if (this.childAddType === '1') {
        obj = {
          contentAreaConfig: contentAreaConfig,
          moduleId: this.statisticsAll.moduleId,
          // rowid: this.nowRowId,
          fn: function fn() {
            _this2.$refs['childSettingForm'].close();
          },
          key: this.nowCellKey
        };
      } else {
        obj = {
          contentAreaConfig: contentAreaConfig,
          moduleId: this.statisticsAll.parentModuleId,
          // rowid: '',
          key: this.statisticsAll.drillDownKeyCurrent,
          fn: function fn() {
            _this2.$refs['childSettingForm'].close();
          }
        };
      }

      this.$emit('componentFunc', {
        method: 'childSettingAdd',
        name: '子级表单新增事件',
        param: obj
      });
    },
    // 子元素同级新增按钮点击事件
    TJAdd: function TJAdd() {
      this.$refs['childSettingForm'].show();
      this.childAddType = '0';
    },
    // 表格、列表右侧按钮点击事件
    operateButtonClick: function operateButtonClick(buttonSetting, rowItem) {
      this.$emit('componentFunc', {
        method: 'whereSubmit',
        name: '筛选保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          buttonSetting: buttonSetting,
          rowItem: rowItem
        }
      }); // this.$emit(
      //   'operateButtonClick',
      //   buttonSetting,
      //   rowItem,
      //   this.statisticsAll.moduleId
      // )
    }
  }
}; // 筛选模块数据配置

exports.childMixins = childMixins;
var screenMixins = {
  data: function data() {
    return {
      whereOffon: false,
      conditionAreaConfig: {},
      // 后台返回筛选配置数据
      whereForm: {}
    };
  },
  mounted: function mounted() {
    this.setWhereForm(this.statisticsAll.conditionAreaConfig);
  },
  methods: {
    // 筛选数据获取
    setWhereForm: function setWhereForm(conditionAreaConfig) {
      var _this3 = this;

      // console.log(conditionAreaConfig)
      // 01-自定义筛选项
      var datas = [];

      if (conditionAreaConfig.screenData && conditionAreaConfig.screenData.length > 0) {
        datas = datas.concat(conditionAreaConfig.screenData);
      }

      datas.forEach(function (item) {
        if (item.defaultValue) {
          _this3.whereForm[item.key] = item.defaultValue;
        }
      });
    },
    // 筛选保存事件
    whereSubmit: function whereSubmit(form) {
      this.$emit('componentFunc', {
        method: 'whereSubmit',
        name: '筛选保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          whereForm: form
        }
      });
    },
    // 查询模块其他按钮点击事件
    whereOtherBtnClick: function whereOtherBtnClick(item) {
      if (item.methodsName === 'localExportExcel') {
        this.localExportExcel(item);
      } // console.log(item, '查询模块其他按钮点击事件')


      this.$emit('componentFunc', {
        method: 'whereOtherBtnClick',
        name: '查询模块其他按钮点击事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          otherItem: item
        }
      });
    },
    // 本地导出excel事件
    // 当前筛选数据缓存
    whereFormKeep: function whereFormKeep(form) {
      this.whereForm = form;
      this.$emit('componentFunc', {
        method: 'whereFormKeep',
        name: '当前筛选数据缓存',
        param: {
          moduleId: this.statisticsAll.moduleId,
          form: form
        }
      });
    }
  }
}; // 详情配置、显示模块配置

exports.screenMixins = screenMixins;
var destailMixins = {
  data: function data() {
    return {
      nowDetailsAreaConfig: {} // 当前详情配置数据

    };
  },
  methods: {
    // 详情配置组件显示事件
    destailSettingShow: function destailSettingShow() {
      this.$refs.destailSetting.show(this.statisticsAll.data, this.settingForm.keyArr, this.statisticsAll.detailsAreaConfig);
    },
    // 详情配置保存事件
    destailSettingSubmit: function destailSettingSubmit(detailsAreaConfig, fn) {
      this.nowDetailsAreaConfig = detailsAreaConfig;
      this.$emit('componentFunc', {
        method: 'detailsAreaConfigEmit',
        name: '详情配置保存事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          detailsAreaConfig: detailsAreaConfig,
          fn: fn
        }
      });
    },
    // 详情弹出显示事件
    destailShow: function destailShow(index) {
      // console.log(this.statisticsAll)
      this.$refs['destail'].show(index);
    }
  }
};
exports.destailMixins = destailMixins;