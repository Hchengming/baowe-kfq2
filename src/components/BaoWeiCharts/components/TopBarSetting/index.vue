<template>
  <el-dialog class="top-bar-setting dialog-common settingForm"
             ref="topBarSetting"
             :append-to-body="true"
             :visible.sync="isShow">
    <div class="headerTitle"
         slot="title"
         @mousedown="dragElement">
      顶部栏配置信息
    </div>
    <el-form ref="topBaSettingForm"
             :model="form"
             label-width="65px">
      <div class="setting-box">
        <!-- 数据接口处理部分 -->
        <api-choose :itemApiData="itemApiData"
                    :form="form"></api-choose>
        <!-- 接口参数、字段配置             -->
        <param-key-config :itemApiData="itemApiData"
                          :form="form">
          <div slot="keys"
               class="top-bar-setting-box">
            <el-button size="small"
                      
                       @click="getKeysData">字段获取</el-button>
            <p class="warning">*第一个字段必须为标题字段</p>
            <ul class="top-bar-setting-list">
              <li>
                <span class="txt1 hTxt">字段名</span>
                <span class="txt2 hTxt">标题</span>
                <span class="txt2 hTxt">单位</span>
                <span class="txt3 hTxt">是否显示</span>
                <span class="hTxt06 hTxt icons">
                  <i @click="keyAdd"
                     class="el-icon-circle-plus-outline  theme-color"></i>
                </span>
              </li>
              <li v-for="(item,index) in topBarSettingData"
                  :key="index">
                <span class="txt1 hTxt">
                  <el-input size="mini"
                            placeholder="字段名"
                            v-model="item.key"></el-input>
                </span>
                <span class="txt2 hTxt ">
                  <el-input size="mini"
                            placeholder="标签"
                            v-model="item.label"></el-input>
                </span>
                <span class="txt2 hTxt ">
                  <el-input size="mini"
                            placeholder="单位"
                            v-model="item.dw"></el-input>
                </span>
                <span class="txt3  hTxt">
                  <el-checkbox v-model="item.isShow"></el-checkbox>
                </span>
                <span class="hTxt06 hTxt icons">
                  <i @click="keyDelete(index)"
                     class="el-icon-remove-outline remove"></i>
                  <i @click="sortChange(index-1, index,item)"
                     :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"></i>
                  <i @click="sortChange(index+1, index,item)"
                     :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled:topBarSettingData.length - 1 == index }
                  ]"></i>
                </span>
              </li>
            </ul>
          </div>
        </param-key-config>
        <!-- <fieldset >
          <legend class="theme-color">显示内容配置</legend>
          
        </fieldset> -->
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="isShow=false"
                 size="small">取 消</el-button>
      <el-button type="primary"
                 @click="onSubmit"
                 size="small">确 定</el-button>

    </span>
  </el-dialog>
</template>
<script> 
import { dragDialog } from '../../utils/mixins.js'
import JSMixins from "./mixins.js"
import ApiChoose from '../ApiChoose/index.vue'
import ParamKeyConfig from '../SettingForm/ParamKeyConfig/index.vue'
export default {
  mixins: [JSMixins, dragDialog],
  components: { ApiChoose, ParamKeyConfig },
  props: {
    itemApiData: {
      type: Array
    }
  }
}
</script>
