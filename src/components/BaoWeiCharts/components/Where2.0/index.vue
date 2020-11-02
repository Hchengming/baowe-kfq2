<template>
  <div
    v-if="conditionAreaConfig.screenData&&conditionAreaConfig.screenData.length>0"
    class="static-where-2"
  >
    <div class="where-left">
      <el-form
        ref="form"
        class="where-form"
        :model="whereAll.form"
      >
        <el-form-item
          v-for="(item,index) in whereAll.data"
          :key="index"
          :label="label(item)"
          :label-width="item.sfjssj === '1'?'10px':item.labelWidth+'px'"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type=='input'"
            v-model="whereAll.form[item.key]"
            :style="{width:item.rightWidth+'px'}"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          />
          <!-- 下拉框 -->
          <el-select
            v-if="item.type=='select'"
            v-model="whereAll.form[item.key]"
            size="small"
            :style="{width:item.rightWidth+'px'}"
            placeholder="请选择"
            @change="onSubmit(item.isInsert=='1')"
          >
            <el-option
              v-for="option in item.arr"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <!-- 单选框 -->
          <el-radio-group
            v-if="item.type=='radio'&&item.styleType!=='2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          >
            <el-radio
              v-for="radioItem in item.arr"
              :key="radioItem.value"
              :border="item.styleType==='1'"
              :label="radioItem.value"
            >{{ radioItem.label }}</el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="item.type=='radio'&&item.styleType==='2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          >
            <el-radio-button
              v-for="radioItem in item.arr"
              :key="radioItem.value"
              :label="radioItem.value"
            >{{ radioItem.label }}</el-radio-button>
          </el-radio-group>
          <!-- 多选框 -->
          <!-- <p v-if="item.type=='checkbox'"> {{item.arr[0].value}}</p> -->
          <el-checkbox-group
            v-if="item.type=='checkbox'&&item.styleType!=='2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          >
            <el-checkbox
              v-for="(obj,iii) in item.arr"
              :key="iii"
              :border="item.styleType==='1'"
              :label="obj.value"
            >{{ obj.label }}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group
            v-if="item.type=='checkbox'&&item.styleType==='2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          >

            <el-checkbox-button
              v-for="checkboxItem in item.arr"
              :key="checkboxItem.value"
              :label="checkboxItem.value"
            >{{ checkboxItem.label }}</el-checkbox-button>
          </el-checkbox-group>
          <!-- 数字输入框 -->
          <el-input-number
            v-if="item.type=='number'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert=='1')"
          />
          <!-- 日期框  -->
          <el-date-picker
            v-if="item.type==='date'"
            v-model="whereAll.form[item.key]"
            :style="{width:item.rightWidth+'px'}"
            :type="item.styleType?item.styleType:'date'"
            size="small"
            :placeholder="datePlaceholder(item,index)"
            @change="onSubmit(item.isInsert=='1')"
          />

          <!-- 日期时间框  -->
          <el-date-picker
            v-if="item.type==='dateTime'"
            v-model="whereAll.form[item.key]"
            :style="{width:item.rightWidth+'px'}"
            type="datetime"
            :placeholder="dateTimePlaceholder(item,index)"
            @change="onSubmit(item.isInsert=='1')"
          />
        </el-form-item>
      </el-form>
      <div class="staticWhereBottom">
        <el-button
          v-if="conditionAreaConfig.isShowInsertButton!=='0'"
          type="primary"
          size="small"
          @click="onSubmit(true)"
        >查 询</el-button>
      </div>

    </div>
    <div class="where-right">
      <el-button
        v-for="item in btnSettingData"
        :key="item.name"
        :type="item.type"
        size="small"
        @click="whereOtherBtnClick(item)"
      >{{ item.name }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    conditionAreaConfig: {
      type: Object,
      default: null
    }
  },
  data() {
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
    conditionAreaConfig() {
      this.setWhereAll(this.conditionAreaConfig)
    }
  },
  mounted() {
    this.setWhereAll(this.conditionAreaConfig)
  },
  methods: {
    // 日期 placeholder显示
    datePlaceholder(item, index) {
      if (item.sfjssj === '1') {
        return '结束日期'
      } else if (index + 1 <= this.whereAll.data.length - 1 && this.whereAll.data[index + 1].sfjssj === '1') {
        return '开始日期'
      } else {
        return '日期选择'
      }
    },
    // 日期时间 placeholder显示
    dateTimePlaceholder(item, index) {
      if (item.sfjssj === '1') {
        return '结束日期时间'
      } else if (index + 1 <= this.whereAll.data.length - 1 && this.whereAll.data[index + 1].sfjssj === '1') {
        return '开始日期时间'
      } else {
        return '日期时间选择'
      }
    },
    // 左侧标签显示数据
    label(item) {
      if ((item.type === 'date' || item.type === 'dateTime') && item.sfjssj === '1') {
        return '-'
      } else {
        return item.label ? item.label + ':' : ''
      }
    },
    // 弹窗显示事件
    setWhereAll(conditionAreaConfig) {
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

      const whereData = JSON.parse(JSON.stringify(conditionAreaConfig.screenData))
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
    onSubmit(offon) {
      if (!offon) return
      const form = JSON.parse(JSON.stringify(this.whereAll.form))
      // console.log(form)
      this.$emit('whereSubmit', form)
    },
    // 其他按钮点击事件
    whereOtherBtnClick(buttonSetting) {
      if (
        buttonSetting.jsMethods &&
        buttonSetting.jsMethods.replace(/\s*/g, '') !== ''
      ) {
        const funcStr = buttonSetting.jsMethods
        // eslint-disable-next-line no-eval
        const test = eval('(false || ' + funcStr + ')')
        test()
      }
      this.$emit('whereOtherBtnClick', buttonSetting)
    }
  }
}
</script>
