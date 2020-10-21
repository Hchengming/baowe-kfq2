<template>
  <div>
    <el-dialog
      v-drag
      title="表格、列表右侧操作按钮弹窗"
      class="operate-button-setting-dialog"
      :append-to-body="true"
      :visible.sync="isShow"
    >
      <button-setting
        :operate-button="operateButton"
        setting-type="1"
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
import ButtonSetting from '../../ButtonSetting/index.vue'
import JSMixins from './mixins.js'
export default {
  components: { ButtonSetting },
  mixins: [JSMixins],
  props: {
    form: {
      type: Object,
      default: null
    }
  }

}
</script>
