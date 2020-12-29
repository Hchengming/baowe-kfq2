<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :before-close="handleClose"
    title="系统提示"
    class="judge-pop-model dialog-common"
  >
    <div class="content">
      <i class="el-icon-info" />
      <span v-html="comtentHtml" />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      comtentHtml: '',
      transmissionValue: null // 传值
    }
  },
  methods: {
    // 弹窗取消事件
    handleClose() {
      this.dialogVisible = false
      this.$emit('handleClose', this.transmissionKey, this.transmissionValue)
    },
    // 确认按钮点击事件
    confirm() {
      this.dialogVisible = false
      this.$emit('confirm', this.transmissionValue)
    },
    // 弹窗显示事件
    show(html, transmissionValue) {
      this.dialogVisible = true
      this.comtentHtml = html
      this.transmissionValue = transmissionValue
    }
  }
}
</script>
