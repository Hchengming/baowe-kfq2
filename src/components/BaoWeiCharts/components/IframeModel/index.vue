<template>
  <div>
    <iframe
      :id="iframeId()"
      :src="src"
      :style="{'height':height+'px'}"
      :class="['static-iframe','ifrmmap-'+statisticsAll.moduleId]"
    />
  </div>
</template>

<script>
//
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
    },
    settingConfig: {
      type: Object,
      default: null
    },
    settingForm: {
      type: Object,
      default: null
    },
    containerElelemt: {
      type: Element,
      default: null
    }
  }
}
</script>

