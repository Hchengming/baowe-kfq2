<template>
  <!-- 筛选 -->
  <div>
    <div class="screenForm-top">
      <span>是否显示查询按钮</span>
      <el-radio-group
        v-model="form.filterConfig.isShowInsertButton"
        size="small"
      >
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </div>
    <div class="screenBox">
      <fieldset class="form-setting">
        <legend class="theme-color">表单配置</legend>
        <el-button size="small" @click="getmrParams">默认参数获取</el-button>
        <colums-setting
          :table-data="form.filterConfig.screenData"
          :table-cloums="tableCloums"
        />
      </fieldset>
      <fieldset>
        <legend class="theme-color">右侧其他按钮配置</legend>
        <button-setting
          :operate-button="form.filterConfig.btnSettingData"
          setting-type="2"
        />
      </fieldset>
    </div>
    <settingData
      ref="settingData"
      :form="form"
      @itemDataConfig="itemDataConfig"
    />
    <!-- 树形弹窗 -->
    <tree-model
      ref="treeModel"
      :tree-data="treeData"
      @elTreeSubmit="elTreeSubmit"
    />
  </div>
</template>
<script>
import settingData from './settingData'
import ButtonSetting from '../../../ButtonSetting/index.vue'
import { dragDialog } from '../../../../utils/mixins.js'
import WhereSettingMixins from './WhereSettingMixins'
import ColumsSetting from '../../../ColumsSetting'
import TreeModel from '../../TreeModel/index'
export default {
  components: { settingData, ButtonSetting, ColumsSetting, TreeModel },
  mixins: [dragDialog, WhereSettingMixins],
  props: {
    form: {
      type: Object,
      default: null
    }
  }
}
</script>
