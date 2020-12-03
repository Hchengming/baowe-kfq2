<template>
  <div>
    <colums-setting
      :tableCloums="tableCloums"
      :tableData="tableData"
    ></colums-setting>
  </div>
</template>
<script>
import filterDataDefault from "./commonWhere.json";
import ColumsSetting from "../../ColumsSetting";
export default {
  props: {
    tableData: {
      type: Array,
      default: null,
    },
  },
  components: { ColumsSetting },
  data() {
    return {
      tableCloums: [
        {
          label: "筛选项",
          key: "filterItem",
          placeholder: "筛选项",
          width: 150,
          formType: "select",
          change: (items, item) => {
            let selectItem = {};
            item.selectArr.forEach((obj) => {
              if (items[item.key] === obj.val) {
                selectItem = obj;
              }
            });
            items.type=selectItem.type;
            this.tableCloums.forEach((obj2) => {
              if (selectItem[obj2.key]) {
                items[obj2.key] = selectItem[obj2.key];
              }
            });
          },
          selectArr: filterDataDefault,
        },
        {
          label: "参数名",
          key: "key",
          placeholder: "参数名",
          width: 100,
          formType: "input",
        },
        {
          label: "标签",
          key: "label",
          placeholder: "标签",
          width: 100,
          formType: "input",
        }, {
          label: "默认值",
          key: "defaultValue",
          placeholder: "默认值",
          width: 100,
          formType: "input",
        },
        {
          label: "插入索引",
          key: "index",
          placeholder: "插入索引",
          width: 100,
          formType: "number",
        },
        {
          label: "是否换行",
          key: "isLineFeed",
          placeholder: "插入索引",
          width: 80,
          formType: "select",
          selectArr: [
            { value: "1", label: "是" },
            { value: "0", label: "否" },
          ],
        },
      ],
    };
  },
  mounted() {},
};
</script>