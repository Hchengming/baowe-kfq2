<template>
  <div class="top-bar-wrap">
    <div class="operation">
      <i class="iconfont iconxiugai theme-color"
         @click="emit"></i>
      <el-popconfirm icon="el-icon-info"
                     class="delete-template-popconfirm"
                     @onConfirm="deleteTemplate"
                     iconColor="red"
                     title="确认删除顶部栏？">
        <i title="删除"
           slot="reference"
           class="el-icon-delete"></i>
      </el-popconfirm>
    </div>
    <ul class="top-bar-box">
      <li v-for="(data,indexs) in topBarData"
          @click="topBarClick(data)"
          :key="indexs">
        <div class='list-box'>
          <p class="txt1">{{nowlabel(data[0])}}{{data[0].value}}<span>{{nowDW(data[0])}}</span></p>
          <div class="test">
            <p  v-for="(item,index) in nowData(data)"
               :class="[data.length>2?'txt3':'txt2']"
               :key="index"><span class="t1" v-html='nowlabel(item)'></span>{{item.value}}<span class="t2">{{nowDW(item)}}</span></p>
          </div>
        </div>
      </li>
    </ul>
    <top-bar-setting ref="topBarSetting"
                     :itemApiData="itemApiData"
                     @submit="settingSubmit"></top-bar-setting>
  </div>

</template>
<script>
import TopBarSetting from '../TopBarSetting/index.vue'
export default {
  props: {
    topBarAll: {
      type: Object
    },
    itemApiData: {
      type: Array
    }
  },
  components: { TopBarSetting },
  data () {
    return {

    }
  },
  computed: {
    topBarData () {
      let data = []
      if(this.topBarAll.data.length>0&&this.topBarAll.configData.length>0){
        this.topBarAll.data.forEach(items => {
        let data01 = []
        
          this.topBarAll.configData.forEach(item => {
            for (let key in items) {
            if (key === item.key) {
              data01.push({
                key: key,
                value: items[key],
                dw: item.dw?item.dw:'',
                label: item.label?item.label:''
              })
            }
             }
          })
       
        data.push(data01)
      })
      
      }
      console.log(data)
      return data
    }
  },
  methods: {
    //数据整理，减去第一条数据
    nowData (data) {
      let datas = JSON.parse(JSON.stringify(data))
      datas.splice(0, 1)
      return datas
    },
    //单位
    nowDW (item) {
      if (item.dw) {
        return `(${item.dw})`
      } else {
        return ''
      }
    },
    //标签
    nowlabel (item) {
      if (item.label) {
        return item.label + '<br/>'
      } else {
        return ''
      }
    },
    //模块占比
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
    //顶部菜单点击事件
    topBarClick (item) {
      this.$emit('topBarClick', item)
    }
  }
}
</script>
