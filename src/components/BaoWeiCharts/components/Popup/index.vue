<template>
  <el-dialog
    v-drag
    :append-to-body="true"
    :visible.sync="isShow"
    :class="classes"
    class="dialog-common"
  >
    <div slot="title" class="headerTitle">{{ title }}</div>
    <slot />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">{{ submitHide?'关 闭':'取 消' }}</el-button>
      <el-button v-if="!submitHide" type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    classes: {
      type: String,
      default: null
    },
    submitHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$emit('dialogClose')
    },
    // 弹窗确认事件
    onSubmit() {
      this.isShow = false
      this.$emit('dialogSubmit')
    }
  }
}
</script>
