<template>
  <div
    :ref="'listWrap'"
    :style="listWrapStyle"
    :class="['time-axis',{'time-axis-admin':settingConfig.systemPermissions==='admin'}]"
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
    <ul class="time-list" >
      <li
        v-for="(item, index) in timeListData()"
        :key="index"
        :style="{
          'padding-right': liP + 'px'
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
      :time-config="settingForm"
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
      listChooseIndex: 1,
      // listData: [],
      timeConfig: {},
      lip: ''
    }
  },
  computed: {
    listWrapStyle() {
      const element = document.getElementsByClassName('my_main_content')[0]
      const style = {
        top: parseFloat(
          (this.settingForm.top * element.scrollHeight) / 100) + 'px',
        left: parseFloat(
          (this.settingForm.left * element.scrollWidth) / 100) + 'px',
        'z-index': this.settingForm.zindex,
        width: ((this.settingForm.width * element.scrollWidth) / 100) + 'px',
        cursor: this.cursor
      }
      return style
    }
  },
  methods: {

    // 拖拽完成后保存事件
    TZLSKeep() {
      this.$emit('timeAxisEmit', this.settingForm, this.moduleId)
    },
    // 年度点击事件
    listClick(item, index) {
      this.listChooseIndex = index
      this.$emit('timeClick', item)
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
      const ul_w = ((this.settingForm.width * element.scrollWidth) / 100)
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
    }
  }
}
</script>
