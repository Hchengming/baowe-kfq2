<template>
  <!-- <div> -->
  <el-dialog
    v-drag
    :append-to-body="true"

    :visible.sync="isShow"
    class="dialog-common tabs-setting-form-dialog"
  >
    <div slot="title" class="headerTitle">时间配置信息</div>
    <el-form ref="timeConfig" :model="timeConfig" label-width="130px">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="位置X轴(页面占比)" prop="left">
            <el-input-number
              v-model="timeConfig.left"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="位置Y轴(页面占比)" prop="top">
            <el-input-number
              v-model="timeConfig.top"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="宽度(页面占比)" prop="width">
            <el-input-number
              v-model="timeConfig.width"
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
          <el-form-item label="开始时间" prop="start">
            <el-date-picker
              v-model="timeConfig.start"
              :style="{ width: '130px' }"
              value-format="yyyy"
              type="year"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="end">
            <el-date-picker
              v-model="timeConfig.end"
              :style="{ width: '130px' }"
              value-format="yyyy"
              type="year"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="视图层级" prop="zindex">
            <el-input
              v-model="timeConfig.zindex"
              size="small"
              style="width: 70px"
              placeholder="若模块重叠,低层级模块会被高层级覆盖"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>

  <!-- </div> -->
</template>
<script>
import ListsSettingMixins from './TimeAxisSettingMixins'
export default {
  mixins: [ListsSettingMixins],
  props: {
    timeConfig: {
      type: Object,
      default: null
    }
  }
}
</script>
