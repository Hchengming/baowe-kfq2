"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.export_json_to_excel = export_json_to_excel;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint-disable */
require("script-loader!file-saver");

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, _this) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };

  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;

      var cell_ref = _this.XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === "number") cell.t = "n";else if (typeof cell.v === "boolean") cell.t = "b";else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = _this.XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s";
      ws[cell_ref] = cell;
    }
  }

  if (range.s.c < 10000000) ws["!ref"] = _this.XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);

  for (var i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }

  return buf;
} //主要修改此函数内的方法


function export_json_to_excel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$multiHeader = _ref.multiHeader,
      multiHeader = _ref$multiHeader === void 0 ? [] : _ref$multiHeader,
      header = _ref.header,
      data = _ref.data,
      sheetname = _ref.sheetname,
      filename = _ref.filename,
      _this = _ref._this,
      _ref$merges = _ref.merges,
      merges = _ref$merges === void 0 ? [] : _ref$merges,
      _ref$autoWidth = _ref.autoWidth,
      autoWidth = _ref$autoWidth === void 0 ? true : _ref$autoWidth,
      _ref$bookType = _ref.bookType,
      bookType = _ref$bookType === void 0 ? "xlsx" : _ref$bookType;

  /* original data */
  filename = filename || "excel-list";
  data = _toConsumableArray(data);

  for (var i = 0; i < header.length; i++) {
    data[i].unshift(header[i]);
  } // data.unshift(header)
  // for (let i = multiHeader.length - 1; i > -1; i--) {
  //     data.unshift(multiHeader[i])
  // }


  var ws_name = sheetname;
  var wb = new Workbook(),
      ws = []; // console.log(header, 'header')

  for (var j = 0; j < header.length; j++) {
    ws.push(sheet_from_array_of_arrays(data[j], _this));
  }

  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = [];
    merges.forEach(function (item) {
      ws["!merges"].push(_this.XLSX.utils.decode_range(item));
    });
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    var colWidth = [];

    for (var k = 0; k < header.length; k++) {
      colWidth.push(data[k].map(function (row) {
        return row.map(function (val) {
          /*先判断是否为null/undefined*/
          if (val == null) {
            return {
              wch: 10
            };
          } else if (val.toString().charCodeAt(0) > 255) {
            /*再判断是否为中文*/
            return {
              wch: val.toString().length * 2
            };
          } else {
            return {
              wch: val.toString().length
            };
          }
        });
      }));
    }
    /*以第一行为初始值*/


    var result = [];

    for (var k = 0; k < colWidth.length; k++) {
      result[k] = colWidth[k][0];

      for (var _i = 1; _i < colWidth[k].length; _i++) {
        for (var _j = 0; _j < colWidth[k][_i].length; _j++) {
          if (result[k][_j]["wch"] < colWidth[k][_i][_j]["wch"]) {
            result[k][_j]["wch"] = colWidth[k][_i][_j]["wch"];
          }
        }
      }
    } // 分别给sheet表设置宽度


    for (var l = 0; l < result.length; l++) {
      ws[l]["!cols"] = result[l];
    }
  } // console.log(data)
  // console.log(filename)
  // console.log(ws_name)

  /* add worksheet to workbook */


  for (var k = 0; k < header.length; k++) {
    wb.SheetNames.push(ws_name[k]);
    wb.Sheets[ws_name[k]] = ws[k];
  }

  var wbout = _this.XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "".concat(filename, ".").concat(bookType));
}