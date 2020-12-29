<template>
  <!-- <div> -->
  <el-dialog
    v-drag
    ref="listsSettingFormDialog"
    :append-to-body="true"
    :visible.sync="isShow"
    class="dialog-common tabs-setting-form-dialog"
  >
    <div slot="title" class="headerTitle">类目轴配置信息</div>
    <el-form ref="axisConfig" :model="axisConfig" label-width="130px">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="位置X轴(页面占比)" prop="left">
            <el-input-number
              v-model="axisConfig.left"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置Y轴(页面占比)" prop="top">
            <el-input-number
              v-model="axisConfig.top"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="视图层级" prop="zindex">
            <el-input
              v-model="axisConfig.zindex"
              size="small"
              style="width: 70px"
              placeholder="若模块重叠,低层级模块会被高层级覆盖"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用拖拽功能" prop="isDrafting">
            <el-switch v-model="axisConfig.isDrafting" />
          </el-form-item>
        </el-col>
      </el-row>
      <fieldset class="param-config-setting">
        <!-- 请求参数配置 -->
        <legend class="theme-color">数据配置</legend>
        <colums-setting
          :table-data="axisData"
          :table-cloums="tableCloums"
          @add="axisAdd"
        />
      </fieldset>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>

  <!-- </div> -->
</template>
<script>
import ListsSettingMixins from './AxisSettingMixins'
import columsSetting from '../ColumsSetting'
export default {
  components: { columsSetting },
  mixins: [ListsSettingMixins],
  props: {
    axisConfig: {
      type: Object,
      default: null
    }
  }
}
</script>
<style scoped>
.axis-field {
  width: 98%;
}
.axis-field-set {
  width: 100%;
  margin-right: 0px;
}
.axis-ul {
  width: 98%;
}
.axis-center {
  width: calc(calc(100% - 100px) / 2) !important;
}
</style>
