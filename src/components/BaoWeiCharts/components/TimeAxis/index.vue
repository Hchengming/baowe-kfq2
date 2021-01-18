<template>
  <div
    :ref="'listWrap'"
    :style="listWrapStyle"
    :class="['time-axis', { 'time-axis-admin': isAdmin }]"
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
    <div class="time-axis-content">
      <div :style="{ width: labelWidth + 'px' }" class="label">
        {{ settingForm.label }}:
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
          <span v-show="!timeShow(item)" class="text text2" />
        </li>
        <li class="end-li" />
      </ul>
    </div>

    <time-axis-setting
      ref="TimeAxisSetting"
      :time-config="settingForm"
      :setting-config="settingConfig"
      @componentFunc="componentFunc"
    />
  </div>
</template>
<script>
import './index.scss'
// import dragStretchMixins from './dragStretchMixins'
import TimeAxisSetting from '../TimeAxisSetting'
import drag from '../../utils/drag'
export default {
  components: { TimeAxisSetting },
  // mixins: [dragStretchMixins],
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
    },
    containerElelemt: { type: HTMLElement, default: null }
  },
  data() {
    return {
      listChooseYear: '', // 初始选中年份
      labelWidth: null, // 标签宽度
      // listData: [],
      timeConfig: {},
      lip: '',
      isAdmin: this.settingConfig.systemPermissions === 'admin'
    }
  },
  computed: {
    listWrapStyle() {
      let style = {}
      // this.$nextTick(() => {
      const element = this.containerElelemt ? this.containerElelemt : document.getElementsByClassName('my_main_content')[0]
      style = {
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
      console.log(this.containerElelemt, 'style')
      // })

      return style
    }
  },
  watch: {},
  mounted() {
    this.getDefaultTime()
  },
  methods: {
    mousedown_tz(e) {
      const _this = this
      if (this.isAdmin) {
        const element = this.containerElelemt ? this.containerElelemt : document.getElementsByClassName('my_main_content')[0]
        drag({
          e,
          settingForm: this.settingForm,
          drag: this.$refs['listWrap'],
          fatherElement: element,
          fnc: () => {
            _this.TZLSKeep()
          }
        })
      }
    },
    // 时间轴方法暴露
    componentFunc(obj) {
      this[obj.method](obj.param)
    },
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
      this.$emit('componentFunc', {
        method: 'timeAxisEmit',
        param: {
          config: this.settingForm,
          moduleId: this.moduleId
        }
      })
      // this.$emit('timeAxisEmit', this.settingForm, this.moduleId)
    },
    // 年度点击事件
    listClick(item, index) {
      this.listChooseYear = item.time
      this.$emit('componentFunc', {
        method: 'timeClick',
        param: {
          data: item,
          moduleId: this.moduleId
        }
      })
      // this.$emit('timeClick', item, this.moduleId)
    },
    // 类目轴删除事件
    deleteTemplate() {
      // this.$emit('deleteTemplate', this.moduleId)
      this.$emit('componentFunc', {
        method: 'deleteTimeAxis',
        param: {
          moduleId: this.moduleId
        }
      })
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
      this.labelWidth = this.settingForm.label
        ? this.settingForm.label.length * 18 + 10
        : 0
      const ul_w =
        (this.settingForm.width * element.scrollWidth) / 100 - this.labelWidth
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
    timeAxisEmit(param) {
      this.$emit('componentFunc', {
        method: 'timeAxisEmit',
        param: {
          config: this.settingForm,
          moduleId: this.moduleId,
          close: param.close
        }
      })
      // this.$emit('timeAxisEmit', this.settingForm, this.moduleId, close)
    },
    // 交互按钮点击事件
    Interactive() {
      const object = {
        moduleId: this.moduleId
      }
      this.$emit('componentFunc', {
        method: 'timeAxisInteractiveIconClick',
        param: object
      })
      // this.$emit('interactive', object)
    }
  }
}
</script>
