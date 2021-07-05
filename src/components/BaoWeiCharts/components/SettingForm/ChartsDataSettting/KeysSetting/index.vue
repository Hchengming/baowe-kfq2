<template>
  <div>
    <el-button size="small" @click="getKeysData">字段获取</el-button>
    <el-button
      v-if="['table', 'list'].indexOf(form.displayMode) > -1"
      size="small"
      @click="operateButtonSetting"
    >右侧操作按钮配置</el-button>
    <el-button size="small" @click="tableHeaderSetting">多表头配置</el-button>
    <el-button
      size="small"
      @click="loadJsMethodsSettingShow"
    >数据加载完成js脚本配置</el-button>
    <br>
    <!-- <p class="tips">
                <span v-if="!isWidth">*第一个字段必须为图表标题字段</span>
              </p> -->
    <ul class="zdpz_list keys-config-list">
      <li class="zdpz_list_header">
        <span class="hTxt1 hTxt">字段名</span>
        <span class="hTxt2 hTxt">含义</span>
        <span v-if="isWidth" class="hTxt3 hTxt">宽度</span>
        <span class="hTxt4 hTxt">单位</span>
        <!-- <span class="hTxt5 hTxt" title="单元格数据自定义js脚本渲染"
                      >单元格渲染</span
                    >
                    <span
                      class="hTxt6 hTxt"
                      title="单元格鼠标移入悬浮框内容自定义js脚本渲染"
                      >tip渲染</span
                    > -->
        <span v-if="form.submodule == '1'" class="hTxt7 hTxt">下级参数</span>
        <span v-if="form.isLinkMap == '1'" class="hTxt9 hTxt">
          地图使用字段</span>
        <span class="hTxt8 hTxt">
          列表显示
          <el-checkbox v-model="listKeyAll" @change="ListkeyChooseChange" />
        </span>
        <span class="hTxt81 hTxt">
          图表显示
          <el-checkbox v-model="chartsKeyAll" @change="ChartskeyChooseChange" />
        </span>
        <span class="hTxt82 hTxt">图表标题字段</span>
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1 &&
              form.barHisShowType === '1'
          "
          class="hTxt82 hTxt"
        >堆栈</span>
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1
          "
          class="hTxt83 hTxt"
        >
          柱背景色
        </span>
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1
          "
          class="hTxt83 hTxt"
        >
          柱渐变色
        </span>

        <span class="hTxt82 hTxt">表格列自适应</span>
        <span class="hTxt82 hTxt">表格列固定</span>
        <span class="hTxt82 hTxt">表格列排序</span>
        <span
          v-if="form.displayMode === 'destailTable'"
          class="hTxt82 hTxt"
        >宽度占比</span>
        <span class="hTxt82 hTxt">可点击</span>
        <span class="hTxt91 hTxt">其他配置</span>
        <!-- <span class="hTxt5 hTxt" v-if="form.clickToShow=='cell'">下钻关联字段</span> -->
        <span class="hTxt6 hTxt icons">
          <i
            class="el-icon-circle-plus-outline theme-color"
            @click="keyAdd(-1)"
          />
        </span>
      </li>
      <li
        v-for="(item, index) in form.keyArr"
        :key="index"
        :class="['zdpz_list_content', { active: chooseRowIndex === index }]"
        @click="rowClick(item, index)"
      >
        <span class="hTxt1 hTxt">
          <el-input
            v-model="item.key"
            :disabled="item.key === 'operationButton'"
            size="mini"
            placeholder="字段名"
          />
        </span>
        <span class="hTxt2 hTxt">
          <el-input
            v-model="item.explain"
            :title="item.explain"
            :disabled="item.key === 'operationButton'"
            size="mini"
            placeholder="含义"
          />
        </span>
        <span v-if="isWidth" class="hTxt3 hTxt">
          <el-input v-model="item.width" size="mini" placeholder="宽度" />
        </span>
        <span class="hTxt4 hTxt">
          <el-input
            v-model="item.dw"
            :disabled="item.key === 'operationButton'"
            size="mini"
            placeholder="单位"
          />
        </span>
        <!-- 下级参数 -->
        <span v-if="form.submodule == '1'" class="hTxt7 hTxt">
          <el-checkbox
            v-model="item.isCruxKey"
            :disabled="item.key === 'operationButton'"
          />
        </span>
        <!-- 地图使用字段 -->
        <span v-if="form.isLinkMap == '1'" class="hTxt9 hTxt">
          <el-checkbox
            v-model="item.isMapKey"
            :disabled="item.key === 'operationButton'"
            @change="isMapKeyChange(item)"
          />
        </span>
        <!-- 列表显示 -->
        <span class="hTxt8 hTxt">
          <el-checkbox
            v-model="item.isShow"
            :disabled="item.key === 'operationButton'"
          />
        </span>
        <!-- 图表显示 -->
        <span class="hTxt81 hTxt">
          <el-checkbox
            v-model="item.ischartsShow"
            :disabled="item.key === 'operationButton'"
          />
        </span>
        <!-- 图表标题字段 -->
        <span class="hTxt82 hTxt">
          <el-checkbox
            v-model="item.ischartsTitle"
            :disabled="item.key === 'operationButton'"
            @change="chartsTitleChange(item.key)"
          />
        </span>
        <!-- stack 堆栈设置 -->
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1 &&
              form.barHisShowType === '1'
          "
          class="hTxt83 hTxt"
        >
          <el-input
            v-model="item.stack"
            :disabled="!item.ischartsShow||item.ischartsTitle"
            size="mini"
            placeholder="堆栈设置"
          />
        </span>
        <!-- 柱背景颜色 -->
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1
          "
          class="hTxt83 hTxt"
        >
          <el-color-picker
            v-if="item.ischartsShow"
            v-model="item.zBgColor"
            :disabled="item.key === 'operationButton'"
            size="mini"
          />
        </span>
        <!-- 柱背渐变色 -->
        <span
          v-if="
            form.moduleType === '0' &&
              ['bar', 'histogram'].indexOf(form.displayMode) > -1
          "
          class="hTxt83 hTxt"
        >
          <el-color-picker
            v-if="item.ischartsShow"
            v-model="item.zBgColor2"
            :disabled="item.key === 'operationButton'"
            size="mini"
          />
        </span>

        <!-- 表格列自适应 -->
        <span class="hTxt82 hTxt">
          <el-checkbox
            v-model="item.tableCustom"
            :disabled="item.key === 'operationButton'"
            @change="tableCustomChange(item.key)"
          />
        </span>
        <!-- 表格列固定 -->
        <span class="hTxt82 hTxt">
          <el-select
            v-model="item.colFixed"
            size="small"
            placeholder="表格列固定"
          >
            <el-option label="否" value="null" />
            <el-option label="左侧" value="left" />
            <el-option label="右侧" value="right" />
          </el-select>
        </span>

        <!-- 表格列排序 -->
        <span class="hTxt82 hTxt">
          <el-select v-model="item.colSort" size="small" placeholder="是否排序">
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </span>
        <!-- 详情表格宽度占比 -->
        <span v-if="form.displayMode === 'destailTable'" class="hTxt82 hTxt">
          <el-select
            v-model="item.proportion"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="option in proportionAll"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </span>
        <!-- 字段是否可点击 -->
        <span class="hTxt82 hTxt">
          <el-select
            v-model="item.isClick"
            size="small"
            placeholder="字段是否可点击"
          >
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </span>
        <!-- 其他配置 -->
        <span class="hTxt91 hTxt">
          <el-button
            :style="otherButtonStyle(item)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="otherKeySetting(item, index)"
          />
        </span>
        <!-- 右侧按钮区域 -->
        <span class="icons hTxt6 hTxt">
          <i
            class="el-icon-circle-plus-outline theme-color"
            @click="keyAdd(index)"
          />
          <i
            v-show="form.keyArr.length > 1 && item.key !== 'operationButton'"
            class="el-icon-remove-outline remove"
            @click="keyRemove(index)"
          />
          <i
            :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
            @click="sortPrev(item, index, index == 0)"
          />
          <i
            :class="[
              'iconfont',
              'iconxiayi',
              { disabled: form.keyArr.length - 1 == index }
            ]"
            @click="sortNext(item, index, form.keyArr.length - 1 == index)"
          />
        </span>
      </li>
    </ul>
    <!-- 表格、列表右侧操作按钮弹窗 -->
    <operate-button-setting
      ref="operateButtonSetting"
      :form="form"
      @submit="operateButtonSubmit"
    />
    <!-- 多表头配置                     -->
    <table-header-setting ref="tableHeaderSetting" :form="form" />
    <!-- 图表其他字段配置弹窗 -->
    <other-key-setting ref="otherKeySetting" :form="form" />
    <!-- js脚本配置弹窗 -->
    <JsMethodsSetting
      ref="JsMethodsSetting"
      setting-type="5"
      @submit="loadJsMethodsSettingSubmit"
    />
  </div>
</template>
<script>
import keysSettingMixins from './keysSettingMixins'
import OperateButtonSetting from '../../OperateButtonSetting'
import OtherKeySetting from '../../OtherKeySetting'
import countryRadioMixins from '../../../../tuobiao/middleware/mixins/countryRadioMixins'
import TableHeaderSetting from '../../tableHeaderSetting/index.vue'
import JsMethodsSetting from '@/components/BaoWeiCharts/components/JsMethodsSetting'
export default {
  components: {
    OperateButtonSetting,
    OtherKeySetting,
    TableHeaderSetting,
    JsMethodsSetting
  },
  mixins: [keysSettingMixins, countryRadioMixins],
  props: {
    form: {
      type: Object,
      default: null
    },
    itemApiData: {
      type: Array,
      default: null
    },
    // dataViewList: {
    //   type: Array,
    //   default: null
    // },
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.zdpz_list_content.active {
  box-shadow: 0 0 4px #bf7777;
  position: relative;
  z-index: 9;
}
</style>
