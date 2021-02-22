<template>
  <el-dialog
    v-drag
    :append-to-body="true"
    :visible.sync="isShow"
    class="dialog-common custom-components-setting-dialog"
  >
    <div slot="title" class="headerTitle">Vue自定义组件配置信息</div>
    <help-tips :help-tips-txt="helpTipsTxt" />
    <el-form
      ref="customComponentsConfig"
      :model="customComponentsConfig"
      label-width="130px"
    >
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="customComponentsConfig.title"
              size="small"
              style="width: 200px"
              placeholder="组件标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="视图层级" prop="zindex">
            <el-input
              v-model="customComponentsConfig.zindex"
              size="small"
              style="width: 120px"
              placeholder="若模块重叠,低层级模块会被高层级覆盖"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="js部分代码" prop="js">
        <el-input
          v-model="customComponentsConfig.js"
          :rows="5"
          type="textarea"
          size="small"
          placeholder="若模块重叠,低层级模块会被高层级覆盖"
        />
      </el-form-item>
      <el-form-item label="template部分代码" prop="temp">
        <el-input
          v-model="customComponentsConfig.temp"
          :rows="5"
          size="small"
          type="textarea"
          placeholder="若模块重叠,低层级模块会被高层级覆盖"
        />
      </el-form-item>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="位置X轴(页面占比)" prop="left">
            <el-input-number
              v-model="customComponentsConfig.left"
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
              v-model="customComponentsConfig.top"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="宽度(页面占比)" prop="width">
            <el-input-number
              v-model="customComponentsConfig.width"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高度(页面占比)" prop="height">
            <el-input-number
              v-model="customComponentsConfig.height"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
  </span></el-dialog>
</template>
<script>
// import CustomComponentsSettingMixins from './CustomComponentsSettingMixins'
import HelpTips from '../HelpTips'
export default {
  components: {
    HelpTips
  },
  props: {
    customComponentsConfig: {
      type: Object,
      default: null
    },
    moduleId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      helpTipsTxt: `
      组件交互
      const obj = {
        interactiveModuleId: moduleId, // 交互组件id
        param: {//传递参数
          asd: this.num
        }
      }
      localStorage.setItem('customComponentsParam', JSON.stringify(obj))
      `
    }
  },
  methods: {
    // 弹窗显示事件
    show() {
      this.isShow = true
    },
    // 弹窗关闭事件
    close() {
      this.isShow = false
      this.$refs['customComponentsConfig'].resetFields()
    },
    // 配置确认提交事件
    onSubmit() {
      this.$emit('componentFunc', {
        method: 'customComponentsEmit',
        param: {
          config: this.customComponentsConfig,
          moduleId: this.moduleId,
          close: () => {
            this.close()
          }
        }
      })
    }
  }
}
</script>
