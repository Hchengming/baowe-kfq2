<template>
  <div class="top-bar-wrap">
    <div class="operation">
      <i class="iconfont iconxiugai theme-color"
         @click="emit" />
      <el-popconfirm icon="el-icon-info"
                     class="delete-template-popconfirm"
                     icon-color="red"
                     title="确认删除顶部栏？"
                     @onConfirm="deleteTemplate">
        <i slot="reference"
           title="删除"
           class="el-icon-delete" />
      </el-popconfirm>
    </div>
    <ul class="top-bar-box">
      <li v-for="(data,indexs) in topBarData"
          :style="{height:liHeight()}"
          :key="indexs"
          >
        <div class="list-box">
          <p class="txt1" @click="topBarClick(data,data[0].key)">{{ nowlabel(data[0]) }}{{ data[0].value }}<span>{{ nowDW(data[0]) }}</span></p>
          <div class="test">
            <p v-for="(item,index) in nowData(data)"
               :key="index"
               @click="topBarClick(data,item.key)"
               :class="[data.length>2?'txt3':'txt2']"><span class="t1"
                    v-html="nowlabel(item)" />{{ item.value }}<span class="t2">{{ nowDW(item) }}</span></p>
          </div>
        </div>
      </li>
    </ul>
    <top-bar-setting ref="topBarSetting"
                     :item-api-data="itemApiData"
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
      default: null
    },
    itemApiData: {
      type: Array,
      default: null
    }
  },
  data () {
    return {

    }
  },
  computed: {
    topBarData () {
      const data = []
      if (this.topBarAll.data.length > 0 && this.topBarAll.configData.length > 0) {
        this.topBarAll.data.forEach(items => {
          const data01 = []

          this.topBarAll.configData.forEach(item => {
            for (const key in items) {
              if (key === item.key) {
                data01.push({
                  key: key,
                  value: items[key],
                  dw: item.dw ? item.dw : '',
                  label: item.label ? item.label : ''
                })
              }
            }
          })

          data.push(data01)
        })
      }
      // console.log(data)
      return data
    }
  },
  methods: {
    //列高度计算
    liHeight () {
      let liHeight = "90px"
      if (this.topBarAll.form.height) {
        const OHeight = window.innerHeight;
        liHeight = (OHeight * this.topBarAll.form.height / 100) - 5 + 'px'
      }
      return liHeight

    },
    // 数据整理，减去第一条数据
    nowData (data) {
      const datas = JSON.parse(JSON.stringify(data))
      datas.splice(0, 1)
      return datas
    },
    // 单位
    nowDW (item) {
      if (item.dw) {
        return `(${item.dw})`
      } else {
        return ''
      }
    },
    // 标签
    nowlabel (item) {
      if (item.label) {
        return item.label + '<br/>'
      } else {
        return ''
      }
    },
    // 模块占比
    // nowSpan(index){
    //    if(index==)
    // },
    // 顶部栏删除事件
    deleteTemplate () {
      this.$emit('delete')
    },
    // 编辑按钮点击事件
    emit () {
      this.$refs['topBarSetting'].show(this.topBarAll)
    },
    // 编辑提交事件
    settingSubmit (topBarSettingData, fn) {
      this.$emit('update', topBarSettingData, fn)
    },
    // 顶部菜单点击事件
    topBarClick (item,key) {
      this.$emit('topBarClick', item,key)
    }
  }
}
</script>
