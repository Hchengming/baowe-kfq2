<template>
  <div
    :ref="'listWrap'"
    :style="{
      left: modelStyle.left + 'px',
      top: modelStyle.top + 'px',
      cursor: 'defalut',
      'z-index': modelStyle.zindex,
      width: modelStyle.width + 'px'
    }"
    class="time-out"
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
    <ul class="time-list" @mousedown="mousedown_tz">
      <li
        v-for="(item, index) in listData"
        :key="index"
        :style="{
          'padding-right': modelStyle.liP + 'px'
        }"
      >
        <span
          :class="['text', { active: listChooseIndex == index }]"
          @click="listClick(item, index)"
        >
          <span>{{ item.time }}</span>
        </span>
      </li>
      <li class="end-li" />
    </ul>

    <Time-Axis-Setting
      ref="TimeAxisSetting"
      :time-config="configInfo"
      @timeAxisEmit="timeAxisEmit"
    />
  </div>
</template>
<script>
import './index.scss'
import dragStretchMixins from './dragStretchMixins'
import TimeAxisSetting from '../TimeAxisSetting'
export default {
  components: { TimeAxisSetting },
  mixins: [dragStretchMixins],
  props: {
    configInfo: {
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
      listChooseIndex: 1,
      listData: [],
      timeConfig: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    console.log('configInfo', this.configInfo)
  },
  methods: {
    listClick(item, index) {
      this.listChooseIndex = index
      this.$emit('timeClick', item)
    },
    deleteTemplate() {
      this.$emit('delete')
    },
    setyear() {
      const start = parseInt(this.settingForm.start)
      const end = parseInt(this.settingForm.end)
      this.listData = []
      for (let i = start; i <= end; i++) {
        this.listData.push({
          time: i.toString()
        })
      }
      const li_size = this.listData.length
      const ul_w = this.modelStyle.width
      const li_w_all = ul_w - 50
      const li_w = parseFloat(li_w_all / li_size)
      this.modelStyle.liP = parseFloat(li_w - 22)
    },
    // 编辑按钮点击事件
    edit() {
      // this.timeConfig = {
      //   left: this.settingForm.left,
      //   top: this.settingForm.top,
      //   zindex: this.settingForm.zindex, // 视图层级
      //   isDrafting: this.settingForm.isDrafting,// 是否启用拖拽功能
      //   start: this.settingForm.start,
      //   end: this.settingForm.end,
      //   width: this.settingForm.width
      // }
      this.$refs['TimeAxisSetting'].show()
    },
    // 编辑提交事件
    timeAxisEmit(config) {
      this.$emit('timeAxisEmit', config, this.moduleId)
    },
    timeAxisAdd(config) {
      this.settingForm.left = config.left
      this.settingForm.top = config.top
      this.settingForm.zindex = config.zindex
      this.settingForm.isDrafting = config.isDrafting
      this.settingForm.start = config.start
      this.settingForm.end = config.end
      this.settingForm.width = config.width
      this.setDemos()
      this.setyear()
    }
  }
}
</script>
