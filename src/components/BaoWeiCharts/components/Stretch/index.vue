<template>
  <!-- 模块缩放组件 -->
  <div class="stretch">
    <span
      v-for="(item, index) in spotData"
      :key="index"
      :class="[item.position[0], item.position[1]]"
      @mousedown="mousedown_stretch(item.position)"
    />
  </div>
</template>
<script>
import stretch from './stretch'
export default {
  props: {
    settingForm: { type: Object, default: null },
    stretchElelemt: { type: HTMLElement, default: null },
    containerElelemt: { type: HTMLElement, default: null }
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
    // 模块拉伸事件
    mousedown_stretch(position) {
      var event = window.event || arguments[0]
      const element = this.containerElelemt
        ? this.containerElelemt
        : document.getElementsByClassName('my_main_content')[0]

      stretch({
        event,
        position,
        settingForm: this.settingForm,
        stretch: this.stretchElelemt,
        fatherElement: element,
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
    width: 15px;
    height: 15px;
    background: green;
    border-radius: 50%;
    position: absolute;
    z-index: 999999;

  }
  span:nth-child(2),
  span:nth-child(7) {
    left: 50%;
    margin-left: -7.5px;
    cursor: n-resize;
  }
  span:nth-child(4),
  span:nth-child(5) {
    top: 50%;
    margin-top: -7.5px;
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
    top: -7.5px;
  }
  span.left {
    left: -7.5px;
  }
  span.right {
    right: -7.5px;
  }
  span.bottom {
    bottom: -7.5px;
  }
}
</style>
