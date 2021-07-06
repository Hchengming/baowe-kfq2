<template>
  <div>
    <table class="form-table other-btn-table operate-button-table">
      <tr class="t-head">
        <td width="100" class="txt1">按钮名</td>
        <td width="100" class="txt2">方法名</td>
        <td width="100" class="txt3">按钮颜色</td>
        <td width="100" class="txt3">图标</td>
        <td width="100" class="txt3">边框/边距填充</td>
        <td width="100" class="txt3">显示方式</td>
        <td width="200" class="txt4">Js脚本</td>
        <td width="80" class="t-head-cz">
          <i class="iconfont iconzengjia theme-color" @click="btnAdd" />
        </td>
      </tr>
      <tr v-for="(item, index) in operateButton" :key="index">
        <td>
          <el-input v-model="item.name" placeholder="按钮名" size="small" />
        </td>
        <td>
          <el-input
            v-model="item.methodsName"
            placeholder="方法名"
            size="small"
          />
        </td>

        <td>
          <el-select v-model="item.type" size="small" placeholder="按钮颜色">
            <el-option
              v-for="value in buttonTypeArr"
              :key="value"
              :label="value"
              :value="value"
              class="btn-color-choose"
            >
              <el-button :type="value" size="small">{{ value }}</el-button>
            </el-option>
          </el-select>
        </td>
        <td>
          <el-select v-model="item.icon" size="small" placeholder="按钮图标">
            <el-option
              v-for="x in iconArr"
              :key="x.value"
              :label="x.label"
              :value="x.value"
              class="btn-color-choose"
            >
              <span
                :class="['iconfont', x.value]"
                style="padding-right:5px; display: inline-block;width: 30px;text-align: center;"
              />
              {{ x.label }}
            </el-option>
          </el-select>
        </td>
        <td>
          <el-select
            v-model="item.showBorder"
            size="small"
            placeholder="背景边框显示"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </td>
        <td>
          <el-select
            v-model="item.renderType"
            size="small"
            placeholder="显示方式"
          >
            <el-option label="按钮" value="0" />
            <el-option label="图标" value="1" />
            <el-option label="图标+按钮" value="2" />
          </el-select>
        </td>
        <td>
          <el-input
            v-model="item.jsMethods"
            :rows="1"
            type="textarea"
            placeholder="js脚本"
            readonly
            @click.native="jsMethodsSettingShow(item, index)"
          />
        </td>
        <td class="t-body-cz">
          <i
            :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
            @click="sortChange(item, index, -1, index == 0)"
          />
          <i
            :class="[
              'iconfont',
              'iconxiayi',
              { disabled: operateButton.length - 1 == index }
            ]"
            @click="
              sortChange(item, index, 1, operateButton.length - 1 == index)
            "
          />
          <i class="el-icon-delete remove" @click="btnRemove(index)" />
        </td>
      </tr>
    </table>

    <js-methods-setting
      ref="jsMethodsSetting"
      :setting-type="settingType"
      @submit="changeJsMethods"
    />
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
