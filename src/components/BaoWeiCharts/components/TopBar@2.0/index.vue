<template>
  <div
    :style="{ height: liHeight(), background: wrapBg(), width: wrapWidth(),top:liTop() }"
    :class="['top-bar-wrap']"
  >
    <div v-if="settingConfig.systemPermissions === 'admin'" class="operation">
      <i class="iconfont iconxiugai theme-color" @click="emit" />
      <i
        class="el-icon-set-up theme-color"
        title="模块数据交互"
        @click="Interactive()"
      />
      <el-popconfirm
        icon="el-icon-info"
        class="delete-template-popconfirm"
        icon-color="red"
        title="确认删除顶部栏？"
        @confirm="deleteTemplate"
      >
        <i slot="reference" title="删除" class="el-icon-delete" />
      </el-popconfirm>
    </div>
    <ul
      v-loading="!topBarAll.data||topBarAll.data.length===0"
      id="top-bar-box"
      :class="{'choose':topBarAll.choose}"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      style="height:100%"
      @click="componentClick"
    >
      <!-- 'flex':indexs===2?5:((indexs===0||indexs===3||indexs===5)?3:4) -->
      <li
        v-for="(obj, indexs) in topBarAll.data"
        :key="indexs"
        :style="{ height: '100%', background: listBackground(obj, indexs),'flex':obj.data.length?obj.data.length:2 }"
        class="theme-bg-color"
        @click="topBarClick(obj)"
      >
        <div class="top-bar-boxs">
          <div :class="['list-box', { 'list-box-2': obj.data.length > 1 }]">
            <p class="txt1">
              {{ obj.title }}
            </p>
            <div class="test">
              <p
                v-for="(item, index) in obj.data"
                :key="index"
                :class="[obj.data.length > 1 ? 'txt3' : 'txt2']"
              >
                <!-- <span v-show="obj.data.length<=1"
                    class="t1"
                    v-html="item.label" /> -->
                {{ item.value }}<span class="t2">{{ item.dw }}</span>
                <span
                  v-show="obj.data.length > 1"
                  class="t3"
                  v-html="item.label"
                />
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <top-bar-setting
      ref="topBarSetting"
      :data-view-list="dataViewList"
      :item-api-data="itemApiData"
      :setting-config="settingConfig"
      @submit="settingSubmit"
      @getTopData="getTopData"
    />
  </div>
</template>
<script>
import TopBarSetting from '../TopBarSetting/index.vue'
export default {
  components: { TopBarSetting },
  props: {
    topBarAll: {
      type: Object,
      default: null
    },
    itemApiData: {
      type: Array,
      default: null
    },
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    dataViewList: {
      type: Array,
      default: null
    }
  },
  methods: {
    // 顶部栏交互按钮点击事件
    Interactive() {
      this.$emit('interactive')
    },
    liTop() {
      let top = 0
      if (this.topBarAll.form && this.topBarAll.form.top) {
        top = this.topBarAll.form.top + '%'
      }
      return top
    },
    wrapWidth() {
      return this.topBarAll.form && this.topBarAll.form.width
        ? this.topBarAll.form.width + '%'
        : '100%'
    },
    // 获取数据失败后背景颜色设置
    wrapBg() {
      let bg = ''
      if (!this.topBarAll.data || this.topBarAll.data.length === 0) {
        bg = '#3c212121'
      } else {
        bg = undefined
      }
      return bg
    },
    // 背景颜色设置
    listBackground(obj, index) {
      const bgColorSettingData = this.topBarAll.bgColorSettingData
      let bgColor = '#3b85d8'
      if (bgColorSettingData) {
        const item = bgColorSettingData.filter(x => { return x.title === obj.title })[0]
        if (item && item.background) {
          bgColor = item.background
        }
      }
      return bgColor + '!important'
    },
    // 列高度计算
    liHeight() {
      let liHeight = '90px'
      if (this.topBarAll.form.height) {
        const OHeight = window.innerHeight
        liHeight = (OHeight * this.topBarAll.form.height) / 100 - 5 + 'px'
      }
      return liHeight
    },
    // 顶部栏删除事件
    deleteTemplate() {
      this.$emit('delete')
    },
    // 编辑按钮点击事件
    emit() {
      this.$refs['topBarSetting'].show(this.topBarAll)
    },
    // 编辑提交事件
    settingSubmit(topBarSettingData, fn) {
      this.$emit('update', topBarSettingData, fn)
    },
    // 顶部菜单点击事件
    topBarClick(obj) {
      this.$emit('topBarClick', obj)
    },
    // 顶部栏数据获取事件
    getTopData(params) {
      this.$emit('getTopData', params)
    },
    componentClick() {
      if (this.settingConfig.systemPermissions === 'admin') {
        this.$emit('componentFunc', {
          method: 'componentChooseClick',
          name: '组件点击选中事件',
          param: {
            moduleId: this.topBarAll.moduleId
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#top-bar-box{
  padding: 1px 0;
  border: 1px dashed transparent;
}
   #top-bar-box.choose{
    //  box-shadow: 0 5px 5px #008000;
    border: 1px dashed #008000;
   }
</style>
