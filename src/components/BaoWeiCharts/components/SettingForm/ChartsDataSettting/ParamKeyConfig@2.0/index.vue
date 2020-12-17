<template>
  <div class="fieldset-list">
    <fieldset class="param-config-setting">
      <!-- 请求参数配置 -->
      <legend class="theme-color">请求参数配置</legend>
      <el-button v-if="componentType!=='iframe'"
                 size="small"
                 @click="getparamConfig">参数获取</el-button>
      <br>
      <colums-setting :tableData="form.paramConfig"
                      :tableCloums="tableCloums">
        
      </colums-setting>
    </fieldset>

    
    <!-- 树形弹窗 -->
    <tree-model ref="treeModel"
                :tree-data="treeData"
                @elTreeSubmit="elTreeSubmit" />
  </div>
</template>
<script>
import ParamKeyConfigMixins from './ParamKeyConfigMixins.js'
import TreeModel from '../../TreeModel/index'
import ColumsSetting from '../../../ColumsSetting'
export default {
  components: { TreeModel, ColumsSetting },
  mixins: [ParamKeyConfigMixins],
  props: {
    itemApiData: {
      type: Array,
      default: null
    },
    form: {
      type: Object,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    whereForm: {
      type: Object,
      default: null
    },
    parentParamsAll: {
      type: Object,
      default: null
    },
    componentType: {
      type: String,
      default: null
    },
    settingConfig:{
      type: Object,
      default: null
    }
  },
}
</script>
