<template>
  <div :id="'charts-system-'+settingConfig.answerId" style="height: 100%">
    <bao-wei-charts
      ref="baoweiCharts"
      :setting-config="settingConfig"
      :slot-name="['cxdht']"
    >
      <div
        slot="cxdht"
        style="width: 100%; height: 100%; overflow: auto;background:white"
      >
        <cxdht
          ref="cxdht"
          :setting-config="settingConfig"
          @modeuleShow="modeuleShow"
          @changePageData="changePageData"
        />
      </div>
    </bao-wei-charts>
  </div>
</template>
<script>
import BaoWeiCharts from '@/components/BaoWeiCharts/main'
import Cxdht from './page/Cxdht/index'
// import tdgxxt from './mixins/tdgxxt.js'
export default {
  components: { BaoWeiCharts, Cxdht },
  // mixins: [tdgxxt],
  data() {
    return {
      settingConfig: {
        answerId: 'a97a6aad-d6f8-406b-8004-8339b4ce7e67', // 数据视图获取编码/id
        // serviceId: 'fb054e83-9bb3-4385-a3c7-53a020434506',
        commonUrl: window.config.SecondPageApi, // 'http://23.36.123.82:8005', // 配置数据接口公共部分
        dataUrl: window.config.SecondPageDataApi, // 'http://23.36.123.82:8005', // 图表、组件数据公共接口
        systemPermissions: window.config.RoleName, // 权限管理
        // systemPermissions: 'user', // 权限管理
        theme: '2', // 当前已配置主题 0：白色背景 1：深色背景
        itemTitle: '土地供应监管系统', // 项目标题
        menuUniqueOpened: true // 是否只保持一个子菜单的展开
      }
    }
  },
  mounted() {
    // 项目初始化
    this.$refs['baoweiCharts'].startRender()
  },
  methods: {
    modeuleShow() {},
    changePageData(moduleId, viewchange, wh) {
      this.$refs['baoweiCharts'].changePageData(moduleId, viewchange, wh)
    }
  }
}
</script>
