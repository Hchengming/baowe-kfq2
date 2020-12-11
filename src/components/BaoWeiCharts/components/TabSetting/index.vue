<template>
  <!-- <div> -->
  <el-dialog
    ref="tabsSettingFormDialog"
    v-drag
    class="dialog-common tabs-setting-form-dialog"
    :append-to-body="true"
    :visible.sync="isShow"
  >
    <div slot="title" class="headerTitle">tabs切换模块配置信息</div>
    <el-form ref="tabsForm" :model="tabsForm" label-width="130px">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="模块标题" prop="title">
            <el-input v-model="tabsForm.title" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      <fieldset class="keys-config-setting">
        <legend class="theme-color">tabs切换栏设置</legend>
        <colums-setting :table-cloums="titleColums" :table-data="tabsForm.titleData" />
      </fieldset>

      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="宽度(页面占比)" prop="width">
            <el-input-number
              v-model="tabsForm.width"
              size="small"
              :min="0"
              :max="100"
              :precision="2"
            />
            <!-- <el-button size="small" @click="widthMax">一键100%</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高度(页面占比)" prop="height">
            <el-input-number
              v-model="tabsForm.height"
              size="small"
              :min="0"
              :max="100"
              :precision="2"
            />
            <!-- <el-button size="small" @click="heightMax">一键100%</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="位置X轴(页面占比)" prop="left">
            <el-input-number
              v-model="tabsForm.left"
              size="small"
              :min="0"
              :max="100"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置Y轴(页面占比)" prop="top">
            <el-input-number
              v-model="tabsForm.top"
              size="small"
              :min="0"
              :max="100"
              :precision="2"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="视图层级" prop="zindex">
            <el-input
              v-model="tabsForm.zindex"
              size="small"
              style="width: 70px"
              placeholder="若模块重叠,低层级模块会被高层级覆盖"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否启用拖拽功能" prop="isDrafting">
            <el-switch v-model="tabsForm.isDrafting" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mask" label="是否添加遮罩层">
            <el-radio-group v-model="tabsForm.mask">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
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
import TabSettingMixins from './TabSettingMixins'
import ColumsSetting from '../ColumsSetting'
export default {
  components: { ColumsSetting },
  mixins: [TabSettingMixins],
  props: {
    tabsForm: {
      type: Object,
      default: null
    }
  }
}
</script>
