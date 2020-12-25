<template>
  <el-dialog
    v-drag
    title="按钮事件js脚本配置"
    class="js-methods-setting-dialog"
    :append-to-body="true"
    :visible.sync="isShow"
  >
    <p v-if="warn" class="warning-color">{{ warn }}</p>
    <el-input
      v-model="jsMethods"
      type="textarea"
      :rows="20"
      placeholder="js脚本"
    />
    <span slot="footer" class="dialog-footer">
      <div class="right">
        <!-- <el-button @click="isShow=false">取 消</el-button> -->
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
import JSMixins from './mixins.js'
export default {
  mixins: [JSMixins],
  props: {
    // 配置类型 1：列表、表格右侧按钮配置,2:筛选模块右侧按钮配置
    settingType: {
      type: String,
      default: null
    }
  }
}
</script>
