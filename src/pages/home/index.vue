<template>
  <div>
    <bao-wei-charts :setting-config="settingConfig"></bao-wei-charts>

    <!-- 权限控制 测试 -->
    <el-radio-group class="system-cs"
                    v-model="settingConfig.systemPermissions">
      <el-radio-button label="admin">管理员</el-radio-button>
      <el-radio-button label="user">用户</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
import Vue from 'vue'
import BaoWeiCharts from '@/components/BaoWeiCharts'
Vue.component('BaoWeiCharts', BaoWeiCharts)
// import BaoWeiCharts from '@/../static/js/baoweiCharts'
// Vue.component('BaoWeiCharts', BaoWeiCharts)
export default {
  data () {
    return {
      settingConfig: {
        commonUrl: 'http://23.36.71.171:8082', // 配置公共路径
        dataUrl: 'http://23.36.71.243:4000', // 数据接口公告路径
        systemPermissions: 'admin' // 权限控制
      }
    }
  },
  // components:{BaoWeiCharts},
  mounted () {
  }
}
</script>

<style lang="scss">
// @import "@/styles/element-variables.scss";
$--color-primary: #1890ff;
.theme-color {
  color: $--color-primary !important;
}
.theme-bg-color {
  background: $--color-primary !important;
}
.theme-box-shadow {
  box-shadow: 0 0 5px $--color-primary;
}
.theme-border-color {
  border-color: $--color-primary !important;
}

/*测试*/
.system-cs {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
