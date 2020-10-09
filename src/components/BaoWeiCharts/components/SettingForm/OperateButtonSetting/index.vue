<template>
  <div>
    <el-dialog title="表格、列表右侧操作按钮弹窗"
               class="operate-button-setting-dialog"
               v-drag
               :append-to-body="true"
               :visible.sync="isShow">
      <button-setting :operateButton="operateButton"
                      settingType="1"></button-setting>
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
import ButtonSetting from '../../ButtonSetting/index.vue'
import JSMixins from './mixins.js'
export default {
  mixins: [JSMixins],
  components: { ButtonSetting },
  props: {
    form: {
      type: Object
    }
  }

}
</script>
