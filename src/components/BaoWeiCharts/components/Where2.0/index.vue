<template>
  <div class="static-where-2"
       v-if="conditionAreaConfig.screenData&&conditionAreaConfig.screenData.length>0">
    <div class="where-left">
      <el-form ref="form"
               class="where-form"
               :model="whereAll.form">
        <el-form-item v-for="(item,index) in whereAll.data"
                      :key="index"
                      :label="label(item)"
                      :label-width="item.sfjssj === '1'?'10px':item.labelWidth+'px'">
          <!-- 输入框 -->
          <el-input v-if="item.type=='input'"
                    v-model="whereAll.form[item.key]"
                    :style="{width:item.rightWidth+'px'}"
                    size="small"></el-input>
          <!-- 下拉框 -->
          <el-select v-if="item.type=='select'"
                     v-model="whereAll.form[item.key]"
                     size="small"
                     :style="{width:item.rightWidth+'px'}"
                     placeholder="请选择">
            <el-option v-for="option in item.arr"
                       :key="option.value"
                       :label="option.label"
                       :value="option.value"></el-option>
          </el-select>
          <!-- 单选框 -->
          <el-radio-group v-if="item.type=='radio'"
                          v-model="whereAll.form[item.key]">
            <el-radio size="small"
                      v-for="radioItem in item.arr"
                      :key="radioItem.value"
                      :label="radioItem.value">{{radioItem.label}}</el-radio>
          </el-radio-group>
          <!-- 多选框 -->
          <!-- <p v-if="item.type=='checkbox'"> {{item.arr[0].value}}</p> -->
          <el-checkbox-group v-if="item.type=='checkbox'"
                             size="small"
                             v-model="whereAll.form[item.key]">
            <el-checkbox v-for="(obj,index) in item.arr"
                         size="small"
                         :key="index"
                         :label="obj.value">{{obj.label}}</el-checkbox>
          </el-checkbox-group>
          <!-- 数字输入框 -->
          <el-input-number v-if="item.type=='number'"
                           size="small"
                           v-model="whereAll.form[item.key]"></el-input-number>
          <!-- 日期框  -->
           <el-date-picker
           v-if="item.type==='date'"
            :style="{width:item.rightWidth+'px'}"
      v-model="whereAll.form[item.key]"
      type="date"
      :placeholder="datePlaceholder(item,index)">
    </el-date-picker>

     <!-- 日期时间框  -->
      <el-date-picker
       v-if="item.type==='dateTime'"
        :style="{width:item.rightWidth+'px'}"
      v-model="whereAll.form[item.key]"
      type="datetime"
     :placeholder="dateTimePlaceholder(item,index)">
    </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="staticWhereBottom">
        <el-button type="primary"
                   @click="onSubmit"
                   size="small">查 询</el-button>
      </div>

    </div>
    <div class="where-right">
      <el-button v-for="item in btnSettingData"
                 :key="item.name"
                 :type="item.type"
                 @click="whereOtherBtnClick(item)"
                 size="small">{{item.name}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    conditionAreaConfig: {
      type: Object
      // default () {
      //   return {}
      // }
    }
  },
  data () {
    return {
      isShow: false,
      whereAll: {
        data: [],
        form: {}
      },
      btnSettingData: []
    }
  },
  watch: {
    conditionAreaConfig () {
      this.setWhereAll(this.conditionAreaConfig)
    }
  },
  mounted () {
    this.setWhereAll(this.conditionAreaConfig)
  },
  methods: {
    //日期 placeholder显示
    datePlaceholder(item,index){
        if(item.sfjssj === '1'){
             return '结束日期'
        }else if(index+1 <= this.whereAll.data.length-1&&this.whereAll.data[index+1].sfjssj === '1'){
             return '开始日期' 
        } else {
             return '日期选择' 
        }
    },
     //日期时间 placeholder显示
    dateTimePlaceholder(item,index){
        if(item.sfjssj === '1'){
             return '结束日期时间'
        }else if(index+1 <= this.whereAll.data.length-1&&this.whereAll.data[index+1].sfjssj === '1'){
             return '开始日期时间' 
        } else {
             return '日期时间选择' 
        }
    },
    // 左侧标签显示数据
    label(item){
      if((item.type==='date'||item.type==='dateTime')&&item.sfjssj==='1'){
          return '-'
      }else{
         return  item.label+':'
      }
    },
    // 弹窗显示事件
    setWhereAll (conditionAreaConfig) {

      if (conditionAreaConfig) {
        if (!conditionAreaConfig.screenData ||
          typeof conditionAreaConfig.screenData !== 'object') {
          conditionAreaConfig.screenData = []
        }
        if (!conditionAreaConfig.btnSettingData ||
          typeof conditionAreaConfig.btnSettingData !== 'object') {
          conditionAreaConfig.btnSettingData = []
        }
      }

      let whereData = JSON.parse(JSON.stringify(conditionAreaConfig.screenData))
      this.whereAll.form = {}

      whereData.forEach(item => {
        if (item.defaultValue) {
          if (item.type === 'checkbox') {
            this.$set(this.whereAll.form, item.key, JSON.parse(item.defaultValue))
          } else {
            this.$set(this.whereAll.form, item.key, item.defaultValue)
          }
        } else {
          if (item.type === 'number') {
            this.$set(this.whereAll.form, item.key, null)
          }
          if (item.type === 'checkbox') {
            this.$set(this.whereAll.form, item.key, [])
          } else {
            this.$set(this.whereAll.form, item.key, '')
          }
        }
      })

      this.$set(this.whereAll, 'data', whereData)
      // 其他按钮配置
      this.btnSettingData = JSON.parse(JSON.stringify(conditionAreaConfig.btnSettingData))

    },
    // 查询按钮点击事件
    onSubmit () {
      let form = JSON.parse(JSON.stringify(this.whereAll.form))

      this.$emit('whereSubmit', form)
    },
    // 其他按钮点击事件
    whereOtherBtnClick (item) {
      this.$emit('whereOtherBtnClick', item)
    }
  }
}
</script>
