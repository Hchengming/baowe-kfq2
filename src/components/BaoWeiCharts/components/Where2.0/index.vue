<template>
  <div v-if="isShowWhere()" ref="static-where-2" class="static-where-2">
    <div class="where-left">
      <el-form ref="form" :model="whereAll.form" class="where-form">
        <el-form-item
          v-for="(item, index) in whereAll.data"
          v-show="item.isShow !== '0'"
          :key="index"
          :label="label(item)"
          :style="formItemStyle(item)"
          :label-width="
            item.sfjssj === '1'
              ? '10px'
              : item.labelWidth
                ? item.labelWidth + 'px'
                : '0'
          "
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type == 'input'"
            v-model="whereAll.form[item.key]"
            :style="{ width: item.rightWidth + 'px' }"
            :title="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          />
          <!-- 下拉框 -->
          <el-select
            v-if="item.type == 'select'"
            v-model="whereAll.form[item.key]"
            :title="whereAll.form[item.key]"
            :style="{ width: item.rightWidth + 'px' }"
            size="small"
            placeholder="请选择"
            @change="onSubmit(item.isInsert == '1')"
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
            v-if="item.type == 'radio' && item.styleType !== '2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          >
            <el-radio
              v-for="radioItem in item.arr"
              :key="radioItem.value"
              :border="item.styleType === '1'"
              :label="radioItem.value"
            >
              {{ radioItem.label }}
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="item.type == 'radio' && item.styleType === '2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          >
            <el-radio-button
              v-for="radioItem in item.arr"
              :key="radioItem.value"
              :label="radioItem.value"
            >
              {{ radioItem.label }}
            </el-radio-button>
          </el-radio-group>
          <!-- 多选框 -->
          <!-- <p v-if="item.type=='checkbox'"> {{item.arr[0].value}}</p> -->
          <el-checkbox-group
            v-if="item.type == 'checkbox' && item.styleType !== '2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          >
            <el-checkbox
              v-for="(obj, iii) in item.arr"
              :key="iii"
              :border="item.styleType === '1'"
              :label="obj.value"
            >
              {{ obj.label }}
            </el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group
            v-if="item.type == 'checkbox' && item.styleType === '2'"
            v-model="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          >
            <el-checkbox-button
              v-for="checkboxItem in item.arr"
              :key="checkboxItem.value"
              :label="checkboxItem.value"
            >
              {{ checkboxItem.label }}
            </el-checkbox-button>
          </el-checkbox-group>
          <!-- 数字输入框 -->
          <el-input-number
            v-if="item.type == 'number'"
            v-model="whereAll.form[item.key]"
            :title="whereAll.form[item.key]"
            size="small"
            @change="onSubmit(item.isInsert == '1')"
          />
          <!-- 日期框  -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="whereAll.form[item.key]"
            :title="whereAll.form[item.key]"
            :style="{ width: item.rightWidth + 'px' }"
            :type="item.styleType ? item.styleType : 'date'"
            :placeholder="datePlaceholder(item, index)"
            size="small"
            @change="onSubmit(item.isInsert == '1', item)"
          />
          <time-slot
            v-if="item.type === 'date' && item.iSaddTimeSlot"
            :where-data="whereAll.data"
            :now-index="index"
            :form="whereAll.form"
            @timeSlotChange="onSubmit"
          />
          <!-- 日期时间框  -->
          <el-date-picker
            v-if="item.type === 'dateTime'"
            v-model="whereAll.form[item.key]"
            :title="whereAll.form[item.key]"
            :style="{ width: item.rightWidth + 'px' }"
            :placeholder="dateTimePlaceholder(item, index)"
            type="datetime"
            size="small"
            @change="onSubmit(item.isInsert == '1', item)"
          />

          <!-- 其他 通用配置项 -->
          <div v-if="['country-radio'].indexOf(item.type) > -1">
            <common-where
              :form="whereAll.form"
              :common-item="item"
              @formSubmit="onSubmit(true)"
            />
          </div>
        </el-form-item>
        <div class="staticWhereBottom">
          <el-button
            v-if="conditionAreaConfig.isShowInsertButton !== '0'"
            type="primary"
            size="small"
            @click="onSubmit(true)"
          >
            查 询
          </el-button>
        </div>
        <p class="clear:both" />
      </el-form>
    </div>
    <div class="where-right">
      <el-button
        v-for="item in btnSettingData"
        :key="item.name"
        :type="item.type"
        size="small"
        @click="whereOtherBtnClick(item)"
      >
        {{ item.name }}
      </el-button>
    </div>
  </div>
</template>
<script>
import '../../utils/utils.js'
import CommonWhere from './CommonWhere'
// 时间段选择组件
import TimeSlot from './TimeSlot'
import axios from 'axios'
export default {
  components: { CommonWhere, TimeSlot },
  props: {
    conditionAreaConfig: {
      type: Object,
      default: null
    },
    whereHeight: {
      type: Number,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      oldHeight: null,
      whereAll: {
        data: [],
        form: {}
      },
      btnSettingData: []
    }
  },
  watch: {
    conditionAreaConfig: {
      handler() {
        this.setWhereAll(this.conditionAreaConfig)
      },
      deep: true
    },

    'whereAll.form': {
      handler() {
        this.getWhereHeight()
        // console.log(this.whereAll.form,'this.whereAll.form')
        this.$emit('whereFormKeep', this.whereAll.form)
      },
      deep: true
    }
  },
  mounted() {
    this.setWhereAll(this.conditionAreaConfig)
    this.getWhereHeight()
  },
  methods: {
    // 模块是否显示事件
    isShowWhere() {
      let offon = true
      if (
        !(
          this.conditionAreaConfig.btnSettingData &&
          this.conditionAreaConfig.btnSettingData.length > 0
        )
      ) {
        offon = false
      }
      if (
        !this.conditionAreaConfig.screenData ||
        this.conditionAreaConfig.screenData.length === 0
      ) {
        offon = false
      } else {
        offon = false
        this.conditionAreaConfig.screenData.forEach(item => {
          if (item.isShow !== '0') {
            offon = true
          }
        })
      }
      return offon
    },
    // 查询模块高度变化事件
    getWhereHeight() {
      this.$nextTick(() => {
        if (this.isShowWhere()) {
          const newHeight = this.$refs['static-where-2'].scrollHeight
          if (newHeight !== this.oldHeight) {
            this.oldHeight = newHeight
            this.$emit('update:whereHeight', newHeight)
          }
        }
      })
    },
    formItemStyle(item) {
      const style = {}
      if (item.isLineFeed === '1') {
        // style.float = "left";
        style.clear = 'left'
      }

      return style
    },
    // 日期 placeholder显示
    datePlaceholder(item, index) {
      if (item.sfjssj === '1') {
        return '结束日期'
      } else if (
        index + 1 <= this.whereAll.data.length - 1 &&
        this.whereAll.data[index + 1].sfjssj === '1'
      ) {
        return '开始日期'
      } else {
        return '日期选择'
      }
    },
    // 日期时间 placeholder显示
    dateTimePlaceholder(item, index) {
      if (item.sfjssj === '1') {
        return '结束日期时间'
      } else if (
        index + 1 <= this.whereAll.data.length - 1 &&
        this.whereAll.data[index + 1].sfjssj === '1'
      ) {
        return '开始日期时间'
      } else {
        return '日期时间选择'
      }
    },
    // 左侧标签显示数据
    label(item) {
      if (
        (item.type === 'date' || item.type === 'dateTime') &&
        item.sfjssj === '1'
      ) {
        return '-'
      } else {
        return item.label ? item.label : ''
      }
    },
    // 弹窗显示事件
    setWhereAll(conditionAreaConfig) {
      if (!conditionAreaConfig) return
      if (
        !conditionAreaConfig.screenData ||
        typeof conditionAreaConfig.screenData !== 'object'
      ) {
        conditionAreaConfig.screenData = []
      }
      if (
        !conditionAreaConfig.btnSettingData ||
        typeof conditionAreaConfig.btnSettingData !== 'object'
      ) {
        conditionAreaConfig.btnSettingData = []
      }
      const whereData = JSON.parse(
        JSON.stringify(conditionAreaConfig.screenData)
      )

      // 01 自定义筛选项，通用筛选项数据整合
      // this.whereDataInit(conditionAreaConfig, whereData);
      // 02 form表单数据初始化
      this.formInit(whereData)
      this.$set(this.whereAll, 'data', whereData)
      // 其他按钮配置
      this.btnSettingData = JSON.parse(
        JSON.stringify(conditionAreaConfig.btnSettingData)
      )
    },
    // form表单数据初始化
    formInit(whereData) {
      this.whereAll.form = {}

      whereData.forEach(item => {
        // 01-默认值添加
        if (item.defaultValue) {
          if (item.type === 'checkbox') {
            this.$set(
              this.whereAll.form,
              item.key,
              JSON.parse(item.defaultValue)
            )
          } else {
            this.$set(
              this.whereAll.form,
              item.key,
              this.getParamValue(item.defaultValue, item)
            )
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
        // 02-时间类型默认时间设置为当前时间
        if (item.isNewDate) {
          const date = new Date()
          if (item.type === 'date') {
            this.$set(this.whereAll.form, item.key, date.Format('yyyy-MM-dd'))
          } else {
            this.$set(
              this.whereAll.form,
              item.key,
              date.Format('yyyy-MM-dd hh:mm:ss')
            )
          }
        }
      })
    },
    // localStorage自定义参数-值获取
    getParamValue(val, item) {
      let paramValue = ''
      if (val && typeof val === 'string' && val.indexOf('${') === 0) {
        const num = val.length - 1
        const key = val.substring(2, num)
        paramValue = localStorage.getItem(key)
      } else {
        paramValue = val
      }
      switch (item.dataType) {
        case 'number':
          if (Number(paramValue)) {
            paramValue = Number(paramValue)
          } else {
            paramValue = null
          }
          break
        case 'object':
          paramValue = JSON.parse(paramValue)
          break
      }
      return paramValue
    },
    // 自定义筛选项，通用筛选项数据整合
    // whereDataInit(conditionAreaConfig, whereData) {
    //   //  通用筛选项数据导入
    //   if (
    //     conditionAreaConfig.commonFilterData &&
    //     conditionAreaConfig.commonFilterData.length > 0
    //   ) {
    //     conditionAreaConfig.commonFilterData.forEach((item) => {
    //       whereData.splice(item.index, 0, item);
    //     });
    //   }
    // },
    // 查询按钮点击事件
    onSubmit(offon, item) {
      if (item) {
        // 时间日期格式转换
        if (item.type === 'date') {
          this.whereAll.form[item.key] = new Date(
            this.whereAll.form[item.key]
          ).Format('yyyy-MM-dd')
          // console.log(this.whereAll.form[item.key])
        } else if (item.type === 'dateTime') {
          this.whereAll.form[item.key] = new Date(
            this.whereAll.form[item.key]
          ).Format('yyyy-MM-dd hh:mm:ss')
        }
      }
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
        test({
          axios, // axios
          message: this.$message, // message
          getData: () => { // 模块数据刷新事件
            const form = JSON.parse(JSON.stringify(this.whereAll.form))
            this.$emit('whereSubmit', form)
          },
          settingForm: this.settingForm
        })
      }
      this.$emit('whereOtherBtnClick', buttonSetting)
    }
  }
}
</script>
