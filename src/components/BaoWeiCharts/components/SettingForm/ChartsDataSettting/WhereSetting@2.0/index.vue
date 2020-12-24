<template>
  <!-- 筛选 -->
  <div>
    <div class="screenForm-top">
      <span>是否显示查询按钮</span>
      <el-radio-group v-model="form.filterConfig.isShowInsertButton"
                      size="small">
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </div>
    <div class="screenBox">
      <fieldset class="form-setting">
        <legend class="theme-color">表单配置</legend>
         <el-button 
                 size="small"
                 @click="getmrParams">默认参数获取</el-button>
        <colums-setting :tableData="form.filterConfig.screenData"
                        :tableCloums="tableCloums">

        </colums-setting>
      </fieldset>
      <fieldset>
        <legend class="theme-color">右侧其他按钮配置</legend>
        <button-setting :operate-button="form.filterConfig.btnSettingData"
                        setting-type="2" />
      </fieldset>
    </div>
    <settingData ref="settingData"
                 :form="form"
                 @itemDataConfig="itemDataConfig" />
  </div>
</template>
<script>
import settingData from './settingData'
import ButtonSetting from '../../../ButtonSetting/index.vue'
import { dragDialog } from '../../../../utils/mixins.js'
import WhereSettingMixins from './WhereSettingMixins'
import ColumsSetting from '../../../ColumsSetting'
export default {
  components: { settingData, ButtonSetting, ColumsSetting },
  mixins: [dragDialog, WhereSettingMixins],
  props: {
    form: {
      type: Object,
      default: null,
    },
  },
}
</script>
