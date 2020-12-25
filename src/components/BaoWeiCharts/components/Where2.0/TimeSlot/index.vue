<template>
  <!-- <div> -->
  <el-radio-group v-model="timeSlot" size="small" @change="timeSlotChange">
    <el-radio-button label="本周" />
    <el-radio-button label="本月" />
    <el-radio-button label="本季度" />
    <el-radio-button label="本年" />
  </el-radio-group>
  <!-- </div> -->
</template>
<script>
import '../../../utils/utils.js'
export default {
  props: {
    whereData: {
      type: Array,
      default: null
    },
    nowIndex: {
      type: Number,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      timeSlot: ''
    }
  },
  methods: {
    timeSlotChange(val) {
      let startTime, endTime
      const now = new Date() // 当前日期
      const nowDayOfWeek = now.getDay() // 今天本周的第几天
      const nowDay = now.getDate() // 当前日
      const nowMonth = now.getMonth() // 当前月
      const nowYear = now.getFullYear() // 当前年
      const jd = Math.ceil((nowMonth + 1) / 3)
      switch (val) {
        case '本周':
          startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
          endTime = new Date(nowYear, nowMonth, nowDay + 6 - nowDayOfWeek)
          break
        case '本月':
          startTime = new Date(nowYear, nowMonth, 1)
          endTime = new Date(nowYear, nowMonth + 1, 0)
          break
        case '本季度':
          startTime = new Date(nowYear, (jd - 1) * 3, 1)
          endTime = new Date(nowYear, jd * 3, 0)
          break
        case '本年':
          startTime = new Date(nowYear, 0, 1)
          endTime = new Date(nowYear, 11, 31)
          break
      }
      startTime = startTime.Format('yyyy-MM-dd')
      endTime = endTime.Format('yyyy-MM-dd')
      this.form[this.whereData[this.nowIndex - 1].key] = startTime
      this.form[this.whereData[this.nowIndex].key] = endTime
      this.$emit('timeSlotChange', true)
      // console.log(startTime, endTime)
    }
  }
}
</script>
