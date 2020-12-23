<template>
  <div :style="{
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
        cursor: 'defalut',
        'z-index': modelStyle.zindex,
        width: modelStyle.width+'px'
      }" class="time-out"
       :ref="'listWrap'">
    <div class="operation">
      <i
        class="iconfont iconxiugai theme-color"
        @click="edit"
      />
      <el-popconfirm
        icon="el-icon-info"
        class="delete-template-popconfirm"
        icon-color="red"
        title="确认删除类目轴？"
        @confirm="deleteTemplate"
      >
        <i
          slot="reference"
          title="删除"
          class="el-icon-delete"
        />
      </el-popconfirm>
    </div>
    <ul class="time-list"  @mousedown="mousedown_tz">
      <li v-for="(item,index) in listData" :key="index" :style="{
        'padding-right': modelStyle.liP + 'px'
      }">
        <span :class="['text',{'active':listChooseIndex==index}]" @click="listClick(item,index)">
            <span>{{item.time}}</span>
        </span>
      </li>
      <li class="end-li"/>
    </ul>

    <Time-Axis-Setting
      ref="TimeAxisSetting"
      :time-config="timeConfig"
      @axisAdd="timeAxisAdd"
    />
  </div>
</template>
<script>
import './index.scss'
import dragStretchMixins from './dragStretchMixins'
import TimeAxisSetting from '../TimeAxisSetting'
export default {
  mixins: [dragStretchMixins],
  components: {TimeAxisSetting},
  props: {
      configInfo:{
         type: Object,
         default: null,
      }
  },
  data() {
    return {
        listChooseIndex:1,
        listData:[],
        timeConfig:{}
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
      listClick(item,index){
          this.listChooseIndex=index
          this.$emit('timeClick',item)
      },
      deleteTemplate() {
          this.$emit('delete')
      },
      edit(){
          this.timeConfig = {
              left: this.settingForm.left,
              top: this.settingForm.top,
              zindex: this.settingForm.zindex, // 视图层级
              isDrafting: this.settingForm.isDrafting,// 是否启用拖拽功能
              start: this.settingForm.start,
              end: this.settingForm.end
          }
          this.$refs['TimeAxisSetting'].show()
      },
      timeAxisAdd(config){
          this.settingForm.left = config.left
          this.settingForm.top = config.top
          this.settingForm.zindex = config.zindex
          this.settingForm.isDrafting = config.isDrafting
          this.settingForm.start = config.start
          this.settingForm.end = config.end
          this.setDemos()
          this.setyear()
      }
  }
}
</script>
