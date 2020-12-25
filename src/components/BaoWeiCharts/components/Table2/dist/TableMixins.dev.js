"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      pageSizes: [10, 20, 50, 100, 500, 1000]
    };
  },
  methods: {
    // 单元格显示数据
    cellHtml: function cellHtml(colums, rowData) {
      return this.jsMethodsFuc(colums, rowData, 'cellRenderer');
    },
    // 单元格提示信息配置
    cellTip: function cellTip(colums, rowData) {
      return this.jsMethodsFuc(colums, rowData, 'tipRenderer');
    },
    // 单元格配置js脚本运行公共方法
    jsMethodsFuc: function jsMethodsFuc(colums, rowData, keys) {
      var docHtml = '';

      if (colums[keys]) {
        // console.log(colums)
        // eslint-disable-next-line no-eval
        var fnc = eval("(false || ".concat(colums[keys], ")"));
        docHtml = fnc(colums, rowData);
      } else {
        docHtml = rowData[colums.key];
      }

      if (typeof docHtml === 'number') {
        docHtml = docHtml.toString();
      }

      return docHtml;
    },
    // 单元格类名设置
    colClass: function colClass(item) {
      var menuTapAll = this.settingForm.menuTapAll;
      var colClass = ''; // 判断是为菜单跳转字段

      if (menuTapAll && menuTapAll.isMenuTap === '1') {
        if (item.key === menuTapAll.menuTapKey) {
          colClass = 'theme-color cursor-pointer';
        }
      } // 判断当前字段是否已配置单元格下钻子页面


      if (this.statisticsAll.drillDownKeyAll && this.statisticsAll.drillDownKeyAll.indexOf(item.key) > -1) {
        colClass = 'theme-color cursor-pointer';
      } // 判断是否已配置详情功能


      if (this.settingForm.isDestail === '1') {
        colClass = 'cursor-pointer';
      } // 判断是否为行下钻


      if (this.settingForm.submodule === '1' && this.settingForm.clickToShow === 'row') {
        colClass = 'cursor-pointer';
      }

      return colClass;
    },
    // 右侧其他按钮点击事件
    operateButtonClick: function operateButtonClick(buttonSetting, rowItem) {
      if (buttonSetting.jsMethods && buttonSetting.jsMethods.replace(/\s*/g, '') !== '') {
        var funcStr = buttonSetting.jsMethods; // eslint-disable-next-line no-eval

        var test = eval('(false || ' + funcStr + ')'); // console.log('(false || ' + funcStr + ')')

        test(rowItem);
      }

      this.$emit('operateButtonClick', buttonSetting, rowItem);
    },
    // topTitle显示位置控制
    setPlacement: function setPlacement(data) {
      var index = 0;
      var length = this.colums.length;
      this.colums.forEach(function (item, num) {
        if (item.key === data.key) {
          index = num;
        }
      });

      if (index + 1 <= length / 2) {
        return 'top-start';
      } else {
        return 'top-end';
      }
    },
    // 单元格样式
    cellCursorClass: function cellCursorClass(key) {
      var calss = 'cursor-default';

      if (this.settingForm.submodule === '1') {
        if (this.settingForm.clickToShow === 'row' && this.statisticsAll.isRowDrillDown === '1') {
          calss = 'cursor-pointer';
        }

        if (this.settingForm.clickToShow === 'cell' && this.statisticsAll.drillDownKeyAll && this.statisticsAll.drillDownKeyAll.indexOf(key) > -1) {
          calss = 'cursor-pointer';
        }
      }

      return calss;
    },
    // 分页变化事件
    handleCurrentChange: function handleCurrentChange(currentPage) {
      this.paginationAll.currentPage = currentPage;
      this.$emit('tablePageSort', this.paginationAll);
    },
    // 每页条数变化事件
    handleSizeChange: function handleSizeChange(pageSize) {
      this.paginationAll.pageSize = pageSize;
      this.$emit('tablePageSort', this.paginationAll);
    }
  }
};
exports["default"] = _default;