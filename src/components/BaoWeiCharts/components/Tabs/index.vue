<template>
  <div>

    <article
      v-show="statisticsAll.isShow !== false"
      :id="settingForm.elementId ? settingForm.elementId : undefined"
      :ref="'statisticsWrap'"
      :style="{
        height: modelStyle.height + 'px',
        width: modelStyle.width + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
        cursor: cursor,
        'z-index': settingForm.zindex,
      }"
    >
      <div class="" />
    </article>
  </div>
</template>
<script>
export default {
  mixins: [],
  data() {
    return {
      settingForm: {},
      modelStyle: {},
      cursor: 'defalut'
    }
  }
}
</script>
