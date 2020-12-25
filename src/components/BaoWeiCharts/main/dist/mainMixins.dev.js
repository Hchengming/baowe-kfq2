"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _request = _interopRequireDefault(require("@/utils/request.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import defaultData from './menuData.json'
var _default = {
  data: function data() {
    return {
      leftMenuWidth: '200px',
      // 左侧区域宽度
      themeClass: 'charts-theme2',
      // 项目主题类名
      nowMenuId: '',
      // 当前menuid
      menuSetting: {
        isShow: false,
        menuId: '',
        jsjbxx: '',
        menuMap: '',
        type: '新增' // 配置类型 新增/修改

      },
      menu_i: 'el-icon-s-fold',
      // 点击图标控制
      isCollapse: false,
      // 左侧菜单展示控制`
      defaultActive: '',
      menuData: [],
      // 菜单数据
      menuActiveIndex: 0,
      // 顶部菜单选中索引
      // 侧导航数据
      leftMenu: [],
      nowProjectConfig: {
        theme: 2
      } // 当前查询后主题配置页面数据

    };
  },
  mounted: function mounted() {
    if (this.settingConfig.theme) {
      this.themeClass = 'charts-theme' + this.settingConfig.theme;
    }
  },
  methods: {
    // 项目主体(主题)配置事件
    projectConfigChange: function projectConfigChange(projectConfig) {
      this.themeClass = 'charts-theme' + projectConfig.theme;
      this.settingConfig.theme = projectConfig.theme;
    },
    // 项目主题获取事件
    getProjectConfig: function getProjectConfig() {
      var _this = this;

      _request["default"].post(this.settingConfig.commonUrl + '/busThemeConfig/selectProjectConfig', {
        projectId: this.settingConfig.answerId
      }).then(function (res) {
        // console.log(res, 'res')
        if (res.data.projectConfigs) {
          _this.nowProjectConfig = JSON.parse(res.data.projectConfigs);
          _this.themeClass = 'charts-theme' + _this.nowProjectConfig.theme;
          _this.settingConfig.theme = _this.nowProjectConfig.theme;
        }
      });
    },
    // 项目主题编辑事件
    projectConfigEmit: function projectConfigEmit(projectConfig) {
      var _this2 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/busThemeConfig/insertProjectConfigData', {
        projectId: this.settingConfig.answerId,
        projectConfig: projectConfig
      }).then(function () {
        _this2.$message({
          type: 'success',
          message: '项目主题修改成功'
        });

        _this2.getProjectConfig();
      });
    },
    // 项目主体(主题)配置保存事件
    projectConfigSubmit: function projectConfigSubmit(projectConfig) {
      this.projectConfigEmit(projectConfig);
    },
    // 顶部栏数据变化事件
    changTopAll: function changTopAll(viewChange) {
      this.$refs['myPage'].changTopAll(viewChange);
    },
    // 通过模块id改变模块渲染数据事件
    changePageData: function changePageData(moduleId, viewchange, wh) {
      this.$refs['myPage'].changePageData(moduleId, viewchange, wh);
    },
    // 图表模块显示隐藏控制事件
    modeuleShow: function modeuleShow(obj) {
      this.$refs['myPage'].modeuleShow(obj);
    },
    // 菜单配置按钮点击事件
    menuSettingClick: function menuSettingClick(menuItem) {
      this.menuSetting.menuId = menuItem.menuId;
      this.queryMenuSetting(menuItem.menuId);
    },
    // 菜单配置数据查询事件
    queryMenuSetting: function queryMenuSetting(menuId, fn) {
      var _this3 = this;

      _request["default"].post(this.settingConfig.commonUrl + '/busMenuSetting/getMenuSettingDataByModuleId', {
        menuId: menuId
      }).then(function (res) {
        var code = res.code;
        var resData = res.data;

        if (code === 20000) {
          if (fn) {
            fn(resData);
          } else {
            if (resData) {
              _this3.menuSetting.jsjbxx = resData.jsjbxx;
              _this3.menuSetting.type = '修改';
            } else {
              _this3.menuSetting.type = '新增';
              _this3.menuSetting.jsjbxx = '';
            }

            _this3.menuSetting.isShow = true;
          }
        }
      });
    },
    // 菜单配置提交事件
    menuSettingSubmit: function menuSettingSubmit() {
      var _this4 = this;

      var url = '';

      if (this.menuSetting.type === '新增') {
        url = '/busMenuSetting/insertMenuSettingData';
      } else {
        url = '/busMenuSetting/updateMenuSettingData';
      }

      var reqData = {
        menuId: this.menuSetting.menuId,
        jsjbxx: this.menuSetting.jsjbxx,
        menuMap: {}
      };

      _request["default"].post(this.settingConfig.commonUrl + url, reqData).then(function (res) {
        var code = res.code; // const resData = res.data

        if (code === 20000) {
          _this4.$message({
            message: '菜单配置' + _this4.menuSetting.type + '成功',
            type: 'success'
          });

          _this4.menuSetting.isShow = false;
        }
      });
    },
    // 工具启动，开始加载数据渲染事件
    startRender: function startRender() {
      // 开始加载菜单数据
      this.getTreeMenu();
      this.$refs['myPage'].getItemApi();
      this.$refs['myPage'].getDataIview();
      this.getProjectConfig();
    },
    // 表格、列表单元格点击菜单跳转事件执行
    cellClickMenuTap: function cellClickMenuTap(obj) {
      if (obj.methodsName === 'cellClick') {
        var contentAreaConfig = obj.statisticsAll.contentAreaConfig;

        if (contentAreaConfig.menuTapAll.isMenuTap === '1' && contentAreaConfig.menuTapAll.menuTapKey === obj.key) {
          var nowMenuCode = '';
          contentAreaConfig.keyArr.forEach(function (item) {
            if (item.key === contentAreaConfig.menuTapAll.menuCodeKey) {
              nowMenuCode = obj.rowItem[item.key];
            }
          });
          this.menuJump(nowMenuCode);
        }
      }
    },
    // 组件事件暴露
    elementMethods: function elementMethods(obj) {
      this.cellClickMenuTap(obj);
      this.$emit('elementMethods', obj);
    },
    // 菜单点击后js脚本执行
    menuJS: function menuJS(menuId) {
      this.queryMenuSetting(menuId, function (data) {
        if (data) {
          if (data.jsjbxx && data.jsjbxx.replace(/\s*/g, '') !== '') {
            var funcStr = data.jsjbxx; // eslint-disable-next-line no-eval

            var test = eval('(false || ' + funcStr + ')');

            if (test) {
              test();
            }
          }
        }
      });
    },
    // 左侧菜单点击事件
    leftMenuClick: function leftMenuClick(menuItem) {
      this.menuJS(menuItem.menuId);
      this.defaultActive = menuItem.menuCode;
      this.$refs['myPage'].menuClick(menuItem);
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: 'menuClick',
        menuItem: menuItem
      });
    },
    // 顶部菜单点击事件
    topMenuClick: function topMenuClick(item, index) {
      var _this5 = this;

      this.menuJS(item.menuId);
      this.menuActiveIndex = index;
      this.leftMenu = item.children;
      this.$refs['myPage'].mainStyleChange();
      this.$refs['myPage'].menuClick(item, 'top', function (offon) {
        if (offon && _this5.settingConfig.systemPermissions === 'user') {
          // this.menuJump(item.children[0].menuCode)
          _this5.redusion(item);
        }
      });
      this.$emit('elementMethods', {
        name: '顶部菜单点击事件',
        methodsName: 'menuClick',
        menuItem: item
      });
    },
    // 顶部栏点击为配置页面跳转
    redusion: function redusion(item) {
      if (item.children && item.children.length > 0) {
        this.redusion(item.children[0]);
      } else {
        this.menuJump(item.menuCode);
      }
    },
    // 菜单树数据查询事件
    getTreeMenu: function getTreeMenu() {
      var _this6 = this;

      // this.menuData = defaultData
      // if (this.menuData[0]) {
      //   this.$refs['myPage'].menuClick(this.menuData[0])
      //   return false
      // }
      if (this.settingConfig.isCustomMenu) {
        // 自定义配置菜单数据获取
        _request["default"].post(this.settingConfig.systomMenuApi + '/menu/insertMenu', {
          answerId: this.settingConfig.answerId
        }).then(function (res) {
          // console.log(res)
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            _this6.menuData = resData;

            if (_this6.menuData[0]) {
              _this6.$refs['myPage'].menuClick(_this6.menuData[0]);

              _this6.leftMenu = _this6.menuData[0].children;
            }

            _this6.$emit('elementMethods', {
              name: '菜单数据获取事件',
              methodsName: 'getMenuData',
              menuData: _this6.menuData
            });
          }
        });
      } else {
        // 项目-直接菜单数据获取
        // const url = `http://23.36.123.128/api/applicationcenter/function/findAll?key=a18f4adc-94aa-4aa4-a9cd-e24ec52e2abe&type=1`
        var url = "http://23.36.123.128/api/applicationcenter/function/findAll?key=".concat(this.settingConfig.answerId, "&type=1");

        _request["default"].get(url, {}).then(function (res) {
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            _this6.recursion(resData, 'children', function (item) {
              item.menuCode = item.apeCode;
              item.menuName = item.apeName;
              item.children = item.children ? item.children : [];
              item.menuId = item.apeKey;
            });

            _this6.menuData = resData;

            _this6.$emit('elementMethods', {
              name: '菜单数据获取事件',
              methodsName: 'getMenuData',
              menuData: _this6.menuData
            });

            if (_this6.menuData[0]) {
              _this6.$refs['myPage'].menuClick(_this6.menuData[0]);

              _this6.leftMenu = _this6.menuData[0].children;
            }
          }
        });
      }
    },
    // 最外层--通过menuCode触发菜单跳转事件
    menuJump: function menuJump(menuCode) {
      var _this7 = this;

      this.menuData.forEach(function (items, index) {
        if (items.menuCode === menuCode) {
          _this7.menuActiveIndex = index;
          _this7.leftMenu = items.children;

          _this7.$refs['myPage'].menuClick(items);

          return false;
        }

        if (items.children.length > 0) {
          _this7.recursion(items.children, 'children', function (item) {
            if (item.menuCode === menuCode) {
              _this7.menuActiveIndex = index;
              _this7.leftMenu = items.children;

              _this7.$refs['myPage'].menuClick(item);

              _this7.defaultActive = menuCode;
            }
          });
        }
      });
    },
    // 菜单数据变化更新
    getMenuChange: function getMenuChange(menuData) {
      this.menuData = menuData;
      this.leftMenu = this.menuData[this.menuActiveIndex].children;
    },
    // 左侧菜单展示控制
    leftMenuControl: function leftMenuControl() {
      var _this8 = this;

      this.menu_i = this.menu_i === 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold';
      this.isCollapse = !this.isCollapse;
      setTimeout(function () {
        _this8.leftMenuWidth = _this8.isCollapse ? '64px' : '200px';

        _this8.$refs['myPage'].mainStyleChange();
      }, 100);
    }
  }
};
exports["default"] = _default;