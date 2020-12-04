<template>
  <el-dialog
    ref="topBarSetting"
    class="top-bar-setting dialog-common settingForm"
    :append-to-body="true"
    :visible.sync="isShow"
  >
    <div slot="title" class="headerTitle" @mousedown="dragElement">
      顶部栏配置信息
    </div>
    <el-form ref="topBaSettingForm" :model="form" label-width="65px">
      <div class="setting-box">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="背景设置" prop="bgType">
              <el-radio-group v-model="form.bgType">
                <el-radio label="0">单色调</el-radio>
                <el-radio label="1">双色调</el-radio>
                <el-radio label="2">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="form.bgType != '2'">
            <el-form-item label="背景一" prop="bg1">
              <el-input
                v-model="form.bg1"
                size="small"
                placeholder="背景颜色"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="form.bgType === '1'">
            <el-form-item label="背景二" prop="bg2">
              <el-input
                v-model="form.bg2"
                size="small"
                placeholder="背景颜色"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="form.bgType === '2'">
            <el-form-item label="背景字段" prop="bgKey">
              <el-input
                v-model="form.bgKey"
                size="small"
                placeholder="背景颜色字段"
              />
              <!-- <el-select v-model="form.bgKey"
                         size="small"
                         placeholder="背景使用字段选择">
                <el-option v-for="item in topBarSettingData"
                           :key="item.key"
                           :label="item.key"
                           :value="item.key"></el-option>

              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
          
              label="宽度(%)"
              prop="width"
            >
              <el-input-number
                v-model="form.width"
                size="small"
                :min="0"
                :max="100"
                :precision="2"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="接口类型" prop="apiType">
              <el-radio-group v-model="form.apiType" @change="apiTypeChange">
                <el-radio label="0">数据视图</el-radio>
                <el-radio label="1">服务接口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 数据接口处理部分 -->
        <api-choose
          :item-api-data="itemApiData"
          :setting-config="settingConfig"
          :data-view-list="dataViewList"
          ref="apiChoose"
          :form="form"
        />
        <!-- 接口参数、字段配置             -->
        <param-key-config :item-api-data="itemApiData" :form="form">
          <div slot="keys" class="top-bar-setting-box">
            <el-button size="small" @click="getKeysData">字段获取</el-button>

            <p class="warning">*第一个字段必须为标题字段</p>
            <ul class="top-bar-setting-list">
              <li>
                <span class="txt1 hTxt">字段名</span>
                <span class="txt2 hTxt">标题</span>
                <span class="txt2 hTxt">单位</span>
                <span class="txt3 hTxt">是否显示</span>
                <span class="hTxt06 hTxt icons">
                  <i
                    class="el-icon-circle-plus-outline theme-color"
                    @click="keyAdd"
                  />
                </span>
              </li>
              <li v-for="(item, index) in topBarSettingData" :key="index">
                <span class="txt1 hTxt">
                  <el-input
                    v-model="item.key"
                    size="mini"
                    placeholder="字段名"
                  />
                </span>
                <span class="txt2 hTxt">
                  <el-input
                    v-model="item.label"
                    size="mini"
                    placeholder="标签"
                  />
                </span>
                <span class="txt2 hTxt">
                  <el-input v-model="item.dw" size="mini" placeholder="单位" />
                </span>
                <span class="txt3 hTxt">
                  <el-checkbox v-model="item.isShow" />
                </span>
                <span class="hTxt06 hTxt icons">
                  <i
                    class="el-icon-remove-outline remove"
                    @click="keyDelete(index)"
                  />
                  <i
                    :class="[
                      'iconfont',
                      'iconshangyi',
                      { disabled: index == 0 },
                    ]"
                    @click="sortChange(index - 1, index, item)"
                  />
                  <i
                    :class="[
                      'iconfont',
                      'iconxiayi',
                      { disabled: topBarSettingData.length - 1 == index },
                    ]"
                    @click="sortChange(index + 1, index, item)"
                  />
                </span>
              </li>
            </ul>
          </div>
        </param-key-config>
        <!-- <fieldset >
          <legend class="theme-color">显示内容配置</legend>

        </fieldset> -->
      </div>

      <el-form-item label="高度(页面占比)" label-width="100px" prop="height">
        <el-input-number
          v-model="form.height"
          size="small"
          :min="0"
          :max="100"
          :precision="2"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="isShow = false">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { dragDialog } from "../../utils/mixins.js";
import JSMixins from "./mixins.js";
import ApiChoose from "../ApiChoose/index.vue";
import ParamKeyConfig from "../SettingForm/ParamKeyConfig/index.vue";
export default {
  components: { ApiChoose, ParamKeyConfig },
  mixins: [JSMixins, dragDialog],
  props: {
    itemApiData: {
      type: Array,
      default: null,
    },
    dataViewList: {
      type: Array,
      default: null,
    },
    settingConfig: {
      type: Object,
      default: null,
    },
  },
};
</script>
