"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  data: function data() {
    return {
      destailSetting: []
    };
  },
  computed: {
    skyWidth: function skyWidth() {
      return this.labelWidth ? this.labelWidth + 'px' : '80px';
    },
    valWidth: function valWidth() {
      if (this.labelWidth) {
        return "calc(100% - ".concat(this.labelWidth, "px)");
      } else {
        return "calc(100% - 80px)";
      }
    }
  },
  mounted: function mounted() {
    if (this.settingForm.keyArr) {
      this.setDestailSetting();
    }
  },
  watch: {
    'settingForm.keyArr': {
      handler: function handler() {
        this.setDestailSetting();
      },
      deep: true
    }
  },
  methods: {
    // 单元格点击事件
    cellClick: function cellClick(colums) {
      this.$emit('cellClick', this.tableData, colums.key);
    },
    // 展示数据配置事件
    setDestailSetting: function setDestailSetting() {
      var _this = this;

      var tableItem = this.tableData; // console.log(tableItem)

      var detailsAreaConfig = JSON.parse(JSON.stringify(this.settingForm.keyArr));
      detailsAreaConfig.forEach(function (item) {
        for (var key in tableItem) {
          if (item.key === key) {
            item.val = tableItem[key];
          }
        }
      });
      var num = 0;
      var RowData = [];
      this.destailSetting = [];

      var lastBQ = function lastBQ(index) {
        if (index === detailsAreaConfig.length - 1) {
          if (num < 24) {
            var RowDataLength = RowData.length;
            var colSpan = 0;
            RowData.forEach(function (obj, objIndex) {
              if (objIndex !== RowDataLength - 1) {
                colSpan += obj.proportion;
              }
            });
            RowData[RowDataLength - 1].proportion = 24 - colSpan;

            _this.destailSetting.push({
              row: RowData
            });
          }
        }
      };

      detailsAreaConfig.forEach(function (item, index) {
        if (item.isShow === true) {
          var proportion = item.proportion ? item.proportion : 24;

          if (num + proportion === 24) {
            RowData.push(item);

            _this.destailSetting.push({
              row: RowData
            });

            num = 0;
            RowData = [];
          } else if (num + proportion > 24) {
            _this.destailSetting.push({
              row: RowData
            });

            num = proportion;
            RowData = [item];
            lastBQ(index);
          } else {
            RowData.push(item);
            num += proportion;
            lastBQ(index);
          }
        }
      });
    }
  }
};
exports["default"] = _default;