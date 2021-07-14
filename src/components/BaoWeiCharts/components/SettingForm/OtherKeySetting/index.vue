<template>
  <div>
    <el-dialog
      v-drag
      :append-to-body="true"
      :visible.sync="isShow"
      title="图表字段配置"
      class="other-key-setting-dialog"
    >
      <el-form
        ref="otherKeySettingForm"
        :model="otherKeySetting"
        label-width="140px"
      >
        <el-form-item v-if="['line','histogram'].indexOf(form.displayMode)>-1" class="row-ipt" label="y轴坐标">
          <el-select
            v-model="otherKeySetting.yCoordinate"
            size="small"
            placeholder="y轴坐标选择(多个度量至少要有一个选择坐标1)"
          >
            <el-option label="坐标1(左侧坐标轴)" value="0" />
            <el-option label="坐标2(右侧坐标轴)" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.displayMode==='line'" class="row-ipt" label="标签位置">
          <el-select
            v-model="otherKeySetting.lineLabelPosition"
            size="small"
            placeholder="折线图标签位置"
          >
            <el-option label="顶部" value="top" />
            <el-option label="底部" value="bottom" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.displayMode==='line'" class="row-ipt" label="标签偏移量(top)">
          <el-input-number
            v-model="otherKeySetting.lineLabelTop"
            :min="-300"
            :max="300"
            controls-position="right"
            size="small"
          />
        </el-form-item>
        <el-form-item class="row-textarea" label="表格单元格渲染">
          <el-input
            v-model="otherKeySetting.cellRenderer"
            :rows="3"
            type="textarea"
            placeholder="单元格数据自定义js脚本渲染"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('cellRenderer')"
          />
        </el-form-item>
        <el-form-item class="row-textarea" label="表格tip渲染">
          <el-input
            v-model="otherKeySetting.tipRenderer"
            :rows="3"
            type="textarea"
            placeholder="单元格鼠标移入悬浮框内容自定义js脚本渲染"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('tipRenderer')"
          />
        </el-form-item>
        <el-form-item class="row-textarea" label="数据格式化">
          <el-input
            v-model="otherKeySetting.colDataformat"
            :rows="3"
            type="textarea"
            placeholder="接口返回数据格式化"
          />
          <i
            class="el-icon-full-screen theme-color"
            @click="enlarge('colDataformat')"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="right">
          <!-- <el-button @click="isShow=false">取 消</el-button> -->
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <js-methods-setting
      ref="jsMethodsSetting"
      setting-type="3"
      @submit="changeJsMethods"
    />
  </div>
</template>
<script>
import OtherKeySettingMixins from './OtherKeySettingMixins'
import JsMethodsSetting from '../../JsMethodsSetting'
export default {
  components: { JsMethodsSetting },
  mixins: [OtherKeySettingMixins],
  props: {
    form: {
      type: Object,
      default: null
    }
  }
}
</script>
