<template>
  <div class="top-bar-wrap">
    <div class="operation">
      <i
        class="iconfont iconxiugai theme-color"
        v-if="settingConfig.systemPermissions === 'admin'"
        @click="emit"
      />
      <el-popconfirm
        icon="el-icon-info"
        class="delete-template-popconfirm"
        icon-color="red"
        title="确认删除顶部栏？"
        @confirm="deleteTemplate"
      >
        <i
          slot="reference"
          title="删除"
          v-if="settingConfig.systemPermissions === 'admin'"
          class="el-icon-delete"
        />
      </el-popconfirm>
    </div>
    <ul id="top-bar-box">
      <li
        v-for="(obj, indexs) in topBarAll.data"
        class="theme-bg-color"
        :style="{ height: liHeight(), background: listBackground(obj, indexs) }"
        :key="indexs"
      >
        <div class="top-bar-boxs">
          <div :class="['list-box', { 'list-box-2': obj.data.length > 1 }]">
            <p class="txt1" @click="topBarClick(obj, { title: obj.title })">
              {{ obj.title }}
            </p>
            <div class="test">
              <p
                v-for="(item, index) in obj.data"
                :key="index"
                @click="topBarClick(item, { [item.key]: item.value })"
                :class="[obj.data.length > 1 ? 'txt3' : 'txt2']"
              >
                <!-- <span v-show="obj.data.length<=1"
                    class="t1"
                    v-html="item.label" /> -->
                {{ item.value }}<span class="t2">{{ item.dw }}</span
                ><span
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
      :item-api-data="itemApiData"
      @submit="settingSubmit"
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
  },
  data() {
    return {}
  },
  methods: {
    //背景颜色设置
    listBackground(obj, index) {
      let form = this.topBarAll.form
      let bgColor = ''
      switch (form.bgType) {
        case '0':
          bgColor = form.bg1
          break
        case '1':
          bgColor = index % 2 === 0 ? form.bg1 : form.bg2
          break
        case '2':
          bgColor = obj[form.bgKey]

          break
        default:
          bgColor = undefined
      }
      // console.log(data)
      // console.log(index)
      return bgColor +'!important'
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
    topBarClick(item, obj) {
      this.$emit('topBarClick', item, obj)
    },
  },
}
</script>
