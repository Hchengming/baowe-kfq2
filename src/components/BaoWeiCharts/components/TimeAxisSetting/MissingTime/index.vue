<template>
  <el-dialog
    v-drag
    :append-to-body="true"
    :visible.sync="isShow"
    class="dialog-common missing-time-dialog"
  >
    <div slot="title" class="headerTitle">缺失年度选择</div>
    <div class="content" style="margin-top:10px">
      <el-checkbox-group v-model="form.missingTime" @change="missingTimeSlot">
        <el-checkbox v-for="year in timeSlot" :key="year" :label="year"/>
        <!-- <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox> -->
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="isShow = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      timeSlot: []// 时间段数据
    }
  },
  methods: {
    // 缺失时间选择时间
    missingTimeSlot() {
      this.form.missingTimeStr = JSON.stringify(this.form.missingTime)
    },
    // 当前事件段获取
    setTimeSlot() {
      this.timeSlot = []
      const start = this.form.start
      const end = this.form.end
      if (start && end && Number(end) > Number(start)) {
        for (let i = 0; i <= Number(end) - Number(start); i++) {
          this.timeSlot.push(Number(start) + i)
        }
      }
    },
    // 弹窗显示事件
    show() {
      this.isShow = true
      this.setTimeSlot()
      // console.log(this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
   .missing-time-dialog{
     >>>.el-dialog{
       width: 800px !important;
     }
   }
</style>
