<template>
  <div class="top-bar-wrap"
       :style="{height: liHeight(),background:wrapBg(),width:wrapWidth()}">
    <div class="operation"
         v-if="settingConfig.systemPermissions === 'admin'">
      <i class="iconfont iconxiugai theme-color"
         @click="emit" />
      <i class="el-icon-set-up theme-color"
         title="模块数据交互"
         @click="Interactive()"></i>
      <el-popconfirm icon="el-icon-info"
                     class="delete-template-popconfirm"
                     icon-color="red"
                     title="确认删除顶部栏？"
                     @confirm="deleteTemplate">
        <i slot="reference"
           title="删除"
           class="el-icon-delete" />
      </el-popconfirm>
    </div>
    <ul id="top-bar-box">
      <li v-for="(obj, indexs) in topBarAll.data"
          :key="indexs"
          class="theme-bg-color"
          :style="{ height: liHeight(), background: listBackground(obj, indexs) }"
          @click="topBarClick(obj)">
        <div class="top-bar-boxs">
          <div :class="['list-box', { 'list-box-2': obj.data.length > 1 }]">
            <p class="txt1">
              {{ obj.title }}
            </p>
            <div class="test">
              <p v-for="(item, index) in obj.data"
                 :key="index"
                 :class="[obj.data.length > 1 ? 'txt3' : 'txt2']">
                <!-- <span v-show="obj.data.length<=1"
                    class="t1"
                    v-html="item.label" /> -->
                {{ item.value }}<span class="t2">{{ item.dw }}</span><span v-show="obj.data.length > 1"
                      class="t3"
                      v-html="item.label" />
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <top-bar-setting ref="topBarSetting"
                     :data-view-list="dataViewList"
                     :item-api-data="itemApiData"
                     :setting-config="settingConfig"
                     @submit="settingSubmit" />
  </div>
</template>
<script>
import TopBarSetting from '../TopBarSetting/index.vue'
export default {
  components: { TopBarSetting },
  props: {
    topBarAll: {
      type: Object,
      default: null,
    },
    itemApiData: {
      type: Array,
      default: null,
    },
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
    dataViewList: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {}
  },
  methods: {
    //顶部栏交互按钮点击事件
    Interactive(object){
      console.log(this.topBarAll)
       this.$emit('interactive',object)
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
      if(bgColorSettingData&&bgColorSettingData[index]){
        bgColor=bgColorSettingData[index].background
      }
      // switch (form.bgType) {
      //   case '0':
      //     bgColor = form.bg1
      //     break
      //   case '1':
      //     bgColor = index % 2 === 0 ? form.bg1 : form.bg2
      //     break
      //   case '2':
      //     bgColor = obj[form.bgKey]

      //     break
      //   default:
      //     bgColor = undefined
      // }
    
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
  },
}
</script>
