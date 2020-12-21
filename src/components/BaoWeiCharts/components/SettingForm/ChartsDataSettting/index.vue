<template>
  <div>
    <!-- <h1>图表默认参数获取、筛选模块配置、字段配置</h1> -->
    <el-tabs v-model="activeName"
             style="min-height:300px"
             @tab-click="handleClick">
      <el-tab-pane label="默认参数获取"
                   name="first">
        <param-key-config
        ref="paramKeyConfig" :item-api-data="itemApiData"
                          :form="form"
                          :settingConfig="settingConfig">
        </param-key-config>
      </el-tab-pane>
      <el-tab-pane label="筛选项配置"
                   name="second">
        <where-setting ref="screenSetting"
                       :form="form"></where-setting>
      </el-tab-pane>
      <el-tab-pane label="字段配置"
                   name="third">
        <keys-setting :item-api-data="itemApiData"
                     :form="form"
                     :settingConfig="settingConfig"></keys-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ChartsDataSetttingMixins from './ChartsDataSetttingMixins'
import ParamKeyConfig from './ParamKeyConfig@2.0'
import WhereSetting from './WhereSetting@2.0'
import KeysSetting from './KeysSetting'
export default {
  mixins: [ChartsDataSetttingMixins],
  components: {
    ParamKeyConfig,
    WhereSetting,
    KeysSetting,
  },
  props: {
    itemApiData: {
      type: Array,
      default: null,
    },
    form: {
      type: Object,
      default: null,
    },
    statisticsAll: {
      type: Object,
      default: null,
    },
    whereForm: {
      type: Object,
      default: null,
    },
    componentType: {
      type: String,
      default: null,
    },
    settingConfig: {
      type: Object,
      default: null,
    },
  },
}
</script>