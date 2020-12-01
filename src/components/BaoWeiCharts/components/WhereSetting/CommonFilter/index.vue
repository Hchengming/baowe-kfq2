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
          width: 200,
          formType: "select",
          selectArr: filterDataDefault,
        },
        {
          label: "插入索引",
          key: "index",
          placeholder: "插入索引",
          width: 100,
          formType: "number",
        },
      ],
    };
  },
  mounted() {},
};
</script>