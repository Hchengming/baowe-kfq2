"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// 插件方式
var excel = require('./Export2Excel');

var agExportExcel = function agExportExcel(tableColumns, tableData, filename, firstWorkName, filter, otherTable, _this) {
  //  滤值
  var filters = filter || [];
  /* 判断是否有其他导出表*/

  var isOther = false;

  if (otherTable && otherTable.length > 0) {
    isOther = true;
  } // 1 所有工作表数据整合


  var headerAll = [[]]; // 所有工作表-表头集合

  var dataAll = [[]]; // 所有工作表-数据集合
  // 1.1 第一工作表数据整合

  var firstColumns = []; // 第一工作表过滤后剩余字符集合

  tableColumns.forEach(function (item) {
    if (item.field !== undefined && filters.indexOf(item.field) < 0) {
      headerAll[0].push(item.headerName);
      firstColumns.push(item);
    }
  });
  tableData.forEach(function (items) {
    var arr = [];
    firstColumns.forEach(function (item) {
      if (item.arr && item.arr.length > 0) {
        item.arr.forEach(function (val) {
          if (items[item.field] === val.val) {
            arr.push(val.text);
          }
        });
      } else {
        arr.push(items[item.field]);
      }
    });
    dataAll[0].push(arr);
  }); // 除第一工作表外其他工作表整合

  if (isOther) {
    otherTable.forEach(function (obj, index) {
      headerAll.push([]);
      dataAll.push([]);
      var otherColumns = [];
      obj.excelClumns.forEach(function (item) {
        if (item.field !== undefined && obj.filter.indexOf(item.field) < 0) {
          headerAll[index + 1].push(item.headerName);
          otherColumns.push(item);
        }
      });
      obj.tableData.forEach(function (items) {
        var arr = [];
        otherColumns.forEach(function (item) {
          if (item.arr && item.arr.length > 0) {
            item.arr.forEach(function (val) {
              if (items[item.field] === val.val) {
                arr.push(val.text);
              }
            });
          } else {
            arr.push(items[item.field]);
          }
        });
        dataAll[index + 1].push(arr);
      });
    });
  } // console.log("headerAll", headerAll)


  var sheetname = getWorkName(); // console.log("sheetname", sheetname)
  // console.log(otherTable)

  excel.export_json_to_excel({
    header: headerAll,
    data: dataAll,
    sheetname: sheetname,
    filename: filename,
    autoWidth: true,
    _this: _this
  }); // 获取工作表表名数组

  function getWorkName() {
    var arrWorkName = [firstWorkName];

    if (isOther) {
      otherTable.forEach(function (item) {
        arrWorkName.push(item.workName);
      });
    }

    return arrWorkName;
  }
};

var _default = agExportExcel;
exports["default"] = _default;