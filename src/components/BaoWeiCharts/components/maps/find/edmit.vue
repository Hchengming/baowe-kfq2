<template>
  <div>
    <el-dialog
      class="settingForm"
      title="地图模块配置信息"
      :append-to-body="true"
      :visible.sync="mapAll.isShow"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="130px"
      >
        <el-row
          type="flex"
          class="row-bg"
        >
          <el-col :span="12">
            <el-form-item label="地图尺寸">
              <el-input-number
                v-model="form.zoom"
                size="small"
                :min="0"
                :max="100"
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据展现方式">
              <el-select
                v-model="form.myType"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          class="row-bg"
        >
          <el-col :span="12">
            <el-form-item label="宽度(页面占比)">
              <el-input-number
                v-model="form.width"
                size="small"
                :min="0"
                :max="100"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度(页面占比)">
              <el-input-number
                v-model="form.height"
                size="small"
                :min="0"
                :max="100"
                :precision="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          class="row-bg"
        >
          <el-col :span="12">
            <el-form-item label="位置X轴(页面占比)">
              <el-input-number
                v-model="form.left"
                size="small"
                :min="0"
                :max="100"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置Y轴(页面占比)">
              <el-input-number
                v-model="form.top"
                size="small"
                :min="0"
                :max="100"
                :precision="2"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          class="row-bg"
        >
          <el-col :span="12">
            <el-form-item label="层级">
              <el-input
                v-model="form.zindex"
                size="small"
                placeholder="若模块重叠,低层级模块会被高层级覆盖"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="mapAll.isShow=false">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import dataPresentation from "../statistics/dataPresentation.json";
export default {
  props: {
    mapAll: {
      type: Object,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      options: [
        {
          value: 'XZQMap',
          label: '行政区图'
        }
      ]
    }
  },
  mounted() { },
  methods: {
    // 弹窗显示事件
    show() {
      this.dialogVisible = true
    },
    // 弹窗关闭事件
    close() {
      this.dialogVisible = false
    },
    // 表单确认事件
    onSubmit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>
