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
      menu_i: 'el-icon-s-fold',
      // 点击图标控制
      isCollapse: false,
      // 左侧菜单展示控制
      defaultActive: '',
      menuData: [],
      // 菜单数据
      menuActiveIndex: 0,
      // 顶部菜单选中索引
      // 侧导航数据
      leftMenu: []
    };
  },
  methods: {
    // 工具启动，开始加载数据渲染事件
    startRender: function startRender() {
      // 开始加载菜单数据
      this.getTreeMenu();
      this.$refs['myPage'].getItemApi();
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
    // 左侧菜单点击事件
    leftMenuClick: function leftMenuClick(menuItem) {
      this.$refs['myPage'].menuClick(menuItem);
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: 'menuClick',
        menuItem: menuItem
      });
    },
    // 顶部菜单点击事件
    topMenuClick: function topMenuClick(item, index) {
      this.menuActiveIndex = index;
      this.leftMenu = item.children;
      this.$refs['myPage'].mainStyleChange();
      this.$refs['myPage'].menuClick(item);
      this.$emit('elementMethods', {
        name: '顶部菜单点击事件',
        methodsName: 'menuClick',
        menuItem: item
      });
    },
    // 菜单树数据查询事件
    getTreeMenu: function getTreeMenu() {
      var _this = this;

      // this.menuData = defaultData
      // if (this.menuData[0]) {
      //   this.$refs['myPage'].menuClick(this.menuData[0])
      //   return false
      // }
      if (this.settingConfig.isCustomMenu) {
        // 自定义配置菜单数据获取
        _request["default"].post(this.settingConfig.systomMenuApi + '/menu/insertMenu').then(function (res) {
          // console.log(res)
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            _this.menuData = resData;

            if (_this.menuData[0]) {
              _this.$refs['myPage'].menuClick(_this.menuData[0]);

              _this.leftMenu = _this.menuData[0].children;
            }
          }
        });
      } else {
        // 规划局项目-直接菜单数据获取
        _request["default"].get(this.settingConfig.getMenuUrl, {}).then(function (res) {
          var code = res.code;
          var resData = res.data;

          if (code === 20000) {
            _this.recursion(resData, 'children', function (item) {
              item.menuCode = item.apeCode;
              item.menuName = item.apeName;
              item.children = item.children ? item.children : [];
              item.menuId = item.apeKey;
            });

            _this.menuData = resData;

            if (_this.menuData[0]) {
              _this.$refs['myPage'].menuClick(_this.menuData[0]);

              _this.leftMenu = _this.menuData[0].children;
            }
          }
        });
      }
    },
    // 最外层--通过menuCode触发菜单跳转事件
    menuJump: function menuJump(menuCode) {
      var _this2 = this;

      this.menuData.forEach(function (items, index) {
        if (items.menuCode === menuCode) {
          _this2.menuActiveIndex = index;
          _this2.leftMenu = items.children;

          _this2.$refs['myPage'].menuClick(items);

          return false;
        }

        if (items.children.length > 0) {
          _this2.recursion(items.children, 'children', function (item) {
            if (item.menuCode === menuCode) {
              _this2.menuActiveIndex = index;
              _this2.leftMenu = items.children;

              _this2.$refs['myPage'].menuClick(item);

              _this2.defaultActive = menuCode;
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
      var _this3 = this;

      this.menu_i = this.menu_i === 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold';
      this.isCollapse = !this.isCollapse;
      setTimeout(function () {
        _this3.leftMenuWidth = _this3.isCollapse ? '64px' : '200px';

        _this3.$refs['myPage'].mainStyleChange();
      }, 100);
    }
  }
};
exports["default"] = _default;