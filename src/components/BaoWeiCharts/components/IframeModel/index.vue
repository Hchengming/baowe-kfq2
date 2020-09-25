<template>
  <div>
      <iframe 
        :src="iframeAll.iframeUrl"
        id="ifrmmap"
        :style="{'height':height+'px'}"
        :class="['static-iframe','ifrmmap-'+statisticsAll.moduleId]">
      </iframe>
  </div>
</template>
<script>
import dataMixins from './mixins.js'
export default {
   mixins: [dataMixins],
   props: {
    height: {
      type: Number
    },
    iframeAll:{
      type: Object
    },
    statisticsAll:{
      type: Object
    },
    iframePositionAll:{
       type: Object
    }
   },
}
</script>

