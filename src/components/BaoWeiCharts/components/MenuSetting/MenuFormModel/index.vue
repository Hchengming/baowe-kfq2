 <template>
  <el-dialog class="settingForm menuForm"
             title="菜单编辑信息"
             :append-to-body="true"
             :visible.sync="menuFormAll.isShow">
    <el-form ref="form"
             :model="menuFormAll.menuForm"
             :rules="rules"
             label-width="130px">
      <el-form-item label="菜单编码"
                    prop="menuCode">
        <el-input size="small"
                  v-model="menuFormAll.menuForm.menuCode"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称"
                    prop="menuName">
        <el-input size="small"
                  v-model="menuFormAll.menuForm.menuName"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标"
                    prop="menuIcon">
        <el-input size="small"
                  v-model="menuFormAll.menuForm.menuIcon"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="menuFormAll.isShow=false">取 消</el-button>
      <el-button type="primary"
                 @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["menuFormAll"],
  watch: {
    "menuFormAll.isShow" (val) {
      if (!val) {
        this.resetForm()
      }
    }
  },
  data () {
    return {
      rules: {
        menuCode: [
          { required: true, message: "请输入菜单编码", trigger: "change" }
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //表单提交事件
    onSubmit () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("menuFormSubmit", this.menuFormAll.menuForm, () => {
            this.resetForm()
          });
        } else {
          this.$message({
            message: "表单信息不完整",
            type: "error"
          });
          return false;
        }
      });
    },
    //表单重置事件
    resetForm () {
      this.menuFormAll.isShow = false;
      this.$refs['form'].resetFields();
    }
  }
};
</script>
<style  scoped>
.settingForm.menuForm .el-form-item {
  margin-bottom: 20px;
}
</style>