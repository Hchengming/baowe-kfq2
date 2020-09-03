<template>
  <el-dialog title="系统提示"
             :visible.sync="dialogVisible"
             :append-to-body="true"
             class="judge-pop-model dialog-common"
             :before-close="handleClose">
    <div class="content">
      <i class="el-icon-info"></i>
      <span v-html="comtentHtml"></span>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button size="small"
                 @click="handleClose">取 消</el-button>
      <el-button size="small"
                 type="primary"
                 @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      comtentHtml: '',
      transmissionValue: null // 传值
    }
  },
  methods: {
    // 弹窗取消事件
    handleClose () {
      this.dialogVisible = false
      this.$emit('handleClose', this.transmissionValue)
    },
    // 确认按钮点击事件
    confirm () {
      this.dialogVisible = false
      this.$emit('confirm', this.transmissionValue)
    },
    // 弹窗显示事件
    show (html, transmissionValue) {
      this.dialogVisible = true
      this.comtentHtml = html
      this.transmissionValue = transmissionValue
    }
  }
}
</script>
