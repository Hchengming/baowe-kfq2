<template>
  <div>
    <bao-wei-charts :setting-config="settingConfig"></bao-wei-charts>
  </div>
</template>
<script>
import Vue from 'vue'
import BaoWeiCharts from '@/components/BaoWeiCharts'
Vue.component('BaoWeiCharts', BaoWeiCharts)
// import ChartsTable from "@/components/dist/baoweiCharts"
// Vue.use(ChartsTable)
export default {
  data () {
    return {
      settingConfig: {
        commonUrl: 'http://localhost:4000' // 请求公共路径
      }
    }
  },
  // components:{BaoWeiCharts},
  mounted () {
    // eslint-disable-next-line no-undef
    console.log($('#asd'))
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
</style>
