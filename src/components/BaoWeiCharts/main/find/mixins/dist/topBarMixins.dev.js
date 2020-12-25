"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  data: function data() {
    return {
      itemApiData: [],
      // 项目所有接口数据
      dataViewList: [],
      // 数据视图列表获取
      topListShow: false,
      // Authorization:
      //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc1NhZG1pbiI6MCwiaXNBZG1pbiI6MSwiZXhwIjoxNjAwMzIyMTMxLCJ1c2VyIjoie1wiYWNjb3VudFwiOlwiY2hlbmN1aVwiLFwiZW1haWxcIjpcIlwiLFwiaWRcIjo0MTMsXCJvZmZpY2VQaG9uZU51bWJlclwiOlwiNTMxNTg5NDBcIixcIm9yZ0Z1bGxOYW1lXCI6XCLnu4Tnu4fmnLrmnoQt5biC6KeE5YiS6Ieq54S26LWE5rqQ5L-h5oGv5Lit5b-DLeeglOWPkee7hC3nu4TlkZhcIixcIm9yZ0Z1bGxOYW1lSURcIjpcIi0xLTI4LTQ1LTEwMjUwXCIsXCJwYXNzd29yZFwiOlwiXCIsXCJwaG9uZVwiOlwiMTM3NTI5MzYxNTZcIixcInFRTnVtYmVyXCI6XCJcIixcInJlbWFya1wiOlwi5bmz5Y-w57u05oqkXCIsXCJzZXhcIjpcIueUt1wiLFwic3RhdGVcIjoxLFwidGlja2V0XCI6XCIyMzZiYWRkNC1lYTk4LTQ3ZWUtYmY5OS1lNWZiMWEzNGZiYzNcIixcInVzZXJOYW1lXCI6XCLpmYjokINcIixcInVzZXJrZXlcIjpcIkE5MUE2NzJBLTY0NEUtNDZFRi05RkRFLUU4QUZGMEUyODA5NFwifSIsImlhdCI6MTU5OTcxNzMzMX0.u17BKpJ8XP_d3yaJ0Ld0-dO0wavfq3tHUlQAB9z4rQdaC5XBLjJ_rzkuyTsdMeX-vXnt2hESEmyQa4pMJQTkAA',
      nowElementId: '',
      // 当前组件id
      topBarAll: {
        form: {},
        moduleId: '',
        data: [],
        // 当前顶部数据内容
        configData: [] // 配置数据

      }
    };
  },
  methods: {
    // 项目所有接口获取--应用接口列表获取
    getItemApi: function getItemApi() {
      var _this = this;

      // Authorization: this.Authorization
      var method = this.settingConfig.isCustomMenu ? 'post' : 'get';
      var url = '';

      if (!this.settingConfig.isCustomMenu) {
        var serviceId = this.settingConfig.serviceId ? this.settingConfig.serviceId : this.settingConfig.answerId;
        url = "http://23.36.123.128/api/shareservice/app/authorizeListByApp?uuid=".concat(serviceId);
      } else {
        url = this.settingConfig.getInterfaceUrl;
      }

      _request["default"][method](url, {}).then(function (res) {
        if (res.code === 20000) {
          _this.itemApiData = res.data;
        }
      });
    },
    // 数据视图列表获取
    getDataIview: function getDataIview() {
      var _this2 = this;

      _request["default"].get('http://23.36.123.128/api/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus=', {
        params: {
          appCode: this.settingConfig.answerId
        }
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          _this2.dataViewList = resData.records;
        }
      });
    },
    // 顶部栏查询事件
    getTopBarConfig: function getTopBarConfig() {
      var _this3 = this;

      this.topListShow = false;

      _request["default"].post(this.settingConfig.commonUrl + '/busElementConfig/getElementDataByModuleId', {
        moduleId: this.nowMenuItem.menuId
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          _this3.topBarAll.data = [];

          if (resData.length > 0) {
            _this3.topListShow = true;
            _this3.nowElementId = resData[0].elementId;
            var elementConfig = JSON.parse(resData[0].elementConfigs);
            _this3.topBarAll.bgColorSettingData = elementConfig.bgColorSettingData;
            _this3.topBarAll.configData = elementConfig.topBarSettingData;
            _this3.topBarAll.moduleId = resData[0].moduleId;
            _this3.topBarAll.form = elementConfig.form;

            _this3.getTopBarData(elementConfig.form);
          }
        }
      });
    },
    // 顶部栏渲染是数据变化事件
    changTopAll: function changTopAll(viewcChange) {
      viewcChange(this.topBarAll);
    },
    // 具体数据获取
    getTopBarData: function getTopBarData(form) {
      var _this4 = this;

      // 特殊情况处理 (获取数据格式特殊，默认情况无法处理)
      var _sftsqk = false; // 当前是否未特殊情况

      this.elementMethods({
        name: '顶部栏数据查询事件',
        methodsName: 'getTopBarData',
        menuId: this.nowMenuItem.menuId,
        config: form,
        sftsqk: function sftsqk(offon) {
          // 是否未特殊情况返回
          _sftsqk = !!offon;
        },
        tsqkData: function tsqkData(data) {
          // console.log('resData:', data)
          // 特殊情况数据处理后返回
          _this4.topBarAll.data = data;
        }
      });

      if (!_sftsqk) {
        var options = form.options === 'GET' ? 'get' : 'post'; // form.url = '/kfqcxtj/getKfqmjqkData'
        // 判断当前接口是完全接口还是测试接口

        var nowUrl = '';

        if (form.url.indexOf('http') > -1) {
          nowUrl = form.url;
        } else {
          nowUrl = this.settingConfig.dataUrl + form.url;
        }

        var reqData = {};

        if (form.paramConfig && form.paramConfig.length > 0) {
          form.paramConfig.forEach(function (item) {
            if (item.isUse) {
              reqData[item.paramKey] = item.paramValue;
            }
          });
        }

        reqData = options === 'get' ? {
          params: reqData
        } : reqData;

        _request["default"][options](nowUrl, reqData).then(function (res) {
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            _this4.topBarAll.data = resData;
          }
        });
      }
    },
    // 顶部栏新增事件
    topBarAdd: function topBarAdd(elementConfig, fn) {
      // this.topBarAll = elementConfig.topBarSettingData
      fn();
      var reqObj = {
        moduleId: this.nowMenuItem.menuId,
        elementConfig: elementConfig
      };
      this.topBarEmit(reqObj, '/busElementConfig/insertElementData', '新增', fn);
    },
    // 顶部栏修改事件
    topBarUpdate: function topBarUpdate(elementConfig, fn) {
      var reqObj = {
        moduleId: this.nowMenuItem.menuId,
        elementId: this.nowElementId,
        elementConfig: elementConfig
      };
      this.topBarEmit(reqObj, '/busElementConfig/updateElementData', '修改', fn);
    },
    // 新增、修改提交公共事件
    topBarEmit: function topBarEmit(reqObj, url, txt, fn) {
      var _this5 = this;

      _request["default"].post(this.settingConfig.commonUrl + url, reqObj).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this5.$message({
            message: txt + '成功',
            type: 'success'
          });

          fn();

          _this5.getTopBarConfig();
        } else {
          _this5.$message({
            message: code + '报错',
            type: 'error'
          });
        }
      });
    },
    // 顶部栏删除事件
    topBarDelete: function topBarDelete() {
      var _this6 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/busElementConfig/deleteElemeteById', {
        elementId: this.nowElementId,
        moduleId: this.nowMenuItem.menuId
      }).then(function (res) {
        var code = res.code;

        if (code === 20000) {
          _this6.$message({
            message: '删除成功',
            type: 'success'
          });

          _this6.getTopBarConfig();
        } else {
          _this6.$message({
            message: code + '报错',
            type: 'error'
          });
        }
      });
    },
    // 顶部菜单点击事件
    topBarClick: function topBarClick(item) {
      this.elementMethods({
        name: '顶部菜单点击事件',
        methodsName: 'topBarClick',
        item: item
      });
      this.topBarInteractive(item);
    }
  }
};
exports["default"] = _default;