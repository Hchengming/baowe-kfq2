<template>
  <el-dialog ref="topBarSetting"
             class="top-bar-setting dialog-common settingForm"
             :append-to-body="true"
             :visible.sync="isShow">
    <div slot="title"
         class="headerTitle"
         @mousedown="dragElement">
      顶部栏配置信息
    </div>
    <el-form ref="topBaSettingForm"
             :model="form"
             label-width="65px">
      <div class="setting-box">
        <el-row>
          <el-col :span="8">
            <el-form-item label="接口类型"
                          prop="apiType">
              <el-radio-group v-model="form.apiType"
                              @change="apiTypeChange">
                <el-radio label="0">数据视图</el-radio>
                <el-radio label="1">服务接口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 数据接口处理部分 -->
        <api-choose ref="apiChoose"
                    :itemApiData.sync="itemApiData"
                    :dataViewList.sync="dataViewList"
                    :settingConfig="settingConfig"
                    :form="form" />
        <!-- 接口参数、字段配置             -->
        <div class="content-setting">
          <!-- 接口参数 -->
          <param-key-config ref="paramKeyConfig"
                            :item-api-data="itemApiData"
                            :form="form"
                            :settingConfig="settingConfig">
          </param-key-config>
          <!-- 颜色配置 -->
          <fieldset class="param-config-setting">
            <!-- 请求参数配置 -->
            <legend class="theme-color">背景配置</legend>
            <colums-setting :tableData='bgColorSettingData'
                            @add="bgSettingAdd"
                            :tableCloums="tableCloums">
            </colums-setting>
          </fieldset>

        </div>

      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="宽度(%)"
                        prop="width">
            <el-input-number v-model="form.width"
                             size="small"
                             :min="0"
                             :max="100"
                             :precision="2"
                             controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="高度(页面占比)"
                        label-width="100px"
                        prop="height">
            <el-input-number v-model="form.height"
                             size="small"
                             :min="0"
                             :max="100"
                             :precision="2" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button size="small"
                 @click="isShow = false">取 消</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { dragDialog } from '../../utils/mixins.js'
import JSMixins from './mixins.js'
import ApiChoose from '../ApiChoose/index.vue'
import columsSetting from '../ColumsSetting'
import ParamKeyConfig from '../SettingForm/ChartsDataSettting/ParamKeyConfig@2.0'
export default {
  components: { ApiChoose, ParamKeyConfig, columsSetting },
  mixins: [JSMixins, dragDialog],
  props: {
    // itemApiData: {
    //   type: Array,
    //   default: null
    // },
    // dataViewList: {
    //   type: Array,
    //   default: null
    // },
    settingConfig: {
      type: Object,
      default: null,
    },
  },
}
</script>
