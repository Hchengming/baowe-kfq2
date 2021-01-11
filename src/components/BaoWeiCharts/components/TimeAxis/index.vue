<template>
  <div
    :ref="'listWrap'"
    :style="listWrapStyle"
    :class="[
      'time-axis',
      { 'time-axis-admin': settingConfig.systemPermissions === 'admin' }
    ]"
    @mousedown="mousedown_tz"
  >
    <div class="operation">
      <i class="iconfont iconxiugai theme-color" @click="edit" />
      <i
        class="el-icon-set-up theme-color"
        title="模块数据交互"
        @click="Interactive()"
      />
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
    <ul class="time-list">
      <li
        v-for="(item, index) in timeListData()"
        :key="index"
        :style="{
          'padding-right': liP + 'px',
          width: '22px'
        }"
      >
        <span
          v-show="timeShow(item)"
          :class="['text', { active: listChooseYear == item.time }]"
          @click="listClick(item, index)"
        >
          <span>{{ item.time }}</span>
        </span>
      </li>
      <li class="end-li" />
    </ul>

    <time-axis-setting
      ref="TimeAxisSetting"
      :time-config="settingForm"
      :setting-config="settingConfig"
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
      listChooseYear: '', // 初始选中年份
      // listData: [],
      timeConfig: {},
      lip: ''
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
        width: (this.settingForm.width * element.scrollWidth) / 100 + 'px',
        cursor: this.cursor
      }
      // console.log(this.settingForm)
      return style
    }
  },
  watch: {

  },
  mounted() {
    this.getDefaultTime()
  },
  methods: {
    // 当前默认时间选择
    getDefaultTime() {
      this.listChooseYear = ''
      const defaultTime = this.settingForm.defaultTime
        ? this.settingForm.defaultTime
        : new Date().getFullYear().toString()
      this.$nextTick(() => {
        this.timeListData().forEach(item => {
          if (item.time === defaultTime) {
            this.listChooseYear = item.time
          }
        })
      })
    },
    // 缺失时间控制
    timeShow(item) {
      return this.settingForm.missingTimeStr.indexOf(item.time) === -1
    },
    // 拖拽完成后保存事件
    TZLSKeep() {
      this.$emit('timeAxisEmit', this.settingForm, this.moduleId)
    },
    // 年度点击事件
    listClick(item, index) {
      this.listChooseYear = item.time
      this.$emit('timeClick', item, this.moduleId)
    },
    // 类目轴删除事件
    deleteTemplate() {
      this.$emit('deleteTemplate', this.moduleId)
    },
    // 时间轴时间数据循环获取--时间间距设置
    timeListData() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const start = parseInt(this.settingForm.start)
      const end = parseInt(this.settingForm.end)
      const listData = []
      for (let i = start; i <= end; i++) {
        listData.push({
          time: i.toString()
        })
      }
      const li_size = listData.length
      const ul_w = (this.settingForm.width * element.scrollWidth) / 100
      const li_w_all = ul_w - 50
      const li_w = parseFloat(li_w_all / li_size)
      // 时间间距
      this.liP = parseFloat(li_w - 22)
      return listData
    },
    // 编辑按钮点击事件
    edit() {
      this.$refs['TimeAxisSetting'].show()
    },
    // 编辑提交事件
    timeAxisEmit(timeConfig, moduleId, close) {
      this.$emit('timeAxisEmit', this.settingForm, this.moduleId, close)
    },
    // 交互按钮点击事件
    Interactive() {
      const object = {
        moduleId: this.moduleId
      }
      this.$emit('interactive', object)
    }
  }
}
</script>
