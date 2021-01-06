<template>
  <el-dialog
    v-drag
    :append-to-body="true"
    :visible.sync="isShow"
    class="dialog-common corresponding-param-setting"
  >
    <div slot="title" class="headerTitle">对应参数选择</div>
    <el-radio-group v-model="corParams" >
      <el-radio v-for="(item,index) in interactiveParams" :key="index" :label="item.val">{{ item.lab }}({{ item.val }})</el-radio>
    </el-radio-group>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="isShow=false">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      corParams: '',
      interactiveParams: []
    }
  },
  methods: {
    // 弹窗显示事件
    show(params, interactiveParams) {
      this.isShow = true
      this.interactiveParams = interactiveParams
      this.$nextTick(() => {
        this.corParams = params
      })
    },
    // 确认按钮点击事件
    onSubmit() {
      this.isShow = false
      this.$emit('onSubmit', this.corParams)
    }
  }
}
</script>
<style lang="scss" scoped>
   .corresponding-param-setting{
     >>> .el-dialog{
       width: 500px;
       .el-radio-group label{
         display: block;
         margin-top: 15px;
       }
     }
   }
</style>
