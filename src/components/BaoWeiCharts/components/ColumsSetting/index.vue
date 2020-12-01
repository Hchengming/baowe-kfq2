<template>
    <!-- 列配置表格 -->
    <table class="table-arr-setting">
      <tr>
        <td v-for="item in tableCloums" :key="item.key">
          {{ item.label }}
        </td>
        <td>
          <i
            class="el-icon-circle-plus-outline theme-color"
            @click="cloumsAdd"
          />
        </td>
      </tr>
      <tr v-for="(items, index) in tableData" :key="index">
        <td v-for="item in tableCloums" :key="item.key">
          <el-input
            v-if="item.formType==='input'"
            v-model="items[item.key]"
            size="mini"
            :placeholder="item.placehoder"
              :style="{ width: item.width+'px' }"
          />
          <!-- 下拉框 -->
           <el-select v-if="item.formType=='select'"  v-model="items[item.key]" size="small">
            <el-option
              v-for="item in item.selectArr"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :style="{ width: item.width+'px' }"
            />
          </el-select>
          <!-- 数字框 -->
           <el-input-number
           v-if="item.formType=='number'" 
           v-model="items[item.key]"
            size="small"
            :min="0"
            :max="10000"
            :precision="0"
            :style="{ width: item.width+'px' }"
            controls-position="right"
          />
        </td>
        <td>
          <i
            class="el-icon-remove-outline remove"
            @click="cloumsDelete(index)"
          />
          <i
            :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
            @click="sortChange(index, 'prev')"
          />
          <i
            :class="[
              'iconfont',
              'iconxiayi',
              {
                disabled: tableData.length - 1 == index,
              },
            ]"
            @click="sortChange(index, 'next')"
          />
        </td>
      </tr>
    </table>
</template>
<script>
/**
 * tableCloums[]
 * key 字段名
 * label 标签
 * placeholder
 * width
 * formType 表单类型  input/select/number
 * selectArr  下拉框配置数据[{value:"",label:""}]
 * defaultValue  默认值
*/
export default {
  props: {
    tableData: {
      type: Array,
      default: null
    }, 
    tableCloums: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
 
    };
  },
  methods: {
    //获取新增默认列值
    setColums() {
      let obj = {};
      this.tableCloums.forEach((item) => {
        if (item.defaultValue) {
          obj[item.key] = item.defaultValue;
        } else {
          obj[item.key] = null;
        }
      });
      console.log(obj)
      return obj;
    },
    //列新增事件
    cloumsAdd() {
      this.tableData.push(this.setColums());
    },
    //列删除事件
    cloumsDelete(index) {
      this.tableData.splice(index, 1);
    },
    //序号变化事件
    sortChange(index, type) {
      let obj = this.tableData[index];
     
      if (type === "prev") {
          if(index===0)return
        this.tableData.splice(index, 1);
        this.tableData.splice(index - 1, 0, obj);
      } else {
          if(index===this.tableData.length-1) return
        this.tableData.splice(index, 1);
        this.tableData.splice(index + 1, 0, obj);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.table-arr-setting {
  border-collapse: collapse;
  table-layout: fixed;
  td {
    border: 1px solid grey;
    /*允许在单词内换行。*/
    word-break: break-word;
    padding: 2px 3px;
    text-align: center;
    font-size: 14px;
    > i {
      font-size: 18px;
      cursor: pointer;
      &.remove {
        color: red;
      }
      &.disabled {
        cursor: no-drop;
        color: #c0c4cc;
      }
    }
  }
}
</style>

