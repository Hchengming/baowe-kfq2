<template>
  <div
    id="category-axis"
    :ref="'listWrap'"
    :style="listWrapStyle"
    :class="{'category-axis-admin':settingConfig.systemPermissions==='admin'}"
    @mousedown="mousedown_tz"
  >
    <div class="operation">
      <i class="iconfont iconxiugai theme-color" @click="edit" />
      <el-popconfirm
        icon="el-icon-info"
        class="delete-template-popconfirm"
        icon-color="red"
        title="确认删除类目轴？"
        @confirm="deleteTemplate"
      >
        <i slot="reference" title="删除" class="el-icon-delete" />
      </el-popconfirm>
    </div>
    <ul
      class="list"
    >
      <li v-for="(item, index) in settingForm.axisData" :key="index">
        <span
          :class="['text', { active: listChooseIndex == index }]"
          @click="listClick(item, index)"
        >
          <span>{{ item.value }}</span>
        </span>
      </li>
    </ul>
    <Axis-setting
      ref="AxisSetting"
      :axis-config="settingForm"
      @axisConfigSubmit="categoryConfigSubmit"
    />
  </div>
</template>
<script>
import './index.scss'
import dragStretchMixins from '../TimeAxis/dragStretchMixins'
import AxisSetting from '../AxisSetting'
export default {
  components: { AxisSetting },
  mixins: [dragStretchMixins],
  props: {
    settingForm: {
      type: Object,
      default: null
    },
    moduleId: {
      type: String,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      listChooseIndex: null
    }
  },
  computed: {
    listWrapStyle() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const style = {
        top:
          parseFloat((this.settingForm.top * element.scrollHeight) / 100) +
          'px',
        left:
          parseFloat((this.settingForm.left * element.scrollWidth) / 100) +
          'px',
        'z-index': this.settingForm.zindex,
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px'
      }
      return style
    }
  },
  methods: {
    // 拖拽完成后保存事件
    TZLSKeep() {
      this.$emit('categoryConfigSubmit', this.settingForm, this.moduleId)
    },
    // 类目点击事件
    listClick(item, index) {
      this.listChooseIndex = index
      this.$emit('axisClick', item)
    },
    // 删除按钮点击事件
    deleteTemplate() {
      this.$emit('deleteCategory', this.moduleId)
    },
    // 编辑按钮点击事件
    edit() {
      this.$refs['AxisSetting'].show()
    },
    // 配置数据点击确认事件
    categoryConfigSubmit(config, moduleId, close) {
      this.$emit('categoryConfigSubmit', config, this.moduleId, close)
      // console.log(config, moduleId, close)
    }
  }
}
</script>
