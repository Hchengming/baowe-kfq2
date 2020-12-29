<template>
  <div
    id="category-axis"
    :ref="'listWrap'"
    :style="{
      left: modelStyle.left + 'px',
      top: modelStyle.top + 'px',
      cursor: 'defalut',
      'z-index': modelStyle.zindex
    }"
    class="list-out"
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
      :style="{
        cursor: 'move'
      }"
      class="list"
      @mousedown="mousedown_tz"
    >
      <li v-for="(item, index) in listData" :key="index">
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
      :axis-config="axisConfig"
      @axisAdd="axisAdd"
    />
  </div>
</template>
<script>
import './index.scss'
import dragStretchMixins from './dragStretchMixins'
import AxisSetting from '../AxisSetting'
export default {
  components: { AxisSetting },
  mixins: [dragStretchMixins],
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      axisConfig: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    listClick(item, index) {
      this.listChooseIndex = index
      this.$emit('axisClick', item)
    },
    deleteTemplate() {
      this.$emit('delete')
    },
    edit() {
      this.axisConfig = {
        left: this.settingForm.left,
        top: this.settingForm.top,
        zindex: this.settingForm.zindex, // 视图层级
        isDrafting: this.settingForm.isDrafting // 是否启用拖拽功能
      }
      this.$refs['AxisSetting'].initData(this.listData)
      this.$refs['AxisSetting'].show()
    },
    axisAdd(config) {
      this.settingForm.left = config.axisConfig.left
      this.settingForm.top = config.axisConfig.top
      this.settingForm.zindex = config.axisConfig.zindex
      this.settingForm.isDrafting = config.axisConfig.isDrafting
      this.listData = config.axisData.map(value => value)
      this.setDemos()
    }
  }
}
</script>
