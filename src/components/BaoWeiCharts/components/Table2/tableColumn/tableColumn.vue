<template>
  <el-table-column
    v-if="!item.children || item.children.length === 0"
    :class-name="item.className + ' ' + cellCursorClass(item.key)"
    :prop="item.key"
    :label="colLabel(item)"
    :width="colWidth(item)"
    :sortable="item.colSort == '1'"
    :fixed="
      item.colFixed === 'left' || item.colFixed === 'right'
        ? item.colFixed
        : undefined
    "
  >
    <template slot-scope="scope">
      <el-tooltip
        v-if="item.key !== 'operationButton'"
        :content="cellTip(item, scope.row)"
        :placement="setPlacement(item)"
      >
        <span
          :class="[colClass(item)]"
          :style="{
            color: textColor(scope.row[item.key]),
            cursor: cellCursor(item.key)
          }"
          v-html="cellHtml(item, scope.row)"
        />
      </el-tooltip>
      <div v-else class="right-operate-button">
        <el-button
          v-for="val in settingForm.operateButton"
          :key="val.name"
          :class="[val.showBorder==='0'?'nowBorder':'showBorder',val.type==='default'?'theme-color':'button-wihte']"
          :type="val.type"
          :icon="val.renderType === '0' ? '' : 'iconfont ' + val.icon"
          :title="val.name"
          size="small"
          @click="operateButtonClick(val, scope.row)"
        >{{ val.renderType === '1' ? '' : val.name }}</el-button>
      </div>
      <!-- <span :title="scope.row[item.key]">{{scope.row[item.key]}}</span> -->
    </template>
  </el-table-column>
  <el-table-column v-else :label="colLabel(item)">
    <table-column
      v-for="(val, num) in item.children"
      :key="num"
      :colums="colums"
      :setting-form="settingForm"
      :statistics-all="statisticsAll"
      :item="val"
      :width="width"
      @operateButtonClick="operateButtonClick"
    />
  </el-table-column>
</template>
<script>
import listTableCommonJs from '../TableMixins'
export default {
  name: 'TableColumn',
  mixins: [listTableCommonJs],
  props: {
    item: {
      type: Object,
      default: null
    },
    colums: {
      type: Array,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default: null
    }
  },
  methods: {
    textColor(val) {
      let color = ''
      if (val) {
        if (typeof val === 'number') {
          val = val.toString()
        }
        const num = val.indexOf(' @{')
        if (num > -1) {
          color = 'red'
        }
      }
      return color
    },

    // headername 获取
    colLabel(item) {
      const title = item.label ? item.label : item.explain
      return item.dw ? title + `(${item.dw})` : title
    },
    // 动态获取宽度
    colWidth(item) {
      let widths = item.width ? Number(item.width) : 100
      if (item.tableCustom) {
        widths = undefined
      }
      return widths
    },
    // 右侧其他按钮点击事件
    operateButtonClick(buttonSetting, rowItem) {
      // if (
      //   buttonSetting.jsMethods &&
      //           buttonSetting.jsMethods.replace(/\s*/g, '') !== ''
      // ) {
      //   const funcStr = buttonSetting.jsMethods
      //   // eslint-disable-next-line no-eval
      //   const test = eval('(false || ' + funcStr + ')')
      //   // console.log('(false || ' + funcStr + ')')
      //   test(rowItem)
      // }
      this.$emit('operateButtonClick', buttonSetting, rowItem)
    }
  }
}
</script>
<style lang="scss" scoped>
.right-operate-button {
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  >>> .el-button {
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-items: center;
    font-size: 16px;
    margin-top: 4px;
    // min-width: 30px;
    // text-align: center;
    margin: 0 5px;
    .iconfont {
      margin-right: 3px;
      font-size: 18px;

    }
    &.nowBorder{
      padding: 0;
      border:none;
    }
    &.showBorder{
      padding: 0 10px;
    }
    &.button-wihte{
      color: white;
    }
  }
}
</style>
