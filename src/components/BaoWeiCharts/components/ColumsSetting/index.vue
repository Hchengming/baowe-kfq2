<template>
  <!-- 列配置表格 -->
  <div>
    <table class="table-arr-setting">
      <tr>
        <td v-for="item in tableCloums"
            :key="item.key"
            :style="{ width: item.width?item.width + 'px':'100px' }">
          {{ item.label }}
        </td>
        <td style="width:100px">
          <i class="el-icon-circle-plus-outline theme-color"
             @click="cloumsAdd" />
        </td>
      </tr>
      <tr v-for="(items, index) in tableData"
          :key="index">
        <td v-for="(item,num) in tableCloums"
            :key="num"
            :style="{ width: item.width?item.width + 'px':'100px' }">
          <!-- 输入框 多行文本框-->
          <el-input v-if="setFormType(items,index,item) === 'input'"
                    :type="item.inputType"
                    v-model="items[item.key]"
                    @click.native="inputClick(items,index,item)"
                    size="mini"
                    :title="items[item.key]"
                    :rows="item.rows"
                    :disabled="setDisabled(items,index,item)"
                    :placeholder="placeholder(item)" />
          <!-- 下拉框 -->
          <el-select v-if="setFormType(items,index,item) == 'select'"
                     v-model="items[item.key]"
                     :disabled="setDisabled(items,index,item)"
                     :placeholder="placeholder(item)"
                     size="small"
                     :title="items[item.key]"
                     @change="selectChange(items,index, item)">
            <el-option v-for="x in item.selectArr"
                       :key="x.val"
                       :value="x.val"
                       :label="x.lab" />
          </el-select>
          <!-- 数字框 -->
          <el-input-number v-if="setFormType(items,index,item) == 'number'"
                           v-model="items[item.key]"
                           :disabled="item.disabled"
                           :placeholder="placeholder(item)"
                           size="small"
                           :min="0"
                           :max="10000"
                           :precision="0"
                           controls-position="right" />
          <!-- 多选 -->
          <el-checkbox v-if="setFormType(items,index,item) === 'checkbox'"
                       v-model="items[item.key]"
                       size="mini"
                       :disabled="setDisabled(items,index,item)"
                       @change="checkboxChange(items,index, item)" />
          <!-- 带右侧按钮输入框 -->
          <el-input v-if="setFormType(items,index,item) === 'inputButton'"
                    v-model="items[item.key]"
                    :placeholder="placeholder(item)"
                    size="small"
                    class="input-with-select"
                    :disabled="setDisabled(items,index,item)"
                    :title="items[item.key]">
            <el-button slot="append"
                       icon="el-icon-search"
                       :disabled="setDisabled(items,index,item)"
                       @click.native="inputClick(items,index,item)" />
          </el-input>
          <!-- 颜色选择器 -->
          <el-color-picker v-if="setFormType(items,index,item) === 'color'"
                           size="small"
                           v-model="items[item.key]">

          </el-color-picker>
          <!-- 其他配置 -->
          <el-button v-if="setFormType(items,index,item) === 'other'"
                     type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     circle
                     @click="otherKeySettingClick(items, index,item)" />
          <!-- 特殊情况 slot嵌入 -->
          <slot v-if="setFormType(items,index,item)==='slot'"
                :name="item.slot" />
        </td>
        <td>
          <i :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
             @click="sortChange(index, 'prev')" />
          <i :class="[
            'iconfont',
            'iconxiayi',
            {
              disabled: tableData.length - 1 == index,
            },
          ]"
             @click="sortChange(index, 'next')" />
          <i class="el-icon-delete remove"
             @click="cloumsDelete(index)" />
        </td>
      </tr>
    </table>
    <other-key-setting ref="OtherKeySetting"
                       @inputClick="otherInputClick">
    </other-key-setting>
  </div>

</template>
<script>
/**
 * tableCloums[]
 * key 字段名
 * label 标签
 * placeholder
 * width
 * formType 表单类型  input/select/number
 * inputType 输入框类型 text/textarea/password
 * selectArr  下拉框配置数据[{value:"",label:""}]
 * defaultValue  默认值
 * disabled 不可点击的
 * slot 特殊情况嵌入
 */
/**
 * 其他配置项
 * isJscript  是否为js脚本代码
 * jsTips     提示信息
 */
import OtherKeySetting from './OtherKeySetting'
export default {
  components: { OtherKeySetting },
  props: {
    tableData: {
      type: Array,
      default: null,
    },
    tableCloums: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      otherForm: {}, //其他配置项数据
      nowIndex: null, //当前点击索引
    }
  },
  methods: {
    //动态当前表单类型获取
    setFormType(items, index, item) {
      if (typeof item.formType === 'string') {
        return item.formType
      } else {
        return item.formType(items, index, item)
      }
    },
    //动态是否不可点击数据获取
    setDisabled(items, index, item) {
      if (!item.disabled || item.disabled === true) {
        return item.disabled
      } else {
        return item.disabled(items, index, item)
      }
    },
    //其他项配置点击事件
    otherInputClick(form, item, index) {
      this.tableCloums.forEach((x) => {
        if (x.formType === 'other') {
          if (x.children[index].click) {
            x.children[index].click(form, this.nowIndex, item)
          }
        }
      })
    },
    //其他配置按钮点击事件
    otherKeySettingClick(items, index, item) {
      this.nowIndex = index
      this.$refs['OtherKeySetting'].show(items, item.children)
    },
    //placeholder设置
    placeholder(item) {
      return item.placeholder ? item.placeholder : item.label
    },
    //带按钮输入框按钮点击事件
    inputClick(items, index, item) {
      if (item.click) {
        item.click(items, index, item)
      }
    },
    // 下拉框变化事件
    selectChange(items, index, item) {
      if (item.change) {
        item.change(items, index, item)
      }
    },
    //多选变化事件
    checkboxChange(items, index, item) {
      if (item.change) {
        item.change(items, index, item)
      }
    },
    // 获取新增默认列值
    setColums() {
      const obj = {}
      this.tableCloums.forEach((item) => {
        //判断是否为其他配置项
        if (item.formType === 'other') {
          item.children.forEach((x) => {
            if (x.defaultValue) {
              obj[x.key] = x.defaultValue
            } else {
              obj[x.key] = null
            }
          })
        } else {
          if (item.defaultValue) {
            obj[item.key] = item.defaultValue
          } else {
            obj[item.key] = null
          }
        }
      })
      // console.log(obj)
      return obj
    },
    // 列新增事件
    cloumsAdd() {
      this.tableData.push(this.setColums())
      // console.log(this.tableData)
    },
    // 列删除事件
    cloumsDelete(index) {
      this.tableData.splice(index, 1)
    },
    // 序号变化事件
    sortChange(index, type) {
      const obj = this.tableData[index]

      if (type === 'prev') {
        if (index === 0) return
        this.tableData.splice(index, 1)
        this.tableData.splice(index - 1, 0, obj)
      } else {
        if (index === this.tableData.length - 1) return
        this.tableData.splice(index, 1)
        this.tableData.splice(index + 1, 0, obj)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.table-arr-setting {
  display: block;
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  td {
    border: 1px solid grey;
    /*允许在单词内换行。*/
    border-collapse: collapse;
    word-break: break-word;
    padding: 2px 3px;
    text-align: center;
    font-size: 14px;
    margin: 0;
    .el-input,
    .el-select,
    .el-input-number {
      width: 100%;
    }
    >>> .el-textarea .el-textarea__inner {
      padding: 6px 3px;
      min-height: 20px !important;
      line-height: 20px;
    }

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

