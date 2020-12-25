"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _this;

var _default = {
  data: function data() {
    return {
      pageData: [],
      childPageData: [],
      browserXY: {
        width: window.innerWidth,
        height: window.innerHeight,
        mainWidth: null,
        mainHeight: null
      },
      childData: [] // 子级测试数据

    };
  },
  mounted: function mounted() {
    _this = this;
  },
  methods: {
    setOptions: function setOptions(options, chartType, data, moduleId) {
      this.chartsMethods({
        methodsName: 'setOptions',
        name: '图表配置外层定制化事件',
        options: options,
        chartType: chartType,
        data: data,
        moduleId: moduleId
      });
    },
    // 监听屏幕变化事件
    resize: function resize() {
      _this.browserXY.width = window.innerWidth;
      _this.browserXY.height = window.innerWidth;
    },
    // 内容区域宽高变化事件
    mainStyleChange: function mainStyleChange() {
      var element = document.getElementsByClassName('my_main_content')[0];
      this.browserXY.mainWidth = element.scrollWidth;
    },
    // statistics组件--行数据点击事件
    rowClick: function rowClick(item, statisticsAll) {
      this.chartsMethods({
        methodsName: 'rowClick',
        rowItem: item,
        name: '行点击事件',
        statisticsAll: statisticsAll,
        moduleId: statisticsAll.moduleId
      }); // this.iframeMapChange(item, statisticsAll)
    },
    // 单元格点击事件
    cellClick: function cellClick(item, statisticsAll, key, whereForm) {
      this.chartsMethods({
        methodsName: 'cellClick',
        rowItem: item,
        name: '单元格点击事件',
        statisticsAll: statisticsAll,
        moduleId: statisticsAll.moduleId,
        whereForm: whereForm,
        key: key
      });
      this.iframeMapChange(item, statisticsAll);
    },
    // 行/单元格点击地图模块数据变化事件
    iframeMapChange: function iframeMapChange(itemValue, statisticsAll) {
      var _this2 = this;

      var iframePositionVal = '';
      var mapKey = ''; // 地图使用字段

      var offon = false; // console.log(statisticsAll)

      if (statisticsAll.contentAreaConfig.isLinkMap === '1') {
        offon = true;
        statisticsAll.contentAreaConfig.keyArr.forEach(function (item) {
          if (item.isMapKey) {
            mapKey = item.key;
            iframePositionVal = itemValue[item.key];
          }
        });
      } // 添加开关 判断单元格点击字段是否为地图使用字段


      if (statisticsAll.contentAreaConfig.clickToShow === 'cell' && statisticsAll.drillDownKeyCurrent !== mapKey) {
        offon = false;
      }

      if (offon) {
        // console.log(iframePositionVal, 'iframePositionVal')
        this.pageData.forEach(function (item) {
          if (item.contentAreaConfig.moduleType === '1') {
            _this2.$set(item, 'iframePositionAll', {
              mapPosition: statisticsAll.contentAreaConfig.mapPosition,
              area: iframePositionVal
            });
          }
        }); // console.log(this.pageData)
      }
    },
    // 旧的筛选数据删除事件
    oldConditionAreaConfigUpdate: function oldConditionAreaConfigUpdate(filterConfig, moduleId) {
      if (filterConfig.screenData.length === 0) {
        this.screenKeep({}, moduleId);
      }
    },
    // statistics组件--模块修改保存事件
    updateMoule: function updateMoule(contentAreaConfig, moduleId, fn, whereForm) {
      var _this3 = this;

      // this.oldConditionAreaConfigUpdate(contentAreaConfig.filterConfig, moduleId)
      // console.log(contentAreaConfig.filterConfig, 'contentAreaConfig.filterConfig')
      var reqData = {
        secondMasterPageConfigPOS: [{
          contentAreaConfig: contentAreaConfig,
          moduleId: moduleId
        }]
      };

      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/updateSecondMasterPageConfigData', reqData).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this3.$message({
            message: '模块配置修改成功',
            type: 'success'
          });

          if (fn) {
            fn();
          }

          var obj = {};
          var newItem = {}; // let pageDataClone = JSON.parse(JSON.stringify(this.pageData))

          _this3.pageData.forEach(function (item, index) {
            if (item.moduleId === moduleId) {
              obj.index = index;
              newItem = item;
            }
          });

          obj.url = contentAreaConfig.url;

          if (contentAreaConfig.isPage === '1') {
            obj.pageSize = contentAreaConfig.pageSize;
            obj.currentPage = 1;
          }

          if (contentAreaConfig.moduleType !== '1' && contentAreaConfig.moduleType !== '3') {
            _this3.getTableData(obj, whereForm, newItem);
          }
        } else {
          _this3.$message({
            message: '模块修改失败',
            type: 'error'
          });
        }
      });
    },
    // statistics组件--模块删除事件
    deleteMoule: function deleteMoule(moduleId, menuId, parentModuleId) {
      var _this4 = this;

      // console.log('删除')
      var reqUrl;

      if (menuId) {
        reqUrl = '/busSecondmasterpageconfig/deleteSecondMasterPageConfigData';
      } else {
        reqUrl = '/busSecondmasterpageconfig/deleteDrillDownData';
      }

      _request["default"].post(this.settingConfig.commonUrl + reqUrl, {
        moduleId: moduleId,
        menuId: menuId,
        parentModuleId: parentModuleId
      }).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this4.$message({
            message: '模块删除成功',
            type: 'success'
          });

          _this4.getData();
        }
      });
    },
    // 子页面新增事件
    childSettingAdd: function childSettingAdd(obj) {
      var _this5 = this;

      // console.log(obj)
      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/insertDrillDownData', {
        contentAreaConfig: obj.contentAreaConfig,
        parentModuleId: obj.moduleId,
        drillDownKeyCurrent: obj.key,
        menuId: this.menuId
      }).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this5.$message({
            message: '模块添加成功',
            type: 'success'
          });

          _this5.getData(); // this.childInsertData(obj.moduleId, obj.rowid, '', obj.key)


          obj.fn();
        }
      });
    },
    // 子页面数据查询事件
    // 父级模块id 行数据id 副标题1 单元格点击选中格key值
    childInsertData: function childInsertData(parentModuleId, childKV, subtitle1, key) {
      var _this6 = this;

      // console.log(parentModuleId, rowid, subtitle1, key)
      // 旧的二级数据删除
      // let pageDataClone = JSON.parse(JSON.stringify(this.pageData))
      var data = [];
      var zfModuleId = '';
      this.pageData.forEach(function (item) {
        if (item.moduleId === parentModuleId) {
          zfModuleId = item.parentModuleId;
        }
      });
      this.pageData.forEach(function (item) {
        if (!item.parentModuleId || item.parentModuleId === parentModuleId || item.moduleId === parentModuleId || item.parentModuleId === zfModuleId) {
          data.push(item);
        }
      });
      this.pageData = data;

      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/queryDrillDownData', {
        parentModuleId: parentModuleId,
        drillDownKeyCurrent: key
      }).then(function (res) {
        var code = res.code;
        var reqData = res.data;

        if (code === 20000) {
          for (var i = _this6.pageData.length - 1; i >= 0; i--) {
            if (_this6.pageData[i].drillDownKeyCurrent && _this6.pageData[i].drillDownKeyCurrent !== key && _this6.pageData[i].parentModuleId === parentModuleId) {
              _this6.pageData.splice(i, 1);
            }
          }

          reqData.forEach(function (items) {
            var offon = true;

            _this6.itemGSH(items);

            items.contentAreaConfig.subtitle1 = subtitle1;
            var reqObj = {
              url: items.contentAreaConfig.url
            }; // 分页

            if (items.contentAreaConfig.isPage === '1') {
              reqObj.currentPage = 1;
              reqObj.pageSize = items.contentAreaConfig.pageSize; // items.paginationAll = {
              //   currentPage: 1, // 当前显示页数
              //   pageSize: items.contentAreaConfig.pageSize, // 每页数据条数
              //   total: null // 总数据量
              // }
            }

            _this6.pageData.forEach(function (item, index) {
              if (item.moduleId === items.moduleId) {
                item.contentAreaConfig = items.contentAreaConfig;
                item.conditionAreaConfig = items.conditionAreaConfig;
                reqObj.index = index;
                offon = false;
              }
            });

            if (offon) {
              _this6.pageData.push(items);

              console.log(_this6.pageData);
              reqObj.index = _this6.pageData.length - 1;
            } // 默认请求参数解析


            var defaultReqData = {};
            items.conditionAreaConfig.screenData.forEach(function (conditionObj) {
              if (conditionObj.defaultValue) {
                defaultReqData[conditionObj.key] = conditionObj.defaultValue;
              }
            }); // 请求参数（关键字段-值）写入

            for (var _key in childKV) {
              defaultReqData[_key] = childKV[_key];
            } // 判断下钻子级是否是iframe嵌入类型


            if (items.contentAreaConfig.moduleType !== '1' && items.contentAreaConfig.moduleType !== '3') {
              _this6.getTableData(reqObj, defaultReqData, items);
            }
          });
        }
      })["catch"](function (msg) {
        _this6.$message({
          message: '请求失败' + msg,
          type: 'error'
        });

        return false;
      });
    },
    // 新增按钮点击事件
    addTemplate: function addTemplate() {
      this.addSettingForm = JSON.parse(JSON.stringify(this.addSettingFormClone));
      this.$refs['settingForm'].show();
    },
    // 新增确认事件
    addKeep: function addKeep(contentAreaConfig) {
      var _this7 = this;

      // console.log(this.menuId)
      var reqData = {
        secondMasterPageConfigPOS: [{
          contentAreaConfig: contentAreaConfig,
          menuId: this.menuId
        }]
      };

      if (!this.menuId) {
        this.$message({
          message: '菜单id不能为空',
          type: 'error'
        });
      }

      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/insertSecondMasterPageConfigData', reqData).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this7.$message({
            message: '模块添加成功',
            type: 'success'
          });

          _this7.$refs['settingForm'].close();

          _this7.getData();
        } else {
          _this7.$message({
            message: '模块添加失败',
            type: 'error'
          });
        }
      });
    },
    // 新增筛选数据获取
    addScreenKeep: function addScreenKeep(conditionAreaConfig) {
      this.addConditionAreaConfig = conditionAreaConfig;
    },
    // statistics组件--筛选模块配置数据保存
    screenKeep: function screenKeep(conditionAreaConfig, moduleId) {
      var _this8 = this;

      var reqData = {
        secondMasterPageConfigPOS: [{
          conditionAreaConfig: conditionAreaConfig,
          moduleId: moduleId
        }]
      };

      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/updateSecondMasterPageConfigData', reqData).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this8.$message({
            message: '筛选配置数据添加成功',
            type: 'success'
          }); // this.getData()


          _this8.pageData.forEach(function (item) {
            if (item.moduleId === moduleId) {
              item.conditionAreaConfig = conditionAreaConfig;
            }
          });
        }
      })["catch"](function (msg) {
        _this8.$message({
          message: '请求失败' + msg,
          type: 'error'
        });

        return false;
      });
    },
    // 列表数据筛选事件
    whereSubmit: function whereSubmit(moduleId, whereForm) {
      var _this9 = this;

      this.chartsMethods({
        moduleId: moduleId,
        name: '查询按钮点击事件',
        methodsName: 'whereSubmit',
        whereForm: whereForm
      });
      var obj = {};
      this.pageData.forEach(function (item, index) {
        if (item.moduleId === moduleId) {
          obj.index = index;
          obj.url = item.contentAreaConfig.url;

          if (item.contentAreaConfig.isPage === '1') {
            obj.pageSize = item.contentAreaConfig.pageSize;
            obj.currentPage = 1;
          }

          _this9.getTableData(obj, whereForm, item);
        }
      });
    },
    // 详情配置保存事件
    detailsAreaConfigEmit: function detailsAreaConfigEmit(moduleId, detailsAreaConfig, fn) {
      var _this10 = this;

      // console.log(detailsAreaConfig)
      var reqData = {
        moduleId: moduleId,
        detailsAreaConfig: detailsAreaConfig
      };

      _request["default"].post(this.settingConfig.commonUrl + '/busSecondmasterpageconfig/insertDetailsAreaConfig', reqData).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this10.$message({
            message: '详情配置数据添加成功',
            type: 'success'
          });

          _this10.pageData.forEach(function (item) {
            if (item.moduleId === moduleId) {
              item.detailsAreaConfig = detailsAreaConfig;
            }
          });

          fn();
        }
      })["catch"](function (msg) {
        _this10.$message({
          message: '请求失败' + msg,
          type: 'error'
        });

        return false;
      });
    },
    // 图表设置按钮点击事件
    settingClick: function settingClick(statisticsAll, fn) {
      var keyArr = [];

      if (statisticsAll.parentModuleId) {
        this.pageData.forEach(function (item) {
          if (item.moduleId === statisticsAll.parentModuleId) {
            keyArr = item.contentAreaConfig.keyArr;
          }
        });
      }

      fn(keyArr);
    }
  }
};
exports["default"] = _default;