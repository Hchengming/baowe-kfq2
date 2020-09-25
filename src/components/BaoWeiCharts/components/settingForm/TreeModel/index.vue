<template>
  <div>
    <el-dialog title="参数值选择弹窗"
               class="param-tree-dialog"
               :append-to-body="true"
               :visible.sync="isShow">
      <el-tree ref="elTree"
               :data="treeData"
               node-key="id"
               :default-expand-all="true"
               @node-click="handleCheckChange"
               :render-content="renderContent"
               :props="defaultProps"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <div class="right">
          <el-button @click="isShow=false">取 消</el-button>
          <el-button type="primary"
                     @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import JSMixins from './mixins.js'
export default {
   mixins:[JSMixins],
  props: {
    treeData: {
      type: Array
    }
  }
  
}
</script>
