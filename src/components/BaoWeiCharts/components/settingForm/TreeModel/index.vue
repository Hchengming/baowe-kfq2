<template>
  <div>
    <el-dialog
      v-drag
      :append-to-body="true"
      :visible.sync="isShow"
      title="参数值选择弹窗"
      class="param-tree-dialog"
    >
      <el-tree
        ref="elTree"
        :data="treeData"
        :default-expand-all="true"
        :render-content="renderContent"
        :props="defaultProps"
        node-key="id"
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
