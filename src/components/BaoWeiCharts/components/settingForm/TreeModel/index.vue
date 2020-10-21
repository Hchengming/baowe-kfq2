<template>
  <div>
    <el-dialog
      v-drag
      title="参数值选择弹窗"
      class="param-tree-dialog"
      :append-to-body="true"
      :visible.sync="isShow"
    >
      <el-tree
        ref="elTree"
        :data="treeData"
        node-key="id"
        :default-expand-all="true"
        :render-content="renderContent"
        :props="defaultProps"
        @node-click="handleCheckChange"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div class="right">
          <el-button @click="isShow=false">取 消</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { treeModelmixins } from './treeModelmixins.js'
export default {
  mixins: [treeModelmixins],
  props: {
    treeData: {
      type: Array,
      default: null
    }
  }
}
</script>
