<template>
  <div>
    <table class="form-table other-btn-table operate-button-table">
      <tr class="t-head">
        <td
          width="100"
          class="txt1"
        >按钮名</td>
        <td
          width="100"
          class="txt2"
        >方法名</td>
        <td
          width="100"
          class="txt3"
        >按钮颜色</td>
        <td
          width="200"
          class="txt4"
        >Js脚本</td>
        <td
          width="80"
          class="t-head-cz"
        ><i
          class="iconfont iconzengjia theme-color"
          @click="btnAdd"
        /></td>
      </tr>
      <tr
        v-for="(item,index) in operateButton"
        :key="index"
      >
        <td>
          <el-input
            v-model="item.name"
            placeholder="按钮名"
            size="small"
          />
        </td>
        <td>
          <el-input
            v-model="item.methodsName"
            placeholder="方法名"
            size="small"
          />
        </td>

        <td>
          <el-select
            v-model="item.type"
            size="small"
            placeholder="按钮颜色"
          >
            <el-option
              v-for="value in buttonTypeArr"
              :key="value"
              class="btn-color-choose"
              :label="value"
              :value="value"
            >
              <el-button
                size="small"
                :type="value"
              >{{ value }}</el-button>
            </el-option>

          </el-select>
        </td>
        <td>
          <el-input
            v-model="item.jsMethods"
            type="textarea"
            :rows="1"
            placeholder="js脚本"
            readonly
            @click.native="jsMethodsSettingShow(item,index)"
          />
        </td>
        <td class="t-body-cz">
          <i
            :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
            @click="sortChange(item, index,-1, index == 0)"
          />
          <i
            :class="[
              'iconfont',
              'iconxiayi',
              { disabled: operateButton.length - 1 == index }
            ]"
            @click="
              sortChange(item, index,1, operateButton.length - 1 == index)
            "
          />
          <i
            class="el-icon-delete remove"
            @click="btnRemove(index)"
          />
        </td>
      </tr>
    </table>
    <js-methods-setting ref="jsMethodsSetting" :setting-type="settingType" @submit="changeJsMethods" />
  </div>

</template>
<script>
import JsMethodsSetting from '../JsMethodsSetting/index.vue'
import JSMixins from './mixins'
export default {
  components: { JsMethodsSetting },
  mixins: [JSMixins],
  props: {
    operateButton: {
      type: Array,
      default: null
    },
    // 配置类型 1：列表、表格右侧按钮配置,2:筛选模块右侧按钮配置
    settingType: {
      type: String,
      default: null
    }
  }
}
</script>
