<template>
  <el-dialog
    v-drag
    class="settingForm dialog-common"
    :title="'菜单配置-'+menuSetting.type"
    :append-to-body="true"
    :visible.sync="menuSetting.isShow"
  >
    <el-form
      ref="form"
      :model="menuSetting"
      label-width="60px"
    >
      <el-form-item
        label="js脚本"
        prop="jsjbxx"
      >
        <el-input
          v-model="menuSetting.jsjbxx"
          type="textarea"
          :rows="12"
          placeholder="js脚本"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="menuSetting.isShow=false">取 消</el-button>
      <el-button
        type="primary"
        @click="onSubmit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    menuSetting: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 表单提交事件
    onSubmit() {
      this.$emit('submit')
    }

  }
}
</script>
<style  scoped>
.settingForm.menuForm .el-form-item {
  margin-bottom: 20px;
}
</style>
