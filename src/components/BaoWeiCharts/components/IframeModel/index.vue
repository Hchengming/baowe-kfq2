<template>
  <div>
    <iframe
      :id="iframeAll.iframeType==='0'?'ifrmmap':'iframe'+statisticsAll.moduleId"
      :src="iframeAll.iframeUrl"
      :style="{'height':height+'px'}"
      :class="['static-iframe','ifrmmap-'+statisticsAll.moduleId]"
    />
  </div>
</template>
<script>
import dataMixins from './mixins.js'
export default {
  mixins: [dataMixins],
  props: {
    height: {
      type: Number,
      default: null
    },
    iframeAll: {
      type: Object,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    iframePositionAll: {
      type: Object,
      default: null
    }
  }
}
</script>

