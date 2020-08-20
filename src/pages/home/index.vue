<template>
  <div>
    <bao-wei-charts :setting-config="settingConfig"></bao-wei-charts>
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
        commonUrl: 'http://23.36.71.171:8080', // 请求公共路径
        dataUrl: 'http://23.36.71.171:8081/api/v1'
      }
    }
  },
  // components:{BaoWeiCharts},
  mounted () {
    // eslint-disable-next-line no-undef
    // console.log($('#asd'))
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
