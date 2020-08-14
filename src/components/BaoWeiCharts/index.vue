<template>
  <div id="bao-wei-charts">
    <my-main :settingConfig="settingConfig">
      <div slot="main"
           class="main_content"></div>
    </my-main>
  </div>
</template>
<script>
import MyMain from './main/index.vue'
import './css/index.css'
export default {
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  mounted () {
    // console.log(this.settingConfig)
  },
  components: { MyMain },
  data () {
    return {}
  }
}
</script>
