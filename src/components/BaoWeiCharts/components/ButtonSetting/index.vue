<template>
 <div>
 <table class="form-table other-btn-table operate-button-table">
        <tr class="t-head">
          <td width="100"
              class="txt1">按钮名</td>
          <td width="100"
              class="txt2">方法名</td>
          <td width="100"
              class="txt3">按钮颜色</td>
          <td width="200"
              class="txt4">Js脚本</td>
          <td width="80"
              class="t-head-cz"><i @click="btnAdd"
               class="iconfont iconzengjia theme-color"></i></td>
        </tr>
        <tr v-for="(item,index) in operateButton"
            :key="index">
          <td>
            <el-input v-model="item.name"
            placeholder='按钮名'
                      size="small"></el-input>
          </td>
          <td>
            <el-input v-model="item.methodsName"
             placeholder='方法名'
                      size="small"></el-input>
          </td>
         
          <td>
            <el-select v-model="item.type"
                       size="small"
                       placeholder="按钮颜色">
              <el-option class="btn-color-choose"
                         v-for="value in buttonTypeArr"
                         :key="value"
                         :label="value"
                         :value="value">
                <el-button size="small"
                           :type="value">{{value}}</el-button>
              </el-option>

            </el-select>
          </td>
           <td>
            <el-input type="textarea"
                      :rows="1"
                      placeholder="js脚本"
                      readonly
                      @click.native="jsMethodsSettingShow(item,index)"
                      v-model="item.jsMethods">
            </el-input>
          </td>
          <td class="t-body-cz">
            <i @click="sortChange(item, index,-1, index == 0)"
               :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"></i>
            <i @click="
                    sortChange(item, index,1, operateButton.length - 1 == index)
                  "
               :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled: operateButton.length - 1 == index }
                  ]"></i>
            <i @click="btnRemove(index)"
               class="el-icon-delete remove"></i>
          </td>
        </tr>
      </table>
      <js-methods-setting ref="jsMethodsSetting" :settingType="settingType" @submit="changeJsMethods"></js-methods-setting>
 </div>
   
</template>
<script>
import JsMethodsSetting from "./JsMethodsSetting/index.vue"
import JSMixins from './mixins'
export default {
  mixins:[JSMixins],
  components:{ JsMethodsSetting },
  props:{
    operateButton:{
      type:Array
    },
    //配置类型 1：列表、表格右侧按钮配置,2:筛选模块右侧按钮配置
    settingType:{
       type:String
    }
  }
}
</script>
