<template>
  <div>
    <el-dialog
      v-drag
      title="图表字段配置"
      class="other-key-setting-dialog"
      :append-to-body="true"
      :visible.sync="isShow"
    >
      <el-form
        ref="otherKeySettingForm"
        :model="otherKeySetting"
        label-width="110px"
      >
        <el-form-item class="row-textarea" label="表格单元格渲染">
          <el-input
            v-model="otherKeySetting.cellRenderer"
            type="textarea"
            :rows="3"
            placeholder="单元格数据自定义js脚本渲染"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('cellRenderer')"
          />
        </el-form-item>
        <el-form-item class="row-textarea" label="表格tip渲染">
          <el-input
            v-model="otherKeySetting.tipRenderer"
            type="textarea"
            :rows="3"
            placeholder="单元格鼠标移入悬浮框内容自定义js脚本渲染"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('tipRenderer')"
          />
        </el-form-item>
        <el-form-item class="row-textarea" label="数据格式化">
          <el-input
            v-model="otherKeySetting.colDataformat"
            type="textarea"
            :rows="3"
            placeholder="接口返回数据格式化"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('colDataformat')"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="right">
          <!-- <el-button @click="isShow=false">取 消</el-button> -->
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <js-methods-setting
      ref="jsMethodsSetting"
      setting-type="3"
      @submit="changeJsMethods"
    />
  </div>
</template>
<script>
import OtherKeySettingMixins from './OtherKeySettingMixins'
import JsMethodsSetting from '../../JsMethodsSetting'
export default {
  components: { JsMethodsSetting },
  mixins: [OtherKeySettingMixins],
  props: {
    form: {
      type: Object,
      default: null
    }
  }
}
</script>
