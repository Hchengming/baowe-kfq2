<template>
  <!-- 模块缩放组件 -->
  <div class="stretch">
    <span
      v-for="(item, index) in spotData"
      :class="[item.position[0], item.position[1]]"
      :key="index"
      @mousedown="mousedown_stretch(item.position)"
    />
  </div>
</template>
<script>
import stretch from './stretch'
export default {
  props: {
    settingForm: { type: Object, default: null },
    stretchElelemt: { type: HTMLElement, default: null }
  },
  data() {
    return {
      spotData: [
        { position: ['top', 'left'] },
        { position: ['top', 'center'] },
        { position: ['top', 'right'] },
        { position: ['center', 'left'] },
        { position: ['center', 'right'] },
        { position: ['bottom', 'left'] },
        { position: ['bottom', 'center'] },
        { position: ['bottom', 'right'] }
      ]
    }
  },
  methods: {
    mousedown_stretch(position) {
      // console.log(this.stretchElelemt)
      var event = window.event || arguments[0]
      stretch({
        event,
        position,
        settingForm: this.settingForm,
        stretch: this.stretchElelemt,
        fatherElement: document.querySelector('.my_main_content'),
        fnc: () => {
          this.$emit('stretchkeep')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.stretch {
  display: none;
  span {
    width: 10px;
    height: 10px;
    background: green;
    border-radius: 50%;
    position: absolute;
    z-index: 99;

  }
  span:nth-child(2),
  span:nth-child(7) {
    left: 50%;
    margin-left: -5px;
    cursor: n-resize;
  }
  span:nth-child(4),
  span:nth-child(5) {
    top: 50%;
    margin-top: -5px;
    cursor: e-resize;
  }
  span:nth-child(1),
  span:nth-child(8) {
    cursor: nw-resize;
  }
  span:nth-child(3),
  span:nth-child(6) {
    cursor: ne-resize;
  }
  span.top {
    top: -5px;
  }
  span.left {
    left: -5px;
  }
  span.right {
    right: -5px;
  }
  span.bottom {
    bottom: -5px;
  }
}
</style>
