<template>
  <div class="help-tips">
    <i class="el-icon-question theme-color" @click="isShow=!isShow" />
    <pre v-show="isShow" v-html="helpTipsTxt" />
  </div>
</template>
<script>
export default {
  props: {
    helpTipsTxt: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isShow: false
    }
  }
}
</script>
<style lang="scss" scoped>
    .help-tips{
      .el-icon-question{
        font-size: 16px;
        position: absolute;
        top: 40px;
        right: 20px;
        z-index: 9999;
      }
      pre{
        padding: 10px 0;
        background:#0000008a;
        color: white;
        position: absolute;
        top: 60px;
        right: 20px;
        z-index: 9999;
        border-radius: 5px;
        box-shadow: 0 0 5px #666666;
      }
    }
</style>
